'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useScaffoldContractWrite, useScaffoldContractRead } from '~~/hooks/scaffold-eth';
import { AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import { MetaHeader } from '~~/components/MetaHeader';
import { Address } from '~~/components/scaffold-eth';
import { InputBase } from '~~/components/scaffold-eth';

export default function InventoryPage() {
  const [itemId, setItemId] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const { address } = useAccount();

  // Get all inventory IDs
  const { data: inventoryIds } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getAllInventoryIds",
    args: [],
  });

  // Get multiple inventory items
  const { data: inventoryItems } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getMultipleInventoryItems",
    args: inventoryIds ? [inventoryIds] : undefined,
    enabled: !!inventoryIds && inventoryIds.length > 0,
  });

  // For getting specific inventory item data
  const { data: inventoryItem, isLoading: isLoadingInventory } = useScaffoldContractRead({
    contractName: "BaseFlowImplementation",
    functionName: "getInventory",
    args: [address || '0x0000000000000000000000000000000000000000', itemId || 'default'],
    enabled: !!address && !!itemId && itemId !== '',
  });

  // Setup scaffoldContractWrite for updateInventory function
  const { writeAsync: updateInventory, isLoading } = useScaffoldContractWrite({
    contractName: "BaseFlowImplementation",
    functionName: "updateInventory",
    args: [itemId, BigInt(quantity || 0), BigInt(parseFloat(price || '0') * 1_000_000)],
    onBlockConfirmation: txnReceipt => {
      console.log('Transaction blockHash', txnReceipt.blockHash);
      // Clear form after successful update
      setItemId('');
      setQuantity('');
      setPrice('');
    },
  });

  // Filter inventory items for low stock
  const lowStockItems = inventoryItems 
    ? inventoryItems
        .filter(item => Number(item.quantity) < lowStockThreshold)
        .map(item => ({
          id: item.itemId,
          name: item.itemId,
          stock: Number(item.quantity),
          reorderPoint: lowStockThreshold,
          price: Number(item.price) / 1_000_000
        }))
    : [];

  // Get top items by price (as a proxy for importance)
  const topSellingItems = inventoryItems 
    ? [...inventoryItems]
        .sort((a, b) => Number(b.price) - Number(a.price))
        .slice(0, 4)
        .map(item => ({
          id: item.itemId,
          name: item.itemId,
          price: Number(item.price) / 1_000_000,
          quantity: Number(item.quantity),
          trend: Number(item.quantity) > 10 ? 'up' : Number(item.quantity) > 5 ? 'stable' : 'down'
        }))
    : [];

  const handleUpdateInventory = async () => {
    if (!itemId || !quantity || !price) {
      alert('Please fill all fields');
      return;
    }
    
    // Validate inputs
    if (parseFloat(quantity) < 0) {
      alert('Quantity cannot be negative');
      return;
    }
    
    if (parseFloat(price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    
    try {
      await updateInventory();
    } catch (error) {
      console.error('Error updating inventory', error);
    }
  };

  return (
    <>
      <MetaHeader title="Inventory | BaseFlow" description="Inventory management with BaseFlow" />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Manager</h1>
          <p className="text-gray-600">Manage your inventory on Lisk blockchain</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Inventory Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Update Inventory Item</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item ID</label>
                <InputBase
                  value={itemId}
                  onChange={e => setItemId(e.target.value)}
                  placeholder="e.g., tshirt-black-l"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <InputBase
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="e.g., 100"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USDC)</label>
                <InputBase
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="e.g., 19.99"
                  type="number"
                  step="0.01"
                />
              </div>
              <button
                className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleUpdateInventory}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Update Inventory'}
              </button>
            </div>
          </div>

          {/* Inventory Stats */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <AlertTriangle size={18} className="mr-2 text-orange-500" />
                  Low Stock Alert
                </h2>
                <button className="text-sm text-blue-600 hover:underline">Reorder All</button>
              </div>
              <div className="divide-y divide-gray-200">
                {lowStockItems.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Reorder point: {item.reorderPoint}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-500">{item.stock} left</p>
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <TrendingUp size={18} className="mr-2 text-blue-600" />
                  Top Selling Items
                </h2>
                <button className="text-sm text-blue-600 hover:underline">Full Report</button>
              </div>
              <div className="divide-y divide-gray-200">
                {topSellingItems.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <div className="flex items-center">
                      <p className="font-medium mr-2">{item.sold} sold</p>
                      {item.trend === 'up' && <TrendingUp size={16} className="text-green-500" />}
                      {item.trend === 'down' && <TrendingUp size={16} className="text-red-500 transform rotate-180" />}
                      {item.trend === 'stable' && <BarChart3 size={16} className="text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Display blockchain data */}
        {inventoryItem && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-md font-semibold mb-2">Blockchain Data for {itemId}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">
                <span className="font-medium">Quantity:</span> {inventoryItem.quantity?.toString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Price:</span>{' '}
                {inventoryItem.price ? (Number(inventoryItem.price) / 1_000_000).toFixed(2) : '0'} USDC
              </div>
              <div className="text-sm">
                <span className="font-medium">Merchant:</span> <Address address={inventoryItem.merchant} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
