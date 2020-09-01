#!/usr/bin/bash

ECR_URL="257875578557.dkr.ecr.ap-southeast-2.amazonaws.com/sneakertrader/express"
TAG_NAME="prod"
LOCAL_IMAGE_NAME="main_backend"

# login to ECR -> build image -> tag image to ECR -> push to ECR

# authenticate aws
aws ecr get-login-password | sudo docker login --username AWS --password-stdin 257875578557.dkr.ecr.ap-southeast-2.amazonaws.com 

sudo docker build -t "${LOCAL_IMAGE_NAME}:${TAG_NAME}" .
sudo docker tag "${LOCAL_IMAGE_NAME}:${TAG_NAME}" "${ECR_URL}:${TAG_NAME}"
sudo docker push "${ECR_URL}:${TAG_NAME}"
