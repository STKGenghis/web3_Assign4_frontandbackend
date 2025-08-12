#!/bin/bash

# Script to prepare frontend for Vercel deployment
echo "BaseFlow Frontend Preparation Script for Vercel"
echo "=============================================="

# Check if we're in the right directory
if [ ! -d "packages/nextjs" ]; then
    echo "Error: packages/nextjs directory not found. Please run this script from the root of the scaffold-lisk repository."
    exit 1
fi

# Create .env.local file for NextJS with deployment data
cd packages/nextjs

# Get deployment block number
echo "Enter the deployment block number from your Lisk Sepolia deployment:"
read DEPLOY_BLOCK

# Get Alchemy API Key
echo "Enter your Alchemy API Key (or press enter to use default):"
read ALCHEMY_API_KEY
if [ -z "$ALCHEMY_API_KEY" ]; then
    ALCHEMY_API_KEY="oKxs-03sij-U_N0iOlrSsZFr29-IqbuF"
fi

# Get WalletConnect Project ID
echo "Enter your WalletConnect Project ID (or press enter to use default):"
read WALLET_CONNECT_PROJECT_ID
if [ -z "$WALLET_CONNECT_PROJECT_ID" ]; then
    WALLET_CONNECT_PROJECT_ID="3a8170812b534d0ff9d794f19a901d64"
fi

# Create .env.local file
cat > .env.local << EOL
# BaseFlow Deployment Environment Variables
NEXT_PUBLIC_DEPLOY_BLOCK=${DEPLOY_BLOCK}
NEXT_PUBLIC_ALCHEMY_API_KEY=${ALCHEMY_API_KEY}
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=${WALLET_CONNECT_PROJECT_ID}
EOL

echo "Created .env.local file with the following values:"
echo "NEXT_PUBLIC_DEPLOY_BLOCK=${DEPLOY_BLOCK}"
echo "NEXT_PUBLIC_ALCHEMY_API_KEY=${ALCHEMY_API_KEY}"
echo "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=${WALLET_CONNECT_PROJECT_ID}"

echo ""
echo "Frontend preparation completed!"
echo ""
echo "To deploy to Vercel:"
echo "1. Push your changes to GitHub"
echo "2. Create a new project in Vercel and link your repository"
echo "3. Set the following environment variables in Vercel:"
echo "   - NEXT_PUBLIC_DEPLOY_BLOCK=${DEPLOY_BLOCK}"
echo "   - NEXT_PUBLIC_ALCHEMY_API_KEY=${ALCHEMY_API_KEY}"
echo "   - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=${WALLET_CONNECT_PROJECT_ID}"
echo "4. Set the build command to: yarn build"
echo "5. Set the output directory to: .next"
echo "6. Deploy the application"
