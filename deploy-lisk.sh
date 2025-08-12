#!/bin/bash

# Script to deploy BaseFlow Inventory to Lisk Sepolia
echo "BaseFlow Inventory Deployment Script for Lisk Sepolia"
echo "==================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create it with DEPLOYER_PRIVATE_KEY set."
    exit 1
fi

# Source environment variables
source .env

# Check if DEPLOYER_PRIVATE_KEY is set
if [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
    echo "Error: DEPLOYER_PRIVATE_KEY not set in .env file."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    yarn install
fi

# Deploy contracts to Lisk Sepolia
echo "Deploying contracts to Lisk Sepolia..."
cd packages/hardhat
npx hardhat deploy --network liskSepolia

# Get contract addresses
IMPLEMENTATION_ADDRESS=$(grep -A 1 "BaseFlowImplementation" deployments/liskSepolia/BaseFlowImplementation.json | grep "address" | cut -d '"' -f 4)
MOCKUSDC_ADDRESS=$(grep -A 1 "MockUSDC" deployments/liskSepolia/MockUSDC.json | grep "address" | cut -d '"' -f 4)

echo "Deployment completed!"
echo "BaseFlowImplementation deployed at: $IMPLEMENTATION_ADDRESS"
echo "MockUSDC deployed at: $MOCKUSDC_ADDRESS"

# Verify contracts
echo ""
echo "Do you want to verify the contracts on the Lisk Sepolia explorer? (y/n)"
read -r VERIFY

if [ "$VERIFY" = "y" ] || [ "$VERIFY" = "Y" ]; then
    echo "Verifying MockUSDC contract..."
    npx hardhat verify --network liskSepolia "$MOCKUSDC_ADDRESS" "Mock USDC" "USDC" 6
    
    echo "Verifying BaseFlowImplementation contract..."
    npx hardhat verify --network liskSepolia "$IMPLEMENTATION_ADDRESS" "$MOCKUSDC_ADDRESS"
    
    echo "Verification completed!"
fi

# Get the block number
BLOCK_NUMBER=$(npx hardhat --network liskSepolia block-number)

echo ""
echo "Save the following information for your frontend deployment:"
echo "NEXT_PUBLIC_DEPLOY_BLOCK=$BLOCK_NUMBER"
echo ""
echo "Deploy your frontend to Vercel with the above environment variable."

echo ""
echo "Deployment script completed successfully!"
