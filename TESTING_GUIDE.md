# 🧪 TechCare Testing Guide

## Overview

This guide provides comprehensive testing procedures for the TechCare Rwanda application, covering both frontend and backend functionality, user workflows, and integration testing.

## 🚀 Quick Start Testing

### 1. Pre-Testing Setup

```bash
# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup  
cd frontend
npm install
npm run dev
```

### 2. Environment Variables Check

**Backend (.env):**
- ✅ DATABASE_URL is set
- ✅ JWT_SECRET is configured
- ✅ EMAIL_* variables are set
- ✅ PORT=3000

**Frontend (.env.local):**
- ✅ NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
- ✅ Google Maps API keys are set (optional for testing)

## 🔄 End-to-End User Workflows

### Customer Journey Testing

#### 1. User Registration & Authentication
```
✅ Test Cases:
□ Navigate to /signup
□ Select "Customer" account type
□ Fill registration form with valid data
□ Submit and verify success message
□ Check email verification (if implemented)
□ Login with credentials
□ Verify dashboard access
□ Test logout functionality
```

#### 2. Service Discovery
```
✅ Test Cases:
□ Browse homepage services
□ Use search functionality on main page
□ Navigate to /search-results
□ Apply filters (location, price, rating)
□ Search for specific technicians
□ View technician profiles
□ Save/favorite technicians
```

#### 3. Booking Process
```
✅ Test Cases:
□ Select a technician from search results
□ Navigate to booking page (/dashboard/book/[id])
□ Fill booking form completely
□ Select date and time
□ Add location and description
□ Submit booking request
□ Verify booking appears in dashboard
□ Check booking status updates
```

#### 4. Dashboard Management
```
✅ Test Cases:
□ Access customer dashboard (/dashboard)
□ View booking history
□ Check saved technicians
□ Update profile information
□ View notifications
□ Test settings page
```

### Technician Journey Testing

#### 1. Technician Registration
```
✅ Test Cases:
□ Navigate to /signup
□ Select "Technician" account type
□ Fill detailed technician form
□ Upload profile image
□ Upload certificates (PDF)
□ Submit and verify pending approval
□ Test admin approval process
```

#### 2. Technician Dashboard
```
✅ Test Cases:
□ Access technician dashboard (/dashboard/technician)
□ View pending booking requests
□ Accept booking requests
□ Reject booking requests
□ Mark bookings as complete
□ Toggle availability status
□ View earnings and statistics
```

#### 3. Real-time Features
```
✅ Test Cases:
□ Receive booking notifications
□ Test browser notifications
□ Check notification center
□ Real-time availability updates
□ WebSocket connection status
```

## 🔧 Component Testing

### Authentication System
```bash
# Test login functionality
POST http://localhost:3000/api/v1/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# Expected Response:
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_here"
}
```

### Booking System
```bash
# Test booking creation
POST http://localhost:3000/api/v1/bookings
{
  "technicianId": "1",
  "service": "Computer Repair",
  "description": "Laptop won't start",
  "date": "2024-01-20",
  "time": "14:00",
  "location": "Kigali, Rwanda"
}
```

### File Upload System
```bash
# Test file uploads (for technician registration)
POST http://localhost:3000/api/v1/upload
Content-Type: multipart/form-data
- profileImage: [file]
- certificates: [file]
```

## 🎯 API Testing with Postman

### 1. Import Collection
- Import the provided Postman collection
- Set environment variables:
  - `base_url`: http://localhost:3000
  - `token`: (will be set after login)

### 2. Authentication Tests
```
1. Customer Login
   POST {{base_url}}/api/v1/auth/login
   
2. Technician Signup
   POST {{base_url}}/api/v1/auth/technician/signup
   
3. Check Authentication
   GET {{base_url}}/api/v1/customer/check-auth
   Headers: Authorization: Bearer {{token}}
```

### 3. Booking Management Tests
```
1. Create Booking
   POST {{base_url}}/api/v1/bookings
   
2. Get User Bookings
   GET {{base_url}}/api/v1/bookings/user
   
3. Update Booking Status
   PATCH {{base_url}}/api/v1/bookings/{{booking_id}}/status
```

