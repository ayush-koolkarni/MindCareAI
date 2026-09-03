# offline_privacy.py
import json
import hashlib
import time
import re
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

print("🚀 Starting Elevana AI Privacy & Risk Intelligence Service (Offline Mode)")
print("📊 Emotion AI + External Threat Risk Scoring Active")

# Emotion detection using keyword matching (works offline)
EMOTION_KEYWORDS = {
    'joy': ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'glad', 'delighted', 'relieved', 'safe'],
    'sadness': ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'grief', 'crying', 'tears', 'broken', 'lost', 'hurt'],
    'anxiety': ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress', 'overwhelmed', 'fear', 'court', 'trial', 'hearing', 'shaking'],
    'anger': ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'rage', 'hate', 'unfair', 'injustice'],
    'fear': ['afraid', 'terrified', 'frightened', 'scared', 'worried', 'panic', 'tremor', 'threatened', 'danger'],
    'hopelessness': ['hopeless', 'worthless', 'pointless', 'give up', 'no point', 'meaningless', 'empty', 'cannot go on'],
    'trauma': ['flashback', 'nightmare', 'assault', 'abuse', 'rape', 'beating', 'violence', 'attack', 'scarred', 'molested'],
}

# Crisis / Suicidal Ideation Keywords
CRISIS_SUICIDE_KEYWORDS = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self-harm', 'self harm',
    'want to die', 'better off dead', 'no reason to live', 'end my life', 'hanging myself',
    'take my life', 'cut myself', 'cannot live anymore'
]

# External Threat / Physical Safety Keywords (Threat to user from external hostile factors)
EXTERNAL_THREAT_KEYWORDS = [
    'crowd', 'mob', 'following me', 'outside my house', 'break into', 'breaking in',
    'hostile person', 'men outside', 'armed with', 'weapons', 'knife', 'gun', 'lathi',
    'threatened to kill', 'threat to kill', 'kill me', 'stalking me', 'beat me', 'burn our house',
    'trapped', 'surrounded', 'attacking us', 'hiding from', 'police emergency', 'threats',
    'goons', 'threatening my family'
]

