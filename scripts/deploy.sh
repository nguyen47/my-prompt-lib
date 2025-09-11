#!/bin/bash

# Production deployment script for Prompt Library

echo "🚀 Starting Prompt Library production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Please create .env file with the following variables:"
    echo "   AUTH_EMAIL=your-email@example.com"
    echo "   AUTH_PASSWORD=your-secure-password"
    echo ""
    echo "Example:"
    echo "cat << EOF > .env"
    echo "AUTH_EMAIL=admin@promptlib.com"
    echo "AUTH_PASSWORD=mySecurePassword123"
    echo "EOF"
    exit 1
fi

# Source environment variables
set -a
source .env
set +a

echo "✅ Environment variables loaded"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Create data directory if it doesn't exist
mkdir -p data
echo "✅ Data directory ready"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for the application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 10

# Check if the application is running
if curl -f http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your Prompt Library at: http://localhost:3002"
    echo "📧 Login email: $AUTH_EMAIL"
    echo "🔒 Login password: [HIDDEN]"
else
    echo "❌ Application failed to start. Checking logs..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Management commands:"
echo "   View logs:     docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
echo "   Stop app:      docker-compose -f docker-compose.yml -f docker-compose.prod.yml down"
echo "   Restart app:   docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart"
echo "   Update app:    ./scripts/deploy.sh"
