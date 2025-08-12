#!/bin/bash

# Script to help with GitHub setup and Vercel deployment
echo "BaseFlow GitHub and Vercel Setup Script"
echo "======================================"

# Check for git
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Check if remote origin exists
if ! git remote | grep -q "origin"; then
    echo "Enter your GitHub username:"
    read GITHUB_USERNAME

    echo "Enter your repository name (e.g., baseflow-lisk):"
    read REPO_NAME

    # Create .gitignore file
    cat > .gitignore << EOL
node_modules
.env
.env.local
.DS_Store
coverage
coverage.json
typechain
typechain-types

# Hardhat files
cache
artifacts
.openzeppelin

# Next.js
.next/
out/
next-env.d.ts
EOL

    echo "Setting up remote origin..."
    git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
    
    echo "Remote origin set to: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo ""
    echo "Now you need to:"
    echo "1. Create a new repository on GitHub named '$REPO_NAME'"
    echo "2. Run the following commands to push your code:"
    echo "   git add ."
    echo "   git commit -m \"Initial commit of BaseFlow on Scaffold Lisk\""
    echo "   git branch -M main"
    echo "   git push -u origin main"
else
    echo "Remote origin already exists. You can push your changes with:"
    echo "git add ."
    echo "git commit -m \"Your commit message\""
    echo "git push"
fi

echo ""
echo "For Vercel deployment:"
echo "1. Sign up or log in to Vercel: https://vercel.com"
echo "2. Create a new project and import your GitHub repository"
echo "3. Configure these environment variables in Vercel:"

# Try to read deployment block from .env file
DEPLOY_BLOCK=""
if [ -f "packages/nextjs/.env.local" ]; then
    DEPLOY_BLOCK=$(grep "NEXT_PUBLIC_DEPLOY_BLOCK" packages/nextjs/.env.local | cut -d "=" -f2)
fi

if [ -z "$DEPLOY_BLOCK" ]; then
    echo "   - NEXT_PUBLIC_DEPLOY_BLOCK=<Your contract deployment block number>"
else
    echo "   - NEXT_PUBLIC_DEPLOY_BLOCK=$DEPLOY_BLOCK"
fi

echo "   - NEXT_PUBLIC_ALCHEMY_API_KEY=<Your Alchemy API Key>"
echo "   - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<Your WalletConnect Project ID>"
echo ""
echo "4. Set the following settings:"
echo "   - Framework preset: Next.js"
echo "   - Root directory: packages/nextjs"
echo "   - Build command: yarn build"
echo "   - Output directory: .next"
echo ""
echo "5. Click Deploy"
echo ""
echo "Once deployed, you will get a URL like: https://your-project.vercel.app"
echo "This is your Vercel deployed link that you need to submit."
