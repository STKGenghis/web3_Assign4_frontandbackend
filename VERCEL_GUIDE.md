# Vercel Deployment Guide

Follow these steps to deploy your BaseFlow Inventory frontend to Vercel:

## Prerequisites

Before deploying to Vercel, ensure you have:
- Successfully pushed your project to GitHub
- Deployed your smart contracts to Lisk Sepolia
- Noted your contract deployment block number

## 1. Prepare Your Environment Variables

Create a `.env.local` file in the `packages/nextjs` directory with the following variables:

```
# Replace these values with your own
NEXT_PUBLIC_DEPLOY_BLOCK=<Your contract deployment block number>
NEXT_PUBLIC_ALCHEMY_API_KEY=<Your Alchemy API Key>
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<Your WalletConnect Project ID>
```

You can run the prepared script to help with this:

```bash
cd /home/digitalshaman/scaffold-lisk
./prepare-frontend.sh
```

## 2. Sign Up for Vercel

1. Go to [Vercel](https://vercel.com/) and sign up for an account.
2. You can sign up with your GitHub account for a smoother integration.

## 3. Create a New Project

1. Once logged in, click the "Add New..." button and select "Project".
2. Connect your GitHub account if you haven't already.
3. Select the repository you created for your BaseFlow Inventory project.
4. Click "Import".

## 4. Configure Project Settings

1. **Framework Preset**: Select "Next.js" from the dropdown menu.
2. **Root Directory**: Enter `packages/nextjs`.
3. **Build Command**: Enter `yarn build`.
4. **Output Directory**: Enter `.next`.

## 5. Add Environment Variables

Click on the "Environment Variables" section and add the following:

1. **NEXT_PUBLIC_DEPLOY_BLOCK**: Your contract deployment block number
2. **NEXT_PUBLIC_ALCHEMY_API_KEY**: Your Alchemy API Key
3. **NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID**: Your WalletConnect Project ID

These are the same values you added to your `.env.local` file.

## 6. Deploy

1. Click the "Deploy" button.
2. Wait for the deployment to complete. This may take a few minutes.

## 7. Check Your Deployment

1. Once deployed, Vercel will provide you with a URL for your project (e.g., `https://baseflow-inventory.vercel.app`).
2. Click on the URL to visit your deployed application.
3. Test the application to make sure everything is working correctly.

## 8. Share Your Vercel Link

This is the Vercel deployment URL that you will share as part of your deliverables:

```
https://your-project-name.vercel.app
```

Be sure to replace "your-project-name" with your actual Vercel project URL.
