#!/bin/bash

set -e

echo "🧪 Running tests..."
npm run test

echo "🔧 Building Typescript project..."
npm run build

echo "📦 Creating Lambda Zip Archive..."
cd dist
zip -r lambda.zip . ../node_modules ../package.json
cd ..

echo "🚀 Initializing Terraform Deploy..."
cd terraform
terraform init
terraform apply -var-file="terraform.tfvars" -var-file="secrets.tfvars" -auto-approve
cd ..

echo "✅ Deploy completed!"
