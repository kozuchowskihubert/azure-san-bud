"""
SMTP Email Test Script
Tests the email configuration and sends a test email
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def test_smtp_connection():
    """Test SMTP connection with current configuration"""
    
    print("🧪 Testing SMTP Configuration...")
    print("=" * 50)
    
    # Get SMTP configuration from environment
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.sendgrid.net')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER', 'apikey')
    smtp_pass = os.environ.get('SMTP_PASS')
    from_email = os.environ.get('SMTP_FROM_EMAIL', 'noreply@sanbud.pl')
    from_name = os.environ.get('SMTP_FROM_NAME', 'SanBud')
    
    print(f"\nSMTP Configuration:")
    print(f"  Host: {smtp_host}")
    print(f"  Port: {smtp_port}")
    print(f"  User: {smtp_user}")
    print(f"  Pass: {'*' * 10 if smtp_pass else 'NOT SET'}")
    print(f"  From: {from_name} <{from_email}>")
    print()
    
    if not smtp_pass:
        print("❌ Error: SMTP_PASS environment variable not set!")
        print("\nPlease set the following environment variables:")
        print("  export SMTP_PASS='your_sendgrid_api_key'")
        return False
    
    # Get test recipient email
    test_email = input("Enter test recipient email address: ").strip()
    if not test_email or '@' not in test_email:
        print("❌ Invalid email address")
        return False
    
    # Create test message
    msg = MIMEMultipart('alternative')
    msg['From'] = f"{from_name} <{from_email}>"
    msg['To'] = test_email
    msg['Subject'] = "🧪 Test Email from SanBud SMTP Configuration"
    
    # Plain text version
    text_body = """
Test Email from SanBud

This is a test email to verify your SMTP configuration is working correctly.

If you received this email, your SMTP settings are configured properly!

Configuration tested:
- SMTP Server: {}
- Port: {}
- TLS: Enabled

---
SanBud - Profesjonalne Usługi Hydrauliczne
https://sanbud.pl
    """.format(smtp_host, smtp_port)
    
    # HTML version
    html_body = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 20px;">
    <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧪 Test Email</h1>
            <p style="color: white; margin: 10px 0 0 0;">SMTP Configuration Test</p>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #16a34a; margin-top: 0;">✅ Success!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
                If you're reading this email, your SMTP configuration is working correctly!
            </p>
            
            <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">Configuration Tested:</h3>
                <table style="width: 100%;">
                    <tr>
                        <td style="padding: 5px 0; color: #374151;"><strong>SMTP Server:</strong></td>
                        <td style="padding: 5px 0; color: #16a34a;">{}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #374151;"><strong>Port:</strong></td>
                        <td style="padding: 5px 0; color: #16a34a;">{}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #374151;"><strong>TLS:</strong></td>
                        <td style="padding: 5px 0; color: #16a34a;">Enabled</td>
                    </tr>
                </table>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                You can now use this configuration for your contact forms and booking confirmations.
            </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-weight: bold;">SanBud - Profesjonalne Usługi Hydrauliczne</p>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
                <a href="https://sanbud.pl" style="color: #16a34a; text-decoration: none;">www.sanbud.pl</a>
            </p>
        </div>
    </div>
</body>
</html>
    """.format(smtp_host, smtp_port)
    
    # Attach both versions
    msg.attach(MIMEText(text_body, 'plain'))
    msg.attach(MIMEText(html_body, 'html'))
    
    print(f"📧 Sending test email to: {test_email}")
    print("⏳ Please wait...")
    
    try:
        # Connect to SMTP server
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
        server.set_debuglevel(0)  # Set to 1 for verbose debugging
        
        print("  → Connecting to SMTP server...")
        server.ehlo()
        
        print("  → Starting TLS encryption...")
        server.starttls()
        server.ehlo()
        
        print("  → Authenticating...")
        server.login(smtp_user, smtp_pass)
        
        print("  → Sending email...")
        server.send_message(msg)
        
        print("  → Closing connection...")
        server.quit()
        
        print()
        print("=" * 50)
        print("✅ SUCCESS! Test email sent successfully!")
        print("=" * 50)
        print()
        print("📬 Check your inbox at:", test_email)
        print("💡 Don't forget to check spam folder if you don't see it")
        print()
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print()
        print("=" * 50)
        print("❌ AUTHENTICATION ERROR")
        print("=" * 50)
        print(f"Error: {e}")
        print()
        print("Possible causes:")
        print("  • Wrong API key or password")
        print("  • SMTP_USER should be 'apikey' for SendGrid")
        print("  • Check that SMTP_PASS matches your SendGrid API key")
        print()
        return False
        
    except smtplib.SMTPException as e:
        print()
        print("=" * 50)
        print("❌ SMTP ERROR")
        print("=" * 50)
        print(f"Error: {e}")
        print()
        return False
        
    except Exception as e:
        print()
        print("=" * 50)
        print("❌ ERROR")
        print("=" * 50)
        print(f"Error: {e}")
        print()
        print("Possible causes:")
        print("  • Network connection issues")
        print("  • Firewall blocking SMTP port")
        print("  • Invalid SMTP server address")
        print()
        return False


def test_flask_mail():
    """Test Flask-Mail configuration"""
    print("\n🧪 Testing Flask-Mail Integration...")
    print("=" * 50)
    
    try:
        from flask import Flask
        from config.email import init_email, send_contact_email
        
        print("  → Creating Flask app...")
        app = Flask(__name__)
        
        print("  → Initializing email configuration...")
        with app.app_context():
            init_email(app)
            
            # Test sending a contact email
            test_name = "Test User"
            test_email = input("\nEnter test recipient email: ").strip()
            if not test_email:
                print("❌ No email provided")
                return False
            
            test_phone = "+48 123 456 789"
            test_message = "This is a test message from the SMTP configuration test script."
            
            print(f"\n📧 Sending test contact email to: {test_email}")
            print("⏳ Please wait...")
            
            success = send_contact_email(test_name, test_email, test_phone, test_message)
            
            if success:
                print()
                print("=" * 50)
                print("✅ SUCCESS! Flask-Mail test email sent!")
                print("=" * 50)
                print()
                return True
            else:
                print()
                print("❌ Failed to send email via Flask-Mail")
                return False
                
    except ImportError as e:
        print(f"\n❌ Import Error: {e}")
        print("\nMake sure Flask-Mail is installed:")
        print("  pip install Flask-Mail")
        return False
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False


if __name__ == "__main__":
    print()
    print("╔" + "=" * 48 + "╗")
    print("║" + " " * 10 + "SanBud SMTP Email Test" + " " * 16 + "║")
    print("╚" + "=" * 48 + "╝")
    print()
    
    print("Choose test method:")
    print("1. Direct SMTP test (basic)")
    print("2. Flask-Mail test (recommended)")
    print("3. Both")
    print()
    
    choice = input("Enter your choice (1/2/3): ").strip()
    print()
    
    if choice == "1":
        test_smtp_connection()
    elif choice == "2":
        test_flask_mail()
    elif choice == "3":
        test_smtp_connection()
        print("\n" + "-" * 50 + "\n")
        test_flask_mail()
    else:
        print("❌ Invalid choice")
