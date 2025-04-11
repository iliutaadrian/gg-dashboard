#!/bin/bash
# Replace these with your actual values
REGISTRY="docker.io"
USERNAME="iliutaadrian"
APP_NAME="gg-dashboard"

# echo "Logging in to Docker registry..."
docker login ${REGISTRY}

docker buildx build --platform linux/amd64 \
  -f ./backend/Dockerfile.prod \
  -t ${REGISTRY}/${USERNAME}/${APP_NAME}-backend:latest \
  --push ./backend

docker buildx build --platform linux/amd64 \
  -f ./frontend/Dockerfile.prod \
  -t ${REGISTRY}/${USERNAME}/${APP_NAME}-frontend:latest \
  --push ./frontend

docker buildx build --platform linux/amd64 \
  -f ./cronjob/Dockerfile \
  -t ${REGISTRY}/${USERNAME}/${APP_NAME}-cronjob:latest \
  --push ./cronjob

#VPS
echo "Deploying to VPS..."
ssh homelab << 'EOF'
  cd /Sites/gg-dashboard
  docker compose -f docker-compose.prod.yml pull
  docker compose -f docker-compose.prod.yml up -d
EOF

