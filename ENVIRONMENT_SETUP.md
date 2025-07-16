# 🔧 TechCare Environment Setup Guide

## 📋 What You Need To Do

### 1. Backend Environment (.env file)

Create a file called `.env` in your `backend/` folder and copy this content:

```env
# TechCare Backend Environment Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/techcare"
JWT_SECRET="techcare-super-secret-jwt-key-2024-development-only"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
PORT=3000
NODE_ENV="development"
CORS_ORIGINS="http://localhost:3001,http://localhost:3000"
RATE_LIMIT=100
```

### 2. Frontend Environment (.env.local file)

You already have this file! Copy this content into your existing `frontend/.env.local`:

```env
# TechCare Frontend Environment Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_API_VERSION="v1"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key-here"
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY="your-google-places-api-key-here"
NEXT_PUBLIC_ENV="development"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## 🎯 Step-by-Step Instructions

### For Email Setup (Gmail):
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password: https://support.google.com/accounts/answer/185833
4. Use that app password in EMAIL_PASSWORD (not your regular password)

### For Google Maps API (Free):
1. Go to: https://console.cloud.google.com/
2. Create a new project called "TechCare Rwanda"
3. Enable these APIs:
   - Maps JavaScript API
   - Places API (New)
4. Create an API Key
5. Copy the same key to both GOOGLE variables

### For Database:
- Install PostgreSQL locally, or
- Use a free cloud service like Railway, Neon, or Supabase
- Create a database called "techcare"

## 🧪 Testing Your Setup

### Backend Test:
```bash
cd backend
npm run dev
```
Visit: http://localhost:3000/health

### Frontend Test:
```bash
cd frontend
npm run dev
```
Visit: http://localhost:3001

## 🔧 Postman Setup (Simple Guide)

Since you mentioned Postman isn't working, here's a simple approach:

### 1. Download Postman
- Go to: https://www.postman.com/downloads/
- Install the desktop app

### 2. Test Basic Connection
1. Open Postman
2. Create a new request
3. Set method to GET
4. URL: `http://localhost:3000/health`
5. Click Send
6. You should see a response like: `{"status": "ok"}`

### 3. Test Login (if backend is running)
1. Create a new request
2. Set method to POST  
3. URL: `http://localhost:3000/api/v1/auth/login`
4. Go to Body tab → raw → JSON
5. Paste:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
6. Click Send

## 🚨 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Connection refused" | Backend isn't running - run `npm run dev` in backend folder |
| "CORS error" | Check CORS_ORIGINS in backend .env |
| "API key not found" | Check variable names in .env.local |
| "Database error" | Check DATABASE_URL and ensure PostgreSQL is running |
| Maps not loading | Check Google Maps API key |

## 🤝 Need Help?

If something isn't working:
1. Share the exact error message
2. Tell me which step you're on
3. Show me your .env.local content (hide sensitive keys)

The app will work with mock data even if some services aren't set up yet! 