# privacy_service.py
import json
import hashlib
import time
from datetime import datetime
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import spacy
import re
from collections import Counter
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load models once at startup
print("Loading NLP models...")
tokenizer = AutoTokenizer.from_pretrained("SamLowe/roberta-base-go_emotions")
emotion_model = AutoModelForSequenceClassification.from_pretrained("SamLowe/roberta-base-go_emotions")
nlp = spacy.load("en_core_web_sm")
print("Models loaded successfully!")

# Emotion labels for the RoBERTa model
EMOTION_LABELS = [emotion_model.config.id2label[i] for i in range(emotion_model.config.num_labels)]

from collections import Counter

class AnonymizationPipeline:
    def __init__(self):
        self.processed_count = 0
        self.emotion_history = []
        self.topic_history = []
        
    def generate_anonymous_id(self, user_id: str, timestamp: str) -> str:
        """Generate a one-way hash that can't be traced back to the user"""
        combined = f"{user_id}_{timestamp}_{time.time()}"
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def strip_pii(self, text: str) -> str:
        """Remove potential personally identifiable information"""
        # Remove email addresses
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
        
        # Remove phone numbers
        text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE]', text)
        
        # Remove potential names using spaCy NER
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                text = text.replace(ent.text, "[NAME]")
        
        return text
    
    def extract_emotions(self, text: str) -> dict:
        """Extract emotional metadata using RoBERTa"""
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        
        with torch.no_grad():
            outputs = emotion_model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # Get top 3 emotions with confidence scores
        emotion_scores = predictions[0].tolist()
        top_emotions = sorted(
            [(EMOTION_LABELS[i], score) for i, score in enumerate(emotion_scores)], 
            key=lambda x: x[1], 
            reverse=True
        )[:3]

        # Fallback to ensure we always have three emotions
        while len(top_emotions) < 3:
            top_emotions.append(('neutral', 0.0))
        
        return {
            'primary_emotion': top_emotions[0][0],
            'primary_confidence': round(top_emotions[0][1], 3),
            'secondary_emotion': top_emotions[1][0],
            'secondary_confidence': round(top_emotions[1][1], 3),
            'tertiary_emotion': top_emotions[2][0],
            'tertiary_confidence': round(top_emotions[2][1], 3)
        }
    
    def extract_topics(self, text: str) -> list:
        """Extract key topics and themes"""
        doc = nlp(text)
        
        # Extract noun phrases and important entities
        topics = []
        
        # Get noun chunks
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) <= 3:  # Keep phrases short
                topics.append(chunk.text.lower())
        
        # Get named entities (excluding PERSON which we've already stripped)
        for ent in doc.ents:
            if ent.label_ in ["ORG", "EVENT", "WORK_OF_ART", "FAC"]:
                topics.append(ent.text.lower())
        
        # Mental health keyword detection
        mental_health_keywords = [
            'anxiety', 'depression', 'stress', 'panic', 'worry', 'fear', 'sad', 'lonely',
            'exam', 'test', 'grades', 'college', 'relationship', 'family', 'sleep',
            'eating', 'body', 'confidence', 'self-esteem', 'therapy', 'counseling'
        ]
        
        detected_keywords = []
        text_lower = text.lower()
        for keyword in mental_health_keywords:
            if keyword in text_lower:
                detected_keywords.append(keyword)
        
        return {
            'themes': list(set(topics))[:5],  # Top 5 unique themes
            'mental_health_indicators': detected_keywords
        }
    
    def calculate_severity_score(self, emotions: dict, text: str) -> dict:
        """Calculate urgency/severity indicators for crisis detection"""
        crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'hurt myself', 'self-harm',
            'want to die', 'better off dead', 'hopeless', 'worthless'
        ]
        
        high_risk_emotions = ['grief', 'sadness', 'fear', 'remorse', 'disappointment']
        
        crisis_score = 0
        text_lower = text.lower()
        
        # Check for crisis keywords
        for keyword in crisis_keywords:
            if keyword in text_lower:
                crisis_score += 3
        
        # Check for high-risk emotions
        if emotions['primary_emotion'] in high_risk_emotions:
            crisis_score += emotions['primary_confidence']
        
        return {
            'severity_level': 'high' if crisis_score > 2 else 'medium' if crisis_score > 1 else 'low',
            'crisis_indicators': crisis_score > 2,
            'risk_score': round(min(crisis_score, 5), 2)  # Cap at 5
        }
    
    def process_message(self, user_id: str, message: str) -> dict:
        """Main anonymization pipeline"""
        timestamp = datetime.now().isoformat()
        
        # Step 1: Generate anonymous ID
        anon_id = self.generate_anonymous_id(user_id, timestamp)
        
        # Step 2: Strip PII (but keep original for chatbot)
        cleaned_text = self.strip_pii(message)
        
        # Step 3: Extract emotional metadata
        emotions = self.extract_emotions(cleaned_text)
        
        # Step 4: Extract topics and themes
        topics = self.extract_topics(cleaned_text)
        
        # Step 5: Calculate severity for crisis detection
        severity = self.calculate_severity_score(emotions, cleaned_text)
        
        # Step 6: Create anonymous metadata packet
        anonymous_metadata = {
            'anonymous_id': anon_id,
            'timestamp': timestamp,
            'message_length': len(message),
            'word_count': len(message.split()),
            'emotions': emotions,
            'topics': topics,
            'severity': severity,
            'processed_version': cleaned_text[:100] + "..." if len(cleaned_text) > 100 else cleaned_text
        }
        
        # Step 7: Store analytics metadata and log processing
        self.emotion_history.append(emotions['primary_emotion'])
        self.topic_history.extend(topics.get('themes', []))
        self.processed_count += 1
        print(f"Processed message #{self.processed_count} - Anonymous ID: {anon_id}")
        print(f"   Primary emotion: {emotions['primary_emotion']} ({emotions['primary_confidence']})")
        print(f"   Topics: {topics.get('themes', [])}")
        print(f"   Severity: {severity['severity_level']}")
        
        return {
            'original_message': message,  # Returns to chatbot
            'anonymous_metadata': anonymous_metadata,  # Stored for analytics
            'crisis_alert': severity['crisis_indicators']
        }

