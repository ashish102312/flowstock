import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/WelcomePage.css';
import { toast } from 'react-hot-toast';

export default function InventoryPage() {
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../services/api').then(({ inventoryApi, productsApi, warehouseApi }) => {
      // Fetch low stock items and map their product/warehouse details
      inventoryApi.getLowStock()
        .then(async (res) => {
          const items = res.data;
          
          // Hydrate with names
          const hydrated = await Promise.all(items.map(async (item) => {
            try {
              const [pRes, wRes] = await Promise.all([
                productsApi.getProductById(item.productId),
                warehouseApi.getWarehouseById(item.warehouseId)
              ]);
              return {
                ...item,
                productName: pRes.data.name,
                warehouseName: wRes.data.name
              };
            } catch (e) {
              return { ...item, productName: item.productId, warehouseName: item.warehouseId };
            }
          }));
          
          setLowStock(hydrated);
        })
        .catch(err => {
          console.error(err);
          toast.error("Failed to load inventory data");
        })
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <header className="welcome-header">
        <Link to="/" className="logo">FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Home</Link>
          <Link to="/warehouses">Warehouses</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Link to="/login" className="cart-btn label-text">Sign In</Link>
      </header>

      <section className="hero-header-section">
        <p className="label-text" style={{ marginBottom: '1rem', opacity: 0.6, color: 'var(--color-olive)' }}>
          STOCK ALERTS
        </p>
        <h1 className="anton" style={{ fontSize: '9vw', lineHeight: 0.85, margin: '0 0 1.5rem 0', color: 'var(--color-olive)' }}>
          INVENTORY WATCH
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.8 }}>
          Real-time distributed stock monitor. Prevents overselling across fulfillment hubs using Redis locking.
        </p>
      </section>

      <section className="content-section">
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
                border: '1px solid rgba(1, 71, 46, 0.1)',
                borderRadius: '2rem',
                padding: '2rem',
                boxShadow: '0 15px 30px rgba(1, 71, 46, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--color-forest)'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ background: 'var(--color-olive)', padding: '0.5rem', borderRadius: '1rem', color: 'var(--color-forest)', fontSize: '1.2rem' }}>⚠️</div>
                  <span className="label-text" style={{ fontSize: '9px', background: 'var(--color-forest)', color: 'var(--color-cream)', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>
                    BELOW THRESHOLD
                  </span>
                </div>

                <h3 className="anton" style={{ fontSize: '1.4rem', color: 'var(--color-forest)', margin: '0 0 0.5rem 0' }}>
                  {item.productName}
                </h3>
                <p className="label-text" style={{ fontSize: '10px', opacity: 0.5, marginBottom: '1.5rem' }}>
                  AT {item.warehouseName.toUpperCase()}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fafafa', borderRadius: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.2rem' }}>AVAILABLE</p>
                    <p className="anton" style={{ fontSize: '1.5rem', color: 'var(--color-forest)', margin: 0 }}>{item.availableQty}</p>
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

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-bottom label-text">
            <span>© 2026 FLOWSTOCK</span>
            <span>DISTRIBUTED INVENTORY SERVICE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
