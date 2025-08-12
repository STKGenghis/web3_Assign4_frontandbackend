#!/bin/bash

# Script to set up and push to your personal GitHub repository
echo "Setting up GitHub Repository for BaseFlow Inventory"
echo "=================================================="

echo "Enter your GitHub username:"
read GITHUB_USERNAME

echo "Enter your new repository name (e.g., baseflow-inventory-lisk):"
read REPO_NAME

echo "Setting up remote origin..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "Adding files to staging..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit of BaseFlow Inventory on Scaffold Lisk"

echo "Setting default branch name to main..."
git branch -M main

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "Process completed!"
echo "Check your repository at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
