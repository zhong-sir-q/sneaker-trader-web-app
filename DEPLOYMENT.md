## Deploy the Express App

- Here is a [good guide](https://medium.com/@ariklevliber/aws-fargate-from-start-to-finish-for-a-nodejs-app-9a0e5fbf6361).

caveats
- I did not use pm2 to start my app in Dockerfile as the author suggested in the guide.
- I did not manually create the load balancer per the guide, I used the one that came with the sample demo app.

- Set a resonably long time for the health check grace period , I set it to 300 seconds.
- Also in the target group under the ec2 service, I updated the health check interval to be 60s
- make sure the docker port to host mappings are correct (e.g. need more elaborations here)