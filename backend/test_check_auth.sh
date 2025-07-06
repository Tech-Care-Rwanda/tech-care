#!/bin/bash

echo "Testing Customer Check-Auth Endpoint..."
echo "======================================"

# Step 1: Login to get a JWT token
echo "Step 1: Logging in to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.flow@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo -e "\n"

# Step 2: Extract JWT token
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "JWT Token extracted: ${JWT_TOKEN:0:50}..."
    echo -e "\n"
    
    # Step 3: Test check-auth endpoint with valid token
    echo "Step 3: Testing check-auth endpoint with valid token..."
    CHECK_AUTH_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/check-auth \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Check-Auth Response: $CHECK_AUTH_RESPONSE"
    echo -e "\n"
    
    # Step 4: Test check-auth endpoint with invalid token
    echo "Step 4: Testing check-auth endpoint with invalid token..."
    INVALID_CHECK_AUTH_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/check-auth \
      -H "Authorization: Bearer invalid_token_here")
    
    echo "Check-Auth Response (invalid token): $INVALID_CHECK_AUTH_RESPONSE"
    echo -e "\n"
    
    # Step 5: Test check-auth endpoint without token
    echo "Step 5: Testing check-auth endpoint without token..."
    NO_TOKEN_CHECK_AUTH_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/check-auth)
    
    echo "Check-Auth Response (no token): $NO_TOKEN_CHECK_AUTH_RESPONSE"
else
    echo "❌ No JWT token found in login response"
    echo "Cannot test check-auth endpoint without a valid token"
fi

echo -e "\n"
echo "Check-Auth endpoint test completed!"
