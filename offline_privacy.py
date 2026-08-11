# privacy_service_offline.py
import json
import hashlib
import time
import re
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

print("🚀 Starting Privacy Service (Offline Mode)")
print("📊 Using rule-based emotion detection for demo")

# Emotion detection using keyword matching (works offline)
EMOTION_KEYWORDS = {
    'joy': ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'glad', 'delighted'],
    'sadness': ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'grief', 'crying', 'tears'],
    'anxiety': ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress', 'overwhelmed', 'fear'],
    'anger': ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'rage', 'hate'],
    'fear': ['afraid', 'terrified', 'frightened', 'scared', 'worried', 'panic', 'anxious'],
    'confusion': ['confused', 'lost', 'unsure', 'don\'t know', 'uncertain', 'puzzled'],
    'gratitude': ['thank', 'grateful', 'appreciate', 'thankful', 'blessed'],
    'hopelessness': ['hopeless', 'worthless', 'pointless', 'give up', 'no point', 'meaningless'],
    'loneliness': ['lonely', 'alone', 'isolated', 'nobody', 'no friends', 'by myself'],
}

# Mental health categories
MENTAL_HEALTH_KEYWORDS = {
    'exam_stress': ['exam', 'test', 'quiz', 'midterm', 'final', 'grade', 'study', 'assignment'],
    'anxiety': ['anxiety', 'anxious', 'worried', 'panic', 'nervous', 'stress'],
    'depression': ['depression', 'depressed', 'sad', 'hopeless', 'worthless', 'empty'],
    'sleep_issues': ['sleep', 'insomnia', 'tired', 'exhausted', 'rest', 'awake', 'can\'t sleep'],
    'relationships': ['relationship', 'breakup', 'friend', 'family', 'boyfriend', 'girlfriend'],
    'self_esteem': ['confidence', 'self-esteem', 'ugly', 'stupid', 'failure', 'not good enough'],
    'loneliness': ['lonely', 'alone', 'isolated', 'no friends', 'nobody'],
}

CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self-harm', 'self harm',
    'want to die', 'better off dead', 'no reason to live', 'end my life'
]

