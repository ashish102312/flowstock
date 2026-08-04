import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsApi, warehouseApi } from '../services/api';
import toast from 'react-hot-toast';
import './WelcomePage.css';
import AboutSection from '../components/AboutSection';

export default function WelcomePage() {
  const { cartItems, setIsCartOpen, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [defaultWarehouseId, setDefaultWarehouseId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach((el) => {
        const speed = el.dataset.speed || 0.05;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });

      const logoEl = document.querySelector('.welcome-header .logo');
      if (logoEl) {
        if (scrolled > 50) {
          logoEl.style.opacity = '0';
          logoEl.style.pointerEvents = 'none';
        } else {
          logoEl.style.opacity = '1';
          logoEl.style.pointerEvents = 'auto';
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    productsApi.getAllProducts()
      .then(res => setProducts(res.data))
      .catch(console.error);

    warehouseApi.getAvailable()
      .then(res => {
        if (res.data?.length > 0) setDefaultWarehouseId(res.data[0].id);
      })
      .catch(console.error);
  }, []);

  const handleQuickAdd = (product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }
    if (!product?.id) return;
    if (!defaultWarehouseId) {
      toast.error('No warehouse available for fulfillment');
      return;
    }
    addToCart(product, defaultWarehouseId);
    toast.success(`${product.name} added to cart`);
  };

  const heroText = "FLOWSTOCK".split('');

  return (
    <div className="welcome-page">
      {/* Header */}
      <header className="welcome-header animate-reveal" style={{animationDelay: '0.5s'}}>
        <Link to="/" className="logo">FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/inventory">Inventory</Link>
          <Link to="/warehouses">Warehouses</Link>
          <Link to="/orders">Orders</Link>
        </nav>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', position: 'relative' }}
          >
            🛒
            {cartItems.length > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-10px', background: 'var(--color-olive)', color: 'var(--color-forest)', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartItems.length}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <Link to="/dashboard" className="cart-btn label-text">Dashboard</Link>
          ) : (
            <Link to="/login" className="cart-btn label-text">Sign In</Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title anton">
          {heroText.map((letter, index) => (
            <span 
              key={index} 
              className="hero-letter" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <img src="/walmart_cart.png" alt="Shopping Cart" className="floating-image float-img-2 parallax" data-speed="0.08" />
        <img src="/barcode_scanner.png" alt="Barcode Scanner" className="floating-image float-img-3 parallax" data-speed="0.03" />

        <div className="hero-bottom animate-reveal" style={{animationDelay: '0.8s'}}>
          <p className="hero-desc">
            A high-end retail supply chain platform combining bold industrial typography with dependable logistics. Streamline stock, movement, and delivery for massive retail hubs in one workspace.
          </p>
          <div style={{textAlign: 'right'}}>
            <p className="label-text">Scale</p>
            <p className="anton" style={{fontSize: '2rem'}}>RETAIL</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="feature-section">
        <div className="feature-container">
          <div className="feature-header">
            <h2 className="feature-title anton">ESSENTIALS</h2>
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} 
              className="cta-circle label-text" 
              style={{ flexShrink: 0, border: 'none', cursor: 'pointer' }}
            >
              About
            </button>
          </div>
          <div className="product-grid">
            {(products.length > 0 ? products.slice(0, 3) : [1, 2, 3]).map((item, index) => {
              const essentialImages = ['/smartwatch.png', '/headphones.png', '/smartspeaker.png'];
              const essentialDescriptions = [
                'Track your active lifestyle with high-precision health monitoring.',
                'Immerse yourself in pure sound with hybrid noise-canceling technology.',
                'Voice-controlled, rich 360-degree acoustic performance for any room.'
              ];
              return (
                <div key={item.id || item} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#a9bfa8' }}>
                    <img 
                      src={essentialImages[index % essentialImages.length]} 
                      alt={item.name || "Product"} 
                      className="product-img" 
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
                    />
                    <div className="product-overlay">
                      <button
                        type="button"
                        className="quick-add-btn label-text"
                        onClick={() => handleQuickAdd(item)}
                        disabled={!item.id}
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem 2rem', backgroundColor: 'var(--color-cream)', borderTop: '2px solid var(--color-olive)', textAlign: 'left' }}>
                    <h3 className="anton text-xl mb-1 tracking-wide" style={{ color: 'var(--color-forest)', margin: '0 0 0.5rem 0' }}>
                      {item.name || (index === 0 ? 'SMART WATCH' : index === 1 ? 'HEADPHONES' : 'SMART SPEAKER')}
                    </h3>
                    <p style={{ color: 'var(--color-forest)', opacity: 0.8, fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
                      {essentialDescriptions[index % essentialDescriptions.length]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AboutSection />
    </div>
  );
}
