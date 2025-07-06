#!/bin/bash

echo "🔧 Testing 403 Error Fix for Image Access"
echo "========================================"

# Test 1: Check if uploads endpoint is accessible
echo "Test 1: Testing uploads debug endpoint..."
DEBUG_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" http://localhost:5001/uploads/debug)
echo "Debug Response: $DEBUG_RESPONSE"
echo -e "\n"

# Test 2: Upload an image and try to access it
echo "Test 2: Complete upload and access test..."

# Create test user
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Access Test User",
    "email": "accesstest@example.com",
    "phoneNumber": "+250788123456",
    "password": "password123"
  }')

echo "Signup: $SIGNUP_RESPONSE"

# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "accesstest@example.com",
    "password": "password123"
  }')

JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "✅ Login successful, JWT token obtained"
    
    # Create and upload image
    echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB\x60\x82" > access_test.png
    
    UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/upload-image \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "image=@access_test.png")
    
    echo "Upload Response: $UPLOAD_RESPONSE"
    
    # Extract image URL
    IMAGE_URL=$(echo $UPLOAD_RESPONSE | grep -o '"image":"[^"]*"' | cut -d'"' -f4)
    
    if [ ! -z "$IMAGE_URL" ]; then
        echo "✅ Image uploaded successfully: $IMAGE_URL"
        
        # Test access to the image
        echo "Test 3: Testing image access..."
        ACCESS_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "$IMAGE_URL")
        echo "Image Access Response: $ACCESS_RESPONSE"
        
        # Test with different methods
        echo "Test 4: Testing with HEAD request..."
        HEAD_RESPONSE=$(curl -s -I "$IMAGE_URL")
        echo "HEAD Response: $HEAD_RESPONSE"
        
        echo -e "\n"
        echo "========================================="
        echo "🎯 TESTING RESULTS:"
        echo "Image URL: $IMAGE_URL"
        echo "Try opening this URL in Chrome: $IMAGE_URL"
        echo "========================================="
    else
        echo "❌ Image upload failed"
    fi
    
    rm -f access_test.png
else
    echo "❌ Login failed"
fi

echo -e "\n"
echo "🔧 TROUBLESHOOTING:"
echo "1. Make sure Spring Boot is running: ./mvnw spring-boot:run"
echo "2. Check if both SecurityConfiguration and JwtValidator allow /uploads/**"
echo "3. Try the URL directly in browser"
echo "4. Check server logs for any errors"
