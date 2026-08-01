import React, { useEffect, useState } from 'react';
import { Package, Truck, LayoutDashboard, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManagerPanel({ user }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    import('../../services/api').then(({ inventoryApi }) => {
      inventoryApi.getLowStock()
        .then(res => {
          setInventory(res.data || []);
          setError(false);
        })
        .catch(err => {
          console.error("Error loading manager inventory:", err);
          setError(true);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const totalAvailable = inventory.reduce((sum, item) => sum + (item.availableQty || item.quantity || 0), 0);
  const totalReserved = inventory.reduce((sum, item) => sum + (item.reservedQty || item.reserved || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-forest">
          <LayoutDashboard className="text-brand-600 w-6 h-6" /> 
          Warehouse Manager Dashboard
        </h2>
        <p className="text-black/60 mt-1">Manage your warehouse zones, real-time microservice stock levels, and active fulfillment orders.</p>
      </div>

      {/* Service Status Banner */}
      {loading ? (
        <div className="bg-white/40 border border-black/10 rounded-xl p-5 text-center font-medium animate-pulse">
          Connecting to distributed inventory microservice via API Gateway...
        </div>
      ) : !error && inventory.length > 0 ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex items-start gap-4 mt-6">
          <CheckCircle2 className="text-emerald-600 w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-800">Inventory Microservice Live & Connected</h3>
            <p className="text-sm text-emerald-700/90 mt-1">
              Successfully synced {inventory.length} product SKUs across active fulfillment hubs using Eureka load-balanced routing.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex items-start gap-4 mt-6">
          <AlertTriangle className="text-amber-600 w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">Inventory Service Offline or Empty</h3>
            <p className="text-sm text-amber-700/80 mt-1">
              Could not retrieve live stock from API Gateway. Ensure all microservices are registered in Eureka.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        {/* Total Stock Metric */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-black/40 uppercase tracking-wider">Total Available Units</p>
              <h3 className="text-3xl font-black text-forest mt-1">{totalAvailable}</h3>
            </div>
            <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-4">● Ready for immediate dispatch</p>
        </div>

        {/* Reserved Metric */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-black/40 uppercase tracking-wider">Reserved Stock</p>
              <h3 className="text-3xl font-black text-amber-600 mt-1">{totalReserved}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-amber-600 font-medium mt-4">● Locked in active carts & orders</p>
        </div>

        {/* Action Card */}
        <div className="bg-gradient-to-br from-forest to-emerald-900 text-cream rounded-2xl p-6 shadow-md flex flex-col justify-between" style={{ background: 'var(--color-forest)', color: 'var(--color-cream)' }}>
          <div>
            <h3 className="font-bold text-lg">Detailed Inventory Grid</h3>
            <p className="text-xs opacity-75 mt-1">Inspect individual warehouse allocations and low-stock alerts.</p>
          </div>
          <Link to="/inventory" className="mt-4 inline-flex items-center gap-2 bg-white text-forest px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-cream transition w-fit" style={{ color: 'var(--color-forest)', background: 'white', textDecoration: 'none' }}>
            Open Inventory Hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Live Inventory Table */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm mt-6">
        <h3 className="font-bold text-lg mb-4 text-forest">Active Hub Inventory Allocations</h3>
        {loading ? (
          <p className="text-sm text-black/40 py-4 text-center">Loading stock allocations...</p>
        ) : inventory.length === 0 ? (
          <p className="text-sm text-black/40 py-4 text-center">No inventory items found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-xs font-bold text-black/50 uppercase">
                  <th className="py-3 px-4">Product ID (SKU)</th>
                  <th className="py-3 px-4">Warehouse ID</th>
                  <th className="py-3 px-4 text-right">Available Qty</th>
                  <th className="py-3 px-4 text-right">Reserved Qty</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-black/[0.02] transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-black/80">{item.productId?.substring(0, 18)}...</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-black/50">{item.warehouseId?.substring(0, 18)}...</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{item.availableQty ?? item.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-amber-600">{item.reservedQty ?? item.reserved}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        In Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
