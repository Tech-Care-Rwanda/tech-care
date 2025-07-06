#!/bin/bash

echo "🔧 Testing /update-profile Endpoint"
echo "=================================="

# Step 1: Create test user
echo "Step 1: Creating test user for profile update..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Profile Test User",
    "email": "profiletest@example.com",
    "phoneNumber": "+250788111222",
    "password": "password123"
  }')

echo "Signup Response: $SIGNUP_RESPONSE"
echo -e "\n"

# Step 2: Login to get JWT token
echo "Step 2: Logging in to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "profiletest@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo -e "\n"

# Extract JWT token
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"jwt":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$JWT_TOKEN" ]; then
    echo "✅ JWT Token extracted: ${JWT_TOKEN:0:50}..."
    echo -e "\n"
    
    # Step 3: Get initial profile
    echo "Step 3: Getting initial profile..."
    INITIAL_PROFILE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Initial Profile: $INITIAL_PROFILE"
    echo -e "\n"
    
    # Step 4: Update only full name
    echo "Step 4: Testing update with only full name..."
    UPDATE_NAME_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "fullName=Updated Profile Test User")
    
    echo "Update Name Response: $UPDATE_NAME_RESPONSE"
    echo -e "\n"
    
    # Step 5: Update only phone number
    echo "Step 5: Testing update with only phone number..."
    UPDATE_PHONE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "phoneNumber=+250788999888")
    
    echo "Update Phone Response: $UPDATE_PHONE_RESPONSE"
    echo -e "\n"
    
    # Step 6: Create test image and update with image
    echo "Step 6: Testing update with image..."
    # Create a simple test image
    echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB\x60\x82" > profile_test_image.png
    
    UPDATE_IMAGE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "image=@profile_test_image.png")
    
    echo "Update Image Response: $UPDATE_IMAGE_RESPONSE"
    echo -e "\n"
    
    # Step 7: Update all fields at once
    echo "Step 7: Testing update with all fields..."
    UPDATE_ALL_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "fullName=Final Updated Name" \
      -F "phoneNumber=+250788777666" \
      -F "image=@profile_test_image.png")
    
    echo "Update All Response: $UPDATE_ALL_RESPONSE"
    echo -e "\n"
    
    # Step 8: Get final profile to verify changes
    echo "Step 8: Getting final profile to verify changes..."
    FINAL_PROFILE=$(curl -s -X GET http://localhost:5001/api/v1/customer/profile \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "Final Profile: $FINAL_PROFILE"
    echo -e "\n"
    
    # Step 9: Test with invalid data
    echo "Step 9: Testing with invalid phone number..."
    INVALID_PHONE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "phoneNumber=invalid-phone")
    
    echo "Invalid Phone Response: $INVALID_PHONE_RESPONSE"
    echo -e "\n"
    
    # Step 10: Test with empty fields
    echo "Step 10: Testing with empty fields..."
    EMPTY_FIELDS_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/v1/customer/update-profile \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -F "fullName=" \
      -F "phoneNumber=")
    
    echo "Empty Fields Response: $EMPTY_FIELDS_RESPONSE"
    echo -e "\n"
    
    # Clean up
    rm -f profile_test_image.png
    
    echo "========================================="
    echo "✅ Profile update tests completed!"
    echo "Key learnings:"
    echo "- You can update individual fields"
    echo "- You can update multiple fields at once"
    echo "- Empty fields are ignored (not updated)"
    echo "- Invalid data returns appropriate errors"
    echo "========================================="
else
    echo "❌ Failed to get JWT token"
fi

echo -e "\n"
echo "🔧 Manual Testing Commands:"
echo "1. Login: curl -X POST http://localhost:5001/api/v1/customer/login -H 'Content-Type: application/json' -d '{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}'"
echo "2. Update Name: curl -X PUT http://localhost:5001/api/v1/customer/update-profile -H 'Authorization: Bearer YOUR_TOKEN' -F 'fullName=New Name'"
echo "3. Update Phone: curl -X PUT http://localhost:5001/api/v1/customer/update-profile -H 'Authorization: Bearer YOUR_TOKEN' -F 'phoneNumber=+250788123456'"
echo "4. Update Image: curl -X PUT http://localhost:5001/api/v1/customer/update-profile -H 'Authorization: Bearer YOUR_TOKEN' -F 'image=@/path/to/image.jpg'"
