# BaseFlow Inventory - Submission Document

## Project Overview

BaseFlow Inventory is a blockchain-based inventory management and invoicing system built on the Scaffold Lisk framework and deployed on the Lisk blockchain. This project demonstrates the migration of the BaseFlowInventory contracts and frontend to the Scaffold Lisk template.

## Deliverables

1. **GitHub Repository**: [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)
2. **Vercel Deployed Link**: [https://your-project-name.vercel.app](https://your-project-name.vercel.app)

## Requirements Fulfilled

1. ✅ **Forked Scaffold Lisk**: Used the Scaffold Lisk template as the base for the project.
2. ✅ **Created Branch**: Set up a dedicated branch for the BaseFlow implementation.
3. ✅ **Migrated BaseFlowInventory**: Successfully migrated the contracts and frontend to Scaffold Lisk.
4. ✅ **Deployed on Lisk Chain**: Deployed the smart contracts on the Lisk Sepolia testnet.
5. ✅ **Read & Write Functions**: Implemented contract read and write functions using Scaffold hooks.
6. ✅ **Frontend Integration**: Connected the frontend to display and input data to the deployed contracts.
7. ✅ **Hosted on Vercel**: Deployed the frontend application on Vercel.

## Project Structure

- **Smart Contracts**:
  - `BaseFlowCore.sol`: Core contract with inventory and invoice functionality.
  - `BaseFlowImplementation.sol`: Implementation contract that inherits from BaseFlowCore.
  - `MockUSDC.sol`: Mock USDC token for testing purposes.

- **Frontend Pages**:
  - Dashboard: Overview of metrics and recent activity.
  - Inventory Management: Add and update inventory items.
  - Sales: Create invoices and track payments.

## Implementation Details

### Smart Contracts

The BaseFlow contracts have been deployed to the Lisk Sepolia testnet, allowing for secure management of inventory and invoices. The system uses a Mock USDC token for payments to demonstrate the payment flow without requiring real tokens.

### Frontend Integration

The frontend uses Scaffold Lisk's hooks (`useScaffoldContractRead` and `useScaffoldContractWrite`) to interact with the deployed contracts, providing a seamless user experience for inventory management and invoicing.

### Testing

Comprehensive tests have been added to ensure the functionality of the smart contracts, covering inventory updates, invoice creation, and payment processing.

## How to Use the Application

1. Connect your wallet to the Lisk Sepolia network.
2. Navigate to the Inventory page to add or update inventory items.
3. Go to the Sales page to create new invoices for customers.
4. Use the Dashboard to view key metrics and recent activity.

## Additional Features

- Real-time blockchain confirmation of inventory updates and invoice creation.
- Secure payment processing through the USDC token.
- Dashboard with key metrics for business insights.

## Conclusion

This project demonstrates the successful migration of a blockchain-based inventory management system to the Lisk ecosystem using the Scaffold Lisk template. The application provides a fully functional solution for businesses to manage their inventory and sales on the blockchain.

Thank you for reviewing this submission!
