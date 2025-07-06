#!/bin/bash

echo "Testing Customer Image Upload Endpoint..."
echo "========================================"

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
    
    # Step 3: Create a test image file
    echo "Step 3: Creating test image file..."
    # Create a simple test image (1x1 pixel PNG)
    echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB\x60\x82" > test_image.png
    
    if [ -f "test_image.png" ]; then
        echo "Test image created successfully"
        echo -e "\n"
        
        # Step 4: Test image upload
        echo "Step 4: Testing image upload..."
        IMAGE_UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/upload-image \
          -H "Authorization: Bearer $JWT_TOKEN" \
          -F "image=@test_image.png")
        
        echo "Image Upload Response: $IMAGE_UPLOAD_RESPONSE"
        echo -e "\n"
        
        # Step 5: Verify profile was updated
        echo "Step 5: Verifying profile update..."
        PROFILE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "Profile Response: $PROFILE_RESPONSE"
        echo -e "\n"
        
        # Clean up test image
        rm -f test_image.png
        echo "Test image cleaned up"
    else
        echo "❌ Failed to create test image"
    fi
else
    echo "❌ No JWT token found in login response"
    echo "Cannot test image upload without a valid token"
fi

echo -e "\n"
echo "Image upload test completed!"
