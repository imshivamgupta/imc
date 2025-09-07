#!/bin/bash

# Test script for Pages API
BASE_URL="http://localhost:3000"

echo "=== Testing Pages API ==="
echo ""

# 1. Run migrations first
echo "1. Running database migrations..."
curl -X POST "$BASE_URL/api/migrate" -H "Content-Type: application/json"
echo ""
echo ""

# 2. Register a test user
echo "2. Registering a test user..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }')
echo "User registration response: $USER_RESPONSE"
echo ""

# 3. Login to get token
echo "3. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }')
echo "Login response: $LOGIN_RESPONSE"

# Extract token from response (this is a simple extraction, in real scenario you'd parse JSON properly)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Extracted token: ${TOKEN:0:20}..."
echo ""

# 4. Create a page
echo "4. Creating a new page..."
PAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/pages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "my-first-page",
    "title": "My First Page",
    "content": "This is the content of my first page created via API!",
    "description": "A test page",
    "is_public": true
  }')
echo "Page creation response: $PAGE_RESPONSE"
echo ""

# 5. Get all public pages
echo "5. Getting all public pages..."
PUBLIC_PAGES=$(curl -s "$BASE_URL/api/pages")
echo "Public pages: $PUBLIC_PAGES"
echo ""

# 6. Get specific page by slug
echo "6. Getting page by slug..."
SINGLE_PAGE=$(curl -s "$BASE_URL/api/pages/my-first-page")
echo "Single page: $SINGLE_PAGE"
echo ""

# 7. Update the page
echo "7. Updating the page..."
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/pages/my-first-page" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My Updated Page Title",
    "content": "This content has been updated!"
  }')
echo "Update response: $UPDATE_RESPONSE"
echo ""

# 8. Search pages
echo "8. Searching pages..."
SEARCH_RESULTS=$(curl -s "$BASE_URL/api/pages?search=updated")
echo "Search results: $SEARCH_RESULTS"
echo ""

echo "=== Test completed ==="
