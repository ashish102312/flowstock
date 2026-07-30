import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/WelcomePage.css';

const SupplierStatusBadge = ({ status }) => {
  const colors = {
    ACTIVE: { bg: '#e9edc9', text: '#01472e' },
    INACTIVE: { bg: '#f5f5f5', text: '#888' },
    BLACKLISTED: { bg: '#fce4ec', text: '#c62828' },
    ON_HOLD: { bg: '#fff3e0', text: '#e65100' },
  };
  const c = colors[status] || colors.ACTIVE;
  return (
    <span className="label-text" style={{
      background: c.bg, color: c.text, padding: '0.25rem 0.75rem',
      borderRadius: '2rem', fontSize: '9px',
    }}>
      {status}
    </span>
  );
};

const OrderStatusBadge = ({ status }) => {
  const colors = {
    DRAFT: { bg: '#f5f5f5', text: '#888' },
    SUBMITTED: { bg: '#e3f2fd', text: '#1565c0' },
    CONFIRMED: { bg: '#e8f5e9', text: '#2e7d32' },
    DISPATCHED: { bg: '#fff3e0', text: '#e65100' },
    RECEIVED: { bg: '#e9edc9', text: '#01472e' },
    CANCELLED: { bg: '#fce4ec', text: '#c62828' },
  };
  const c = colors[status] || colors.DRAFT;
  return (
    <span className="label-text" style={{
      background: c.bg, color: c.text, padding: '0.25rem 0.75rem',
      borderRadius: '2rem', fontSize: '9px',
    }}>
      {status}
    </span>
  );
};

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('suppliers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../services/api').then(({ supplierApi }) => {
      Promise.all([
        supplierApi.getAllSuppliers(),
        supplierApi.getAllPurchaseOrders(),
      ])
        .then(([sRes, poRes]) => {
          setSuppliers(sRes.data);
          setPurchaseOrders(poRes.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Header */}
      <header className="welcome-header">
        <Link to="/" className="logo">-FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Home</Link>
          <Link to="/warehouses">Warehouses</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Link to="/login" className="cart-btn label-text">Sign In</Link>
      </header>

      {/* Hero */}
      <section style={{
        background: 'var(--color-forest)',
        padding: '10rem 4rem 4rem 4rem',
        borderBottomLeftRadius: '5rem',
        borderBottomRightRadius: '5rem',
        textAlign: 'center',
        color: 'var(--color-cream)',
        boxShadow: '0 25px 50px rgba(1,71,46,0.3)',
      }}>
        <p className="label-text" style={{ marginBottom: '1rem', opacity: 0.6 }}>
          SUPPLY CHAIN NETWORK
        </p>
        <h1 className="anton" style={{ fontSize: '10vw', lineHeight: 0.85, margin: '0 0 1.5rem 0', color: 'var(--color-sage)' }}>
          SUPPLIERS
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.7, color: 'var(--color-olive)' }}>
          Manage your supplier network and track purchase orders from submission through delivery.
        </p>

        {/* Tab Switcher */}
        <div style={{ marginTop: '2.5rem', display: 'inline-flex', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '2.5rem', padding: '0.4rem' }}>
          {['suppliers', 'purchase-orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="label-text" style={{
              background: activeTab === tab ? 'var(--color-cream)' : 'transparent',
              color: activeTab === tab ? 'var(--color-forest)' : 'var(--color-sage)',
              border: 'none',
              borderRadius: '2rem',
              padding: '0.6rem 1.5rem',
              cursor: 'pointer',
              fontSize: '10px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              {tab === 'suppliers' ? '🏢 SUPPLIERS' : '📋 PURCHASE ORDERS'}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '5rem 4rem', maxWidth: '1300px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p className="label-text" style={{ opacity: 0.5 }}>LOADING DATA...</p>
          </div>
        ) : activeTab === 'suppliers' ? (
          <>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="anton" style={{ fontSize: '3rem', margin: 0 }}>
                {suppliers.length} SUPPLIER{suppliers.length !== 1 ? 'S' : ''}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {suppliers.map(s => (
                <div key={s.id} style={{
                  background: 'white',
                  borderRadius: '2.5rem',
                  padding: '2rem',
                  boxShadow: '0 15px 35px rgba(1,71,46,0.1)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{
                      background: 'var(--color-forest)',
                      borderRadius: '1rem',
                      width: '50px', height: '50px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem',
                    }}>
                      🤝
                    </div>
                    <SupplierStatusBadge status={s.status} />
                  </div>

                  <h3 className="anton" style={{ fontSize: '1.3rem', margin: '0 0 0.25rem 0', color: 'var(--color-forest)' }}>
                    {s.name}
                  </h3>
                  <p className="label-text" style={{ fontSize: '10px', opacity: 0.5, marginBottom: '1rem' }}>{s.code}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', opacity: 0.7, fontSize: '0.8rem' }}>
                    {s.contactPerson && <p>👤 {s.contactPerson}</p>}
                    {s.email && <p>✉️ {s.email}</p>}
                    {s.city && <p>📍 {s.city}, {s.country}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h2 className="anton" style={{ fontSize: '3rem', margin: 0 }}>
                {purchaseOrders.length} PURCHASE ORDER{purchaseOrders.length !== 1 ? 'S' : ''}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {purchaseOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.4 }}>
                  <p className="label-text">NO PURCHASE ORDERS YET</p>
                </div>
              ) : purchaseOrders.map(po => (
                <div key={po.id} style={{
                  background: 'white',
                  borderRadius: '2rem',
                  padding: '1.5rem 2rem',
                  boxShadow: '0 10px 30px rgba(1,71,46,0.08)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(6px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.25rem' }}>ORDER NO.</p>
                    <p className="anton" style={{ fontSize: '1rem', color: 'var(--color-forest)' }}>{po.orderNumber}</p>
                  </div>
                  <div>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.25rem' }}>SUPPLIER</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{po.supplier?.name}</p>
                  </div>
                  <div>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.25rem' }}>QTY × UNIT</p>
                    <p style={{ fontSize: '0.85rem' }}>{po.quantity} × ₹{po.unitPrice}</p>
                  </div>
                  <div>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.25rem' }}>TOTAL</p>
                    <p className="anton" style={{ color: 'var(--color-forest)', fontSize: '1rem' }}>₹{po.totalAmount}</p>
                  </div>
                  <OrderStatusBadge status={po.status} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-bottom label-text">
            <span>© 2026 FLOWSTOCK</span>
            <span>SUPPLIER MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
