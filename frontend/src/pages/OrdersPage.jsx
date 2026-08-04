import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/WelcomePage.css';
import { orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderStatusBadge = ({ status }) => {
  const colors = {
    PENDING: { bg: '#f5f5f5', text: '#888' },
    INVENTORY_RESERVED: { bg: '#e3f2fd', text: '#1565c0' },
    CONFIRMED: { bg: '#e8f5e9', text: '#2e7d32' },
    PAYMENT_FAILED: { bg: '#fff3e0', text: '#e65100' },
    CANCELLED_NO_INVENTORY: { bg: '#fce4ec', text: '#c62828' },
    SHIPPED: { bg: '#e9edc9', text: '#01472e' },
    DELIVERED: { bg: '#ccd5ae', text: '#01472e' },
  };
  const c = colors[status] || colors.PENDING;
  return (
    <span className="label-text" style={{
      background: c.bg, color: c.text, padding: '0.25rem 0.75rem',
      borderRadius: '2rem', fontSize: '9px',
    }}>
      {status}
    </span>
  );
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
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
          <Link to="/orders">My Orders</Link>
        </nav>
        {isAuthenticated ? (
          <Link to="/dashboard" className="cart-btn label-text">Dashboard</Link>
        ) : (
          <Link to="/login" className="cart-btn label-text">Sign In</Link>
        )}
      </header>

      <section style={{
        background: 'var(--color-sage)',
        padding: '10rem 4rem 4rem 4rem',
        borderBottomLeftRadius: '5rem',
        borderBottomRightRadius: '5rem',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(1,71,46,0.2)',
      }}>
        <p className="label-text" style={{ marginBottom: '1rem', opacity: 0.7, color: 'var(--color-forest)' }}>
          ORDER HISTORY
        </p>
        <h1 className="anton" style={{ fontSize: '8vw', lineHeight: 0.85, margin: '0 0 1.5rem 0', color: 'var(--color-forest)' }}>
          MY ORDERS
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.8, color: 'var(--color-forest)' }}>
          Track your purchases, view saga orchestration states, and monitor order fulfillment.
        </p>
      </section>

      <section style={{ padding: '5rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}><p className="label-text">LOADING ORDERS...</p></div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            <p className="label-text">NO ORDERS FOUND</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{
                background: 'white',
                borderRadius: '2rem',
                padding: '2rem',
                boxShadow: '0 15px 30px rgba(1,71,46,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginBottom: '0.25rem' }}>ORDER ID</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>{order.id}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '0.5rem' }}><OrderStatusBadge status={order.status} /></div>
                    <span className="label-text" style={{ fontSize: '9px', opacity: 0.5 }}>PAYMENT: {order.paymentStatus}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ background: 'var(--color-sage)', color: 'var(--color-forest)', width: '40px', height: '40px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="anton" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-forest)' }}>{item.productName}</p>
                          <p className="label-text" style={{ margin: 0, fontSize: '9px', opacity: 0.5 }}>FROM: {item.warehouseId}</p>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>₹{item.totalPrice}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <div>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, margin: 0 }}>SHIPPED TO</p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{order.shippingAddress}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, margin: 0 }}>TOTAL AMOUNT</p>
                    <p className="anton" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-forest)' }}>₹{order.totalAmount}</p>
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
