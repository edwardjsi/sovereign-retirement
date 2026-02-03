output "db_instance_id" {
  description = "RDS instance ID"
  value       = aws_db_instance.postgresql.id
}

output "db_instance_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.postgresql.endpoint
}

output "db_instance_address" {
  description = "RDS instance address"
  value       = aws_db_instance.postgresql.address
}

output "db_instance_port" {
  description = "RDS instance port"
  value       = aws_db_instance.postgresql.port
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.postgresql.db_name
}

output "db_username" {
  description = "Database username"
  value       = aws_db_instance.postgresql.username
  sensitive   = true
}

output "db_password_secret_arn" {
  description = "ARN of secret containing DB password"
  value       = aws_secretsmanager_secret.db_password.arn
}

output "db_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}