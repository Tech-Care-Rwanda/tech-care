#!/bin/bash

# Test Customer Signup Endpoint
echo "Testing Customer Signup Endpoint..."
echo "================================="

# Sample customer data
curl -X POST http://localhost:5001/api/v1/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+250788123456",
    "password": "password123",
    "image": ""
  }' \
  -v

echo -e "\n\nTest completed!"
