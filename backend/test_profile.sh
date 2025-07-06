#!/bin/bash

# Your JWT Token
JWT_TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NTE3MTIyNzcsImV4cCI6MTc1MTc5ODY3NywiZW1haWwiOiJtdWdpc2hhcHJpbmNlMzk1QGdtYWlsLmNvbSIsImF1dGhvcml0aWVzIjoiUk9MRV9DVVNUT01FUiJ9.gmxlGv_NQdINQ7EaTv0re8Po9b6wfmWMNQQ3YK5ucuPvPoAKDFVhv653EtuTBbM6_9RztIve6j182kn1q05Z2A"

echo "Testing Customer Profile Endpoint..."
echo "==================================="

# Test 1: Valid profile request with JWT token
echo "Test 1: Valid profile request with JWT token"
curl -X GET http://localhost:5001/api/v1/customer/profile \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Test 2: Profile request without token (should fail)
echo "Test 2: Profile request without token (should fail)"
curl -X GET http://localhost:5001/api/v1/customer/profile \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Test 3: Profile request with invalid token (should fail)
echo "Test 3: Profile request with invalid token (should fail)"
curl -X GET http://localhost:5001/api/v1/customer/profile \
  -H "Authorization: Bearer invalid.token.here" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Test 4: Profile request with malformed Authorization header (should fail)
echo "Test 4: Profile request with malformed Authorization header (should fail)"
curl -X GET http://localhost:5001/api/v1/customer/profile \
  -H "Authorization: $JWT_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"
echo "Profile endpoint tests completed!"
echo "Expected Results:"
echo "- Test 1: Should return customer profile data (200)"
echo "- Test 2-4: Should return 401/403 errors"
