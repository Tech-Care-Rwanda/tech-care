#!/bin/bash

echo "Testing Image Upload and Viewing"
echo "==============================="

# Step 1: Create test user
echo "Step 1: Creating test user..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Image Test User",
    "email": "imagetest@example.com",
    "phoneNumber": "+250788123456",
    "password": "password123"
  }')

echo "Signup Response: $SIGNUP_RESPONSE"
echo -e "\n"

# Step 2: Login
echo "Step 2: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "imagetest@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo -e "\n"

# Step 3: Extract JWT token
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "✅ JWT Token extracted: ${JWT_TOKEN:0:50}..."
    echo -e "\n"
    
    # Step 4: Create test image
    echo "Step 4: Creating test image..."
    # Create a simple test image (1x1 pixel PNG)
    echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB\x60\x82" > test_image.png
    
    echo "✅ Test image created"
    echo -e "\n"
    
    # Step 5: Upload image
    echo "Step 5: Uploading image..."
    UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/upload-image \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "image=@test_image.png")
    
    echo "Upload Response: $UPLOAD_RESPONSE"
    echo -e "\n"
    
    # Step 6: Extract image URL from response
    IMAGE_URL=$(echo $UPLOAD_RESPONSE | grep -o '"image":"[^"]*"' | cut -d'"' -f4)
    
    if [ ! -z "$IMAGE_URL" ]; then
        echo "✅ Image URL extracted: $IMAGE_URL"
        echo -e "\n"
        
        # Step 7: Test if image can be accessed
        echo "Step 7: Testing image access..."
        echo "Testing URL: $IMAGE_URL"
        
        IMAGE_ACCESS_RESPONSE=$(curl -s -I "$IMAGE_URL")
        echo "Image Access Response Headers:"
        echo "$IMAGE_ACCESS_RESPONSE"
        echo -e "\n"
        
        # Step 8: Test file serving endpoint
        echo "Step 8: Testing file serving endpoint..."
        TEST_RESPONSE=$(curl -s http://localhost:5001/uploads/test)
        echo "Test Response: $TEST_RESPONSE"
        echo -e "\n"
        
        # Step 9: Check if file exists in filesystem
        echo "Step 9: Checking file system..."
        UPLOAD_DIR="$HOME/techcare-uploads/images"
        echo "Upload directory: $UPLOAD_DIR"
        
        if [ -d "$UPLOAD_DIR" ]; then
            echo "✅ Upload directory exists"
            echo "Files in upload directory:"
            ls -la "$UPLOAD_DIR"
        else
            echo "❌ Upload directory does not exist"
        fi
        
        echo -e "\n"
        echo "========================================="
        echo "🔍 TROUBLESHOOTING GUIDE:"
        echo "1. Make sure Spring Boot is running on port 5001"
        echo "2. Check the upload directory: $UPLOAD_DIR"
        echo "3. Try opening the image URL in browser: $IMAGE_URL"
        echo "4. Check if image file exists: ls -la $UPLOAD_DIR"
        echo "========================================="
    else
        echo "❌ No image URL found in upload response"
    fi
    
    # Clean up
    rm -f test_image.png
else
    echo "❌ No JWT token found"
fi
