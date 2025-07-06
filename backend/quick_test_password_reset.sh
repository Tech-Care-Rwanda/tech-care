#!/bin/bash

echo "🎯 QUICK PASSWORD RESET TEST"
echo "============================"
echo ""

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:5001/api/v1/customer/hello > /dev/null 2>&1; then
    echo "✅ Backend is running on port 5001"
else
    echo "❌ Backend is not running!"
    echo "👉 Start it with: cd /home/prince/tech-care/backend && mvn spring-boot:run"
    exit 1
fi

echo ""

# Your email (change this to your actual email)
EMAIL="mugishaprince395@gmail.com"

echo "📧 Testing password reset for: $EMAIL"
echo "======================================"

# Test 1: Request password reset
echo ""
echo "🔐 Step 1: Requesting password reset..."
echo "---------------------------------------"

RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}")

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "password reset"; then
    echo "✅ Password reset request sent successfully!"
    echo ""
    echo "📧 CHECK YOUR EMAIL NOW!"
    echo "========================"
    echo "Look for an email from TechCare with:"
    echo "Subject: 'TechCare - Password Reset Request'"
    echo ""
    echo "📋 NEXT STEPS:"
    echo "1. Open the email"
    echo "2. Copy the reset token (long UUID string)"
    echo "3. Run this command with your token:"
    echo ""
    echo "curl -X POST http://localhost:5001/api/v1/customer/reset-password \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{"
    echo "    \"resetToken\": \"PASTE_YOUR_TOKEN_HERE\","
    echo "    \"newPassword\": \"NewPassword123!\","
    echo "    \"confirmPassword\": \"NewPassword123!\""
    echo "  }'"
    echo ""
    echo "4. Then test login with new password:"
    echo ""
    echo "curl -X POST http://localhost:5001/api/v1/customer/login \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{"
    echo "    \"email\": \"$EMAIL\","
    echo "    \"password\": \"NewPassword123!\""
    echo "  }'"
    echo ""
    echo "🎉 Password reset is working!"
else
    echo "❌ Something went wrong with password reset request"
    echo "Response: $RESPONSE"
fi

echo ""
echo "🔧 Other Test Options:"
echo "====================="
echo "• Run basic test: ./test_password_reset.sh"
echo "• Run complete test: ./test_complete_password_reset.sh"
echo "• Read full guide: ./HOW_TO_TEST_PASSWORD_RESET.sh"
echo ""
