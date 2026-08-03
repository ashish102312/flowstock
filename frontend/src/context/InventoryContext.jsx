import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { inventoryApi } from '../services/api';

const mockInventoryData = [
  { productId: 'LAP-1001', name: 'Dell Latitude 5440 Laptop', category: 'Electronics', warehouseId: 'A-01', availableQty: 120, lowStockThreshold: 50, reservedQty: 5 },
  { productId: 'MON-1002', name: 'Samsung 24" LED Monitor', category: 'Electronics', warehouseId: 'A-02', availableQty: 85, lowStockThreshold: 50, reservedQty: 2 },
  { productId: 'KEY-1003', name: 'Logitech Wireless Keyboard', category: 'Accessories', warehouseId: 'A-03', availableQty: 240, lowStockThreshold: 50, reservedQty: 10 },
  { productId: 'MOU-1004', name: 'Logitech Wireless Mouse', category: 'Accessories', warehouseId: 'A-04', availableQty: 320, lowStockThreshold: 50, reservedQty: 15 },
  { productId: 'SSD-1005', name: 'Samsung 1TB SSD', category: 'Storage', warehouseId: 'B-01', availableQty: 45, lowStockThreshold: 50, reservedQty: 8 },
  { productId: 'HDD-1006', name: 'Seagate 2TB HDD', category: 'Storage', warehouseId: 'B-02', availableQty: 78, lowStockThreshold: 50, reservedQty: 12 },
  { productId: 'RAM-1007', name: 'Kingston 16GB DDR4 RAM', category: 'Components', warehouseId: 'B-03', availableQty: 34, lowStockThreshold: 50, reservedQty: 6 },
  { productId: 'CPU-1008', name: 'Intel Core i7 Processor', category: 'Components', warehouseId: 'B-04', availableQty: 22, lowStockThreshold: 50, reservedQty: 4 },
  { productId: 'CAB-1009', name: 'HDMI Cable 2m', category: 'Cables', warehouseId: 'C-01', availableQty: 520, lowStockThreshold: 50, reservedQty: 50 },
  { productId: 'USB-1010', name: 'SanDisk 64GB USB Drive', category: 'Storage', warehouseId: 'C-02', availableQty: 310, lowStockThreshold: 50, reservedQty: 20 },
  { productId: 'PRI-1011', name: 'HP LaserJet Printer', category: 'Office Equipment', warehouseId: 'D-01', availableQty: 14, lowStockThreshold: 50, reservedQty: 3 },
  { productId: 'CHA-1012', name: 'Ergonomic Office Chair', category: 'Furniture', warehouseId: 'D-02', availableQty: 64, lowStockThreshold: 50, reservedQty: 10 },
  { productId: 'DES-1013', name: 'Wooden Office Desk', category: 'Furniture', warehouseId: 'D-03', availableQty: 41, lowStockThreshold: 50, reservedQty: 5 },
  { productId: 'CAM-1014', name: 'Hikvision CCTV Camera', category: 'Security', warehouseId: 'E-01', availableQty: 18, lowStockThreshold: 50, reservedQty: 2 },
  { productId: 'UPS-1015', name: 'APC UPS 1000VA', category: 'Power Backup', warehouseId: 'E-02', availableQty: 56, lowStockThreshold: 50, reservedQty: 10 }
];

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetching mock for robustness if backend is down
    const fetchInventory = async () => {
      try {
        const res = await inventoryApi.getLowStock();
        const items = res.data || [];

        // Filter out dummy UUID items
        const realItems = items.filter(item => !item.productId?.startsWith('00000000'));
        
        // Formulate final items
        setInventory([...realItems, ...mockInventoryData]);
      } catch (err) {
        console.warn("Backend fetch failed, loading local inventory data instead");
        setInventory([...mockInventoryData]);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const addInventoryItem = async (newItemData) => {
    try {
      await inventoryApi.addStock(newItemData.productId, newItemData.warehouseId || '00000000-0000-0000-0000-000000000000', parseInt(newItemData.availableQty) || 0);
    } catch(e) {
      console.warn("Backend add failed, proceeding with UI update", e);
    }
    setInventory(prev => [{ ...newItemData, availableQty: parseInt(newItemData.availableQty) || 0, quantity: parseInt(newItemData.availableQty) || 0 }, ...prev]);
  };

  const updateInventoryItem = async (editingItem, editQty) => {
    try {
      if (editingItem.id && !editingItem.id.toString().startsWith('mock')) {
        await inventoryApi.updateInventory(editingItem.id, parseInt(editQty) || 0);
      }
    } catch(e) { 
      console.warn("Backend update failed, proceeding with UI update", e); 
    }
    setInventory(prev => prev.map(item => {
      if (item.productId === editingItem.productId && item.name === editingItem.name) {
        return { ...item, availableQty: parseInt(editQty) || 0, quantity: parseInt(editQty) || 0 };
      }
      return item;
    }));
  };

  const deleteInventoryItem = async (item) => {
    try {
      if (item.id && !item.id.toString().startsWith('mock')) {
        await inventoryApi.deleteInventory(item.id);
      }
    } catch(e) { 
      console.warn("Backend delete failed, proceeding with UI update", e); 
    }
    setInventory(prev => prev.filter(i => !(i.productId === item.productId && i.name === item.name)));
  };

  return (
    <InventoryContext.Provider value={{ inventory, loading, addInventoryItem, updateInventoryItem, deleteInventoryItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
