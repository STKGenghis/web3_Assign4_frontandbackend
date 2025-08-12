'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useScaffoldContractWrite, useScaffoldContractRead } from '~~/hooks/scaffold-eth';
import { MessageSquare, ShoppingBag } from 'lucide-react';
import { MetaHeader } from '~~/components/MetaHeader';
import { InputBase } from '~~/components/scaffold-eth';
import { keccak256, toHex } from 'viem';
import { formatCurrency, shortenAddress } from '~~/utils/baseflow';

export default function SalesPage() {
  const [customer, setCustomer] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');
  const [showAllInvoices, setShowAllInvoices] = useState<boolean>(false);
  
  const { address } = useAccount();

  // Get all invoice IDs
  const { data: invoiceIds, isLoading: isLoadingInvoices } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getAllInvoiceIds",
    args: [],
  });

  // Get all invoices
  const { data: invoices } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getMultipleInvoices",
    args: invoiceIds ? [invoiceIds] : undefined,
    enabled: !!invoiceIds && invoiceIds.length > 0,
  });

  // Setup scaffoldContractWrite for createInvoice function
  const { writeAsync: createInvoice, isLoading } = useScaffoldContractWrite({
    contractName: "BaseFlowImplementation",
    functionName: "createInvoice",
    args: [
      customer || '0x0000000000000000000000000000000000000000', 
      BigInt(parseFloat(amount || '0') * 1_000_000), 
      BigInt(new Date(dueDate || Date.now() + 86400000).getTime() / 1000), 
      metadata || ''
    ],
    onBlockConfirmation: txnReceipt => {
      console.log('Transaction blockHash', txnReceipt.blockHash);
      // Clear form after successful submission
      setCustomer('');
      setAmount('');
      setDueDate('');
      setMetadata('');
    },
  });

  // Setup hook for paying an invoice
  const { writeAsync: payInvoice } = useScaffoldContractWrite({
    contractName: "BaseFlowImplementation",
    functionName: "payInvoice",
    args: ["0x"],  // This will be set when the function is called
  });

  // Map invoice data to display format
  const recentOrders = invoices
    ? invoices
        .slice(0, 5) // Only show 5 most recent
        .map(invoice => ({
          id: invoice.id.slice(0, 10) + '...',
          customer: invoice.customer.slice(0, 6) + '...' + invoice.customer.slice(-4),
          total: (Number(invoice.amount) / 1_000_000).toFixed(2) + ' USDC',
          status: invoice.paid ? 'Paid' : 'Pending',
          dueDate: new Date(Number(invoice.dueDate) * 1000).toLocaleDateString(),
          rawInvoice: invoice
        }))
    : [];

  const customerMessages = [
    {
      id: '1',
      customer: '@alex',
      message: 'Do you have this in red?',
      time: '5m ago',
    },
    {
      id: '2',
      customer: '@taylor',
      message: 'When will my order ship?',
      time: '20m ago',
    },
    {
      id: '3',
      customer: '@jordan',
      message: 'Can I get a refund?',
      time: '1h ago',
    },
  ];

  const handleCreateInvoice = async () => {
    if (!customer || !amount) {
      alert('Please fill in customer address and amount');
      return;
    }
    
    // Validate inputs
    if (!customer.startsWith('0x') || customer.length !== 42) {
      alert('Please enter a valid Ethereum address');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }
    
    if (!dueDate) {
      alert('Please select a due date');
      return;
    }
    
    try {
      await createInvoice();
    } catch (error) {
      console.error('Error creating invoice', error);
    }
  };

  const formatDueDate = (daysFromNow = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      <MetaHeader title="Sales | BaseFlow" description="Sales management with BaseFlow" />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales Manager</h1>
          <p className="text-gray-600">Create invoices and manage orders on Lisk blockchain</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Invoice Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Create Invoice</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
                <InputBase
                  value={customer}
                  onChange={e => setCustomer(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC)</label>
                <InputBase
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g., 100.00"
                  type="number"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <InputBase
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  type="date"
                  placeholder={formatDueDate()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Details (IPFS hash or metadata)</label>
                <InputBase
                  value={metadata}
                  onChange={e => setMetadata(e.target.value)}
                  placeholder="e.g., QmXz7..."
                />
              </div>
              <button
                className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleCreateInvoice}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Create Invoice'}
              </button>
            </div>
          </div>

          {/* Sales Data */}
          <div className="space-y-6">
            {/* Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <ShoppingBag size={18} className="mr-2 text-blue-600" />
                  Recent Invoices
                </h2>
                <button 
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowAllInvoices(prev => !prev)}
                >
                  {isLoadingInvoices ? 'Loading...' : invoices?.length ? 'View all' : 'No invoices'}
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {isLoadingInvoices ? (
                  <div className="py-3 flex items-center justify-center">
                    <p className="text-gray-500">Loading invoices...</p>
                  </div>
                ) : recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <div key={order.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{order.customer}</p>
                        <p className="text-sm text-gray-600">Due: {order.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total}</p>
                        <p
                          className={`text-sm ${
                            order.status === 'Paid'
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-3 flex items-center justify-center">
                    <p className="text-gray-500">No invoices found. Create one!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Messages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-blue-600" />
                  Customer Messages
                </h2>
                <button className="text-sm text-blue-600 hover:underline">View all</button>
              </div>
              <div className="divide-y divide-gray-200">
                {customerMessages.map(msg => (
                  <div key={msg.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">{msg.customer}</p>
                      <p className="text-xs text-gray-500">{msg.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
