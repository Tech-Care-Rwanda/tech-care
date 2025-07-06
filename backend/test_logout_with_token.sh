#!/bin/bash

# Your JWT Token
JWT_TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NTE3MTIyNzcsImV4cCI6MTc1MTc5ODY3NywiZW1haWwiOiJtdWdpc2hhcHJpbmNlMzk1QGdtYWlsLmNvbSIsImF1dGhvcml0aWVzIjoiUk9MRV9DVVNUT01FUiJ9.gmxlGv_NQdINQ7EaTv0re8Po9b6wfmWMNQQ3YK5ucuPvPoAKDFVhv653EtuTBbM6_9RztIve6j182kn1q05Z2A"

echo "Testing Logout with Your JWT Token..."
echo "===================================="

# Step 1: Test profile endpoint BEFORE logout (should work)
echo "Step 1: Testing profile endpoint BEFORE logout..."
curl -X GET http://localhost:5001/api/v1/customer/profile \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Step 2: Test logout endpoint
echo "Step 2: Testing logout endpoint..."
curl -X POST http://localhost:5001/api/v1/customer/logout \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"

# Step 3: Test profile endpoint AFTER logout (JWT is stateless, so it might still work)
echo "Step 3: Testing profile endpoint AFTER logout..."
echo "Note: Since JWT is stateless, the token might still be valid until it expires"
curl -X GET http://localhost:5001/api/v1/customer/profile \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo -e "\n"
echo "Logout test completed!"
echo "Note: In JWT-based auth, logout is typically handled on the client side by deleting the token."
