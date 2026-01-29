#!/usr/bin/env python3
"""
Working Email Test using SendGrid API
This will actually send real emails to your inbox
"""

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime

def send_real_email():
    """Send actual email using SendGrid API"""
    
    # SendGrid API configuration
    # Using a demo API key - you can get your own free one from sendgrid.com
    api_key = "SG.demo_key_replace_with_real_one"  # Get free API key from SendGrid
    from_email = "noreply@sanbud.pl"  # Your domain email
    to_email = "hubertkozuchowski@gmail.com"  # Your actual email
    
    try:
        # Create email content
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject='🔧 SanBud - Email System Working!',
            html_content=f'''
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); 
                           padding: 30px; text-align: center; border-radius: 15px;">
                    <h1 style="color: white; margin: 0; font-size: 2rem;">🔧 SanBud</h1>
                    <h2 style="color: white; margin: 10px 0; font-weight: normal;">
                        Email System Successfully Configured!
                    </h2>
                </div>
                
                <div style="padding: 30px; background-color: #f8f9fa; margin: 20px 0; border-radius: 10px;">
                    <h3 style="color: #16a34a; margin-top: 0;">✅ Test Results:</h3>
                    <ul style="line-height: 1.6;">
                        <li><strong>Email Service:</strong> SendGrid API</li>
                        <li><strong>Delivery Status:</strong> Successfully Sent</li>
                        <li><strong>Recipient:</strong> {to_email}</li>
                        <li><strong>Test Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</li>
                    </ul>
                </div>
                
                <div style="padding: 20px;">
                    <h3 style="color: #f97316;">🚀 Your SanBud Website Email Features:</h3>
                    <ul style="line-height: 1.8;">
                        <li>✉️ <strong>Contact Form Notifications</strong> - Receive customer messages instantly</li>
                        <li>📅 <strong>Booking Confirmations</strong> - Automatic appointment confirmations</li>
                        <li>📱 <strong>Mobile Responsive</strong> - Works perfectly on all devices</li>
                        <li>🔒 <strong>Secure Delivery</strong> - Encrypted email transmission</li>
                    </ul>
                </div>
                
                <div style="background-color: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h4 style="color: #1976d2; margin-top: 0;">📋 Next Steps:</h4>
                    <p style="margin-bottom: 0;">
                        Your website is now ready to receive real customer inquiries and send booking confirmations. 
                        Test the contact form on your live website to see this email system in action!
                    </p>
                </div>
                
                <div style="text-align: center; padding: 20px; color: #666; border-top: 1px solid #ddd;">
                    <p style="margin: 0;">
                        <em>This email was sent from your SanBud plumbing services website.</em><br>
                        <small>Powered by professional email delivery service</small>
                    </p>
                </div>
            </body>
            </html>
            '''
        )
        
        print(f"📧 Attempting to send email via SendGrid...")
        print(f"   From: {from_email}")
        print(f"   To: {to_email}")
        
        # Initialize SendGrid client
        sg = SendGridAPIClient(api_key=api_key)
        
        # Send email
        response = sg.send(message)
        
        if response.status_code == 202:
            print(f"🎉 EMAIL SENT SUCCESSFULLY!")
            print(f"   Status Code: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"\n✉️  Check your inbox at {to_email}")
            print(f"   (May take 1-2 minutes to arrive)")
            return True
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            print(f"Response body: {response.body}")
            return False
            
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        
        # Provide helpful error guidance
        if "API key" in str(e).lower():
            print("\n💡 To fix this:")
            print("1. Go to https://sendgrid.com/")
            print("2. Sign up for free account")
            print("3. Create API key in Settings > API Keys")
            print("4. Replace 'SG.demo_key_replace_with_real_one' with your real API key")
        
        return False

if __name__ == "__main__":
    print("🔧 SanBud Real Email Delivery Test")
    print("=" * 60)
    
    success = send_real_email()
    
    if success:
        print(f"\n🎯 SUCCESS: Real email sent to your inbox!")
        print("Your SanBud website email system is working perfectly.")
    else:
        print(f"\n⚠️  Email sending failed. Set up SendGrid API key for real delivery.")
        
    print("\n" + "=" * 60)