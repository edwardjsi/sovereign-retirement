# Temporary bastion for database testing
# This will be destroyed after verification

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-${var.environment}-bastion-sg"
  description = "Temporary security group for bastion host"
  vpc_id      = module.vpc.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name      = "${var.project_name}-${var.environment}-bastion-sg"
    Temporary = "true"
  }
}

resource "aws_iam_role" "bastion" {
  name = "${var.project_name}-${var.environment}-bastion-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "bastion_ssm" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "bastion_secrets" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

resource "aws_iam_instance_profile" "bastion" {
  name = "${var.project_name}-${var.environment}-bastion-profile"
  role = aws_iam_role.bastion.name
}

resource "aws_instance" "bastion" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = "t3.micro"
  subnet_id              = module.vpc.private_subnet_ids[0]
  vpc_security_group_ids = [aws_security_group.bastion.id, module.rds.db_security_group_id]
  iam_instance_profile   = aws_iam_instance_profile.bastion.name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y postgresql15 jq
              EOF

  tags = {
    Name      = "${var.project_name}-${var.environment}-bastion"
    Temporary = "true"
  }
}

output "bastion_instance_id" {
  description = "Bastion instance ID for Session Manager"
  value       = aws_instance.bastion.id
}

output "connect_command" {
  description = "Command to connect to bastion"
  value       = "aws ssm start-session --target ${aws_instance.bastion.id} --region ap-south-1"
}