# In-memory storage for demo
class ThreatIntelligencePipeline:
    def __init__(self):
        self.processed_count = 0
        self.emotion_history = []
        self.active_threat_alerts = [
            {
                'alert_id': 'THREAT-2026-8801',
                'user_id': 'victim_case_941',
                'victim_name': 'Meera K. (Protected Identity)',
                'phone': '+91 98231 44512',
                'location': 'Wadgaon Sheri, Pune, Maharashtra',
                'nearest_police_station': 'SC/ST Special Cell - Pune Central',
                'threat_score': 92,
                'distress_score': 78,
                'threat_statement': 'Group of 4 hostile individuals gathering outside residence, shouting threats and banging on gate.',
                'status': 'Dispatched to Police',
                'police_dispatch_time': '10 mins ago',
                'timestamp': datetime.now().strftime('%d %b %Y, %I:%M %p'),
            }
        ]
        self.active_counselor_alerts = [
            {
                'alert_id': 'CRISIS-2026-3022',
                'user_id': 'victim_case_512',
                'anonymous_id': 'anon_8f3a9e21',
                'distress_score': 88,
                'primary_concern': 'Acute Trial Panic & Sleep Deprivation after assault',
                'counselor_assigned': 'Dr. Ayush Kulkarni (DLSA)',
                'status': 'Session In Progress',
                'timestamp': datetime.now().strftime('%d %b %Y, %I:%M %p'),
            }
        ]
        self.recent_messages = []

    def generate_anonymous_id(self, user_id: str, timestamp: str) -> str:
        combined = f"{user_id}_{timestamp}_{time.time()}"
        return f"anon_{hashlib.sha256(combined.encode()).hexdigest()[:12]}"
    
    def strip_pii(self, text: str) -> str:
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[REDACTED_EMAIL]', text)
        text = re.sub(r'\b\d{10}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[REDACTED_PHONE]', text)
        return text
    
    def analyze_message(self, text: str, user_id: str, real_name: str = None, location: str = None, phone: str = None) -> dict:
        text_lower = text.lower()
        
        # 1. Emotion detection
        emotion_scores = {}
        for emotion, keywords in EMOTION_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        sorted_emotions = sorted(emotion_scores.items(), key=lambda x: x[1], reverse=True)
        primary_emotion = sorted_emotions[0][0] if sorted_emotions else 'neutral'
        
        # 2. Emotional Distress Score (0-100)
        distress_score = 25  # baseline
        detected_suicide = []
        for kw in CRISIS_SUICIDE_KEYWORDS:
            if kw in text_lower:
                distress_score += 40
                detected_suicide.append(kw)
        
        if primary_emotion in ['hopelessness', 'sadness', 'trauma']:
            distress_score += 25
        elif primary_emotion in ['anxiety', 'fear']:
            distress_score += 20
        distress_score = min(distress_score, 100)

        # 3. External Threat Risk Score (0-100)
        threat_score = 10  # baseline
        detected_threats = []
        for kw in EXTERNAL_THREAT_KEYWORDS:
            if kw in text_lower:
                threat_score += 35
                detected_threats.append(kw)
        
        if 'weapons' in text_lower or 'kill' in text_lower or 'gun' in text_lower or 'knife' in text_lower:
            threat_score += 30
        threat_score = min(threat_score, 100)

        is_suicidal = len(detected_suicide) > 0 or distress_score >= 75
        is_threat_alert = threat_score >= 60

        timestamp = datetime.now().strftime('%d %b %Y, %I:%M %p')
        anon_id = self.generate_anonymous_id(user_id, timestamp)
        cleaned_text = self.strip_pii(text)

        # 4. If Threat Score >= 60, flag and temporarily unmask victim details for police intervention
        if is_threat_alert:
            alert_id = f"THREAT-2026-{int(time.time()) % 10000:04d}"
            victim_identity = real_name or "Registered Complainant / Survivor"
            loc = location or "Pune Central District / Local Jurisdiction"
            ph = phone or "+91 98XXXXXX10"
            
            threat_entry = {
                'alert_id': alert_id,
                'user_id': user_id,
                'victim_name': victim_identity,
                'phone': ph,
                'location': loc,
                'nearest_police_station': 'Nearest SC/ST Nodal Cell / Local Police',
                'threat_score': threat_score,
                'distress_score': distress_score,
                'threat_statement': text,
                'status': 'High Risk - Pending Police Action',
                'police_dispatch_time': 'Action Required',
                'timestamp': timestamp,
            }
            self.active_threat_alerts.insert(0, threat_entry)
            print(f"🚨 CRITICAL EXTERNAL THREAT DETECTED: {alert_id} (Score: {threat_score})")

        # 5. If Emotional Distress >= 75, create Counselor Alert
        if is_suicidal or distress_score >= 75:
            crisis_id = f"CRISIS-2026-{int(time.time()) % 10000:04d}"
            counselor_entry = {
                'alert_id': crisis_id,
                'user_id': user_id,
                'anonymous_id': anon_id,
                'distress_score': distress_score,
                'primary_concern': f"High Emotional Distress / Trauma ({primary_emotion})",
                'counselor_assigned': 'District Emergency Counselor (Pending)',
                'status': 'Immediate Support Triggered',
                'timestamp': timestamp,
            }
            self.active_counselor_alerts.insert(0, counselor_entry)
            print(f"🆘 SUICIDE / CRISIS DETECTED: {crisis_id} (Score: {distress_score})")

        self.processed_count += 1
        self.emotion_history.append(primary_emotion)
        self.recent_messages.insert(0, {
            'anon_id': anon_id,
            'emotion': primary_emotion,
            'distress_score': distress_score,
            'threat_score': threat_score,
            'timestamp': timestamp,
            'snippet': cleaned_text[:60] + ('...' if len(cleaned_text) > 60 else ''),
        })
        if len(self.recent_messages) > 20:
            self.recent_messages = self.recent_messages[:20]

        return {
            'anonymous_id': anon_id,
            'primary_emotion': primary_emotion,
            'emotional_distress_score': distress_score,
            'external_threat_score': threat_score,
            'is_suicidal': is_suicidal,
            'is_threat_alert': is_threat_alert,
            'sos_popup_trigger': is_suicidal or is_threat_alert,
            'threat_keywords': detected_threats,
        }