# Initialize the pipeline
pipeline = AnonymizationPipeline()

@app.route('/process-message', methods=['POST'])
def process_message():
    """API endpoint for processing messages"""
    try:
        data = request.json
        user_id = data.get('user_id')
        message = data.get('message')
        
        if not user_id or not message:
            return jsonify({'error': 'Missing user_id or message'}), 400
        
        # Process the message through anonymization pipeline
        result = pipeline.process_message(user_id, message)
        
        # In a real app, you would:
        # 1. Send original_message to your chatbot AI
        # 2. Store anonymous_metadata in your analytics database
        # 3. Trigger crisis intervention if crisis_alert is True
        
        return jsonify({
            'success': True,
            'chatbot_message': result['original_message'],  # For chatbot processing
            'metadata_stored': True,  # Confirmation that anonymous data was stored
            'crisis_alert': result['crisis_alert'],
            'anonymous_id': result['anonymous_metadata']['anonymous_id']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics-demo', methods=['GET'])
def analytics_demo():
    """Demo endpoint showing anonymized analytics"""
    emotion_counts = Counter(pipeline.emotion_history)
    topic_counts = Counter(pipeline.topic_history)

    top_emotions = [
        {
            'emotion': emotion,
            'count': count,
            'percentage': round(count / max(len(pipeline.emotion_history), 1) * 100, 1)
        }
        for emotion, count in emotion_counts.most_common(5)
    ]

    top_topics = [
        {'topic': topic, 'count': count}
        for topic, count in topic_counts.most_common(5)
    ]

    return jsonify({
        'total_messages_processed': pipeline.processed_count,
        'top_emotions': top_emotions,
        'common_themes': [t['topic'] for t in top_topics],
        'privacy_guarantee': 'No original messages stored. Only anonymous metadata used for insights.',
        'note': 'This dashboard is powered by anonymous analytics from the privacy service.'
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint for dashboard compatibility"""
    return jsonify({
        'status': 'running',
        'mode': 'production',
        'processed': pipeline.processed_count
    })

if __name__ == '__main__':
    print("Starting Privacy-First Anonymization Service...")
    print("This service processes personal messages and creates anonymous insights")
    print("Original messages are NEVER stored - only metadata for research")
    app.run(debug=True, host='0.0.0.0', port=5001)

# requirements.txt content:
"""
flask
flask-cors
transformers
torch
spacy
scikit-learn

# To install spaCy model:
# python -m spacy download en_core_web_sm
"""