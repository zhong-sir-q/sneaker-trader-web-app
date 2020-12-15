HINT=consider source .dev_env.sh or source .prod_env.sh

ifndef env
$(error "Deployment environment is not defined, $(HINT)")
endif

ifndef service_name
$(error "ECS service name is not defined, $(HINT)")
endif

ifndef account_id
$(error "AWS account id is not defined")
endif

ifeq ($(env), dev)
else ifeq ($(env), prod)
else
$(error "Deployment environment must be dev or prod")
endif

BG_DEPLOYMENT_FILE="create-bluegreen-deployment.json"

AWS_ACCOUNT_ID=$(account_id)
ECR_URL="$(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com/sneakertrader/express"
TAG_NAME=$(env)
LOCAL_IMAGE_NAME="main_backend"

SERVICE_NAME=$(service_name)

# NOTE: no security policy is attached to ECR at the moment, hence anyone can push, unsafe.
# TODO: how to make sure the blug green version of the ecs uses the correct docker image? (the tag is overriden)
push-ecr-img:
	aws ecr get-login-password | sudo docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com 
	sudo docker build -t "$(LOCAL_IMAGE_NAME):$(TAG_NAME)" .
	sudo docker tag "$(LOCAL_IMAGE_NAME):$(TAG_NAME)" "$(ECR_URL):$(TAG_NAME)"
	sudo docker push "$(ECR_URL):$(TAG_NAME)"

# not necessary to manually create the deployment because when a new image is
# pushed to ECR, it automatically triggers the CodeDeploy pipeline
create-bluegreen-deploy:
	aws deploy create-deployment --cli-input-json file://$(BG_DEPLOYMENT_FILE)

# works only when ecs is type of rolling update
update-ecs-service:
	aws ecs update-service --cluster sneaker-trader-cluster --service $(SERVICE_NAME) --force-new-deployment

# run-bluegreen-deploy: push-ecr-img create-bluegreen-deploy
run-bluegreen-deploy: push-ecr-img

run-rolling-update: push-ecr-img update-ecs-service

build-deploy-frontend:
	npm --prefix frontend run build
	@if [ $(env) = "dev" ]; then\
  	npm --prefix frontend run deploy-dev;\
	else\
		npm --prefix frontend run deploy-prod;\
	fi

bluegreen-deploy-all: run-bluegreen-deploy build-deploy-frontend

rolling-deploy-all: run-rolling-update build-deploy-frontend
