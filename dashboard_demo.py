# dashboard_demo.py
from flask import Flask, render_template_string
import requests

app = Flask(__name__)

@app.route('/privacy-dashboard')
def dashboard():
    # Get anonymized analytics from privacy service
    try:
        response = requests.get('http://localhost:5001/analytics-demo')
        data = response.json()
        health = requests.get('http://localhost:5001/health').json()
    except:
        data = {
            'error': 'Privacy service not running',
            'message': 'Please start privacy_service_offline.py first'
        }
        health = {'status': 'offline'}
    
    dashboard_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Privacy-First Analytics Dashboard</title>
        <meta http-equiv="refresh" content="5">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                padding: 40px; 
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                color: white; 
                min-height: 100vh;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            h1 {
                font-size: 48px;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .subtitle {
                font-size: 18px;
                color: #8E8E93;
                margin-bottom: 20px;
            }
            
            .status-badge {
                display: inline-block;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }
            
            .status-running {
                background: #30D158;
                color: white;
            }
            
            .status-offline {
                background: #FF3B30;
                color: white;
            }
            
            .card { 
                background: #2a2a2a; 
                padding: 30px; 
                margin: 20px 0; 
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid #3a3a3a;
                transition: transform 0.2s;
            }
            
            .card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
            }
            
            .guarantee { 
                background: linear-gradient(135deg, #2a4a2a 0%, #1a3a1a 100%);
                border: 2px solid #4CAF50;
            }
            
            .error-card {
                background: linear-gradient(135deg, #4a2a2a 0%, #3a1a1a 100%);
                border: 2px solid #FF3B30;
            }
            
            h3 {
                font-size: 24px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .icon {
                font-size: 28px;
            }
            
            p {
                font-size: 16px;
                line-height: 1.6;
                color: #e0e0e0;
                margin: 8px 0;
            }
            
            strong {
                color: #4CAF50;
                font-weight: 600;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .stat-card {
                background: #1a1a1a;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                border: 1px solid #3a3a3a;
            }
            
            .stat-number {
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 8px;
            }
            
            .stat-label {
                font-size: 14px;
                color: #8E8E93;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .emotion-bar {
                display: flex;
                align-items: center;
                margin: 12px 0;
                gap: 12px;
            }
            
            .emotion-label {
                min-width: 120px;
                font-weight: 500;
            }
            
            .emotion-progress {
                flex: 1;
                height: 24px;
                background: #1a1a1a;
                border-radius: 12px;
                overflow: hidden;
                position: relative;
            }
            
            .emotion-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                transition: width 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 8px;
                color: white;
                font-size: 12px;
                font-weight: 600;
            }
            
            .theme-tag {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                margin: 4px;
                font-size: 14px;
                font-weight: 500;
            }
            
            .refresh-note {
                text-align: center;
                color: #8E8E93;
                font-size: 14px;
                margin-top: 30px;
                font-style: italic;
            }
            
            .error-message {
                color: #FF3B30;
                font-size: 18px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🛡️ Privacy-First Analytics Dashboard</h1>
            <p class="subtitle">Real-time anonymous insights from mental health conversations</p>
            <span class="status-badge {% if health.status == 'running' %}status-running{% else %}status-offline{% endif %}">
                {% if health.status == 'running' %}
                    ● Live - {{ health.mode }}
                {% else %}
                    ● Service Offline
                {% endif %}
            </span>
        </div>
        
        {% if 'error' not in data %}
        
        <div class="card guarantee">
            <h3><span class="icon">🔒</span> Privacy Guarantee</h3>
            <p><strong>{{ data.privacy_guarantee }}</strong></p>
            <p style="margin-top: 12px; font-size: 14px; color: #b0b0b0;">
                {{ data.note }}
            </p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{{ data.total_messages_processed }}</div>
                <div class="stat-label">Messages Processed</div>
            </div>
        </div>
        
        <div class="card">
            <h3><span class="icon">🎭</span> Anonymous Emotional Trends</h3>
            {% if data.top_emotions %}
                {% for emotion in data.top_emotions %}
                <div class="emotion-bar">
                    <div class="emotion-label">{{ emotion.emotion.title() }}</div>
                    <div class="emotion-progress">
                        <div class="emotion-fill" style="width: {{ emotion.percentage }}%">
                            {{ emotion.percentage }}%
                        </div>
                    </div>
                    <div style="min-width: 60px; text-align: right; color: #8E8E93;">
                        {{ emotion.count }} msgs
                    </div>
                </div>
                {% endfor %}
            {% else %}
                <p style="color: #8E8E93;">No emotional data yet. Send some messages to see trends!</p>
            {% endif %}
        </div>
        
        <div class="card">
            <h3><span class="icon">📊</span> Common Anonymous Themes</h3>
            <div style="margin-top: 16px;">
                {% if data.common_themes %}
                    {% for theme in data.common_themes %}
                    <span class="theme-tag">{{ theme.replace('_', ' ').title() }}</span>
                    {% endfor %}
                {% else %}
                    <p style="color: #8E8E93;">No themes detected yet. Keep the conversations going!</p>
                {% endif %}
            </div>
        </div>
        
        {% else %}
        
        <div class="card error-card">
            <h3><span class="icon">⚠️</span> Service Error</h3>
            <p class="error-message">{{ data.error }}</p>
            <p style="margin-top: 16px; text-align: center;">{{ data.message }}</p>
        </div>
        
        {% endif %}
        
        <p class="refresh-note">
            🔄 Dashboard auto-refreshes every 5 seconds to show latest anonymous insights
        </p>
    </body>
    </html>
    """
    
    return render_template_string(dashboard_html, data=data, health=health)

if __name__ == '__main__':
    print("\n" + "="*70)
    print("📊 PRIVACY ANALYTICS DASHBOARD")
    print("="*70)
    print("🌐 Dashboard URL: http://localhost:5002/privacy-dashboard")
    print("🔄 Auto-refreshes every 5 seconds")
    print("📈 Shows real-time anonymous insights")
    print("="*70 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5002)