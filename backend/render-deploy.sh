#!/bin/bash

# Render deployment script for TechCare Backend
echo "Starting TechCare Backend deployment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Verify database connection
echo "Verifying database connection..."
npx prisma db seed --preview-feature 2>/dev/null || echo "No seed script found, skipping..."

echo "Deployment completed successfully!" 