### 4. Admin Panel Tests
```
1. Get All Technicians
   GET {{base_url}}/api/v1/admin/get-technicians
   
2. Approve Technician
   POST {{base_url}}/api/v1/admin/technicians/{{id}}/approve
   
3. Get Technician Details
   GET {{base_url}}/api/v1/admin/technicians/{{id}}
```

## 🚨 Error Testing

### Common Error Scenarios
```
✅ Test Cases:
□ Invalid login credentials
□ Expired JWT tokens
□ Missing required form fields
□ Invalid file uploads
□ Network connectivity issues
□ Backend server offline
□ Database connection errors
□ Rate limiting
```

### Frontend Error Handling
```
✅ Verify:
□ Error messages are user-friendly
□ Loading states work properly
□ Fallback to mock data when backend unavailable
□ Network errors show appropriate messages
□ Form validation errors display correctly
```

## 📱 Mobile Testing

### Responsive Design
```
✅ Test on:
□ Mobile phones (320px - 768px)
□ Tablets (768px - 1024px)
□ Desktop (1024px+)
□ Touch interactions work properly
□ Navigation is mobile-friendly
```

## 🔒 Security Testing

### Authentication Security
```
✅ Verify:
□ JWT tokens expire appropriately
□ Passwords are hashed (backend)
□ Sensitive data not exposed in frontend
□ CORS settings are correct
□ File upload restrictions work
□ SQL injection protection (backend)
```

## 🚀 Performance Testing

### Frontend Performance
```
✅ Check:
□ Initial page load speed
□ Component rendering performance
□ Image optimization
□ Bundle size optimization
□ API call efficiency
```

### Backend Performance
```
✅ Check:
□ Database query performance
□ API response times
□ File upload speed
□ Concurrent user handling
```

## 🐛 Common Issues & Solutions

### Environment Issues
| Problem | Solution |
|---------|----------|
| "Connection refused" | Check backend is running on port 3000 |
| "CORS error" | Verify CORS_ORIGINS in backend .env |
| "API key not found" | Check NEXT_PUBLIC_* variables |
| Database connection error | Verify DATABASE_URL format |
| JWT token invalid | Check JWT_SECRET matches |

### Frontend Issues
| Problem | Solution |
|---------|----------|
| Components not loading | Check import paths |
| Hooks causing infinite loops | Verify dependency arrays |
| Styles not applying | Check Tailwind classes |
| Build errors | Verify TypeScript types |

### Backend Issues
| Problem | Solution |
|---------|----------|
| Email not sending | Check EMAIL_* credentials |
| File uploads failing | Verify multer configuration |
| Database queries failing | Check Prisma schema |
| Authentication errors | Verify JWT implementation |

## 📋 Testing Checklist

### Before Release
```
Frontend Testing:
□ All pages load without errors
□ Authentication flow works end-to-end
□ Booking process completes successfully
□ Mobile responsiveness verified
□ Error handling works properly
□ Loading states implemented
□ Notifications work correctly

Backend Testing:
□ All API endpoints respond correctly
□ Database operations work
□ File uploads function properly
□ Email notifications send
□ JWT authentication secure
□ Error responses appropriate
□ Rate limiting functional

Integration Testing:
□ Frontend-backend communication
□ Real-time features working
□ Mock data fallbacks functional
□ Environment variables configured
□ Production build successful
```

## 📊 Performance Benchmarks

### Target Metrics
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **File Upload**: < 10 seconds for 5MB
- **Search Results**: < 1 second
- **Database Queries**: < 100ms

### Monitoring
- Use browser DevTools for frontend performance
- Monitor API response times in Network tab
- Check bundle size with `npm run build`
- Test on different devices and connections

## 🔄 Continuous Testing

### Automated Testing Setup
```bash
# Frontend tests (when implemented)
cd frontend
npm run test

# Backend tests (when implemented)
cd backend
npm run test

# E2E tests (when implemented)
npm run test:e2e
```

## 📝 Bug Reporting

### Bug Report Template
```
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Device: [e.g. Desktop]
- Screen Size: [e.g. 1920x1080]

**Screenshots:**
If applicable, add screenshots

**Console Errors:**
Any JavaScript errors in browser console
```

This comprehensive testing guide ensures all aspects of the TechCare application are thoroughly tested before deployment. Follow this guide systematically to identify and resolve issues early in the development process. 