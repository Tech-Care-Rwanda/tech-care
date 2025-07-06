#!/bin/bash

echo "Testing Customer Login Endpoint..."
echo "================================="

# Test 1: Valid login (should succeed if customer exists)
echo "Test 1: Valid login"
curl -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mugishaprince395@gmail.com",
    "password": "password123"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Test 2: Invalid password (should fail)
echo "Test 2: Invalid password"
curl -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mugishaprince395@gmail.com",
    "password": "wrongpassword"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Test 3: Non-existent email (should fail)
echo "Test 3: Non-existent email"
curl -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Test 4: Missing password field (should fail)
echo "Test 4: Missing password field"
curl -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mugishaprince395@gmail.com"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Test 5: Empty request body (should fail)
echo "Test 5: Empty request body"
curl -X POST http://localhost:5001/api/v1/customer/login \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\nAll login tests completed!"
echo -e "\nExpected Results:"
echo "- Test 1: Should return JWT token if customer exists"
echo "- Test 2-5: Should return error messages with 400/401 status codes"
