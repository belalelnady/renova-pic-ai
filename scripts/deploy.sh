#!/bin/bash

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Validate environment variables
validate_env() {
    print_status "Validating environment variables..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_error ".env file not found. Please create one based on .env.example"
        exit 1
    fi
    
    # Source the .env file
    set -a
    source .env
    set +a
    
    # Check required variables
    required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
        "GOOGLE_CLIENT_ID"
        "GOOGLE_CLIENT_SECRET"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_success "Environment variables validated"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Type checking
    npm run type-check
    if [ $? -ne 0 ]; then
        print_error "Type checking failed"
        exit 1
    fi
    
    # Linting
    npm run lint
    if [ $? -ne 0 ]; then
        print_error "Linting failed"
        exit 1
    fi
    
    print_success "All tests passed"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    npm ci
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    
    # Generate Prisma client
    npx prisma generate
    if [ $? -ne 0 ]; then
        print_error "Failed to generate Prisma client"
        exit 1
    fi
    
    # Build Next.js app
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Failed to build application"
        exit 1
    fi
    
    print_success "Application built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy
    if [ "$1" = "production" ]; then
        vercel --prod
    else
        vercel
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Deployment completed successfully"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Set NODE_ENV to production for migrations
    export NODE_ENV=production
    
    # Run migrations
    npx prisma migrate deploy
    if [ $? -ne 0 ]; then
        print_error "Database migrations failed"
        exit 1
    fi
    
    print_success "Database migrations completed"
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Parse command line arguments
    ENVIRONMENT=${1:-"preview"}
    
    if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "preview" ]; then
        print_error "Invalid environment. Use 'production' or 'preview'"
        exit 1
    fi
    
    print_status "Deploying to: $ENVIRONMENT"
    
    # Run deployment steps
    check_dependencies
    validate_env
    run_tests
    build_app
    
    if [ "$ENVIRONMENT" = "production" ]; then
        run_migrations
    fi
    
    deploy_vercel "$ENVIRONMENT"
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Don't forget to:"
    echo "  1. Update your DNS settings if needed"
    echo "  2. Configure your domain in Vercel dashboard"
    echo "  3. Set up monitoring and alerts"
    echo "  4. Test the deployed application"
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT TERM

# Run main function with all arguments
main "$@"