resource "aws_ecs_task_definition" "express-service" {
  family                = "st-express-service-prod"
  container_definitions = file("task-definitions/express-service.json")

  volume {
    name      = "express-service-storage"
    host_path = "/ecs/express-service-storage"
  }

  placement_constraints {
    type       = "memberOf"
    expression = "attribute:ecs.availability-zone in [ap-southeast-2]"
  }
}