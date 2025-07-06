#!/bin/bash

echo "🔍 Simple Profile Update Debug Test"
echo "=================================="

# First, let's check if the server is running
echo "Testing if server is running..."
SERVER_TEST=$(curl -s -w "HTTP_CODE:%{http_code}" http://localhost:5001/uploads/test)
echo "Server Test: $SERVER_TEST"

if [[ "$SERVER_TEST" == *"200"* ]]; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Start it with: ./mvnw spring-boot:run"
    exit 1
fi

echo -e "\n"

# Use existing user credentials (update these with your real ones)
EMAIL="mugishaprince395@gmail.com"
PASSWORD="your_password_here"  # UPDATE THIS!

echo "🔑 Step 1: Login with your account..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Login Response: $LOGIN_RESPONSE"

# Check if login was successful
if [[ "$LOGIN_RESPONSE" == *"jwt"* ]]; then
    echo "✅ Login successful"
    JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)
    echo "JWT Token: ${JWT_TOKEN:0:50}..."
    
    echo -e "\n📋 Step 2: Get current profile..."
    CURRENT_PROFILE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Current Profile: $CURRENT_PROFILE"
    
    # Extract current values
    CURRENT_NAME=$(echo $CURRENT_PROFILE | jq -r '.fullName // "N/A"')
    CURRENT_PHONE=$(echo $CURRENT_PROFILE | jq -r '.phoneNumber // "N/A"')
    
    echo -e "\n📝 Current values:"
    echo "Name: '$CURRENT_NAME'"
    echo "Phone: '$CURRENT_PHONE'"
    
    echo -e "\n🔄 Step 3: Try simple name update..."
    NEW_NAME="TEST UPDATE $(date +%H%M%S)"
    echo "Updating name to: '$NEW_NAME'"
    
    UPDATE_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "fullName=$NEW_NAME")
    
    echo "Update Response: $UPDATE_RESPONSE"
    
    echo -e "\n📋 Step 4: Get profile after update..."
    UPDATED_PROFILE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Updated Profile: $UPDATED_PROFILE"
    
    # Check if it actually changed
    NEW_RETRIEVED_NAME=$(echo $UPDATED_PROFILE | jq -r '.fullName // "N/A"')
    
    echo -e "\n🔍 RESULT COMPARISON:"
    echo "Before: '$CURRENT_NAME'"
    echo "After:  '$NEW_RETRIEVED_NAME'"
    
    if [ "$CURRENT_NAME" != "$NEW_RETRIEVED_NAME" ]; then
        echo "✅ SUCCESS: Name was actually updated!"
    else
        echo "❌ FAILED: Name was NOT updated!"
        echo -e "\n🔧 Possible issues:"
        echo "1. Validation error (check server logs)"
        echo "2. Database constraint failure"
        echo "3. Transaction rollback"
        echo "4. Field not being saved"
    fi
    
else
    echo "❌ Login failed. Update the EMAIL and PASSWORD variables in this script."
    echo "Current EMAIL: $EMAIL"
    echo "Make sure the password is correct!"
fi

echo -e "\n"
echo "🔧 Manual Test Command:"
echo "curl -X PUT http://localhost:5001/api/v1/customer/update-profile \\"
echo "  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \\"
echo "  -F \"fullName=Your New Name\""
