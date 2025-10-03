#!/bin/bash

# Deploy script for biov2 ElysiaJS API
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment of biov2 API..."

# Variables
APP_DIR="/var/www/biov2"
REPO_URL="https://github.com/yourusername/biov2.git"  # Update this
SERVICE_NAME="biov2-api"

# Create app directory if it doesn't exist
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Navigate to app directory
cd $APP_DIR

# Pull latest code (or clone if first time)
if [ -d ".git" ]; then
    echo "📦 Pulling latest changes..."
    git pull origin main
else
    echo "📦 Cloning repository..."
    git clone $REPO_URL .
fi

# Install dependencies
echo "📋 Installing dependencies..."
bun install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
bunx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
bunx prisma migrate deploy

# Restart the service
echo "🔄 Restarting service..."
pm2 restart $SERVICE_NAME || pm2 start ecosystem.config.js

echo "✅ Deployment completed successfully!"
echo "🌐 API should be available at: https://biov2.aptuae.com/"
