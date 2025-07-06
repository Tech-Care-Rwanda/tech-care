#!/bin/bash

echo "🔍 Debugging Profile Update Issue"
echo "================================"

# Test with your actual data
EMAIL="mugishaprince395@gmail.com"
# Replace with your actual password
PASSWORD="your_actual_password"

echo "Testing with your account: $EMAIL"
echo "Step 1: Login..."

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Login Response: $LOGIN_RESPONSE"
echo -e "\n"

JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "✅ JWT Token extracted"
    echo -e "\n"
    
    # Get current profile BEFORE update
    echo "📋 BEFORE UPDATE - Current Profile:"
    BEFORE_PROFILE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "$BEFORE_PROFILE" | jq '.'
    echo -e "\n"
    
    # Extract current values
    CURRENT_NAME=$(echo $BEFORE_PROFILE | jq -r '.fullName')
    CURRENT_PHONE=$(echo $BEFORE_PROFILE | jq -r '.phoneNumber')
    
    echo "Current Name: $CURRENT_NAME"
    echo "Current Phone: $CURRENT_PHONE"
    echo -e "\n"
    
    # Try to update to NEW values
    NEW_NAME="Prince Mugisha Updated"
    NEW_PHONE="+250788999777"
    
    echo "🔄 UPDATING Profile..."
    echo "New Name: $NEW_NAME"
    echo "New Phone: $NEW_PHONE"
    echo -e "\n"
    
    UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "fullName=$NEW_NAME" \
      -F "phoneNumber=$NEW_PHONE")
    
    echo "Update Response:"
    echo "$UPDATE_RESPONSE" | jq '.'
    echo -e "\n"
    
    # Get profile AFTER update
    echo "📋 AFTER UPDATE - Updated Profile:"
    AFTER_PROFILE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "$AFTER_PROFILE" | jq '.'
    echo -e "\n"
    
    # Extract new values
    UPDATED_NAME=$(echo $AFTER_PROFILE | jq -r '.fullName')
    UPDATED_PHONE=$(echo $AFTER_PROFILE | jq -r '.phoneNumber')
    
    echo "================================"
    echo "🔍 COMPARISON:"
    echo "Name - Before: '$CURRENT_NAME' → After: '$UPDATED_NAME'"
    echo "Phone - Before: '$CURRENT_PHONE' → After: '$UPDATED_PHONE'"
    echo "================================"
    
    if [ "$CURRENT_NAME" != "$UPDATED_NAME" ]; then
        echo "✅ Name was updated successfully!"
    else
        echo "❌ Name was NOT updated!"
    fi
    
    if [ "$CURRENT_PHONE" != "$UPDATED_PHONE" ]; then
        echo "✅ Phone was updated successfully!"
    else
        echo "❌ Phone was NOT updated!"
    fi
    
else
    echo "❌ Failed to get JWT token. Please check your email/password."
    echo "Make sure to update the PASSWORD variable in this script."
fi

echo -e "\n"
echo "🔧 If update is not working, check:"
echo "1. Phone number format: +250XXXXXXXXX (exactly 9 digits after +250)"
echo "2. Database constraints or triggers"
echo "3. Spring Boot validation errors"
echo "4. Check server logs for any errors"