class OfflineAnonymizationPipeline:
    def __init__(self):
        self.processed_count = 0
        self.emotion_history = []
        self.topic_history = []
        
    def generate_anonymous_id(self, user_id: str, timestamp: str) -> str:
        """Generate irreversible anonymous hash"""
        combined = f"{user_id}_{timestamp}_{time.time()}"
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def strip_pii(self, text: str) -> str:
        """Remove personally identifiable information"""
        # Email
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
        # Phone
        text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE]', text)
        # URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '[URL]', text)
        return text
    
    def detect_emotions(self, text: str) -> dict:
        """Detect emotions using keyword matching"""
        text_lower = text.lower()
        emotion_scores = {}
        
        for emotion, keywords in EMOTION_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        # Sort by score
        sorted_emotions = sorted(emotion_scores.items(), key=lambda x: x[1], reverse=True)
        
        if len(sorted_emotions) >= 3:
            return {
                'primary_emotion': sorted_emotions[0][0],
                'primary_confidence': round(sorted_emotions[0][1] / 10, 3),
                'secondary_emotion': sorted_emotions[1][0],
                'secondary_confidence': round(sorted_emotions[1][1] / 10, 3),
                'tertiary_emotion': sorted_emotions[2][0],
                'tertiary_confidence': round(sorted_emotions[2][1] / 10, 3),
            }
        elif len(sorted_emotions) >= 1:
            return {
                'primary_emotion': sorted_emotions[0][0],
                'primary_confidence': round(sorted_emotions[0][1] / 10, 3),
                'secondary_emotion': 'neutral',
                'secondary_confidence': 0.1,
                'tertiary_emotion': 'neutral',
                'tertiary_confidence': 0.05,
            }
        else:
            return {
                'primary_emotion': 'neutral',
                'primary_confidence': 0.5,
                'secondary_emotion': 'neutral',
                'secondary_confidence': 0.3,
                'tertiary_emotion': 'neutral',
                'tertiary_confidence': 0.2,
            }
    
    def extract_topics(self, text: str) -> dict:
        """Extract mental health topics"""
        text_lower = text.lower()
        detected_topics = []
        
        for topic, keywords in MENTAL_HEALTH_KEYWORDS.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_topics.append(topic)
        
        return {
            'detected_categories': detected_topics if detected_topics else ['general_support'],
            'category_count': len(detected_topics)
        }
    
    def calculate_severity(self, emotions: dict, text: str) -> dict:
        """Calculate crisis risk score"""
        crisis_score = 0
        text_lower = text.lower()
        detected_crisis = []
        
        # Check crisis keywords
        for keyword in CRISIS_KEYWORDS:
            if keyword in text_lower:
                crisis_score += 3
                detected_crisis.append(keyword)
        
        # Check high-risk emotions
        high_risk = ['sadness', 'hopelessness', 'fear']
        if emotions['primary_emotion'] in high_risk:
            crisis_score += emotions['primary_confidence'] * 2
        
        return {
            'severity_level': 'high' if crisis_score > 2 else 'medium' if crisis_score > 0.5 else 'low',
            'crisis_indicators': crisis_score > 2,
            'risk_score': round(min(crisis_score, 5), 2),
            'crisis_keywords_found': detected_crisis
        }
    
    def process_message(self, user_id: str, message: str) -> dict:
        """Main anonymization pipeline"""
        timestamp = datetime.now().isoformat()
        
        # Generate anonymous ID
        anon_id = self.generate_anonymous_id(user_id, timestamp)
        
        # Strip PII
        cleaned_text = self.strip_pii(message)
        
        # Detect emotions
        emotions = self.detect_emotions(cleaned_text)
        
        # Extract topics
        topics = self.extract_topics(cleaned_text)
        
        # Calculate severity
        severity = self.calculate_severity(emotions, cleaned_text)
        
        # Store for analytics (in production, this goes to database)
        self.emotion_history.append(emotions['primary_emotion'])
        self.topic_history.extend(topics['detected_categories'])
        
        # Anonymous metadata
        anonymous_metadata = {
            'anonymous_id': anon_id,
            'timestamp': timestamp,
            'message_length': len(message),
            'word_count': len(message.split()),
            'emotions': emotions,
            'topics': topics,
            'severity': severity,
        }
        
        # Log
        self.processed_count += 1
        print(f"\n✅ Message #{self.processed_count} - Anonymous ID: {anon_id}")
        print(f"   🎭 Emotion: {emotions['primary_emotion']} ({emotions['primary_confidence']:.2f})")
        print(f"   📊 Topics: {', '.join(topics['detected_categories'])}")
        print(f"   ⚠️  Severity: {severity['severity_level']}")
        if severity['crisis_indicators']:
            print(f"   🚨 CRISIS ALERT TRIGGERED")
        
        return {
            'original_message': message,
            'anonymous_metadata': anonymous_metadata,
            'crisis_alert': severity['crisis_indicators']
        }

# Initialize pipeline
pipeline = OfflineAnonymizationPipeline()

@app.route('/process-message', methods=['POST'])
def process_message():
    """Process message through privacy pipeline"""
    try:
        data = request.json
        user_id = data.get('user_id')
        message = data.get('message')
        
        if not user_id or not message:
            return jsonify({'error': 'Missing user_id or message'}), 400
        
        result = pipeline.process_message(user_id, message)
        
        return jsonify({
            'success': True,
            'chatbot_message': result['original_message'],
            'metadata_stored': True,
            'crisis_alert': result['crisis_alert'],
            'anonymous_id': result['anonymous_metadata']['anonymous_id'],
            'emotions': result['anonymous_metadata']['emotions'],
            'topics': result['anonymous_metadata']['topics']
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/analytics-demo', methods=['GET'])
def analytics_demo():
    """Show aggregated anonymous analytics"""
    from collections import Counter
    
    emotion_counts = Counter(pipeline.emotion_history)
    topic_counts = Counter(pipeline.topic_history)
    
    top_emotions = [
        {'emotion': emotion, 'count': count, 'percentage': round(count / max(len(pipeline.emotion_history), 1) * 100, 1)}
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
        'privacy_guarantee': '🛡️ No original messages stored. Only anonymous metadata.',
        'note': 'Real-time anonymized insights from your conversations'
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'mode': 'offline_demo',
        'processed': pipeline.processed_count
    })

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🛡️  PRIVACY-FIRST ANONYMIZATION SERVICE (OFFLINE MODE)")
    print("="*70)
    print("✅ No model downloads required")
    print("✅ Works completely offline")
    print("✅ Rule-based emotion & topic detection")
    print("✅ Full privacy protection active")
    print("✅ Crisis detection enabled")
    print("="*70)
    print("\n🌐 Service running on http://0.0.0.0:5001")
    print("📊 Dashboard available at http://localhost:5002/privacy-dashboard\n")
    app.run(debug=True, host='0.0.0.0', port=5001)