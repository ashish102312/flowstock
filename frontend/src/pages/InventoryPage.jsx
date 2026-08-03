import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../pages/WelcomePage.css';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

export default function InventoryPage() {
  const { user } = useAuth();
  const { inventory, loading } = useInventory();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const displayName = user?.firstName || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'Manager');

  // Filter the global inventory state down to just low stock items (< 50)
  const lowStock = inventory.filter(item => (item.availableQty ?? item.quantity ?? 0) < 50);

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <header className="welcome-header light-mode">
        <Link to="/" className="logo">FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Home</Link>
          <Link to="/warehouses">Warehouses</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div className="cart-btn label-text" style={{ background: 'transparent', color: 'var(--color-forest)', border: 'none' }}>
          {displayName.toUpperCase()}
        </div>
      </header>

      <section style={{
        background: 'var(--color-forest)',
        padding: '10rem 4rem 4rem 4rem',
        borderBottomLeftRadius: '5rem',
        borderBottomRightRadius: '5rem',
        textAlign: 'center',
        color: 'var(--color-cream)',
        boxShadow: '0 25px 50px rgba(1,71,46,0.3)',
      }}>
        <p className="label-text" style={{ marginBottom: '1rem', opacity: 0.6, color: '#e65100' }}>
          RESTRICTED ACCESS • ZONE ASSIGNED TO {displayName.toUpperCase()}
        </p>
        <h1 className="anton" style={{ fontSize: '9vw', lineHeight: 0.85, margin: '0 0 1.5rem 0', color: 'var(--color-olive)' }}>
          INVENTORY WATCH
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.8 }}>
          Real-time distributed stock monitor dynamically filtered for your manager profile. Prevents overselling across fulfillment hubs.
        </p>
      </section>

      <section style={{ padding: '5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="anton" style={{ fontSize: '3rem', margin: 0, color: 'var(--color-forest)' }}>
            LOW STOCK ({lowStock.length})
          </h2>
        </div>

        {loading ? (
           <div style={{ textAlign: 'center', padding: '4rem' }}><p className="label-text">LOADING...</p></div>
        ) : lowStock.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
             <p className="label-text">ALL INVENTORY LEVELS HEALTHY</p>
           </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {lowStock.map(item => (
              <div key={item.id} style={{
                background: 'white',
                border: '2px solid #ffccbc',
                borderRadius: '2rem',
                padding: '2rem',
                boxShadow: '0 15px 30px rgba(230, 81, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#e65100'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ background: '#fff3e0', padding: '0.5rem', borderRadius: '1rem', color: '#e65100' }}>⚠️</div>
                  <span className="label-text" style={{ fontSize: '9px', background: '#ffe0b2', color: '#e65100', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>
                    BELOW THRESHOLD
                  </span>
                </div>

                <h3 className="anton" style={{ fontSize: '1.4rem', color: 'var(--color-forest)', margin: '0 0 0.5rem 0' }}>
                  {item.productName || item.name}
                </h3>
                <p className="label-text" style={{ fontSize: '10px', opacity: 0.5, marginBottom: '1.5rem' }}>
                  AT {(item.warehouseName || item.warehouseId || '').toUpperCase()}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fafafa', borderRadius: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.2rem' }}>AVAILABLE</p>
                    <p className="anton" style={{ fontSize: '1.5rem', color: '#d84315', margin: 0 }}>{item.availableQty}</p>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: '#eee' }} />
                  <div style={{ textAlign: 'center' }}>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.2rem' }}>THRESHOLD</p>
                    <p className="anton" style={{ fontSize: '1.2rem', color: 'var(--color-forest)', margin: 0 }}>{item.lowStockThreshold}</p>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: '#eee' }} />
                  <div style={{ textAlign: 'center' }}>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.2rem' }}>RESERVED</p>
                    <p className="anton" style={{ fontSize: '1.2rem', color: 'var(--color-sage)', margin: 0 }}>{item.reservedQty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


    </div>
  );
}
