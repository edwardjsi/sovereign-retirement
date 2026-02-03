# 🏦 Sovereign Retirement Calculator

A full-stack retirement planning application deployed on AWS using Infrastructure as Code, demonstrating modern cloud architecture, containerization, and DevOps practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Infrastructure Components](#infrastructure-components)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [AWS Deployment](#aws-deployment)
- [Cost Analysis](#cost-analysis)
- [Security Best Practices](#security-best-practices)
- [What I Learned](#what-i-learned)
- [Future Improvements](#future-improvements)

---

## 🎯 Overview

Sovereign Retirement Calculator is a web application that helps users plan their retirement by calculating future savings projections based on current age, retirement age, monthly savings, expected returns, and inflation rates.

**Built to demonstrate:**
- Cloud architecture on AWS
- Infrastructure as Code with Terraform
- Container orchestration
- Full-stack TypeScript development
- Security best practices

---

## ✨ Features

### User Features
- 🔐 User authentication and authorization
- 💰 Retirement projection calculations
- 📊 Multiple scenario planning
- 💾 Secure data persistence
- 📱 Responsive UI design

### Technical Features
- 🐳 Fully containerized with Docker
- ☁️ Deployed on AWS with IaC
- 🔒 Secure credential management
- 🌐 Multi-AZ high availability
- 📈 Scalable architecture
- 💵 Cost-optimized infrastructure

---

## 🏗️ Architecture

```

                    Internet
                       ↓
              Application Load Balancer
                       ↓
        ┌──────────────┴──────────────┐
        ↓                              ↓
    Frontend Container            Backend Container
(React + Vite)               (NestJS + TypeScript)
Port: 3000                   Port: 3001
└──────────────┬──────────────┘
↓
RDS PostgreSQL 15
(Private Subnet)
Port: 5432

```

### Network Architecture

```

VPC (10.0.0.0/16)
├── Availability Zone A (ap-south-1a)
│   ├── Public Subnet (10.0.1.0/24)
│   │   └── NAT Gateway
│   └── Private Subnet (10.0.3.0/24)
│       └── RDS Primary
│
└── Availability Zone B (ap-south-1b)
├── Public Subnet (10.0.2.0/24)
│   └── Application Load Balancer
└── Private Subnet (10.0.4.0/24)
└── ECS Tasks

```

---

## 🛠️ Technologies

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Backend
- **Framework**: NestJS + TypeScript
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: class-validator

### Database
- **DBMS**: PostgreSQL 15.15
- **Hosting**: AWS RDS (db.t3.micro)
- **Backups**: Automated 7-day retention

### Infrastructure
- **Cloud Provider**: AWS
- **IaC Tool**: Terraform 1.9+
- **Container Runtime**: Docker + Docker Compose
- **Container Registry**: AWS ECR (planned)
- **Container Orchestration**: AWS ECS Fargate (planned)
- **Load Balancer**: AWS Application Load Balancer (planned)

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: AWS CloudWatch

---

## 🏛️ Infrastructure Components

### Day 4: Networking & Database (COMPLETED ✅)

#### VPC Module
- **Custom VPC**: 10.0.0.0/16 CIDR block
- **Public Subnets**: 2 subnets across 2 AZs (10.0.1.0/24, 10.0.2.0/24)
- **Private Subnets**: 2 subnets across 2 AZs (10.0.3.0/24, 10.0.4.0/24)
- **Internet Gateway**: Public internet access
- **NAT Gateway**: Private subnet internet access (for updates)
- **Route Tables**: Separate routing for public and private subnets

#### RDS Module
- **Engine**: PostgreSQL 15.15
- **Instance Class**: db.t3.micro (2 vCPUs, 1 GB RAM)
- **Storage**: 20 GB General Purpose SSD (gp3)
- **Multi-AZ**: Configured subnet group across 2 AZs
- **Backups**: Automated daily backups, 7-day retention
- **Encryption**: At rest using AWS KMS
- **Security**: Database in private subnets only

#### Security Components
- **Secrets Manager**: Database credentials stored securely
- **Security Groups**: Restrictive rules (PostgreSQL port 5432 only from VPC)
- **IAM Roles**: Enhanced RDS monitoring with CloudWatch
- **Network ACLs**: Default VPC network access control

### Day 5: Container Registry (PLANNED 🔄)
- AWS ECR repositories for frontend and backend images
- Image scanning for vulnerabilities
- Lifecycle policies for image management

### Day 6: Container Orchestration (PLANNED 🔄)
- ECS Fargate cluster (serverless containers)
- Task definitions for frontend and backend
- ECS Services with auto-scaling
- CloudWatch log groups for container logs

### Day 7: Load Balancing (PLANNED 🔄)
- Application Load Balancer in public subnets
- Target groups for ECS tasks
- Health checks and automatic failover
- HTTPS/SSL configuration (optional)

---

## 📁 Project Structure

```

sovereign-retirement/
├── frontend/                    \# React frontend application
│   ├── src/
│   │   ├── components/         \# Reusable UI components
│   │   ├── pages/              \# Page components
│   │   ├── contexts/           \# React contexts (auth, etc.)
│   │   └── services/           \# API service layer
│   ├── app/
│   │   ├── dashboard/          \# Dashboard page
│   │   ├── login/              \# Login page
│   │   └── register/           \# Registration page
│   ├── Dockerfile              \# Frontend container definition
│   └── package.json
│
├── backend/                     \# NestJS backend API
│   ├── src/
│   │   ├── auth/               \# Authentication module
│   │   ├── users/              \# Users module
│   │   ├── retirement/         \# Retirement calculations module
│   │   └── database/           \# Database configuration
│   ├── Dockerfile              \# Backend container definition
│   └── package.json
│
├── terraform/                   \# Infrastructure as Code
│   ├── modules/
│   │   ├── vpc/                \# VPC networking module
│   │   │   ├── main.tf         \# VPC resources
│   │   │   ├── variables.tf    \# Input variables
│   │   │   └── outputs.tf      \# Output values
│   │   └── rds/                \# RDS database module
│   │       ├── main.tf         \# RDS instance \& security
│   │       ├── variables.tf    \# Database configuration
│   │       └── outputs.tf      \# Connection details
│   └── environments/
│       └── dev/                \# Development environment
│           ├── main.tf         \# Main configuration
│           ├── variables.tf    \# Environment variables
│           ├── outputs.tf      \# Stack outputs
│           ├── terraform.tf    \# Terraform settings
│           └── Readme.md       \# Environment documentation
│
├── docker-compose.yml           \# Local development orchestration
├── .gitignore                   \# Git ignore patterns
└── README.md                    \# This file

```

---

## 💻 Local Development

### Prerequisites
- Docker Desktop installed
- Node.js 18+ (for local development without Docker)
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/sovereign-retirement.git
cd sovereign-retirement

# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database: localhost:5432
```


### Individual Service Commands

```bash
# Start only database
docker-compose up -d postgres

# Start backend
docker-compose up -d backend

# Start frontend
docker-compose up -d frontend

# Stop all services
docker-compose down

# Rebuild containers after code changes
docker-compose up -d --build
```


### Manual Setup (Without Docker)

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Run database migrations
cd backend
npm run migration:run

# Start services
npm run start:dev   # Backend (terminal 1)
cd ../frontend
npm run dev         # Frontend (terminal 2)
```


---

## ☁️ AWS Deployment

### Prerequisites

- AWS Account
- AWS CLI configured (`aws configure`)
- Terraform 1.9+ installed
- Docker installed (for ECR push)


### Step 1: Deploy Infrastructure (Day 4 - COMPLETED)

```bash
# Navigate to Terraform dev environment
cd terraform/environments/dev

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Deploy infrastructure
terraform apply

# Save outputs
terraform output > outputs.txt

# Get database connection details
terraform output db_address
terraform output db_password_secret_arn
```


### Step 2: Retrieve Database Credentials

```bash
# Get database password from Secrets Manager
DB_SECRET_ARN=$(terraform output -raw db_password_secret_arn)

aws secretsmanager get-secret-value \
  --secret-id $DB_SECRET_ARN \
  --region ap-south-1 \
  --query SecretString \
  --output text | jq

# Save credentials for application configuration
```


### Step 3: Push Docker Images to ECR (Day 5 - PLANNED)

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  YOUR-ACCOUNT-ID.dkr.ecr.ap-south-1.amazonaws.com

# Build and push frontend
docker build -t sovereign-retirement-frontend ./frontend
docker tag sovereign-retirement-frontend:latest \
  YOUR-ACCOUNT-ID.dkr.ecr.ap-south-1.amazonaws.com/sovereign-retirement-frontend:latest
docker push YOUR-ACCOUNT-ID.dkr.ecr.ap-south-1.amazonaws.com/sovereign-retirement-frontend:latest

# Build and push backend
docker build -t sovereign-retirement-backend ./backend
docker tag sovereign-retirement-backend:latest \
  YOUR-ACCOUNT-ID.dkr.ecr.ap-south-1.amazonaws.com/sovereign-retirement-backend:latest
docker push YOUR-ACCOUNT-ID.dkr.ecr.ap-south-1.amazonaws.com/sovereign-retirement-backend:latest
```


### Step 4: Deploy ECS Cluster (Day 6 - PLANNED)

```bash
# Apply ECS infrastructure
cd terraform/environments/dev
terraform apply

# Verify deployment
aws ecs list-clusters --region ap-south-1
aws ecs list-services --cluster sovereign-retirement-dev --region ap-south-1
```


### Step 5: Configure Load Balancer (Day 7 - PLANNED)

```bash
# Get ALB DNS name
terraform output alb_dns_name

# Access application at:
# http://YOUR-ALB-DNS-NAME.ap-south-1.elb.amazonaws.com
```


### Destroy Infrastructure (Save Costs)

```bash
# Destroy all AWS resources
cd terraform/environments/dev
terraform destroy

# Confirm by typing "yes"
# All resources will be deleted, costs stop immediately
```


---

## 💰 Cost Analysis

### Monthly Costs (if running 24/7)

| Component | Instance Type | Cost/Month | Notes |
| :-- | :-- | :-- | :-- |
| **VPC** | N/A | \$0 | Free tier |
| **NAT Gateway** | N/A | \$32.40 | \$0.045/hour + data transfer |
| **RDS** | db.t3.micro | \$15.30 | 20 GB storage included |
| **ECS Fargate** | 0.25 vCPU, 0.5 GB | \$10-15 | 2 tasks (frontend + backend) |
| **ALB** | N/A | \$18.00 | \$0.025/hour + LCU charges |
| **ECR** | N/A | \$0.10 | Per GB stored |
| **Secrets Manager** | N/A | \$0.40 | Per secret/month |
| **CloudWatch Logs** | N/A | \$2.00 | 5 GB ingestion |
| **Data Transfer** | N/A | \$1-3 | Varies by usage |
| **Total** |  | **~\$75-80/month** |  |

### Demo Mode (Recommended for Portfolio)

**Strategy**: Destroy infrastructure when not actively demoing


| Usage Pattern | Cost/Month | Details |
| :-- | :-- | :-- |
| **Deployed 2 hours/month** | ~\$5 | Recreate for demos only |
| **Deployed 1 day/month** | ~\$10 | Weekend testing |
| **Deployed 1 week/month** | ~\$20 | Extended development |

### Cost Optimization Tips

1. **Destroy when not using**: `terraform destroy` (costs = \$0)
2. **Use Fargate Spot**: 70% cheaper than on-demand
3. **Single NAT Gateway**: Use one instead of two (save \$32/month)
4. **RDS Reserved Instances**: 40% discount for 1-year commitment
5. **CloudWatch Log retention**: Set to 7 days instead of indefinite
6. **ECR Lifecycle policies**: Auto-delete old images

---

## 🔒 Security Best Practices

### Implemented ✅

1. **Network Isolation**
    - Database in private subnets (no direct internet access)
    - Multi-layer security with security groups and NACLs
2. **Secrets Management**
    - Database credentials in AWS Secrets Manager
    - No hardcoded passwords in code
    - Automatic secret rotation capability
3. **Least Privilege IAM**
    - IAM roles with minimal required permissions
    - No AWS access keys in code
4. **Encryption**
    - RDS encryption at rest (AWS KMS)
    - HTTPS/TLS for data in transit (when ALB configured)
5. **Infrastructure as Code**
    - Version controlled infrastructure
    - Peer-reviewable changes
    - Audit trail via Git commits
6. **Container Security**
    - Multi-stage Docker builds (smaller attack surface)
    - Non-root user in containers
    - Minimal base images

### Planned Enhancements 🔄

1. **Web Application Firewall (WAF)**
    - DDoS protection
    - SQL injection prevention
    - Rate limiting
2. **AWS Systems Manager Session Manager**
    - Secure bastion access without SSH keys
    - All sessions logged to CloudWatch
3. **VPC Flow Logs**
    - Network traffic monitoring
    - Intrusion detection
4. **AWS GuardDuty**
    - Threat detection
    - Anomaly monitoring
5. **Certificate Manager (ACM)**
    - Free SSL/TLS certificates
    - Automatic renewal

---

## 🎓 What I Learned

### Cloud Architecture

- Designing multi-tier applications on AWS
- Understanding VPC networking (subnets, routing, gateways)
- High availability across multiple availability zones
- Security through network isolation


### Infrastructure as Code

- Terraform basics: resources, modules, state management
- Modular IaC for reusability and maintainability
- Managing infrastructure lifecycle (plan, apply, destroy)
- Version controlling infrastructure


### Containerization

- Docker multi-stage builds for optimized images
- Docker Compose for local development orchestration
- Container networking and environment variables
- Dockerfile best practices


### AWS Services Deep Dive

- **VPC**: Subnets, route tables, internet/NAT gateways
- **RDS**: Managed databases, backups, security groups
- **Secrets Manager**: Secure credential storage and rotation
- **IAM**: Roles, policies, and least privilege principles
- **CloudWatch**: Monitoring and logging


### DevOps Practices

- Separating environments (dev, staging, prod)
- Cost optimization strategies
- Security best practices
- Documentation and code organization

---

## 🚀 Future Improvements

### Short Term (Next 2 Weeks)

- [ ] Complete Day 5: Push Docker images to ECR
- [ ] Complete Day 6: Deploy ECS Fargate cluster
- [ ] Complete Day 7: Configure Application Load Balancer
- [ ] Add custom domain with Route53
- [ ] Configure SSL/TLS with ACM


### Medium Term (1-2 Months)

- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Add automated testing (unit, integration, e2e)
- [ ] Implement blue-green deployment strategy
- [ ] Add CloudWatch alarms and dashboards
- [ ] Set up AWS Backup for automated backups
- [ ] Add WAF for security protection


### Long Term (3+ Months)

- [ ] Multi-region deployment for disaster recovery
- [ ] Add CloudFront CDN for global performance
- [ ] Implement auto-scaling based on metrics
- [ ] Add comprehensive monitoring with X-Ray
- [ ] Set up centralized logging with OpenSearch
- [ ] Migrate to Amazon Aurora for better performance
- [ ] Add Redis/ElastiCache for caching
- [ ] Implement GraphQL API
- [ ] Add mobile app (React Native)

---

## 📊 Current Status

### Completed ✅

- **Day 1-2**: Full-stack application development
    - Frontend with React + TypeScript
    - Backend API with NestJS + TypeScript
    - PostgreSQL database schema
    - Authentication and authorization
    - Retirement calculation logic
- **Day 3**: Docker containerization
    - Dockerfiles for frontend and backend
    - Docker Compose orchestration
    - Local development environment
    - Multi-container networking
- **Day 4**: AWS infrastructure foundation
    - Custom VPC with public/private subnets
    - RDS PostgreSQL database
    - Security groups and IAM roles
    - Secrets Manager integration
    - Terraform modules (VPC, RDS)


### In Progress 🔄

- **Day 5**: Container registry setup
- **Day 6**: Container orchestration with ECS
- **Day 7**: Load balancing and public access

---

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use this project for learning purposes.

---

## 👤 Author

**Edward Santosh**

- GitHub: [@edwardjsi](https://github.com/edwardjsi)

---

## 🙏 Acknowledgments

- AWS Documentation for best practices
- Terraform Registry for module examples
- NestJS and React communities
- HashiCorp Learn tutorials

---

## 📚 Resources

### Documentation

- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Documentation](https://docs.docker.com/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)


### Learning Resources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## ⚡ Quick Reference

### Useful Commands

```bash
# Local Development
docker-compose up -d              # Start all services
docker-compose logs -f            # View logs
docker-compose down               # Stop services

# Terraform
terraform init                    # Initialize
terraform plan                    # Preview changes
terraform apply                   # Deploy
terraform destroy                 # Delete all
terraform output                  # View outputs

# AWS CLI
aws rds describe-db-instances     # List databases
aws ecs list-clusters             # List ECS clusters
aws secretsmanager list-secrets   # List secrets

# Git
git status                        # Check status
git add .                         # Stage changes
git commit -m "message"           # Commit
git push origin main              # Push to GitHub
```


---

**Built with ❤️ to demonstrate cloud engineering skills and Infrastructure as Code practices.**

**Last Updated**: February 3, 2026
**Project Status**: In Development (Day 4 Complete)