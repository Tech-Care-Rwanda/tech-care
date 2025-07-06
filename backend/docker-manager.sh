#!/bin/bash

# TechCare Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your actual configuration values."
        echo "Do you want to continue? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Start development environment
start_dev() {
    print_status "Starting development environment..."
    check_env_file
    docker-compose up --build
}

# Start production environment
start_prod() {
    print_status "Starting production environment..."
    check_env_file
    docker-compose -f docker-compose.prod.yml up --build -d
}

# Stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    if [ -f docker-compose.prod.yml ]; then
        docker-compose -f docker-compose.prod.yml down
    fi
}

# Clean up everything
cleanup() {
    print_status "Cleaning up containers, networks, and volumes..."
    docker-compose down -v --remove-orphans
    if [ -f docker-compose.prod.yml ]; then
        docker-compose -f docker-compose.prod.yml down -v --remove-orphans
    fi
    docker system prune -f
}

# Show logs
show_logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Build only
build_only() {
    print_status "Building Docker images..."
    docker-compose build
    docker-compose -f docker-compose.prod.yml build
}

# Database backup
backup_db() {
    print_status "Creating database backup..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    docker exec techcare-postgres pg_dump -U techcare_user techcare_db > "backup_${timestamp}.sql"
    print_status "Database backup created: backup_${timestamp}.sql"
}

# Show help
show_help() {
    echo "TechCare Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development environment"
    echo "  prod      Start production environment"
    echo "  stop      Stop all services"
    echo "  cleanup   Stop services and clean up volumes"
    echo "  logs      Show logs for all services"
    echo "  logs APP  Show logs for specific service"
    echo "  build     Build Docker images"
    echo "  backup    Create database backup"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev                 # Start development environment"
    echo "  $0 prod                # Start production environment"
    echo "  $0 logs techcare-app   # Show application logs"
    echo "  $0 stop                # Stop all services"
    echo "  $0 cleanup             # Clean up everything"
}

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "stop")
            stop_services
            ;;
        "cleanup")
            cleanup
            ;;
        "logs")
            show_logs "$2"
            ;;
        "build")
            build_only
            ;;
        "backup")
            backup_db
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
