# 🚀 TechCare Frontend-Backend Integration Setup Guide

This guide will help you set up and run the TechCare application with the newly integrated frontend-backend connection.

## 📋 Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Environment Configuration

### Backend Setup (.env file in `/backend`)

Create a `.env` file in the backend directory with:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/techcare_db"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRY="7d"

# Email Configuration (for password reset)
EMAIL_HOST="smtp.your-email-provider.com"
EMAIL_PORT=587
EMAIL_USER="your-email@domain.com"
EMAIL_PASS="your-email-password"

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR="uploads"

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Frontend Setup (.env.local file in `/frontend`)

Create a `.env.local` file in the frontend directory with:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_VERSION=v1

# Development settings
NODE_ENV=development

# Google Maps API (optional - for location services)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

## 🗄️ Database Setup

1. **Create PostgreSQL Database:**
   ```bash
   createdb techcare_db
   ```

2. **Run Prisma Migrations:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Seed Initial Data (Optional):**
   ```bash
   npx prisma db seed
   ```

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:3000

### Start Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3001

## 🔐 Authentication Flow

The application now uses **real JWT-based authentication**:

### Available Endpoints:

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/customer/signup` - Customer registration
- `POST /api/v1/auth/technician/signup` - Technician registration (with file upload)

#### Customer
- `GET /api/v1/customer/profile` - Get customer profile
- `GET /api/v1/customer/check-auth` - Check authentication status
- `POST /api/v1/customer/forgot-password` - Password reset request
- `POST /api/v1/customer/reset-password` - Reset password with token
- `POST /api/v1/customer/change-password` - Change password

#### Admin
- `GET /api/v1/admin/profile` - Get admin profile
- `GET /api/v1/admin/get-technicians` - Get all technicians
- `PUT /api/v1/admin/technicians/:id/approve` - Approve technician
- `PUT /api/v1/admin/technicians/:id/reject` - Reject technician
- `GET /api/v1/admin/technicians/:id` - Get technician details

## 🧪 Testing the Integration

### Login Testing

You can test the login functionality with these approaches:

1. **Create test users** using the signup endpoints
2. **Use Postman** to test API endpoints directly
3. **Frontend login form** now connects to real backend

### Demo Data

The login form includes demo buttons for quick testing:
- Demo Customer Login
- Demo Admin Login

## 🔍 API Service Architecture

### Core Components:

1. **API Configuration** (`/lib/config/api.ts`)
   - Centralized endpoint definitions
   - Base URL configuration
   - HTTP status codes

2. **API Service** (`/lib/services/api.ts`)
   - HTTP request wrapper
   - Authentication header management
   - Error handling
   - File upload support

3. **Auth Service** (`/lib/services/authService.ts`)
   - Login/logout functionality
   - User registration
   - Token management
   - Password reset operations

4. **React Hooks** (`/lib/hooks/useApi.ts`)
   - Reusable data fetching hooks
   - Loading and error states
   - Admin operations
   - Profile management

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure backend CORS is configured for frontend URL
   - Check if both servers are running

2. **Database Connection:**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in backend .env

3. **Authentication Issues:**
   - Ensure JWT_SECRET is set in backend
   - Check token storage in browser localStorage

4. **File Upload Issues:**
   - Verify upload directory permissions
   - Check MAX_FILE_SIZE configuration

### Health Check

Visit http://localhost:3000/health to verify backend connectivity.

## 🔄 Next Steps

This integration provides:
- ✅ Real authentication with JWT
- ✅ Role-based access control  
- ✅ File upload capabilities
- ✅ Error handling and validation
- ✅ API service architecture

### Still To Implement:
- [ ] Booking system endpoints (PR #60)
- [ ] Real-time technician availability
- [ ] Payment integration
- [ ] Notification system
- [ ] Advanced search and filtering

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify server logs for backend issues
3. Ensure all environment variables are set
4. Test API endpoints with Postman first

---

**Happy Coding! 🎉** 