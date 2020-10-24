#!/usr/bin/bash
# docker deployment configuration script

ACCOUNT_ID="257875578557"
ECR_URL="${ACCOUNT_ID}.dkr.ecr.ap-southeast-2.amazonaws.com/sneakertrader/express"
TAG_NAME="prod"
LOCAL_IMAGE_NAME="main_backend"

# login to ECR -> build image -> tag image to ECR -> push to ECR

# authenticate aws
aws ecr get-login-password | sudo docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com 

sudo docker build -t "${LOCAL_IMAGE_NAME}:${TAG_NAME}" .
sudo docker tag "${LOCAL_IMAGE_NAME}:${TAG_NAME}" "${ECR_URL}:${TAG_NAME}"
sudo docker push "${ECR_URL}:${TAG_NAME}"

SERVICE_NAME="st-blue-green-service"

# use this command if the service using rolling updates
aws ecs update-service --cluster sneaker-trader-cluster --service $SERVICE_NAME --force-new-deployment
