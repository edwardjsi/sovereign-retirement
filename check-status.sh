#!/bin/bash
echo "=== Checking ECS Status ==="
echo ""
echo "Cluster Status:"
aws ecs describe-clusters --clusters sovereign-retirement-dev-cluster --region ap-south-1 --query 'clusters[0].[status,runningTasksCount,pendingTasksCount]' --output table

echo ""
echo "Running Tasks:"
aws ecs list-tasks --cluster sovereign-retirement-dev-cluster --desired-status RUNNING --region ap-south-1

echo ""
echo "Recent Backend Logs:"
aws logs tail /ecs/sovereign-retirement-dev-backend --since 2m --region ap-south-1 | tail -10

echo ""
echo "Recent Frontend Logs:"
aws logs tail /ecs/sovereign-retirement-dev-frontend --since 2m --region ap-south-1 | tail -10
