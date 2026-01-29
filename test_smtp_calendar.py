#!/usr/bin/env python3
"""
Test SMTP configuration for calendar booking emails
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

def test_smtp_config():
    """Test SMTP configuration"""
    print("\n" + "="*60)
    print("🔍 SMTP CONFIGURATION CHECK - Calendar Booking")
    print("="*60 + "\n")
    
    # Check environment variables
    smtp_host = os.getenv('SMTP_HOST')
    smtp_port = os.getenv('SMTP_PORT')
    smtp_user = os.getenv('SMTP_USER')
    smtp_pass = os.getenv('SMTP_PASS')
    booking_email = os.getenv('BOOKING_EMAIL')
    
    print("📋 Environment Variables:")
    print(f"   SMTP_HOST: {smtp_host}")
    print(f"   SMTP_PORT: {smtp_port}")
    print(f"   SMTP_USER: {smtp_user}")
    print(f"   SMTP_PASS: {'*' * len(smtp_pass) if smtp_pass else 'NOT SET'}")
    print(f"   BOOKING_EMAIL: {booking_email}")
    print()
    
    # Check if all required variables are set
    missing = []
    if not smtp_host:
        missing.append('SMTP_HOST')
    if not smtp_port:
        missing.append('SMTP_PORT')
    if not smtp_user:
        missing.append('SMTP_USER')
    if not smtp_pass:
        missing.append('SMTP_PASS')
    if not booking_email:
        missing.append('BOOKING_EMAIL')
    
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        return False
    
    print("✅ All SMTP environment variables are set!")
    print()
    
    # Test SMTP connection
    print("🔌 Testing SMTP connection...")
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        # Create test message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'🧪 Test SMTP - Calendar Booking ({datetime.now().strftime("%Y-%m-%d %H:%M")})'
        msg['From'] = smtp_user
        msg['To'] = booking_email
        
        html = """
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
              <h1>🧪 Test SMTP Configuration</h1>
              <p>Calendar Booking System</p>
            </div>
            <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px; margin-top: -10px;">
              <h2 style="color: #16a34a;">✅ SMTP Test Successful!</h2>
              <p>Jeśli widzisz tę wiadomość, to znaczy że konfiguracja SMTP działa poprawnie.</p>
              <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h3>📊 Szczegóły testowe:</h3>
                <ul>
                  <li><strong>SMTP Server:</strong> {}</li>
                  <li><strong>Port:</strong> {}</li>
                  <li><strong>User:</strong> {}</li>
                  <li><strong>Booking Email:</strong> {}</li>
                  <li><strong>Test Time:</strong> {}</li>
                </ul>
              </div>
              <div style="background: #e6f7ed; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #16a34a;">
                <h4 style="color: #16a34a;">💡 Co to oznacza?</h4>
                <p>Kalendarz rezerwacji będzie mógł wysyłać:</p>
                <ul>
                  <li>✅ Potwierdzenia rezerwacji do klientów</li>
                  <li>✅ Powiadomienia o nowych rezerwacjach dla Ciebie</li>
                  <li>✅ Przypomnienia 24h przed wizytą</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
        """.format(smtp_host, smtp_port, smtp_user, booking_email, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        
        part = MIMEText(html, 'html')
        msg.attach(part)
        
        # Connect and send
        print(f"   Connecting to {smtp_host}:{smtp_port}...")
        server = smtplib.SMTP(smtp_host, int(smtp_port))
        server.starttls()
        print(f"   Logging in as {smtp_user}...")
        server.login(smtp_user, smtp_pass)
        print(f"   Sending test email to {booking_email}...")
        server.send_message(msg)
        server.quit()
        
        print()
        print("="*60)
        print("✅ SUCCESS! SMTP IS WORKING!")
        print("="*60)
        print()
        print(f"📧 Test email sent to: {booking_email}")
        print("   Check your inbox!")
        print()
        print("🎉 Calendar booking emails will work correctly!")
        print()
        
        return True
        
    except smtplib.SMTPAuthenticationError:
        print()
        print("❌ SMTP Authentication Failed!")
        print("   Check your SMTP_USER and SMTP_PASS")
        print("   For Gmail, you need an App Password:")
        print("   https://myaccount.google.com/apppasswords")
        return False
        
    except Exception as e:
        print()
        print(f"❌ SMTP Connection Failed: {str(e)}")
        return False

if __name__ == '__main__':
    success = test_smtp_config()
    sys.exit(0 if success else 1)
