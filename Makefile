BG_DEPLOYMENT_FILE="create-bluegreen-deployment.json"

AWS_ACCOUNT_ID="257875578557"
ECR_URL="$(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com/sneakertrader/express"
TAG_NAME="prod"
LOCAL_IMAGE_NAME="main_backend"

SERVICE_NAME="st-blue-green-service"

# NOTE: no security policy is attached to ECR at the moment, hence anyone can push, unsafe.
# TODO: how to make sure the blug green version of the ecs uses the correct docker image? (the tag is overriden)
push-ecr-img:
	aws ecr get-login-password | sudo docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com 
	sudo docker build -t "$(LOCAL_IMAGE_NAME):$(TAG_NAME)" .
	sudo docker tag "$(LOCAL_IMAGE_NAME):$(TAG_NAME)" "$(ECR_URL):$(TAG_NAME)"
	sudo docker push "$(ECR_URL):$(TAG_NAME)"

create-bluegreen-deploy:
	aws deploy create-deployment --cli-input-json file://$(BG_DEPLOYMENT_FILE)

# works only when ecs is type of rolling update
update-ecs-service:
	aws ecs update-service --cluster sneaker-trader-cluster --service $SERVICE_NAME --force-new-deployment

run-bluegreen-deploy: push-ecr-img create-bluegreen-deploy

run-rolling-update: push-ecr-img update-ecs-service
