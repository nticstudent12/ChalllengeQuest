#!/bin/bash

# ChallengeQuest Setup Script
# This script sets up both frontend and backend for the ChallengeQuest platform

echo "🚀 Setting up ChallengeQuest Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if PostgreSQL is installed
check_postgres() {
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL is not installed. Please install PostgreSQL v13 or higher."
        print_warning "You can install it from: https://www.postgresql.org/download/"
        return 1
    fi
    
    print_success "PostgreSQL is installed"
    return 0
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Setup environment
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cp env.example .env
        print_warning "Please edit backend/.env with your database credentials"
    fi
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    if [ $? -ne 0 ]; then
        print_error "Failed to generate Prisma client"
        exit 1
    fi
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    # Setup environment
    if [ ! -f .env ]; then
        print_status "Creating frontend environment file..."
        cp env.example .env
    fi
    
    print_success "Frontend setup completed"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    cd backend
    
    # Check if database is accessible
    print_status "Testing database connection..."
    
    # Run migrations
    print_status "Running database migrations..."
    npx prisma migrate dev --name init
    
    if [ $? -ne 0 ]; then
        print_error "Failed to run database migrations"
        print_warning "Please ensure PostgreSQL is running and your DATABASE_URL is correct in backend/.env"
        cd ..
        return 1
    fi
    
    # Seed database
    print_status "Seeding database with sample data..."
    npm run db:seed
    
    if [ $? -ne 0 ]; then
        print_warning "Failed to seed database, but migrations were successful"
    else
        print_success "Database seeded with sample data"
    fi
    
    print_success "Database setup completed"
    cd ..
    return 0
}

# Main setup function
main() {
    echo "🎯 ChallengeQuest Platform Setup"
    echo "================================"
    
    # Check prerequisites
    check_node
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Setup database
    if check_postgres; then
        setup_database
    else
        print_warning "Skipping database setup. Please install PostgreSQL and run:"
        print_warning "  cd backend && npm run db:migrate && npm run db:seed"
    fi
    
    echo ""
    echo "🎉 Setup completed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Edit backend/.env with your database credentials"
    echo "2. Start the backend server: cd backend && npm run dev"
    echo "3. Start the frontend server: npm run dev"
    echo "4. Open http://localhost:5173 in your browser"
    echo ""
    echo "🔑 Default admin credentials:"
    echo "   Email: admin@challengequest.com"
    echo "   Password: admin123"
    echo ""
    echo "📚 For more information, see the README files:"
    echo "   - Frontend: README.md"
    echo "   - Backend: backend/README.md"
}

# Run main function
main
