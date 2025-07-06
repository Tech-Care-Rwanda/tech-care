#!/bin/bash

echo "JWT Token Image Upload Test"
echo "=========================="

# Replace these with your actual credentials
EMAIL="customer@example.com"
PASSWORD="password123"
IMAGE_PATH="/path/to/your/image.jpg"  # Change this to your actual image path

echo "Step 1: Login to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Login Response: $LOGIN_RESPONSE"

# Extract JWT token
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "✅ JWT Token: ${JWT_TOKEN:0:50}..."
    
    echo "Step 2: Upload image using JWT token..."
    UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/upload-image \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "image=@$IMAGE_PATH")
    
    echo "Upload Response: $UPLOAD_RESPONSE"
else
    echo "❌ Failed to get JWT token"
fi
