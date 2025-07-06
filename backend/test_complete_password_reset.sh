#!/bin/bash

echo "🔐 Complete Password Reset Flow Test"
echo "===================================="

# Configuration
BASE_URL="http://localhost:5001"
EMAIL="mugishaprince395@gmail.com"
OLD_PASSWORD="your_current_password"  # Replace with actual current password
NEW_PASSWORD="NewSecurePassword123!"

echo "Testing complete password reset flow for: $EMAIL"
echo ""

# Step 1: Verify current login works
echo "Step 1: Testing current login credentials..."
echo "-------------------------------------------"

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/customer/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$OLD_PASSWORD\"
  }")

echo "Current login response: $LOGIN_RESPONSE"

# Check if login was successful
if echo "$LOGIN_RESPONSE" | grep -q "jwt"; then
    echo "✅ Current login successful"
else
    echo "❌ Current login failed - check your credentials"
    echo "Please update OLD_PASSWORD in this script"
    exit 1
fi

echo ""

# Step 2: Request password reset
echo "Step 2: Requesting password reset..."
echo "-----------------------------------"

RESET_REQUEST_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/customer/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\"
  }")

echo "Reset request response: $RESET_REQUEST_RESPONSE"
echo ""

echo "⏳ Please wait a moment, then check your email for the reset token..."
echo ""

# Give user instructions to get the token
echo "📧 To complete the test, you need to:"
echo "1. Check your email for the reset token"
echo "2. Copy the reset token from the email"
echo "3. Run the password reset command below with your actual token"
echo ""

echo "🔧 MANUAL TEST COMMAND:"
echo "======================="
echo "# Replace 'YOUR_RESET_TOKEN_HERE' with the actual token from your email"
echo ""
echo "curl -X POST \"${BASE_URL}/api/v1/customer/reset-password\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"resetToken\": \"YOUR_RESET_TOKEN_HERE\","
echo "    \"newPassword\": \"$NEW_PASSWORD\","
echo "    \"confirmPassword\": \"$NEW_PASSWORD\""
echo "  }'"
echo ""

echo "📝 POSTMAN TEST:"
echo "==============="
echo "POST ${BASE_URL}/api/v1/customer/reset-password"
echo "Content-Type: application/json"
echo ""
echo "Body (JSON):"
echo "{"
echo "  \"resetToken\": \"YOUR_RESET_TOKEN_HERE\","
echo "  \"newPassword\": \"$NEW_PASSWORD\","
echo "  \"confirmPassword\": \"$NEW_PASSWORD\""
echo "}"
echo ""

echo "✅ After successful password reset, test login with new password:"
echo "================================================================="
echo ""
echo "curl -X POST \"${BASE_URL}/api/v1/customer/login\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"email\": \"$EMAIL\","
echo "    \"password\": \"$NEW_PASSWORD\""
echo "  }'"
echo ""

echo "🔄 AUTOMATED TESTING OPTION:"
echo "============================"
echo "If you want to test this automatically, you can:"
echo "1. Set up a test email service that exposes tokens via API"
echo "2. Or modify the service to return tokens in development mode"
echo "3. Or query the database directly for the token"
echo ""

echo "🗄️  DATABASE QUERY TO GET TOKEN:"
echo "================================"
echo "SELECT email, reset_password_token, reset_password_token_expiry"
echo "FROM customer"
echo "WHERE email = '$EMAIL'"
echo "  AND reset_password_token IS NOT NULL"
echo "  AND reset_password_token_expiry > NOW();"
