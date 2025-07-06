# TechCare Rwanda - Docker Setup

This document provides instructions for running the TechCare Rwanda Spring Boot application using Docker.

## Prerequisites

- Docker Desktop or Docker Engine installed
- Docker Compose installed
- At least 4GB of available RAM
- Ports 5001, 5432, and 8080 available on your system

## Quick Start

### 1. Clone and Navigate
```bash
cd /home/prince/tech-care/backend
```

### 2. Set up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your actual values
nano .env
```

### 3. Build and Run with Docker Compose
```bash
# For development
docker-compose up --build

# For production
docker-compose -f docker-compose.prod.yml up --build
```

### 4. Access the Application
- **Application**: http://localhost:5001
- **Database**: localhost:5432
- **pgAdmin** (optional): http://localhost:8080

## Docker Files Overview

### `Dockerfile`
- Basic development Dockerfile
- Builds the application inside the container
- Suitable for development and testing

### `Dockerfile.prod`
- Multi-stage production Dockerfile
- Optimized for production use
- Includes health checks and security improvements
- Runs with non-root user

### `docker-compose.yml`
- Development compose file
- Includes PostgreSQL database
- Includes pgAdmin for database management
- Easy to use for local development

### `docker-compose.prod.yml`
- Production compose file
- Optimized for production deployment
- Uses environment variables for configuration
- Includes health checks and restart policies

## Environment Variables

The application requires the following environment variables:

### Database Configuration
```env
POSTGRES_DB=techcare_db
POSTGRES_USER=techcare_user
POSTGRES_PASSWORD=your_secure_password_here
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/techcare_db
SPRING_DATASOURCE_USERNAME=techcare_user
SPRING_DATASOURCE_PASSWORD=your_secure_password_here
```

### Email Configuration
```env
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
```

### Supabase Configuration
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### File Upload Configuration
```env
FILE_UPLOAD_DIR=/app/uploads
FILE_UPLOAD_IMAGES_PATH=/app/uploads/images
FILE_UPLOAD_DOCUMENTS_PATH=/app/uploads/documents
```

## Docker Commands

### Build the Application
```bash
# Build development image
docker build -t techcare-app .

# Build production image
docker build -f Dockerfile.prod -t techcare-app:prod .
```

### Run Individual Containers
```bash
# Run PostgreSQL
docker run -d --name techcare-postgres \
  -e POSTGRES_DB=techcare_db \
  -e POSTGRES_USER=techcare_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine

# Run the application
docker run -d --name techcare-app \
  --link techcare-postgres:postgres \
  -p 5001:5001 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/techcare_db \
  -e SPRING_DATASOURCE_USERNAME=techcare_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  techcare-app
```

### Docker Compose Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f techcare-app
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :5001
   # Kill the process or change the port in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL container is running
   docker ps
   # Check logs
   docker-compose logs postgres
   ```

3. **Application Not Starting**
   ```bash
   # Check application logs
   docker-compose logs techcare-app
   # Check if all environment variables are set
   ```

4. **File Upload Issues**
   ```bash
   # Check if upload directory exists and has correct permissions
   docker exec -it techcare-backend ls -la /app/uploads
   ```

### Health Checks

The application includes health checks via Spring Boot Actuator:
- Health endpoint: http://localhost:5001/actuator/health
- Info endpoint: http://localhost:5001/actuator/info

### Database Management

Access pgAdmin at http://localhost:8080:
- Email: admin@techcare.com
- Password: admin123

Connect to PostgreSQL:
- Host: postgres
- Port: 5432
- Database: techcare_db
- Username: techcare_user
- Password: (your configured password)

## Production Deployment

For production deployment:

1. Use `docker-compose.prod.yml`
2. Set strong passwords in `.env` file
3. Consider using Docker secrets for sensitive data
4. Set up proper logging and monitoring
5. Configure reverse proxy (nginx) if needed
6. Set up SSL/TLS certificates

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## Data Persistence

- Database data is persisted in the `postgres_data` volume
- File uploads are persisted in the `techcare_uploads` volume
- To backup data:
  ```bash
  docker exec techcare-postgres pg_dump -U techcare_user techcare_db > backup.sql
  ```

## Monitoring

The application includes:
- Health checks on all services
- Actuator endpoints for monitoring
- Proper logging configuration

## Security Notes

- Change default passwords in production
- Use strong JWT secret keys
- Consider using Docker secrets for sensitive data
- Run containers with non-root users (implemented in Dockerfile.prod)
- Keep Docker images updated

## Support

For issues with the Docker setup, check:
1. Docker and Docker Compose versions
2. Available system resources
3. Port availability
4. Environment variable configuration
5. Application logs via `docker-compose logs`
