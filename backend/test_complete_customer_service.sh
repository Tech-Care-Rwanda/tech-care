#!/bin/bash

echo "Complete Customer Service Test with Image Upload..."
echo "================================================="

# Step 1: Create a new customer account
echo "Step 1: Creating new customer account..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Image Test User",
    "email": "imagetest@example.com",
    "phoneNumber": "+250788999888",
    "password": "password123"
  }')

echo "Signup Response: $SIGNUP_RESPONSE"
echo -e "\n"

# Step 2: Login with the newly created account
echo "Step 2: Logging in with the new account..."
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
    echo "JWT Token extracted: ${JWT_TOKEN:0:50}..."
    echo -e "\n"
    
    # Step 4: Get initial profile
    echo "Step 4: Getting initial profile..."
    INITIAL_PROFILE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Initial Profile Response: $INITIAL_PROFILE_RESPONSE"
    echo -e "\n"
    
    # Step 5: Test check-auth endpoint
    echo "Step 5: Testing check-auth endpoint..."
    CHECK_AUTH_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/check-auth \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Check-Auth Response: $CHECK_AUTH_RESPONSE"
    echo -e "\n"
    
    # Step 6: Create test image and upload
    echo "Step 6: Creating test image and uploading..."
    # Create a simple test image (1x1 pixel PNG)
    echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB\x60\x82" > test_complete_image.png
    
    if [ -f "test_complete_image.png" ]; then
        echo "Test image created successfully"
        
        # Upload image
        IMAGE_UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/upload-image \
          -H "Authorization: Bearer $JWT_TOKEN" \
          -F "image=@test_complete_image.png")
        
        echo "Image Upload Response: $IMAGE_UPLOAD_RESPONSE"
        echo -e "\n"
        
        # Step 7: Get profile after image upload
        echo "Step 7: Getting profile after image upload..."
        PROFILE_AFTER_IMAGE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "Profile After Image Upload: $PROFILE_AFTER_IMAGE_RESPONSE"
        echo -e "\n"
        
        # Step 8: Update profile with new info
        echo "Step 8: Updating profile with new information..."
        PROFILE_UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
          -H "Authorization: Bearer $JWT_TOKEN" \
          -F "fullName=Updated Image Test User" \
          -F "phoneNumber=+250788777666")
        
        echo "Profile Update Response: $PROFILE_UPDATE_RESPONSE"
        echo -e "\n"
        
        # Step 9: Get final profile
        echo "Step 9: Getting final profile..."
        FINAL_PROFILE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "Final Profile Response: $FINAL_PROFILE_RESPONSE"
        echo -e "\n"
        
        # Step 10: Test logout
        echo "Step 10: Testing logout..."
        LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/logout \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "Logout Response: $LOGOUT_RESPONSE"
        echo -e "\n"
        
        # Clean up test image
        rm -f test_complete_image.png
        echo "Test image cleaned up"
    else
        echo "❌ Failed to create test image"
    fi
else
    echo "❌ No JWT token found in login response"
    echo "Cannot test image upload without a valid token"
fi

echo -e "\n"
echo "Complete customer service test with image upload completed!"
