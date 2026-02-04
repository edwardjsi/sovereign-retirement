# VPC Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

# RDS Outputs
output "db_endpoint" {
  description = "Database endpoint"
  value       = module.rds.db_instance_endpoint
}

output "db_address" {
  description = "Database address"
  value       = module.rds.db_instance_address
}

output "db_name" {
  description = "Database name"
  value       = module.rds.db_name
}

output "db_password_secret_arn" {
  description = "Database password secret ARN"
  value       = module.rds.db_password_secret_arn
}

output "connection_command" {
  description = "Command to retrieve DB password"
  value       = "aws secretsmanager get-secret-value --secret-id ${module.rds.db_password_secret_arn} --region ${var.aws_region} --query SecretString --output text | jq -r .password"
}

# ECS Outputs
output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "backend_service_name" {
  description = "Backend service name"
  value       = module.ecs.backend_service_name
}

output "frontend_service_name" {
  description = "Frontend service name"
  value       = module.ecs.frontend_service_name
}

output "backend_logs" {
  description = "Backend CloudWatch log group"
  value       = module.ecs.backend_log_group
}

output "frontend_logs" {
  description = "Frontend CloudWatch log group"
  value       = module.ecs.frontend_log_group
}

# ECR Repository Outputs
output "frontend_repository_url" {
  description = "Frontend ECR repository URL"
  value       = module.ecr.frontend_repository_url
}

output "backend_repository_url" {
  description = "Backend ECR repository URL"
  value       = module.ecr.backend_repository_url
}
