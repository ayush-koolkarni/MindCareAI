from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow requests from your React Native app

# Email configuration - replace with your Gmail credentials
GMAIL_USER = "ayush.kulkarni33@gmail.com"  # Your Gmail address
GMAIL_PASSWORD = "tfkxsqwjvfqycfhm"  # Gmail App Password (not regular password)

def send_email(to_email, subject, body):
    """Send email using Gmail SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.route('/send-appointment-emails', methods=['POST'])
def send_appointment_emails():
    try:
        data = request.json
        
        # Extract data
        student_name = data['student']['name']
        student_email = data['student']['email']
        college = data['student']['college']
        preferred_date = data['student']['preferredDate']
        concerns = data['student']['concerns']
        
        counselor_name = data['counselor']['name']
        counselor_email = data['counselor']['email']
        
        # Email to counselor
        counselor_subject = f"New Counseling Appointment Request - {student_name}"
        counselor_body = f"""
Dear {counselor_name},

You have received a new counseling appointment request from a student.

Student Details:
- Name: {student_name}
- Email: {student_email}
- College: {college}
- Preferred Date/Time: {preferred_date}

Student's Concerns:
{concerns}

Please contact the student directly to schedule the appointment.

Best regards,
Elevana AI System
"""
        
        # Email to student
        student_subject = "Counseling Appointment Request Submitted"
        student_body = f"""
Dear {student_name},

Your counseling appointment request has been successfully submitted.

Appointment Details:
- Counselor: {counselor_name}
- Counselor Email: {counselor_email}
- College: {college}
- Requested Date/Time: {preferred_date}

What happens next:
1. Your counselor will receive your request within minutes
2. They will contact you directly within 24-48 hours
3. You can schedule a convenient meeting time together

If you need immediate support, please contact your campus emergency services or call the crisis helpline at 988.

Take care,
Elevana AI Team
"""
        
        # Send both emails
        counselor_sent = send_email(counselor_email, counselor_subject, counselor_body)
        student_sent = send_email(student_email, student_subject, student_body)
        
        if counselor_sent and student_sent:
            return jsonify({"success": True, "message": "Emails sent successfully"})
        else:
            return jsonify({"success": False, "error": "Failed to send one or both emails"})
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)