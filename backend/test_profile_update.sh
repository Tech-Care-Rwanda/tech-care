#!/bin/bash

echo "Testing Customer Profile Update Endpoint..."
echo "=========================================="

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
    echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB\x60\x82" > test_profile_image.png
    
    if [ -f "test_profile_image.png" ]; then
        echo "Test image created successfully"
        echo -e "\n"
        
        # Step 4: Test profile update with all fields
        echo "Step 4: Testing profile update with all fields..."
        PROFILE_UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
          -H "Authorization: Bearer $JWT_TOKEN" \
          -F "fullName=John Doe Updated" \
          -F "phoneNumber=+250788654321" \
          -F "image=@test_profile_image.png")
        
        echo "Profile Update Response: $PROFILE_UPDATE_RESPONSE"
        echo -e "\n"
        
        # Step 5: Test profile update with only name
        echo "Step 5: Testing profile update with only name..."
        PROFILE_UPDATE_NAME_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
          -H "Authorization: Bearer $JWT_TOKEN" \
          -F "fullName=Jane Doe Final")
        
        echo "Profile Update (Name Only) Response: $PROFILE_UPDATE_NAME_RESPONSE"
        echo -e "\n"
        
        # Step 6: Test profile update with only phone
        echo "Step 6: Testing profile update with only phone..."
        PROFILE_UPDATE_PHONE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
          -H "Authorization: Bearer $JWT_TOKEN" \
          -F "phoneNumber=+250788111222")
        
        echo "Profile Update (Phone Only) Response: $PROFILE_UPDATE_PHONE_RESPONSE"
        echo -e "\n"
        
        # Step 7: Verify final profile
        echo "Step 7: Verifying final profile..."
        FINAL_PROFILE_RESPONSE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "Final Profile Response: $FINAL_PROFILE_RESPONSE"
        echo -e "\n"
        
        # Clean up test image
        rm -f test_profile_image.png
        echo "Test image cleaned up"
    else
        echo "❌ Failed to create test image"
    fi
else
    echo "❌ No JWT token found in login response"
    echo "Cannot test profile update without a valid token"
fi

echo -e "\n"
echo "Profile update test completed!"
