#!/bin/bash

echo "Customer Image Upload Test - Step by Step"
echo "========================================"

# Step 1: Check if user exists, if not create one
echo "Step 1: Creating test user (if doesn't exist)..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Image Upload Test User",
    "email": "imageupload@example.com",
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
    "email": "imageupload@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo -e "\n"

# Step 3: Extract JWT token
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "✅ JWT Token extracted successfully"
    echo "Token: ${JWT_TOKEN:0:50}..."
    echo -e "\n"
    
    # Step 4: Create a test image
    echo "Step 4: Creating test image..."
    # Create a simple 1x1 pixel PNG image
    echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB\x60\x82" > test_upload_image.png
    
    if [ -f "test_upload_image.png" ]; then
        echo "✅ Test image created: test_upload_image.png"
        echo -e "\n"
        
        # Step 5: Upload the image
        echo "Step 5: Uploading image..."
        echo "curl -X POST http://localhost:5001/api/v1/customer/upload-image \\"
        echo "  -H \"Authorization: Bearer \$JWT_TOKEN\" \\"
        echo "  -F \"image=@test_upload_image.png\""
        echo -e "\n"
        
        UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/upload-image \
          -H "Authorization: Bearer $JWT_TOKEN" \
          -F "image=@test_upload_image.png")
        
        echo "Upload Response: $UPLOAD_RESPONSE"
        echo -e "\n"
        
        # Step 6: Verify upload by checking profile
        echo "Step 6: Verifying upload - checking profile..."
        PROFILE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "Profile Response: $PROFILE_RESPONSE"
        echo -e "\n"
        
        # Clean up
        rm -f test_upload_image.png
        echo "✅ Test image cleaned up"
    else
        echo "❌ Failed to create test image"
    fi
else
    echo "❌ No JWT token found in login response"
fi

echo -e "\n"
echo "=========================================="
echo "How to upload YOUR OWN image:"
echo "1. Replace 'test_upload_image.png' with your image path"
echo "2. Make sure your Spring Boot app is running on port 5001"
echo "3. Use your real email/password for login"
echo "4. Use this curl command:"
echo ""
echo "curl -X POST http://localhost:5001/api/v1/customer/upload-image \\"
echo "  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \\"
echo "  -F \"image=@/path/to/your/image.jpg\""
echo "=========================================="
