#!/bin/bash

echo "Testing Customer Signup and Login Flow..."
echo "========================================"

# Step 1: Create a new customer account
echo "Step 1: Creating new customer account..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test.flow@example.com",
    "phoneNumber": "+250788123456",
    "password": "password123"
  }')

echo "Signup Response: $SIGNUP_RESPONSE"
echo -e "\n"

# Step 2: Login with the newly created account
echo "Step 2: Logging in with the new account..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.flow@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo -e "\n"

# Step 3: Extract JWT token and test protected endpoint
echo "Step 3: Testing protected endpoint with JWT token..."
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "JWT Token extracted: ${JWT_TOKEN:0:50}..."
    echo -e "\n"
    
    echo "Testing customer profile endpoint..."
    PROFILE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Profile Response: $PROFILE_RESPONSE"
else
    echo "❌ No JWT token found in login response"
fi

echo -e "\n"
echo "Complete signup and login flow test completed!"
echo "============================================="
