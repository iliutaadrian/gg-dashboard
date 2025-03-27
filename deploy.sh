#!/bin/bash
# Replace these with your actual values
REGISTRY="docker.io"
USERNAME="iliutaadrian"
APP_NAME="gg-dashboard"
VPS_IP="192.168.100.69"
VPS_USER="root"
SSH_KEY="~/.ssh/id_rsa"

# Step 1: Build the images locally - specify the file explicitly
echo "Building Docker images locally..."
docker compose -f docker-compose.prod.yml build --no-cache

# Step 2: Tag the images for your registry
echo "Tagging images for registry..."
docker tag ${APP_NAME}-backend:latest ${REGISTRY}/${USERNAME}/${APP_NAME}-backend:latest
docker tag ${APP_NAME}-frontend:latest ${REGISTRY}/${USERNAME}/${APP_NAME}-frontend:latest
docker tag ${APP_NAME}-cronjob:latest ${REGISTRY}/${USERNAME}/${APP_NAME}-cronjob:latest

# Step 3: Login to your registry
echo "Logging in to Docker registry..."
docker login ${REGISTRY}

# Step 4: Push the images to the registry
echo "Pushing images to registry..."
docker push ${REGISTRY}/${USERNAME}/${APP_NAME}-backend:latest
docker push ${REGISTRY}/${USERNAME}/${APP_NAME}-frontend:latest
docker push ${REGISTRY}/${USERNAME}/${APP_NAME}-cronjob:latest

# VPS
# # Pull images using a specific compose file
# docker compose -f docker-compose.prod.yml pull

# # Start containers with the same file
# docker compose -f docker-compose.prod.yml up -d

