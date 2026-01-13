#!/bin/bash
# Replace these with your actual values
USERNAME="iliutaadrian"
APP_NAME="gg-dashboard"
HOMELAB_HOST="homelab"

# # Build images locally without pushing to registry
echo "Building images locally..."
docker build --platform linux/amd64 \
  -f ./backend/Dockerfile.prod \
  -t ${USERNAME}/${APP_NAME}-backend:latest \
  ./backend

docker build --platform linux/amd64 \
  -f ./frontend/Dockerfile.prod \
  -t ${USERNAME}/${APP_NAME}-frontend:latest \
  ./frontend

docker build --platform linux/amd64 \
  -f ./cronjob/Dockerfile \
  -t ${USERNAME}/${APP_NAME}-cronjob:latest \
  ./cronjob

# # Save images to tar files
echo "Saving images to tar files..."
docker save -o ${APP_NAME}-backend.tar ${USERNAME}/${APP_NAME}-backend:latest
docker save -o ${APP_NAME}-frontend.tar ${USERNAME}/${APP_NAME}-frontend:latest
docker save -o ${APP_NAME}-cronjob.tar ${USERNAME}/${APP_NAME}-cronjob:latest

# Transfer images to homelab
echo "Transferring images to homelab..."
scp ${APP_NAME}-backend.tar ${HOMELAB_HOST}:/tmp/
scp ${APP_NAME}-frontend.tar ${HOMELAB_HOST}:/tmp/
scp ${APP_NAME}-cronjob.tar ${HOMELAB_HOST}:/tmp/

# Load images on homelab and run deployment
echo "Deploying to VPS..."
ssh ${HOMELAB_HOST} << 'EOF'
  # Load the images
  # docker load -i /tmp/gg-dashboard-backend.tar
  # docker load -i /tmp/gg-dashboard-frontend.tar
  docker load -i /tmp/gg-dashboard-cronjob.tar

  # Remove the tar files from homelab
  # rm /tmp/gg-dashboard-backend.tar
  # rm /tmp/gg-dashboard-frontend.tar
  rm /tmp/gg-dashboard-cronjob.tar

  cd /Sites/gg-dashboard
  docker compose -f docker-compose.prod.yml up -d
EOF

# # Remove local images and tar files
# echo "Cleaning up local images and tar files..."
docker rmi -f ${USERNAME}/${APP_NAME}-backend:latest
docker rmi -f ${USERNAME}/${APP_NAME}-frontend:latest
docker rmi -f ${USERNAME}/${APP_NAME}-cronjob:latest

rm ${APP_NAME}-backend.tar
rm ${APP_NAME}-frontend.tar
rm ${APP_NAME}-cronjob.tar

echo "Deployment completed!"
