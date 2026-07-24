import React from 'react';
import { Package, Truck, LayoutDashboard, Settings2, AlertTriangle } from 'lucide-react';

export default function ManagerPanel({ user }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 className="anton" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-forest)', margin: 0 }}>
          <div style={{ background: 'var(--color-sage)', padding: '0.5rem', borderRadius: '1rem', display: 'flex' }}>
            <LayoutDashboard style={{ color: 'var(--color-forest)' }} />
          </div>
          WAREHOUSE DASHBOARD
        </h2>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Manage your warehouse zones, inventory, and active orders.</p>
      </div>

      <div style={{ background: '#ffe0b2', border: '2px solid #ffccbc', borderRadius: '2rem', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#e65100' }}>
        <AlertTriangle size={24} style={{ marginTop: '0.25rem' }} />
        <div>
          <h3 className="anton" style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>INVENTORY SERVICE NOT CONNECTED</h3>
          <p style={{ opacity: 0.8, fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            The core Inventory and Order microservices have not been provisioned yet. 
            Once deployed, your real-time warehouse data will appear here.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Inventory Overview - Empty State */}
        <div style={{ background: 'white', border: '2px solid var(--color-olive)', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
          <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--color-olive)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-cream)' }}>
            <Package style={{ color: 'var(--color-forest)' }} />
            <h3 className="anton" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-forest)' }}>INVENTORY STATUS</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-cream)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <Settings2 size={32} style={{ color: 'var(--color-moss)' }} />
            </div>
            <p className="anton" style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: 'var(--color-forest)' }}>0 ACTIVE ITEMS</p>
            <p className="label-text" style={{ opacity: 0.5, margin: 0, marginBottom: '1.5rem', lineHeight: 1.5 }}>CONFIGURE YOUR FIRST WAREHOUSE ZONE TO BEGIN TRACKING INVENTORY.</p>
            <button disabled style={{ background: 'var(--color-olive)', color: 'var(--color-forest)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '2rem', fontWeight: 'bold', cursor: 'not-allowed', opacity: 0.5 }}>
              ADD INVENTORY
            </button>
          </div>
        </div>

        {/* Recent Orders - Empty State */}
        <div style={{ background: 'white', border: '2px solid var(--color-olive)', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
          <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--color-olive)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-cream)' }}>
            <Truck style={{ color: 'var(--color-forest)' }} />
            <h3 className="anton" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-forest)' }}>RECENT ORDERS</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <p className="anton" style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: 'var(--color-forest)', opacity: 0.5 }}>NO ORDERS FOUND</p>
            <p className="label-text" style={{ opacity: 0.4, margin: 0 }}>AWAITING ORDER SERVICE CONNECTION.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