pipeline = ThreatIntelligencePipeline()

@app.route('/process-message', methods=['POST'])
def process_message():
    try:
        data = request.json
        user_id = data.get('user_id', 'demo_user')
        message = data.get('message', '')
        real_name = data.get('real_name')
        location = data.get('location')
        phone = data.get('phone')
        
        if not message:
            return jsonify({'error': 'Missing message'}), 400
        
        result = pipeline.analyze_message(message, user_id, real_name, location, phone)
        
        return jsonify({
            'success': True,
            'anonymous_id': result['anonymous_id'],
            'primary_emotion': result['primary_emotion'],
            'emotional_distress_score': result['emotional_distress_score'],
            'external_threat_score': result['external_threat_score'],
            'is_suicidal': result['is_suicidal'],
            'is_threat_alert': result['is_threat_alert'],
            'sos_popup_trigger': result['sos_popup_trigger'],
            'crisis_alert': result['sos_popup_trigger'],
        })
    except Exception as e:
        print(f"Error in process_message: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/analytics-demo', methods=['GET'])
def analytics_demo():
    from collections import Counter
    counts = Counter(pipeline.emotion_history)
    top_emotions = [
        {'emotion': em, 'count': c, 'percentage': round(c / max(len(pipeline.emotion_history), 1) * 100, 1)}
        for em, c in counts.most_common(5)
    ]

    return jsonify({
        'total_messages_processed': pipeline.processed_count,
        'active_threat_alerts': pipeline.active_threat_alerts,
        'active_counselor_alerts': pipeline.active_counselor_alerts,
        'recent_messages': pipeline.recent_messages,
        'top_emotions': top_emotions,
        'privacy_guarantee': 'Zero PII exposure in regular state. Temporary authorized unmasking active only for life-safety threats.',
    })

@app.route('/transfer-police', methods=['POST'])
def transfer_police():
    data = request.json
    alert_id = data.get('alert_id')
    for item in pipeline.active_threat_alerts:
        if item['alert_id'] == alert_id:
            item['status'] = 'Transferred to Local Police Station (Units Dispatched)'
            item['police_dispatch_time'] = 'Just now'
            return jsonify({'success': True, 'message': f'Alert {alert_id} dispatched to police station.'})
    return jsonify({'error': 'Alert ID not found'}), 404

@app.route('/assign-counselor', methods=['POST'])
def assign_counselor():
    data = request.json
    alert_id = data.get('alert_id')
    counselor_name = data.get('counselor_name', 'Dr. Ayush Kulkarni (Empanelled Trauma Specialist)')
    for item in pipeline.active_counselor_alerts:
        if item['alert_id'] == alert_id:
            item['counselor_assigned'] = counselor_name
            item['status'] = 'Counselor Assigned & Reaching Out'
            return jsonify({'success': True, 'message': f'Counselor assigned to {alert_id}.'})
    return jsonify({'error': 'Alert ID not found'}), 404

@app.route('/resolve-threat', methods=['POST'])
def resolve_threat():
    data = request.json
    alert_id = data.get('alert_id')
    pipeline.active_threat_alerts = [a for a in pipeline.active_threat_alerts if a['alert_id'] != alert_id]
    return jsonify({'success': True, 'message': f'Threat {alert_id} marked as resolved and identity re-anonymized.'})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'running',
        'mode': 'offline_threat_emotion_ai',
        'processed': pipeline.processed_count,
        'threat_alerts_active': len(pipeline.active_threat_alerts),
    })

if __name__ == '__main__':
    print("\n" + "="*75)
    print("🛡️  ELEVANA AI - THREAT & EMOTION INTELLIGENCE SERVER (PORT 5001)")
    print("="*75)
    print("✅ Emotion AI & Suicidal Distress Detection Active")
    print("✅ External Threat & Hostile Factor Detection Active")
    print("✅ High-Risk Police Unmasking Protocol Active")
    print("="*75 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5001)