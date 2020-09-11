## Deploy both frontend and backend

In the `main` directory, run `npm run deployAll`.

## Deploy the Express App

Configure task, container and the service on **ECS with Fargate**, follow the official [AWS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started-fargate.html)

When creating the task definition, you can use your own image for the container. Follow this [guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html) to create an image and push to ECR. (Note: [install docker]((https://docs.docker.com/get-docker/)) if you haven't alreay)


Note

- Make sure the EC2 instance the app lanuches from **have permission** to connect to the desired AWS RDS.
- The EC2 may still not work even when the status indicates it is running, we have to wait for it to reach a steady state for it to be fully functional. (The wait time is unknown)
- Set a resonably long time for the health check grace period , I set it to 60 seconds.
- In the target group under the **EC2 service**, I updated the health check interval to be 60s
- Make sure the docker port to host mappings are correct. For example, if you expose port 3000 in the docker container, then the port mapping for when creating the container in ECS should also be 3000.
