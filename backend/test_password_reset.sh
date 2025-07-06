#!/bin/bash

echo "🔐 Testing Password Reset Functionality"
echo "======================================="

# Configuration
BASE_URL="http://localhost:5001"
EMAIL="mugishaprince395@gmail.com"
# Use a test email if you prefer
# EMAIL="test@example.com"

echo "Testing password reset for email: $EMAIL"
echo ""

# Step 1: Request password reset
echo "Step 1: Requesting password reset..."
echo "------------------------------------"

RESET_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/customer/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\"
  }")

echo "Reset Request Response: $RESET_RESPONSE"
echo ""

# Note: Since we're not exposing the reset token in the response for security reasons,
# you'll need to check your email or database to get the actual reset token

echo "⚠️  CHECK YOUR EMAIL OR DATABASE FOR RESET TOKEN"
echo "================================================"
echo ""
echo "Once you have the reset token, you can test the password reset like this:"
echo ""
echo "# Example with a sample token:"
echo "curl -X POST \"${BASE_URL}/api/v1/customer/reset-password\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"resetToken\": \"YOUR_RESET_TOKEN_HERE\","
echo "    \"newPassword\": \"NewPassword123!\","
echo "    \"confirmPassword\": \"NewPassword123!\""
echo "  }'"
echo ""

# Step 2: Test invalid scenarios
echo "Step 2: Testing invalid scenarios..."
echo "-----------------------------------"

# Test with invalid email format
echo "Testing invalid email format:"
INVALID_EMAIL_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/customer/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"invalid-email\"
  }")

echo "Invalid email response: $INVALID_EMAIL_RESPONSE"
echo ""

# Test with empty email
echo "Testing empty email:"
EMPTY_EMAIL_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/customer/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"\"
  }")

echo "Empty email response: $EMPTY_EMAIL_RESPONSE"
echo ""

# Test password reset with invalid token
echo "Testing password reset with invalid token:"
INVALID_TOKEN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/customer/reset-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"resetToken\": \"invalid-token-12345\",
    \"newPassword\": \"NewPassword123!\",
    \"confirmPassword\": \"NewPassword123!\"
  }")

echo "Invalid token response: $INVALID_TOKEN_RESPONSE"
echo ""

# Test password reset with mismatched passwords
echo "Testing password reset with mismatched passwords:"
MISMATCH_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/customer/reset-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"resetToken\": \"sample-token\",
    \"newPassword\": \"NewPassword123!\",
    \"confirmPassword\": \"DifferentPassword123!\"
  }")

echo "Mismatched passwords response: $MISMATCH_RESPONSE"
echo ""

echo "✅ Password reset API testing completed!"
echo ""
echo "📧 NEXT STEPS:"
echo "1. Check your email for the reset token"
echo "2. Use the reset token to complete the password reset"
echo "3. Test login with the new password"
echo ""
echo "🔍 TO GET THE RESET TOKEN FROM DATABASE:"
echo "You can check the database directly:"
echo "SELECT reset_password_token, reset_password_token_expiry FROM customer WHERE email = '$EMAIL';"
