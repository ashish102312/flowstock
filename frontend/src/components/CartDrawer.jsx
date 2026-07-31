import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      const payload = {
        shippingAddress: "123 Main St, Tech City, IN 110001",
        notes: "Standard delivery",
        items: cartItems.map(item => ({
          productId: item.productId,
          warehouseId: item.warehouseId,
          quantity: item.quantity
        }))
      };
      await orderApi.placeOrder(payload);
      toast.success("Order Placed Successfully!");
      clearCart();
      setIsCartOpen(false);
      navigate('/orders');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Checkout failed: Out of stock or inventory issue.");
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        onClick={() => setIsCartOpen(false)}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
        background: 'var(--color-cream)', zIndex: 1000,
        boxShadow: '-10px 0 30px rgba(1,71,46,0.1)',
        display: 'flex', flexDirection: 'column',
        transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(1,71,46,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="anton" style={{ margin: 0, color: 'var(--color-forest)', fontSize: '1.5rem' }}>YOUR CART</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-forest)' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {cartItems.length === 0 ? (
            <p className="label-text" style={{ textAlign: 'center', opacity: 0.5 }}>CART IS EMPTY</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(1,71,46,0.05)' }}>
                  <div style={{ flex: 1 }}>
                    <p className="anton" style={{ margin: 0, color: 'var(--color-forest)', fontSize: '1.1rem' }}>{item.name}</p>
                    <p className="label-text" style={{ fontSize: '9px', opacity: 0.5, marginTop: '0.2rem' }}>FROM: {item.warehouseId}</p>
                    <p style={{ color: 'var(--color-forest)', margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>₹{item.price}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.productId, item.warehouseId, item.quantity - 1)} style={{ background: 'var(--color-sage)', border: 'none', width: '24px', height: '24px', borderRadius: '12px', cursor: 'pointer', color: 'var(--color-forest)' }}>-</button>
                    <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.warehouseId, item.quantity + 1)} style={{ background: 'var(--color-sage)', border: 'none', width: '24px', height: '24px', borderRadius: '12px', cursor: 'pointer', color: 'var(--color-forest)' }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId, item.warehouseId)} style={{ background: 'none', border: 'none', color: '#d84315', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '2rem', borderTop: '1px solid rgba(1,71,46,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span className="label-text">TOTAL ESTIMATE</span>
            <span className="anton" style={{ fontSize: '1.5rem', color: 'var(--color-forest)' }}>₹{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="cart-btn" 
            style={{ width: '100%', justifyContent: 'center', background: cartItems.length === 0 ? 'rgba(1,71,46,0.1)' : 'var(--color-forest)', color: cartItems.length === 0 ? 'rgba(1,71,46,0.5)' : 'white' }}
          >
            {cartItems.length === 0 ? 'CART EMPTY' : 'SECURE CHECKOUT'}
          </button>
          <p className="label-text" style={{ textAlign: 'center', fontSize: '9px', opacity: 0.5, marginTop: '1rem' }}>
            SAGA-ORCHESTRATED DISTRIBUTED CHECKOUT
          </p>
        </div>
      </div>
    </>
  );
}
