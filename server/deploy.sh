#!/bin/bash

# Campaign Manager — Deployment Script
# This script runs on the production server.

# 1. Login to GHCR (Assumes GHCR_TOKEN is set as env var or you are already logged in)
# If you prefer to use the token from the pipeline, we can pass it here.
# For now, we assume the VPS is already logged in as per our previous step.

echo "🚀 Starting deployment..."

# 2. Pull the latest images
echo "📥 Pulling latest images from GHCR..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull

# 3. Restart services
echo "🔄 Restarting containers..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans

# 4. Cleanup old images
echo "🧹 Cleaning up old images..."
docker image prune -f

# 5. Run migrations or initial import if needed
# (Optional: uncomment if you want to run the import on every deploy, 
# though usually it's a one-time thing or managed via migrations)
# docker compose exec -T backend php artisan app:import-campaigns

echo "✅ Deployment completed successfully!"
