#!/bin/bash

# TechCare API Test Script
# This script demonstrates the basic functionality of the booking and technician management APIs

BASE_URL="http://localhost:3000/api/v1"

echo "🧪 TechCare API Testing Script"
echo "=============================="
echo ""

# Test health endpoint
echo "1. Testing Health Endpoint..."
curl -s "$BASE_URL/../health" | jq .
echo ""

# Test public technicians endpoint
echo "2. Testing Public Technicians Endpoint..."
curl -s "$BASE_URL/technicians" | jq .
echo ""

# Test technicians with filters
echo "3. Testing Technicians with Filters..."
curl -s "$BASE_URL/technicians?page=1&limit=5&isAvailable=true" | jq .
echo ""

# Test specific technician profile (will return 404 since no data)
echo "4. Testing Technician Profile..."
curl -s "$BASE_URL/technicians/1" | jq .
echo ""

# Test technician schedule
echo "5. Testing Technician Schedule..."
curl -s "$BASE_URL/technicians/1/schedule" | jq .
echo ""

# Test booking creation without authentication (should fail)
echo "6. Testing Booking Creation (without auth - should fail)..."
curl -s -X POST "$BASE_URL/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Booking",
    "description": "This is a test booking description",
    "category": "COMPUTER_REPAIR",
    "location": "123 Test Street, Kigali"
  }' | jq .
echo ""

# Test booking creation with invalid data and fake auth (should fail with validation errors)
echo "7. Testing Booking Creation (with fake auth and invalid data)..."
curl -s -X POST "$BASE_URL/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token" \
  -d '{
    "title": "AB",
    "description": "Too short",
    "category": "INVALID_CATEGORY",
    "location": "OK"
  }' | jq .
echo ""

# Test getting bookings without authentication
echo "8. Testing Get Bookings (without auth - should fail)..."
curl -s "$BASE_URL/bookings" | jq .
echo ""

echo "✅ Test Script Completed!"
echo ""
echo "📝 Notes:"
echo "- All endpoints requiring authentication will fail with 'Invalid credentials' due to mock Prisma client"
echo "- Public endpoints return empty data but demonstrate proper structure and validation"
echo "- To test with real data, configure a proper database connection and create test users"
echo ""
echo "🚀 To start the server: npm start (from backend directory)"
echo "📖 For detailed API documentation, see: backend/API_DOCUMENTATION.md"