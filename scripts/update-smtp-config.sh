#!/bin/bash
# Script to update SMTP configuration with new Google App Password

echo "🔧 Aktualizacja konfiguracji SMTP dla SanBud"
echo "============================================="
echo ""

# Prompt for the app password
echo "📋 Wklej hasło aplikacji Google (16 znaków bez spacji):"
echo "   Przykład: abcdefghijklmnop"
read -s APP_PASSWORD

echo ""
echo "Sprawdzam hasło..."

# Validate password length (should be 16 characters without spaces)
APP_PASSWORD_CLEAN=$(echo "$APP_PASSWORD" | tr -d ' ')
if [ ${#APP_PASSWORD_CLEAN} -ne 16 ]; then
    echo "❌ Błąd: Hasło aplikacji powinno mieć 16 znaków (bez spacji)"
    echo "   Otrzymano: ${#APP_PASSWORD_CLEAN} znaków"
    exit 1
fi

echo "✅ Hasło aplikacji wygląda poprawnie"
echo ""

# Update .env file
echo "📝 Aktualizuję plik .env..."

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Błąd: Plik .env nie istnieje"
    exit 1
fi

# Backup original .env
cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ Utworzono backup: ${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Update SMTP settings in .env
sed -i.tmp "s/^SMTP_USER=.*/SMTP_USER=sanbud.kontakt@gmail.com/" "$ENV_FILE"
sed -i.tmp "s/^SMTP_PASS=.*/SMTP_PASS=${APP_PASSWORD_CLEAN}/" "$ENV_FILE"
sed -i.tmp "s/^SMTP_FROM_EMAIL=.*/SMTP_FROM_EMAIL=sanbud.kontakt@gmail.com/" "$ENV_FILE"
sed -i.tmp "s/^SMTP_FROM_NAME=.*/SMTP_FROM_NAME=SanBud - Usługi Hydrauliczne/" "$ENV_FILE"
sed -i.tmp "s/^CONTACT_EMAIL=.*/CONTACT_EMAIL=sanbud.kontakt@gmail.com/" "$ENV_FILE"
sed -i.tmp "s/^BOOKING_EMAIL=.*/BOOKING_EMAIL=sanbud.kontakt@gmail.com/" "$ENV_FILE"

# Remove temporary files
rm -f "${ENV_FILE}.tmp"

echo "✅ Zaktualizowano plik .env"
echo ""

# Display updated configuration (without password)
echo "📋 Nowa konfiguracja SMTP:"
echo "   SMTP_HOST: smtp.gmail.com"
echo "   SMTP_PORT: 587"
echo "   SMTP_USER: sanbud.kontakt@gmail.com"
echo "   SMTP_PASS: ${APP_PASSWORD_CLEAN:0:4}************"
echo "   SMTP_FROM_EMAIL: sanbud.kontakt@gmail.com"
echo ""

# Test SMTP configuration
echo "🧪 Czy chcesz przetestować konfigurację SMTP? (t/n):"
read -p "> " TEST_CHOICE

if [[ "$TEST_CHOICE" == "t" || "$TEST_CHOICE" == "T" ]]; then
    echo ""
    echo "Uruchamiam test SMTP..."
    python scripts/python/testing/test_smtp_config.py
fi

echo ""
echo "============================================="
echo "✅ Konfiguracja SMTP zaktualizowana!"
echo ""
echo "📝 Następne kroki:"
echo "   1. Przetestuj wysyłanie emaili lokalnie"
echo "   2. Zaktualizuj Azure App Settings:"
echo "      az webapp config appsettings set \\"
echo "        --name app-sanbud-api-prod \\"
echo "        --resource-group rg-sanbud-prod \\"
echo "        --settings \\"
echo "        SMTP_USER=sanbud.kontakt@gmail.com \\"
echo "        SMTP_PASS=${APP_PASSWORD_CLEAN} \\"
echo "        SMTP_FROM_EMAIL=sanbud.kontakt@gmail.com"
echo ""
echo "   3. Zrestartuj aplikację Azure"
echo "   4. Przetestuj na produkcji"
echo ""