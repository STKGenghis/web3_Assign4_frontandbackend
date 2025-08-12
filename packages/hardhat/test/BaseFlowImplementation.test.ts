import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BaseFlowImplementation, MockUSDC } from "../typechain-types";
import { deployments } from "hardhat";

describe("BaseFlowImplementation", function () {
  let baseFlow: BaseFlowImplementation;
  let mockUsdc: MockUSDC;
  let deployer: HardhatEthersSigner;
  let merchant: HardhatEthersSigner;
  let customer: HardhatEthersSigner;

  beforeEach(async function () {
    // Get signers
    [deployer, merchant, customer] = await ethers.getSigners();
    
    // Deploy fixtures
    await deployments.fixture(["BaseFlowImplementation"]);
    
    // Get contract instances
    const BaseFlowDeployment = await deployments.get("BaseFlowImplementation");
    baseFlow = await ethers.getContractAt("BaseFlowImplementation", BaseFlowDeployment.address);
    
    const MockUsdcDeployment = await deployments.get("MockUSDC");
    mockUsdc = await ethers.getContractAt("MockUSDC", MockUsdcDeployment.address);
    
    // Transfer some USDC to customer for testing
    await mockUsdc.connect(deployer).transfer(customer.address, ethers.parseUnits("1000", 6));
  });

  describe("Inventory Management", function () {
    it("Should update inventory correctly", async function () {
      const itemId = "tshirt-black-l";
      const quantity = 100n;
      const price = 1995000n; // $19.95 with 6 decimals
      
      await baseFlow.connect(merchant).updateInventory(itemId, quantity, price);
      
      const inventory = await baseFlow.getInventory(merchant.address, itemId);
      expect(inventory.itemId).to.equal(itemId);
      expect(inventory.quantity).to.equal(quantity);
      expect(inventory.price).to.equal(price);
      expect(inventory.merchant).to.equal(merchant.address);
    });
    
    it("Should allow updating existing inventory", async function () {
      const itemId = "tshirt-black-l";
      
      // Initial update
      await baseFlow.connect(merchant).updateInventory(itemId, 100n, 1995000n);
      
      // Update with new values
      const newQuantity = 75n;
      const newPrice = 1895000n; // $18.95
      await baseFlow.connect(merchant).updateInventory(itemId, newQuantity, newPrice);
      
      const inventory = await baseFlow.getInventory(merchant.address, itemId);
      expect(inventory.quantity).to.equal(newQuantity);
      expect(inventory.price).to.equal(newPrice);
    });
  });
  
  describe("Invoice Creation", function () {
    it("Should create invoice correctly", async function () {
      const amount = ethers.parseUnits("100", 6); // 100 USDC
      const dueDate = BigInt(Math.floor(Date.now() / 1000) + 86400); // 1 day from now
      const metadata = "ipfs://QmXz7...";
      
      const tx = await baseFlow.connect(merchant).createInvoice(
        customer.address,
        amount,
        dueDate,
        metadata
      );
      
      const receipt = await tx.wait();
      const event = receipt?.logs.filter(
        log => log.topics[0] === baseFlow.interface.getEvent("InvoiceCreated").topicHash
      )[0];
      
      const invoiceId = event.topics[1];
      const invoice = await baseFlow.invoices(invoiceId);
      
      expect(invoice.merchant).to.equal(merchant.address);
      expect(invoice.customer).to.equal(customer.address);
      expect(invoice.amount).to.equal(amount);
      expect(invoice.dueDate).to.equal(dueDate);
      expect(invoice.paid).to.be.false;
      expect(invoice.metadata).to.equal(metadata);
    });
    
    it("Should fail to create invoice with invalid parameters", async function () {
      // Zero amount
      await expect(
        baseFlow.connect(merchant).createInvoice(
          customer.address,
          0n,
          BigInt(Math.floor(Date.now() / 1000) + 86400),
          ""
        )
      ).to.be.revertedWith("Invalid amount");
      
      // Past due date
      await expect(
        baseFlow.connect(merchant).createInvoice(
          customer.address,
          ethers.parseUnits("100", 6),
          BigInt(Math.floor(Date.now() / 1000) - 86400), // 1 day ago
          ""
        )
      ).to.be.revertedWith("Invalid due date");
    });
  });
  
  describe("Invoice Payment", function () {
    it("Should allow customer to pay invoice", async function () {
      // Create invoice
      const amount = ethers.parseUnits("100", 6); // 100 USDC
      const dueDate = BigInt(Math.floor(Date.now() / 1000) + 86400); // 1 day from now
      
      const tx = await baseFlow.connect(merchant).createInvoice(
        customer.address,
        amount,
        dueDate,
        ""
      );
      
      const receipt = await tx.wait();
      const event = receipt?.logs.filter(
        log => log.topics[0] === baseFlow.interface.getEvent("InvoiceCreated").topicHash
      )[0];
      
      const invoiceId = event.topics[1];
      
      // Approve USDC transfer
      await mockUsdc.connect(customer).approve(baseFlow.target, amount);
      
      // Initial balances
      const merchantInitialBalance = await mockUsdc.balanceOf(merchant.address);
      const customerInitialBalance = await mockUsdc.balanceOf(customer.address);
      
      // Pay invoice
      await baseFlow.connect(customer).payInvoice(invoiceId);
      
      // Check invoice is marked as paid
      const invoice = await baseFlow.invoices(invoiceId);
      expect(invoice.paid).to.be.true;
      
      // Check balances updated correctly
      const merchantFinalBalance = await mockUsdc.balanceOf(merchant.address);
      const customerFinalBalance = await mockUsdc.balanceOf(customer.address);
      
      expect(merchantFinalBalance - merchantInitialBalance).to.equal(amount);
      expect(customerInitialBalance - customerFinalBalance).to.equal(amount);
    });
    
    it("Should fail payment for expired invoice", async function () {
      // Create invoice with very short expiry
      const amount = ethers.parseUnits("100", 6);
      const dueDate = BigInt(Math.floor(Date.now() / 1000) + 1); // 1 second from now
      
      const tx = await baseFlow.connect(merchant).createInvoice(
        customer.address,
        amount,
        dueDate,
        ""
      );
      
      const receipt = await tx.wait();
      const event = receipt?.logs.filter(
        log => log.topics[0] === baseFlow.interface.getEvent("InvoiceCreated").topicHash
      )[0];
      
      const invoiceId = event.topics[1];
      
      // Approve USDC transfer
      await mockUsdc.connect(customer).approve(baseFlow.target, amount);
      
      // Wait for invoice to expire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Attempt to pay expired invoice
      await expect(
        baseFlow.connect(customer).payInvoice(invoiceId)
      ).to.be.revertedWith("Invoice expired");
    });
    
    it("Should fail payment for already paid invoice", async function () {
      // Create invoice
      const amount = ethers.parseUnits("100", 6);
      const dueDate = BigInt(Math.floor(Date.now() / 1000) + 86400);
      
      const tx = await baseFlow.connect(merchant).createInvoice(
        customer.address,
        amount,
        dueDate,
        ""
      );
      
      const receipt = await tx.wait();
      const event = receipt?.logs.filter(
        log => log.topics[0] === baseFlow.interface.getEvent("InvoiceCreated").topicHash
      )[0];
      
      const invoiceId = event.topics[1];
      
      // Approve USDC transfer
      await mockUsdc.connect(customer).approve(baseFlow.target, amount);
      
      // Pay invoice first time
      await baseFlow.connect(customer).payInvoice(invoiceId);
      
      // Attempt to pay again
      await expect(
        baseFlow.connect(customer).payInvoice(invoiceId)
      ).to.be.revertedWith("Invoice already paid");
    });
  });
});
