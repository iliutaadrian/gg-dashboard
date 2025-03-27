#!/bin/bash

# Replace these with your actual values
REGISTRY="docker.io/yourusername"
APP_NAME="your-app"
VPS_IP="your.vps.ip.address"
VPS_USER="root"
SSH_KEY="~/.ssh/id_rsa"

# Step 1: Build the images locally
echo "Building Docker images locally..."
docker compose build --no-cache

# Step 2: Tag the images for your registry
echo "Tagging images for registry..."
docker tag ${APP_NAME}-backend:latest ${REGISTRY}/${APP_NAME}-backend:latest
docker tag ${APP_NAME}-frontend:latest ${REGISTRY}/${APP_NAME}-frontend:latest
docker tag ${APP_NAME}-cron:latest ${REGISTRY}/${APP_NAME}-cron:latest

# Step 3: Login to your registry
echo "Logging in to Docker registry..."
docker login ${REGISTRY}

# Step 4: Push the images to the registry
echo "Pushing images to registry..."
docker push ${REGISTRY}/${APP_NAME}-backend:latest
docker push ${REGISTRY}/${APP_NAME}-frontend:latest
docker push ${REGISTRY}/${APP_NAME}-cron:latest

# Step 5: Create a docker-compose file for the VPS
cat > docker-compose.prod.yml << EOL
version: '3.8'
services:
  backend:
    image: ${REGISTRY}/${APP_NAME}-backend:latest
    ports:
      - "6969:6969"
    networks:
      - gg-network
    env_file:
      - ./backend.env
    restart: unless-stopped
    
  frontend:
    image: ${REGISTRY}/${APP_NAME}-frontend:latest
    ports:
      - "3069:3000"
    networks:
      - gg-network
    env_file:
      - ./frontend.env
    restart: unless-stopped
    
  cron-service:
    image: ${REGISTRY}/${APP_NAME}-cron:latest
    networks:
      - gg-network
    depends_on:
      - frontend
    restart: unless-stopped
    
networks:
  gg-network:
    driver: bridge
EOL

# Step 6: Copy the env files for VPS
cp ./backend/.env ./backend.env
cp ./frontend/.env ./frontend.env

# Step 7: Copy files to VPS
echo "Copying docker-compose and env files to VPS..."
scp -i ${SSH_KEY} docker-compose.prod.yml ${VPS_USER}@${VPS_IP}:/root/docker-compose.yml
scp -i ${SSH_KEY} backend.env ${VPS_USER}@${VPS_IP}:/root/backend.env
scp -i ${SSH_KEY} frontend.env ${VPS_USER}@${VPS_IP}:/root/frontend.env

# Step 8: SSH into VPS and pull/start containers
echo "Starting containers on VPS..."
ssh -i ${SSH_KEY} ${VPS_USER}@${VPS_IP} << 'ENDSSH'
docker login ${REGISTRY}
docker compose pull
docker compose down
docker compose up -d
ENDSSH

# Cleanup temporary files
rm docker-compose.prod.yml backend.env frontend.env

echo "Deployment complete!"
