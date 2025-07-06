#!/bin/bash

# Test script for Docker setup

echo "Testing Docker setup for TechCare Rwanda..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Check if required files exist
files=("Dockerfile" "docker-compose.yml" ".env.example")
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file not found"
        exit 1
    else
        echo "✅ $file exists"
    fi
done

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file exists"
fi

# Test Docker build
echo "🔨 Testing Docker build..."
if docker build -t techcare-test . > /dev/null 2>&1; then
    echo "✅ Docker build successful"
    docker rmi techcare-test > /dev/null 2>&1
else
    echo "❌ Docker build failed"
    exit 1
fi

# Test Docker Compose validation
echo "🔍 Validating Docker Compose..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ Docker Compose configuration is valid"
else
    echo "❌ Docker Compose configuration has errors"
    exit 1
fi

echo ""
echo "🎉 All Docker setup tests passed!"
echo ""
echo "To start the application:"
echo "  ./docker-manager.sh dev    # For development"
echo "  ./docker-manager.sh prod   # For production"
echo ""
echo "Remember to configure your .env file with actual values before running!"
