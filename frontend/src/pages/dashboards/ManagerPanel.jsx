import React from 'react';
import { Package, Truck, LayoutDashboard, Settings2, AlertTriangle } from 'lucide-react';

export default function ManagerPanel({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-brand-400 w-6 h-6" /> 
          Warehouse Dashboard
        </h2>
        <p className="text-white/40 mt-1">Manage your warehouse zones, inventory, and active orders.</p>
      </div>

      <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-5 flex items-start gap-4 mt-6">
        <AlertTriangle className="text-brand-400 w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-brand-300">Inventory Service Not Connected</h3>
          <p className="text-sm text-brand-400/80 mt-1">
            The core Inventory and Order microservices have not been provisioned yet. 
            Once deployed, your real-time warehouse data will appear here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Inventory Overview - Empty State */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-64">
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
            <Package className="w-5 h-5 text-white/50" />
            <h3 className="font-semibold text-white/80">Inventory Status</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white/5 p-4 rounded-full mb-3">
              <Settings2 className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/60 font-medium">0 Active Items</p>
            <p className="text-sm text-white/40 mt-1">Configure your first warehouse zone to begin tracking inventory.</p>
            <button disabled className="mt-4 bg-white/10 text-white/40 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
              Add Inventory
            </button>
          </div>
        </div>

        {/* Recent Orders - Empty State */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-64">
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
            <Truck className="w-5 h-5 text-white/50" />
            <h3 className="font-semibold text-white/80">Recent Orders</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-white/60 font-medium">No Orders Found</p>
            <p className="text-sm text-white/40 mt-1">Awaiting order service connection.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
