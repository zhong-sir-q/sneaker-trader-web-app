## Deploy frontend React and backend Express on AWS

In the root directory, first initialize the environment variables by running `source .dev_env.sh` or `source .prod_env.sh` depending on the deployment stage.

We are hosting the frontend assets in a S3 bucket, and packaged the backend app into a docker image to run it in ECS. Depending on the deployment type of ECS, if it is rolling update, `make run-rolling-update` will create a new backend docker image and push to ECR. If the deployment type is blue/green, since we have setup a [cloudwatch event](https://docs.aws.amazon.com/codepipeline/latest/userguide/create-cwe-ecr-source-console.html), which watches the action happening in ECR, if it is a success, then it triggers the [code pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-ecs-ecr-codedeploy.html) we have setup. Therefore, `make push-ecr-img` will trigger a blue green deployment.

`make build-deploy-frontend` builds and pushes the frontend assets to S3.

## Add environment variable(s) to Express

In CodeCommit, go to the repository `ecs-service-codedeploy-artifacts` (valid repository as of 29/11/2020), in `taskdef.json`, add the desirable environment variable following the format `{ name: key_name, value: key_val }` under the `environment` field. After save and commit, it will trigger a blue/green deployment to update the ECS.

### Deploy to Heroku

NOTE: we no longer use Heroku in the project, but keep this here as a reference.

Prerequisite: follow the [official guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app) to setup Heroku.

When you have heroku as one of the git remote url, simply to do the following to deploy the app, assuming you are in the *root* directory:

- Add and commit any changes in the current project.
- Run `git push heroku <current_branch>:master`
