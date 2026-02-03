cat > README.md << 'EOF'
# Sovereign Retirement Calculator

A full-stack retirement planning application deployed on AWS using Infrastructure as Code.

## 🏗️ Architecture

- **Frontend**: React.js
- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL 15
- **Infrastructure**: AWS (VPC, RDS, ECS Fargate, ALB)
- **IaC**: Terraform
- **Containerization**: Docker

## 🚀 Features

- User authentication and authorization
- Retirement projection calculations
- Multiple scenarios support
- Secure data storage
- Responsive UI

## 📦 Infrastructure Components

### Networking
- Custom VPC (10.0.0.0/16)
- Public subnets (2 AZs) - Load balancer, NAT Gateway
- Private subnets (2 AZs) - Database, application containers
- Internet Gateway and NAT Gateway

### Database
- RDS PostgreSQL 15.15 (db.t3.micro)
- Multi-AZ subnet group
- Automated backups (7-day retention)
- Encrypted at rest
- Credentials stored in AWS Secrets Manager

### Security
- Database in private subnets (no direct internet access)
- Security groups for traffic control
- IAM roles with least privilege
- No hardcoded secrets

## 💰 Cost Optimization

- **24/7 operation**: ~$75/month
- **Demo mode** (destroy when not using): ~$5/month
- Infrastructure can be recreated in 15 minutes

## 🛠️ Technologies

- **IaC**: Terraform 1.9+
- **Cloud**: AWS
- **Backend**: NestJS, TypeScript
- **Frontend**: React, TypeScript
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose

## 📁 Project Structure

sovereign-retirement/
├── frontend/ # React application
├── backend/ # NestJS API
├── terraform/
│ ├── modules/
│ │ ├── vpc/ # VPC networking module
│ │ └── rds/ # RDS database module
│ └── environments/
│ └── dev/ # Development environment
└── docker-compose.yml # Local development


## 🚀 Deployment

### Local Development
```bash
docker-compose up -d
cd terraform/environments/dev
terraform init
terraform plan
terraform apply

