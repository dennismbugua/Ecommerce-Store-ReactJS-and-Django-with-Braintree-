#!/bin/bash

echo "🔐 SSL Certificate Trust Setup"
echo "=============================="
echo ""

# Check if certificate exists
if [ ! -f "ssl/localhost.crt" ]; then
    echo "❌ Certificate not found. Please run ./generate-ssl.sh first"
    exit 1
fi

echo "📋 Manual Certificate Trust Instructions:"
echo ""

echo "🌐 For Chrome/Chromium/Edge:"
echo "1. Open chrome://settings/certificates"
echo "2. Click the 'Authorities' tab"
echo "3. Click 'Import' button"
echo "4. Select the file: $(pwd)/ssl/localhost.crt"
echo "5. Check 'Trust this certificate for identifying websites'"
echo "6. Click 'OK'"
echo ""

echo "🦊 For Firefox:"
echo "1. Open about:preferences#privacy"
echo "2. Scroll to 'Certificates' section"
echo "3. Click 'View Certificates'"
echo "4. Go to 'Authorities' tab"
echo "5. Click 'Import'"
echo "6. Select the file: $(pwd)/ssl/localhost.crt"
echo "7. Check 'Trust this CA to identify websites'"
echo "8. Click 'OK'"
echo ""

echo "🖥️  Alternative: System-wide trust (requires sudo):"
echo "sudo cp ssl/localhost.crt /usr/local/share/ca-certificates/localhost.crt"
echo "sudo update-ca-certificates"
echo ""

echo "🔄 After trusting the certificate:"
echo "1. Restart your browser completely"
echo "2. Clear browser cache (Ctrl+Shift+Delete)"
echo "3. Navigate to https://localhost:3000"
echo ""

echo "💡 Quick test: Open https://localhost:3000 in a new tab"
echo "   If you see a 🔒 green lock icon, SSL is working properly!"