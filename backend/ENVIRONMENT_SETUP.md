# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/techcare"

# JWT Secret Key for token signing (REQUIRED - must be a strong random string)
JWT_SECRET_KEY="your-very-strong-secret-key-here"

# Email Configuration (for nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH="./uploads"
```

## Critical Issues Fixed

1. **PrismaClient Import**: Fixed import from `./generated/prisma` to `@prisma/client`
2. **JWT_SECRET_KEY**: This environment variable is required for login to work
3. **Database Connection**: Make sure DATABASE_URL is properly set

## For Production Deployment (Render)

In your Render dashboard, set these environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET_KEY`: A strong random string (you can generate one with `openssl rand -hex 32`)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: Your email service configuration

## Setup Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start the server
npm start
``` 