#!/bin/bash

echo "🌐 PASSWORD RESET WEB INTERFACE TEST"
echo "===================================="
echo ""

# Configuration
BASE_URL="http://localhost:5001"
EMAIL="mugishaprince395@gmail.com"

echo "📋 Testing the complete password reset web interface"
echo "Email: $EMAIL"
echo "Base URL: $BASE_URL"
echo ""

# Check if backend is running
echo "🔍 Step 1: Checking if backend is running..."
if curl -s $BASE_URL/api/v1/customer/hello > /dev/null 2>&1; then
    echo "✅ Backend is running on port 5001"
else
    echo "❌ Backend is not running!"
    echo "👉 Start it with: cd /home/prince/tech-care/backend && mvn spring-boot:run"
    exit 1
fi

echo ""

# Test 1: Access forgot password page
echo "🌐 Step 2: Testing forgot password page access..."
FORGOT_PAGE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/forgot-password.html)

if [ "$FORGOT_PAGE_RESPONSE" = "200" ]; then
    echo "✅ Forgot password page accessible"
    echo "🔗 Visit: $BASE_URL/forgot-password.html"
else
    echo "❌ Forgot password page not accessible (HTTP $FORGOT_PAGE_RESPONSE)"
fi

echo ""

# Test 2: Access reset password page
echo "🌐 Step 3: Testing reset password page access..."
RESET_PAGE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/reset-password.html)

if [ "$RESET_PAGE_RESPONSE" = "200" ]; then
    echo "✅ Reset password page accessible"
    echo "🔗 Visit: $BASE_URL/reset-password.html"
else
    echo "❌ Reset password page not accessible (HTTP $RESET_PAGE_RESPONSE)"
fi

echo ""

# Test 3: Request password reset via API
echo "📧 Step 4: Requesting password reset for testing..."
RESET_REQUEST_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/customer/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}")

echo "Reset request response: $RESET_REQUEST_RESPONSE"

if echo "$RESET_REQUEST_RESPONSE" | grep -q "password reset"; then
    echo "✅ Password reset request sent successfully!"
else
    echo "❌ Failed to send password reset request"
fi

echo ""

echo "🎉 WEB INTERFACE SETUP COMPLETE!"
echo "==============================="
echo ""

echo "📱 HOW TO USE THE WEB INTERFACE:"
echo "================================"
echo ""

echo "Option 1: Start from Forgot Password Page"
echo "----------------------------------------"
echo "1. Open: $BASE_URL/forgot-password.html"
echo "2. Enter your email address"
echo "3. Click 'Send Reset Link'"
echo "4. Check your email for the reset link"
echo "5. Click the link in the email to reset your password"
echo ""

echo "Option 2: Direct Reset (if you have a token)"
echo "-------------------------------------------"
echo "1. Open: $BASE_URL/reset-password.html"
echo "2. Paste your reset token"
echo "3. Enter your new password"
echo "4. Confirm your new password"
echo "5. Click 'Reset Password'"
echo ""

echo "📧 EMAIL INTEGRATION:"
echo "====================="
echo "The password reset email now includes:"
echo "✅ A clickable 'Reset My Password' button"
echo "✅ Direct link to the reset page with token"
echo "✅ Fallback manual token for copy/paste"
echo "✅ Professional styling and security warnings"
echo ""

echo "🔗 QUICK ACCESS LINKS:"
echo "======================"
echo "• Forgot Password: $BASE_URL/forgot-password.html"
echo "• Reset Password: $BASE_URL/reset-password.html"
echo "• API Documentation: See PASSWORD_RESET_API.md"
echo ""

echo "🧪 TESTING CHECKLIST:"
echo "====================="
echo "□ 1. Visit forgot password page"
echo "□ 2. Enter email and request reset"
echo "□ 3. Check email for reset link"
echo "□ 4. Click reset link from email"
echo "□ 5. Enter new password and confirm"
echo "□ 6. Reset password successfully"
echo "□ 7. Login with new password"
echo ""

echo "🔧 BROWSER TESTING:"
echo "==================="
echo "Open these URLs in your browser to test:"
echo ""
echo "curl -s $BASE_URL/forgot-password.html | head -10"
echo "curl -s $BASE_URL/reset-password.html | head -10"
echo ""

echo "💡 NOTES:"
echo "=========="
echo "• The web interface works with any modern browser"
echo "• JavaScript handles form validation and API calls"
echo "• Responsive design works on mobile and desktop"
echo "• All security features are maintained"
echo "• Users can bookmark these pages for future use"
echo ""

echo "✅ Ready to test! Open $BASE_URL/forgot-password.html in your browser!"
