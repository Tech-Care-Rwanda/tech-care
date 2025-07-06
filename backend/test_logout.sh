#!/bin/bash

echo "Testing Customer Logout Endpoint..."
echo "================================="

# Step 1: Login to get JWT token
echo "Step 1: Logging in to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mugishaprince395@gmail.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo -e "\n"

# Step 2: Extract JWT token
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "✅ JWT Token extracted: ${JWT_TOKEN:0:50}..."
    echo -e "\n"
    
    # Step 3: Test logout with the JWT token
    echo "Step 2: Testing logout endpoint..."
    LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/logout \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -w "\nHTTP Status: %{http_code}")
    
    echo "Logout Response: $LOGOUT_RESPONSE"
    echo -e "\n"
    
    # Step 4: Test if token is still valid (should fail after logout)
    echo "Step 3: Testing if token is still valid after logout..."
    PROFILE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -w "\nHTTP Status: %{http_code}")
    
    echo "Profile Response (should fail): $PROFILE_RESPONSE"
    
else
    echo "❌ Login failed - No JWT token found in response"
    echo "Make sure you have a customer account with email: mugishaprince395@gmail.com"
fi

echo -e "\n"
echo "Logout test completed!"
echo "===================="
