# Deployment Guide for BaseFlow Inventory

This guide will walk you through deploying the BaseFlow Inventory application on the Lisk Sepolia testnet and hosting the frontend on Vercel.

## Prerequisites

- Node.js 16+ and Yarn
- MetaMask or any Web3 wallet with Lisk Sepolia testnet configured
- Private key for deployment
- Vercel account (for frontend hosting)

## Step 1: Configure Environment

Create a `.env` file in the root directory with the following variables:

```
# Deploy to Lisk Sepolia
DEPLOYER_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
```

**Important**: Never commit your `.env` file to Git or share your private key!

## Step 2: Configure MetaMask for Lisk Sepolia

1. Open MetaMask and click on the network dropdown
2. Click "Add Network" and "Add a network manually"
3. Enter the following details:
   - Network Name: `Lisk Sepolia`
   - RPC URL: `https://rpc.sepolia-api.lisk.com`
   - Chain ID: `4202`
   - Currency Symbol: `ETH`
   - Block Explorer URL: `https://sepolia-blockscout.lisk.com`

## Step 3: Get Lisk Sepolia Testnet ETH

You'll need some ETH on Lisk Sepolia testnet to deploy and interact with contracts.
Use a faucet or request some from the Lisk community if available.

## Step 4: Deploy Smart Contracts to Lisk Sepolia

1. Install dependencies if you haven't already:

```bash
yarn install
```

2. Deploy contracts to Lisk Sepolia:

```bash
cd packages/hardhat
npx hardhat deploy --network liskSepolia
```

3. Make note of the contract addresses printed in the console, particularly:
   - MockUSDC address
   - BaseFlowImplementation address

## Step 5: Update Frontend Configuration

1. Update the scaffold configuration:

```typescript
// packages/nextjs/scaffold.config.ts
const scaffoldConfig = {
  targetNetworks: [chains.hardhat, liskSepolia],
  // ...
} as const satisfies ScaffoldConfig;
```

2. Make sure your contract ABIs are correctly generated and imported.

## Step 6: Test Locally Before Deployment

1. Start the NextJS app:

```bash
cd packages/nextjs
yarn dev
```

2. Connect your wallet to Lisk Sepolia
3. Verify that you can interact with your contracts

## Step 7: Deploy Frontend to Vercel

1. Create a new project in Vercel:
   - Connect your GitHub repository
   - Select the main branch

2. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: packages/nextjs
   - Build Command: `yarn build`
   - Output Directory: .next

3. Add environment variables:
   - `NEXT_PUBLIC_DEPLOY_BLOCK`: The block number where your contracts were deployed
   - `NEXT_PUBLIC_ALCHEMY_API_KEY`: Your Alchemy API key
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect Project ID

4. Deploy!

## Step 8: Verify Your Contracts (Optional)

For better transparency and debugging, you can verify your contracts on the Lisk Sepolia block explorer:

```bash
cd packages/hardhat
npx hardhat verify --network liskSepolia <BASEFLOWIMPLEMENTATION_ADDRESS> <MOCKUSDC_ADDRESS>
npx hardhat verify --network liskSepolia <MOCKUSDC_ADDRESS> "Mock USDC" "USDC" 6
```

## Step 9: Testing Your Deployment

1. Visit your Vercel deployment URL
2. Connect your wallet to the Lisk Sepolia network
3. Try the following operations:
   - Add inventory items
   - Create invoices
   - View dashboard metrics

## Troubleshooting

### Contract Interaction Issues
- Ensure you're connected to Lisk Sepolia network
- Check if you have enough ETH for gas
- Verify contract addresses are correct

### Frontend Issues
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure ABIs match deployed contracts

### Transaction Errors
- Check if you're using the correct contract function parameters
- Ensure you have sufficient token balances for transactions
- Verify transaction gas limits

## Additional Resources

- [Lisk Documentation](https://docs.lisk.com/)
- [Scaffold-ETH Documentation](https://docs.scaffoldeth.io/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
