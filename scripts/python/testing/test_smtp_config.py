#!/usr/bin/env python3
"""
SMTP Configuration and Testing Script
Tests email sending with different configurations and providers.
"""

import sys
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Add project root to path
sys.path.insert(0, '/Users/haos/azure-san-bud')

def test_smtp_connection(smtp_host, smtp_port, username, password, use_tls=True):
    """Test SMTP connection with given credentials."""
    
    print(f"🔌 Testing SMTP: {smtp_host}:{smtp_port}")
    print(f"   👤 Username: {username}")
    print(f"   🔐 Password: {password[:5]}...")
    print(f"   🔒 TLS: {use_tls}")
    
    try:
        # Create SMTP connection
        if use_tls:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
        else:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        
        # Login
        server.login(username, password)
        
        print("   ✅ Connection successful!")
        server.quit()
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"   ❌ Authentication failed: {e}")
        return False
    except smtplib.SMTPException as e:
        print(f"   ❌ SMTP error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Connection error: {e}")
        return False

def send_test_email(smtp_host, smtp_port, username, password, from_email, to_email, use_tls=True):
    """Send test email."""
    
    print(f"📧 Sending test email...")
    print(f"   📤 From: {from_email}")
    print(f"   📥 To: {to_email}")
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = "SanBud SMTP Test - " + datetime.now().strftime("%Y-%m-%d %H:%M")
        
        body = f"""
Test wiadomości email z systemu SanBud.

Szczegóły testu:
- Data: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
- SMTP Server: {smtp_host}:{smtp_port}
- From: {from_email}
- TLS: {use_tls}

Ten email potwierdza, że konfiguracja SMTP działa poprawnie.

Pozdrawienia,
System SanBud
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email
        if use_tls:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
        else:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
            
        server.login(username, password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        
        print("   ✅ Email sent successfully!")
        return True
        
    except Exception as e:
        print(f"   ❌ Failed to send email: {e}")
        return False

def test_gmail_configurations():
    """Test different Gmail configurations."""
    
    print("🧪 Testing Gmail SMTP Configurations")
    print("=" * 60)
    
    # Test configurations
    configs = [
        {
            "name": "Personal Gmail (hubertkozuchowski1337)",
            "smtp_host": "smtp.gmail.com",
            "smtp_port": 587,
            "username": "hubertkozuchowski1337@gmail.com",
            "password": "kjpvcqnvfyfuiwrb",  # App password
            "from_email": "hubertkozuchowski1337@gmail.com",
            "use_tls": True
        },
        {
            "name": "Business Gmail (sanbud.kontakt) - Need App Password",
            "smtp_host": "smtp.gmail.com", 
            "smtp_port": 587,
            "username": "sanbud.kontakt@gmail.com",
            "password": "NEED_TO_CREATE_APP_PASSWORD",
            "from_email": "sanbud.kontakt@gmail.com",
            "use_tls": True
        }
    ]
    
    test_email = "hubertkozuchowski@gmail.com"  # Test recipient
    
    for i, config in enumerate(configs, 1):
        print(f"\n📋 Test {i}/{len(configs)}: {config['name']}")
        print("-" * 50)
        
        if config['password'] == "NEED_TO_CREATE_APP_PASSWORD":
            print("⚠️  Skipping - need to create app password for business account")
            continue
        
        # Test connection
        connection_ok = test_smtp_connection(
            config['smtp_host'],
            config['smtp_port'], 
            config['username'],
            config['password'],
            config['use_tls']
        )
        
        if connection_ok:
            # Test sending
            email_ok = send_test_email(
                config['smtp_host'],
                config['smtp_port'],
                config['username'], 
                config['password'],
                config['from_email'],
                test_email,
                config['use_tls']
            )
            
            if email_ok:
                print(f"   🎉 Configuration {config['name']} works perfectly!")
            else:
                print(f"   ⚠️  Configuration {config['name']} connects but can't send")
        else:
            print(f"   ❌ Configuration {config['name']} connection failed")

def generate_app_password_instructions():
    """Generate instructions for creating app password."""
    
    print("\n📝 Instrukcje utworzenia hasła aplikacji dla sanbud.kontakt@gmail.com")
    print("=" * 70)
    print("""
🔐 Krok po kroku - Hasło Aplikacji Google:

1️⃣ Zaloguj się na konto sanbud.kontakt@gmail.com

2️⃣ Przejdź do: https://myaccount.google.com/security

3️⃣ W sekcji "Signing in to Google" kliknij "App passwords"
   (Może być w sekcji "2-Step Verification")

4️⃣ Jeśli nie ma opcji "App passwords":
   - Włącz najpierw "2-Step Verification"
   - Poczekaj kilka minut
   - Odśwież stronę

5️⃣ Kliknij "App passwords" i wybierz:
   - App: "Mail"
   - Device: "Other" -> wpisz "SanBud SMTP"

6️⃣ Skopiuj wygenerowane hasło (16 znaków)

7️⃣ Zaktualizuj .env file:
   SMTP_PASS=your_generated_app_password

⚠️  GOOGLE WORKSPACE ISSUES:
Jeśli nie widzisz opcji "App passwords":

A) Administrator mógł wyłączyć hasła aplikacji
   - Skontaktuj się z administratorem Google Workspace
   - Lub użyj OAuth2

B) Użyj alternatywnych usług:
   - SendGrid (darmowe 100 emaili/dzień)
   - Mailgun (darmowe 5000 emaili/miesiąc)
   - Azure Communication Services

📧 Po utworzeniu hasła uruchom ponownie ten script
""")

def create_alternative_email_config():
    """Create configuration for alternative email providers."""
    
    print("\n🔄 Alternatywne konfiguracje email")
    print("=" * 50)
    
    alt_config = '''
# ALTERNATYWNE KONFIGURACJE EMAIL

# 1. SendGrid (Zalecane dla firm)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=YOUR_SENDGRID_API_KEY
# SMTP_FROM_EMAIL=noreply@sanbud.pl

# 2. Mailgun
# SMTP_HOST=smtp.mailgun.org
# SMTP_PORT=587  
# SMTP_USER=YOUR_MAILGUN_USERNAME
# SMTP_PASS=YOUR_MAILGUN_PASSWORD
# SMTP_FROM_EMAIL=noreply@mg.sanbud.pl

# 3. Outlook/Hotmail
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587
# SMTP_USER=your_outlook_email@outlook.com
# SMTP_PASS=your_outlook_password
# SMTP_FROM_EMAIL=your_outlook_email@outlook.com

# 4. Azure Communication Services
# (Requires SDK configuration, not SMTP)
'''
    
    print(alt_config)
    
    # Save to file
    with open('/Users/haos/azure-san-bud/docs/email-alternatives.env', 'w') as f:
        f.write(alt_config)
    
    print("💾 Saved alternative configs to: docs/email-alternatives.env")

def main():
    """Main function."""
    print("🚀 SanBud Email Configuration Tester")
    print("=" * 60)
    
    # Test current configurations
    test_gmail_configurations()
    
    # Generate instructions
    generate_app_password_instructions()
    
    # Create alternative configs
    create_alternative_email_config()
    
    print("\n" + "=" * 60)
    print("📋 NASTĘPNE KROKI:")
    print("1. Utwórz hasło aplikacji dla sanbud.kontakt@gmail.com")
    print("2. Zaktualizuj SMTP_PASS w .env")
    print("3. Uruchom ponownie ten script do testowania")
    print("4. Jeśli nie działa, rozważ SendGrid lub inną usługę")
    print("=" * 60)

if __name__ == "__main__":
    main()