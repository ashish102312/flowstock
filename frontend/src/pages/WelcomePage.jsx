import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productsApi, warehouseApi } from '../services/api';
import toast from 'react-hot-toast';
import './WelcomePage.css';

export default function WelcomePage() {
  const { cartItems, setIsCartOpen, addToCart } = useCart();
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
          <Link to="/login">Sign In</Link>
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
          <Link to="/login" className="cart-btn label-text">Sign In</Link>
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

        <img src="/walmart_box.png" alt="Shipping Box" className="floating-image float-img-1 parallax" data-speed="0.05" />
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
            <Link to="/register" className="cta-circle label-text">
              View All
            </Link>
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
                <div key={item.id || item} className="product-card">
                  <img 
                    src={essentialImages[index % essentialImages.length]} 
                    alt={item.name || "Product"} 
                    className="product-img" 
                    style={{padding: '2rem', objectFit: 'contain'}} 
                  />
                  <div className="product-overlay flex flex-col items-center justify-center text-center p-6" style={{ alignContent: 'center' }}>
                    {item.name ? (
                      <h3 className="anton text-2xl text-white mb-2">{item.name}</h3>
                    ) : (
                      <h3 className="anton text-2xl text-white mb-2">
                        {index === 0 ? 'Smart Watch' : index === 1 ? 'Headphones' : 'Smart Speaker'}
                      </h3>
                    )}
                    <p className="text-white/90 text-sm mb-4 max-w-[220px] font-medium leading-relaxed">
                      {essentialDescriptions[index % essentialDescriptions.length]}
                    </p>
                    <button
                      type="button"
                      className="quick-add-btn label-text"
                      onClick={() => handleQuickAdd(item)}
                      disabled={!item.id}
                      style={{ transform: 'none', margin: '0' }}
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container text-forest-override">
          <div className="footer-grid" style={{ marginBottom: '2rem' }}>
            <div className="footer-left">
              <h3 className="newsletter-title anton">STAY CONNECTED</h3>
            </div>
            <div className="footer-right">
              <div className="footer-links label-text">
                <Link to="/inventory">Inventory</Link>
                <Link to="/warehouses">Warehouses</Link>
                <Link to="/orders">Orders</Link>
              </div>
              <div className="footer-links label-text">
                <Link to="/">Instagram</Link>
                <Link to="/">Twitter</Link>
                <Link to="/">Pinterest</Link>
              </div>
            </div>
          </div>
          <div className="footer-grid" style={{ marginBottom: '3rem' }}>
            <div className="footer-left">
              <input type="email" placeholder="ENTER YOUR EMAIL" className="newsletter-input input-forest-override label-text" />
            </div>
          </div>
        </div>

        <div className="footer-green-zone">
          <div className="footer-container">
            <div className="footer-bottom label-text" style={{ borderTop: 'none', paddingTop: '0' }}>
              <span>© 2026 FLOWSTOCK</span>
              <span>TERMS & PRIVACY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
