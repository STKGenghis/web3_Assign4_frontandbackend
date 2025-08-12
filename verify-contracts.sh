#!/bin/bash

# Script to verify BaseFlow contracts on Lisk Sepolia
echo "BaseFlow Contract Verification Script for Lisk Sepolia"
echo "==================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create it with DEPLOYER_PRIVATE_KEY set."
    exit 1
fi

# Source environment variables
source .env

# Check for deployment files
if [ ! -f "packages/hardhat/deployments/liskSepolia/BaseFlowImplementation.json" ] || 
   [ ! -f "packages/hardhat/deployments/liskSepolia/MockUSDC.json" ]; then
    echo "Error: Deployment files not found. Please deploy contracts first using deploy-lisk.sh"
    exit 1
fi

# Get contract addresses
cd packages/hardhat
IMPLEMENTATION_ADDRESS=$(grep -A 1 "address" deployments/liskSepolia/BaseFlowImplementation.json | head -2 | grep "address" | cut -d '"' -f 4)
MOCKUSDC_ADDRESS=$(grep -A 1 "address" deployments/liskSepolia/MockUSDC.json | head -2 | grep "address" | cut -d '"' -f 4)

echo "Found contract addresses:"
echo "BaseFlowImplementation: $IMPLEMENTATION_ADDRESS"
echo "MockUSDC: $MOCKUSDC_ADDRESS"

# Verify MockUSDC
echo "Verifying MockUSDC contract..."
npx hardhat verify --network liskSepolia "$MOCKUSDC_ADDRESS" "Mock USDC" "USDC" 6

# Verify BaseFlowImplementation
echo "Verifying BaseFlowImplementation contract..."
npx hardhat verify --network liskSepolia "$IMPLEMENTATION_ADDRESS" "$MOCKUSDC_ADDRESS"

echo "Verification completed!"
