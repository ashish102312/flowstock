import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/WelcomePage.css';

const UtilizationBar = ({ percent }) => (
  <div style={{
    background: 'rgba(1,71,46,0.15)',
    borderRadius: '2rem',
    height: '8px',
    width: '100%',
    marginTop: '0.5rem',
    overflow: 'hidden',
  }}>
    <div style={{
      background: percent > 80 ? '#c0392b' : 'var(--color-forest)',
      height: '100%',
      width: `${Math.min(percent, 100)}%`,
      borderRadius: '2rem',
      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
    }} />
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    ACTIVE: { bg: '#e9edc9', text: '#01472e' },
    INACTIVE: { bg: '#f5f5f5', text: '#888' },
    UNDER_MAINTENANCE: { bg: '#fff3e0', text: '#e65100' },
    FULL: { bg: '#fce4ec', text: '#c62828' },
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

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    import('../services/api').then(({ warehouseApi }) => {
      warehouseApi.getAllWarehouses()
        .then(res => setWarehouses(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, []);

  const filtered = warehouses.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Header */}
      <header className="welcome-header">
        <Link to="/" className="logo">FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Home</Link>
          <Link to="/warehouses">Warehouses</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Link to="/login" className="cart-btn label-text">Sign In</Link>
      </header>

      {/* Hero Banner */}
      <section className="hero-header-section">
        <p className="label-text" style={{ marginBottom: '1rem', opacity: 0.7 }}>
          WAREHOUSE NETWORK
        </p>
        <h1 className="anton" style={{ fontSize: '10vw', lineHeight: 0.85, margin: '0 0 1.5rem 0' }}>
          WAREHOUSES
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.8 }}>
          Real-time overview of all active fulfillment hubs, capacity utilization, and geographic distribution.
        </p>
        <input
          type="text"
          placeholder="SEARCH BY NAME OR CITY..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="label-text"
          style={{
            marginTop: '2rem',
            background: 'rgba(255,255,255,0.6)',
            border: 'none',
            borderRadius: '2.5rem',
            padding: '1rem 2rem',
            width: '100%',
            maxWidth: '400px',
            outline: 'none',
            color: 'var(--color-forest)',
            fontSize: '11px',
          }}
        />
      </section>

      {/* Content */}
      <section className="content-section">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p className="label-text" style={{ opacity: 0.5 }}>LOADING WAREHOUSES...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p className="label-text" style={{ opacity: 0.5 }}>NO WAREHOUSES FOUND</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}>
            {filtered.map(wh => (
              <div key={wh.id} style={{
                background: 'white',
                borderRadius: '2.5rem',
                padding: '2rem',
                boxShadow: '0 20px 40px rgba(1,71,46,0.1)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(1,71,46,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(1,71,46,0.1)';
                }}
              >
                {/* Cover Image */}
                <div style={{
                  height: '160px',
                  margin: '-2rem -2rem 1.5rem -2rem',
                  borderTopLeftRadius: '2.5rem',
                  borderTopRightRadius: '2.5rem',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={`/warehouse_${((wh.id.charCodeAt(wh.id.length - 1) || 0) % 3) + 1}.png`} 
                    alt="Warehouse" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <StatusBadge status={wh.status} />
                  </div>
                </div>

                {/* Name & Code */}
                <h3 className="anton" style={{ fontSize: '1.4rem', margin: '0 0 0.25rem 0', color: 'var(--color-forest)' }}>
                  {wh.name}
                </h3>
                <p className="label-text" style={{ fontSize: '10px', opacity: 0.5, marginBottom: '1rem' }}>{wh.code}</p>

                {/* Location */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-forest)', opacity: 0.8, marginBottom: '0.25rem', fontWeight: 'bold' }}>
                    📍 {wh.city}, {wh.state} {wh.postalCode || wh.postal_code || ''}
                  </p>
                  <p className="label-text" style={{ fontSize: '9px', opacity: 0.6, display: 'flex', gap: '0.5rem' }}>
                    <span>LAT: {wh.latitude?.toFixed(4) || 'N/A'}</span>
                    <span>LNG: {wh.longitude?.toFixed(4) || 'N/A'}</span>
                  </p>
                </div>

                {/* Capabilities / Raw Data */}
                <div style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--color-moss)', paddingLeft: '0.75rem' }}>
                  <p className="label-text" style={{ fontSize: '9px', opacity: 0.6, marginBottom: '0.25rem' }}>RAW DATA / SERVICES PROVIDED</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-forest)', opacity: 0.9, lineHeight: '1.5' }}>
                    {wh.description || 'Standard Fulfillment Operations'}
                  </p>
                </div>

                {/* Capacity */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="label-text" style={{ fontSize: '10px', opacity: 0.6 }}>CAPACITY UTILIZATION</span>
                    <span className="label-text" style={{ fontSize: '10px', color: 'var(--color-forest)', fontWeight: 'bold' }}>
                      {wh.utilizationPercent}%
                    </span>
                  </div>
                  <UtilizationBar percent={wh.utilizationPercent} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', opacity: 0.6 }}>
                    <span style={{ fontSize: '0.75rem' }}>{wh.usedCapacity?.toLocaleString()} used</span>
                    <span style={{ fontSize: '0.75rem' }}>{wh.totalCapacity?.toLocaleString()} total</span>
                  </div>
                </div>

                {/* Available */}
                <div style={{
                  marginTop: '1.5rem',
                  background: 'var(--color-olive)',
                  borderRadius: '1rem',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span className="label-text" style={{ fontSize: '10px' }}>AVAILABLE SLOTS</span>
                  <span className="anton" style={{ fontSize: '1.2rem', color: 'var(--color-forest)' }}>
                    {wh.availableCapacity?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-bottom label-text">
            <span>© 2026 FLOWSTOCK</span>
            <span>WAREHOUSE MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
