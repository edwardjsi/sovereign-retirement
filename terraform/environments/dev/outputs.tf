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
