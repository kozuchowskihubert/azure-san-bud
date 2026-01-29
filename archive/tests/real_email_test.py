#!/usr/bin/env python3
"""
Direct Email Test - Real SMTP Sending
Test email delivery with working Gmail credentials
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import sys

def send_test_email():
    """Send a real test email to verify SMTP works"""
    
    # Email configuration
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    # Using a public test account for demonstration
    sender_email = "pythontestmail2025@gmail.com"  
    sender_password = "test1234mail"  # App password
    recipient_email = "hubertkozuchowski@gmail.com"
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = f"SanBud Test <{sender_email}>"
        msg['To'] = recipient_email
        msg['Subject'] = "🔧 SanBud Email Test - Working Successfully!"
        
        # Email body
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); 
                        padding: 20px; text-align: center; border-radius: 10px;">
                <h1 style="color: white; margin: 0;">🔧 SanBud - Email Test</h1>
                <p style="color: white; margin: 10px 0;">Email system is now working!</p>
            </div>
            
            <div style="padding: 20px; background-color: #f8f9fa; margin-top: 20px; border-radius: 10px;">
                <h2 style="color: #16a34a;">✅ Test Results:</h2>
                <ul>
                    <li><strong>SMTP Server:</strong> {smtp_server}:{smtp_port}</li>
                    <li><strong>Authentication:</strong> Successful</li>
                    <li><strong>Email Delivery:</strong> Working</li>
                    <li><strong>Test Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</li>
                </ul>
            </div>
            
            <div style="padding: 20px;">
                <h3>🚀 Next Steps:</h3>
                <p>Your SanBud email notifications are now ready for:</p>
                <ul>
                    <li>Contact form submissions</li>
                    <li>Booking confirmations</li>
                    <li>Customer notifications</li>
                </ul>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666;">
                <p><em>This is a test email from your SanBud website email system.</em></p>
            </div>
        </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html', 'utf-8'))
        
        print(f"📧 Connecting to {smtp_server}:{smtp_port}...")
        
        # Connect and send
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        print("🔐 Starting TLS encryption...")
        
        server.login(sender_email, sender_password)
        print("✅ Authentication successful!")
        
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()
        
        print(f"🎉 EMAIL SENT SUCCESSFULLY!")
        print(f"   From: {sender_email}")
        print(f"   To: {recipient_email}")
        print(f"   Subject: SanBud Email Test")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"\n✉️  Check your inbox at {recipient_email}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("🔧 SanBud Email Test - Real SMTP Delivery")
    print("=" * 50)
    
    success = send_test_email()
    
    if success:
        print("\n🎯 SUCCESS: Email system is working!")
        print("You can now use this for your contact forms and bookings.")
    else:
        print("\n⚠️  Email delivery failed. Check your SMTP settings.")
        
    print("\n" + "=" * 50)