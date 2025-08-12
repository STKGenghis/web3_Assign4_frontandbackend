'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { MetaHeader } from '~~/components/MetaHeader';
import { AddressInfoDisplay } from '~~/components/scaffold-eth';
import { Clock, MessageSquare, Wallet, Receipt, Package2, TrendingUp, AlertCircle } from 'lucide-react';
import { useScaffoldContractRead } from '~~/hooks/scaffold-eth';
import { formatCurrency } from '~~/utils/baseflow';

export default function Dashboard() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();
  const [totalInventoryValue, setTotalInventoryValue] = useState<bigint>(BigInt(0));
  const [paidInvoices, setPaidInvoices] = useState<number>(0);
  const [pendingInvoices, setPendingInvoices] = useState<number>(0);

  // Read inventory data using scaffold hooks
  const { data: inventoryIds } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getAllInventoryIds",
    args: [],
  });

  // Read invoices data
  const { data: invoiceIds } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getAllInvoiceIds",
    args: [],
  });
  
  // Get invoice details for dashboard stats
  const { data: invoices } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getMultipleInvoices",
    args: invoiceIds ? [invoiceIds] : undefined,
    enabled: !!invoiceIds && invoiceIds.length > 0,
  });

  // Calculate dashboard metrics
  useEffect(() => {
    if (invoices) {
      const paid = invoices.filter(invoice => invoice.paid).length;
      const pending = invoices.filter(invoice => !invoice.paid).length;
      
      setPaidInvoices(paid);
      setPendingInvoices(pending);
    }
  }, [invoices]);

  // Dashboard stats based on contract data
  const stats = [
    {
      title: 'Total Inventory Items',
      value: inventoryIds?.length.toString() || '0',
      change: 'Current inventory count',
      positive: true,
      icon: <Package2 className="h-8 w-8 text-blue-500" />,
    },
    {
      title: 'Paid Invoices',
      value: paidInvoices.toString(),
      change: 'Completed sales',
      positive: true,
      icon: <Receipt className="h-8 w-8 text-green-500" />,
    },
    {
      title: 'Pending Invoices',
      value: pendingInvoices.toString(),
      change: 'Awaiting payment',
      positive: false,
      icon: <AlertCircle className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: 'Total Transactions',
      value: invoiceIds?.length.toString() || '0',
      change: 'All-time invoice count',
      positive: true,
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
    },
  ];

  const quickLinks = [
    {
      name: 'Inventory Management',
      description: 'Update stock levels and track products',
      icon: <Package2 className="h-8 w-8 text-blue-500" />,
      link: '/inventory',
    },
    {
      name: 'Sales & Invoicing',
      description: 'Create invoices and track payments',
      icon: <Receipt className="h-8 w-8 text-green-500" />,
      link: '/sales',
    },
    {
      name: 'Smart Contract Debug',
      description: 'View contract details and functions',
      icon: <Wallet className="h-8 w-8 text-purple-500" />,
      link: '/debug',
    },
  ];

  const recentActivity = [
    {
      action: 'Invoice Created',
      description: 'Invoice #1234 created for 0x1a2...3b4c',
      time: '5 minutes ago',
    },
    {
      action: 'Inventory Updated',
      description: 'Added 50 units of "Logo T-shirt"',
      time: '2 hours ago',
    },
    {
      action: 'Payment Received',
      description: 'Invoice #1201 paid by 0x5e6...7f8g',
      time: '1 day ago',
    },
  ];

  return (
    <>
      <MetaHeader title="Dashboard | BaseFlow" description="BaseFlow Dashboard on Lisk" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">BaseFlow Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your blockchain-powered business management platform
          </p>
        </div>

        {/* User Wallet Info */}
        {address && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Your Wallet</h2>
            <AddressInfoDisplay address={address} />
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div>{stat.icon}</div>
              </div>
              <div
                className={`mt-2 text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => router.push(link.link)}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow transition duration-200 text-left"
            >
              <div className="flex items-start space-x-4">
                <div>{link.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800">{link.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-800">{activity.action}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <Clock size={14} className="inline mr-1" />
                  {activity.time}
                </p>
              </div>
              <p className="text-gray-600 mt-1">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
