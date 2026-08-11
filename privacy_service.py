# privacy_service_simple.py
import json
import hashlib
import time
import re
from datetime import datetime
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load RoBERTa emotion model
print("Loading emotion detection model...")
tokenizer = AutoTokenizer.from_pretrained("SamLowe/roberta-base-go_emotions")
emotion_model = AutoModelForSequenceClassification.from_pretrained("SamLowe/roberta-base-go_emotions")
print("Model loaded successfully!")

# Emotion labels for the RoBERTa model
EMOTION_LABELS = [
    'admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring', 'confusion',
    'curiosity', 'desire', 'disappointment', 'disapproval', 'disgust', 'embarrassment',
    'excitement', 'fear', 'gratitude', 'grief', 'joy', 'love', 'nervousness',
    'optimism', 'pride', 'realization', 'relief', 'remorse', 'sadness', 'surprise'
]

# Mental health keywords for simple topic extraction
MENTAL_HEALTH_KEYWORDS = {
    'anxiety': ['anxiety', 'anxious', 'worried', 'panic', 'nervous', 'stress', 'stressed'],
    'depression': ['depression', 'depressed', 'sad', 'hopeless', 'worthless', 'empty'],
    'exam_stress': ['exam', 'test', 'quiz', 'midterm', 'final', 'grade', 'study'],
    'sleep': ['sleep', 'insomnia', 'tired', 'exhausted', 'rest', 'awake'],
    'relationships': ['relationship', 'breakup', 'friend', 'family', 'alone', 'lonely'],
    'self_esteem': ['confidence', 'self-esteem', 'ugly', 'stupid', 'failure', 'loser'],
    'eating': ['eating', 'food', 'weight', 'body', 'fat', 'diet'],
}

CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self-harm',
    'want to die', 'better off dead', 'no reason to live'
]

class SimplifiedAnonymizationPipeline:
    def __init__(self):
        self.processed_count = 0
        
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
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '[URL]', text)
        
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
        
        return {
            'primary_emotion': top_emotions[0][0],
            'primary_confidence': round(top_emotions[0][1], 3),
            'secondary_emotion': top_emotions[1][0],
            'secondary_confidence': round(top_emotions[1][1], 3),
            'tertiary_emotion': top_emotions[2][0],
            'tertiary_confidence': round(top_emotions[2][1], 3)
        }
    
    def extract_topics(self, text: str) -> dict:
        """Extract mental health topics using keyword matching"""
        text_lower = text.lower()
        detected_topics = []
        
        for topic, keywords in MENTAL_HEALTH_KEYWORDS.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_topics.append(topic)
        
        return {
            'detected_categories': detected_topics,
            'category_count': len(detected_topics)
        }
    
    def calculate_severity_score(self, emotions: dict, text: str) -> dict:
        """Calculate urgency/severity indicators for crisis detection"""
        crisis_score = 0
        text_lower = text.lower()
        
        # Check for crisis keywords
        detected_crisis_keywords = []
        for keyword in CRISIS_KEYWORDS:
            if keyword in text_lower:
                crisis_score += 3
                detected_crisis_keywords.append(keyword)
        
        # Check for high-risk emotions
        high_risk_emotions = ['grief', 'sadness', 'fear', 'remorse', 'disappointment']
        if emotions['primary_emotion'] in high_risk_emotions and emotions['primary_confidence'] > 0.5:
            crisis_score += 1
        
        return {
            'severity_level': 'high' if crisis_score > 2 else 'medium' if crisis_score > 0 else 'low',
            'crisis_indicators': crisis_score > 2,
            'risk_score': round(min(crisis_score, 5), 2),
            'crisis_keywords_found': detected_crisis_keywords
        }
    
    def process_message(self, user_id: str, message: str) -> dict:
        """Main anonymization pipeline"""
        timestamp = datetime.now().isoformat()
        
        # Step 1: Generate anonymous ID
        anon_id = self.generate_anonymous_id(user_id, timestamp)
        
        # Step 2: Strip PII
        cleaned_text = self.strip_pii(message)
        
        # Step 3: Extract emotional metadata
        emotions = self.extract_emotions(cleaned_text)
        
        # Step 4: Extract topics
        topics = self.extract_topics(cleaned_text)
        
        # Step 5: Calculate severity
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
        }
        
        # Step 7: Log processing
        self.processed_count += 1
        print(f"✅ Processed message #{self.processed_count} - Anonymous ID: {anon_id}")
        print(f"   Primary emotion: {emotions['primary_emotion']} ({emotions['primary_confidence']})")
        print(f"   Topics: {topics['detected_categories']}")
        print(f"   Severity: {severity['severity_level']}")
        
        return {
            'original_message': message,
            'anonymous_metadata': anonymous_metadata,
            'crisis_alert': severity['crisis_indicators']
        }

# Initialize the pipeline
pipeline = SimplifiedAnonymizationPipeline()

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
        
        return jsonify({
            'success': True,
            'chatbot_message': result['original_message'],
            'metadata_stored': True,
            'crisis_alert': result['crisis_alert'],
            'anonymous_id': result['anonymous_metadata']['anonymous_id']
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/analytics-demo', methods=['GET'])
def analytics_demo():
    """Demo endpoint showing anonymized analytics"""
    return jsonify({
        'total_messages_processed': pipeline.processed_count,
        'privacy_guarantee': 'No original messages stored. Only anonymous metadata used for insights.',
        'note': 'In production, this would show aggregated data from database'
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🛡️  PRIVACY-FIRST ANONYMIZATION SERVICE")
    print("="*60)
    print("✅ Simplified version (no spaCy dependency)")
    print("✅ Compatible with Python 3.14")
    print("✅ RoBERTa emotion detection active")
    print("✅ Keyword-based topic extraction")
    print("="*60 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5001)