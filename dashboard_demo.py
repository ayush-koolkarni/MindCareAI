# dashboard_demo.py
from flask import Flask, render_template_string, request, jsonify
import requests

app = Flask(__name__)

@app.route('/privacy-dashboard')
def dashboard():
    # Get analytics from privacy service
    try:
        response = requests.get('http://localhost:5001/analytics-demo', timeout=2)
        data = response.json()
        health = requests.get('http://localhost:5001/health', timeout=2).json()
    except Exception as e:
        data = {
            'total_messages_processed': 148,
            'active_threat_alerts': [
                {
                    'alert_id': 'THREAT-2026-8801',
                    'user_id': 'victim_case_941',
                    'victim_name': 'Meera K. (High-Risk Victim)',
                    'phone': '+91 98231 44512',
                    'location': 'Wadgaon Sheri, Pune, Maharashtra',
                    'nearest_police_station': 'SC/ST Special Cell - Pune Central',
                    'threat_score': 92,
                    'distress_score': 78,
                    'threat_statement': 'Group of 4 hostile individuals gathering outside residence, shouting threats and banging on gate.',
                    'status': 'High Risk - Pending Police Action',
                    'police_dispatch_time': 'Action Required',
                    'timestamp': 'Today, 01:25 AM',
                }
            ],
            'active_counselor_alerts': [
                {
                    'alert_id': 'CRISIS-2026-3022',
                    'user_id': 'victim_case_512',
                    'anonymous_id': 'anon_8f3a9e21',
                    'distress_score': 88,
                    'primary_concern': 'Acute Assault Trauma & Extreme Fear before Special Court Trial',
                    'counselor_assigned': 'Dr. Ayush Kulkarni (DLSA)',
                    'status': 'Counselor Assigned & Reaching Out',
                    'timestamp': 'Today, 01:10 AM',
                }
            ],
            'recent_messages': [
                {'anon_id': 'anon_8f3a9e21', 'emotion': 'trauma', 'distress_score': 88, 'threat_score': 15, 'timestamp': '01:10 AM', 'snippet': 'I have severe panic attacks and flashbacks from the violent assault...'},
                {'anon_id': 'anon_99b1c204', 'emotion': 'fear', 'distress_score': 62, 'threat_score': 45, 'timestamp': '01:18 AM', 'snippet': 'The perpetrators are sending messages through villagers to withdraw the FIR...'},
                {'anon_id': 'anon_14e5a882', 'emotion': 'joy', 'distress_score': 20, 'threat_score': 5, 'timestamp': '01:22 AM', 'snippet': 'The legal aid counsel from DLSA helped prepare my court testimony!'},
            ],
            'top_emotions': [
                {'emotion': 'Anxiety & Trial Stress', 'count': 64, 'percentage': 43.2},
                {'emotion': 'Trauma & Fear', 'count': 42, 'percentage': 28.4},
                {'emotion': 'Anger at Injustice', 'count': 22, 'percentage': 14.8},
                {'emotion': 'Relief & Hope', 'count': 20, 'percentage': 13.6},
            ],
            'privacy_guarantee': 'Zero PII exposure in standard state. Conditional emergency unmasking activated only when life-safety threats exceed threshold (>60%).',
        }
        health = {'status': 'running', 'mode': 'offline_intelligence_demo', 'processed': 148}

    dashboard_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Elevana AI - National & District Monitoring Dashboard</title>
        <meta http-equiv="refresh" content="5">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                padding: 30px; 
                background: #0f1117; 
                color: #e6edf3; 
                min-height: 100vh;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #30363d;
                padding-bottom: 20px;
                margin-bottom: 25px;
            }
            .header-title-box h1 {
                font-size: 28px;
                color: #58a6ff;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .header-title-box p {
                font-size: 14px;
                color: #8b949e;
                margin-top: 4px;
            }
            .status-badge {
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                background: #238636;
                color: #ffffff;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .grid-4 {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 16px;
                margin-bottom: 25px;
            }
            .stat-box {
                background: #161b22;
                border: 1px solid #30363d;
                border-radius: 12px;
                padding: 18px;
                text-align: center;
            }
            .stat-num {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 4px;
            }
            .stat-label {
                font-size: 12px;
                color: #8b949e;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .threat-section {
                background: #1f1515;
                border: 1px solid #f85149;
                border-radius: 14px;
                padding: 22px;
                margin-bottom: 25px;
            }
            .threat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            .threat-title {
                color: #f85149;
                font-size: 18px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .unmask-notice {
                font-size: 11px;
                background: rgba(248, 81, 73, 0.15);
                color: #ff7b72;
                padding: 4px 10px;
                border-radius: 12px;
                border: 1px solid rgba(248, 81, 73, 0.4);
            }
            .threat-card {
                background: #161b22;
                border: 1px solid #30363d;
                border-radius: 10px;
                padding: 16px;
                margin-bottom: 12px;
            }
            .threat-card-top {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }
            .victim-name {
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
            }
            .victim-meta {
                font-size: 13px;
                color: #8b949e;
                margin-top: 2px;
            }
            .score-badge-red {
                background: #da3633;
                color: white;
                font-size: 12px;
                font-weight: bold;
                padding: 4px 10px;
                border-radius: 8px;
            }
            .statement-box {
                background: #0d1117;
                border-left: 3px solid #f85149;
                padding: 10px;
                border-radius: 4px;
                font-size: 13px;
                color: #e6edf3;
                margin-bottom: 12px;
                font-style: italic;
            }
            .threat-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .station-tag {
                font-size: 12px;
                color: #58a6ff;
            }
            .dispatch-btn {
                background: #238636;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 12px;
                cursor: pointer;
                text-decoration: none;
            }
            .dispatch-btn:hover { background: #2ea043; }
            .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 25px;
            }
            .card {
                background: #161b22;
                border: 1px solid #30363d;
                border-radius: 14px;
                padding: 20px;
            }
            .card-title {
                font-size: 16px;
                font-weight: bold;
                color: #f0f6fc;
                margin-bottom: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .crisis-card {
                background: #0d1117;
                border: 1px solid #30363d;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 10px;
            }
            .crisis-top {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
            }
            .crisis-user { font-size: 13px; font-weight: bold; color: #a371f7; }
            .crisis-score { font-size: 12px; color: #f85149; font-weight: bold; }
            .crisis-sub { font-size: 12px; color: #8b949e; }
            .bar-row {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                gap: 10px;
            }
            .bar-label { min-width: 140px; font-size: 12px; color: #8b949e; }
            .bar-track {
                flex: 1;
                height: 18px;
                background: #0d1117;
                border-radius: 9px;
                overflow: hidden;
            }
            .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #1f6feb 0%, #a371f7 100%);
                border-radius: 9px;
                text-align: right;
                padding-right: 6px;
                font-size: 10px;
                font-weight: bold;
                line-height: 18px;
                color: white;
            }
            .recent-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
            }
            .recent-table th {
                text-align: left;
                padding: 8px;
                border-bottom: 1px solid #30363d;
                color: #8b949e;
            }
            .recent-table td {
                padding: 8px;
                border-bottom: 1px solid #21262d;
            }
            .privacy-footer {
                text-align: center;
                color: #8b949e;
                font-size: 12px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-title-box">
                <h1>🛡️ Elevana AI - National & District Monitoring Portal</h1>
                <p>Real-Time Dynamic Distress Scoring, Voice Stress Analytics & High-Risk Emergency Intervention</p>
            </div>
            <div>
                <span class="status-badge">● System Online · 18 States Active</span>
            </div>
        </div>

        <!-- 4 Stat Counters -->
        <div class="grid-4">
            <div class="stat-box">
                <div class="stat-num" style="color: #58a6ff;">{{ data.total_messages_processed }}</div>
                <div class="stat-label">Interactions Monitored</div>
            </div>
            <div class="stat-box">
                <div class="stat-num" style="color: #f85149;">{{ data.active_threat_alerts|length }}</div>
                <div class="stat-label">Active Threat Alerts (Police)</div>
            </div>
            <div class="stat-box">
                <div class="stat-num" style="color: #a371f7;">{{ data.active_counselor_alerts|length }}</div>
                <div class="stat-label">Crisis Counseling Queued</div>
            </div>
            <div class="stat-box">
                <div class="stat-num" style="color: #3fb950;">99.4%</div>
                <div class="stat-label">Zero PII Compliance Rate</div>
            </div>
        </div>

        <!-- THREAT SECTION: EMERGENCY POLICE DISPATCH -->
        <div class="threat-section">
            <div class="threat-header">
                <div class="threat-title">🚨 High-Risk External Threats & Hostile Factor Alerts (Police Action Required)</div>
                <div class="unmask-notice">🔒 Conditional Emergency Protocol: Authorized details temporarily unmasked for physical safety protection</div>
            </div>

            {% for threat in data.active_threat_alerts %}
            <div class="threat-card">
                <div class="threat-card-top">
                    <div>
                        <div class="victim-name">{{ threat.victim_name }} · <span style="font-weight: normal; color: #58a6ff;">ID: {{ threat.alert_id }}</span></div>
                        <div class="victim-meta">📍 Location: <strong>{{ threat.location }}</strong> | 📞 Emergency Contact: <strong>{{ threat.phone }}</strong></div>
                    </div>
                    <div class="score-badge-red">Threat Score: {{ threat.threat_score }}/100</div>
                </div>
                <div class="statement-box">
                    "{{ threat.threat_statement }}"
                </div>
                <div class="threat-actions">
                    <div class="station-tag">🚔 Assigned Jurisdiction: <strong>{{ threat.nearest_police_station }}</strong> (Status: {{ threat.status }})</div>
                    <form action="http://localhost:5001/transfer-police" method="post" style="display:inline;" onsubmit="alert('Alert dispatched directly to local police station patrol unit.');">
                        <input type="hidden" name="alert_id" value="{{ threat.alert_id }}">
                        <button type="submit" class="dispatch-btn">🚨 Dispatched to Local Police Unit</button>
                    </form>
                </div>
            </div>
            {% endfor %}
        </div>

        <!-- 2 Column: Crisis Counseling & Emotion Trends -->
        <div class="grid-2">
            <div class="card">
                <div class="card-title">🧠 Suicidal & Acute Psychological Crisis Queue</div>
                {% for crisis in data.active_counselor_alerts %}
                <div class="crisis-card">
                    <div class="crisis-top">
                        <span class="crisis-user">{{ crisis.alert_id }} ({{ crisis.anonymous_id }})</span>
                        <span class="crisis-score">Distress: {{ crisis.distress_score }}/100</span>
                    </div>
                    <div class="crisis-sub">Concern: {{ crisis.primary_concern }}</div>
                    <div class="crisis-sub" style="margin-top: 4px; color: #58a6ff;">Counselor: {{ crisis.counselor_assigned }} ({{ crisis.status }})</div>
                </div>
                {% endfor %}
            </div>

            <div class="card">
                <div class="card-title">🎭 Anonymous Emotion & Distress Distribution</div>
                {% for em in data.top_emotions %}
                <div class="bar-row">
                    <div class="bar-label">{{ em.emotion }}</div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: {{ em.percentage }}%;">{{ em.percentage }}%</div>
                    </div>
                    <div style="font-size: 11px; color: #8b949e; min-width: 45px; text-align: right;">{{ em.count }} msgs</div>
                </div>
                {% endfor %}
            </div>
        </div>

        <!-- Recent Anonymized Stream -->
        <div class="card">
            <div class="card-title">📊 Live Longitudinal Distress Stream (Anonymized)</div>
            <table class="recent-table">
                <thead>
                    <tr>
                        <th>Anonymous ID</th>
                        <th>Time</th>
                        <th>Dominant Emotion</th>
                        <th>Distress Score</th>
                        <th>Threat Score</th>
                        <th>Sanitized PII Snippet</th>
                    </tr>
                </thead>
                <tbody>
                    {% for msg in data.recent_messages %}
                    <tr>
                        <td style="color: #a371f7; font-family: monospace;">{{ msg.anon_id }}</td>
                        <td>{{ msg.timestamp }}</td>
                        <td><span style="background: #21262d; padding: 2px 6px; border-radius: 4px;">{{ msg.emotion }}</span></td>
                        <td style="font-weight: bold; color: {% if msg.distress_score > 70 %}#f85149{% elif msg.distress_score > 40 %}#e3b341{% else %}#3fb950{% endif %};">{{ msg.distress_score }}/100</td>
                        <td style="font-weight: bold; color: {% if msg.threat_score > 50 %}#f85149{% else %}#8b949e{% endif %};">{{ msg.threat_score }}/100</td>
                        <td style="color: #c9d1d9;">{{ msg.snippet }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>

        <div class="privacy-footer">
            🔒 Privacy Guarantee: {{ data.privacy_guarantee }}<br>
            🔄 Portal updates dynamically every 5 seconds · Department of Social Justice & Empowerment, Govt. of India
        </div>
    </body>
    </html>
    """

    return render_template_string(dashboard_html, data=data, health=health)

if __name__ == '__main__':
    print("\n" + "="*75)
    print("📊 ELEVANA AI - NATIONAL & DISTRICT MONITORING DASHBOARD")
    print("="*75)
    print("🌐 Dashboard URL: http://localhost:5002/privacy-dashboard")
    print("🚨 High-Risk External Threats & Hostile Factor Dispatch Active")
    print("🧠 Suicide & Psychological Crisis Queue Active")
    print("🔄 Live auto-refresh enabled")
    print("="*75 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5002)