import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './WelcomePage.css';

export default function WelcomePage() {
  const { cartItems, setIsCartOpen, addToCart } = useCart();

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

  const [products, setProducts] = useState([]);

  useEffect(() => {
    import('../services/api').then(({ productsApi }) => {
      productsApi.getAllProducts().then(res => setProducts(res.data)).catch(console.error);
    });
  }, []);

  const heroText = "FLOWSTOCK".split('');

  return (
    <div className="welcome-page">
      {/* Header */}
      <header className="welcome-header animate-reveal" style={{animationDelay: '0.5s'}}>
        <Link to="/" className="logo">-FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Inventory</Link>
          <Link to="/">Warehouses</Link>
          <Link to="/">Operations</Link>
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

        <img src="/sage_leaves.png" alt="Organic sage leaves" className="floating-image float-img-1 parallax" data-speed="0.05" />
        <img src="/olive_branch.png" alt="Olive branch" className="floating-image float-img-2 parallax" data-speed="0.08" />
        <img src="/matcha_powder.png" alt="Matcha powder" className="floating-image float-img-3 parallax" data-speed="0.03" />

        <div className="hero-bottom animate-reveal" style={{animationDelay: '0.8s'}}>
          <p className="hero-desc">
            An earthy, high-end editorial style combining bold industrial typography with soft organic colors. Streamline stock, movement, and delivery through one dependable workspace.
          </p>
          <div style={{textAlign: 'right'}}>
            <p className="label-text">Origin</p>
            <p className="anton" style={{fontSize: '2rem'}}>NATURE</p>
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
            {(products.length > 0 ? products.slice(0, 3) : [1, 2, 3]).map((item) => (
              <div key={item.id || item} className="product-card">
                <img src="/olive_branch.png" alt={item.name || "Product"} className="product-img" style={{padding: '2rem', objectFit: 'contain'}} />
                <div className="product-overlay flex-col items-center">
                  {item.name && <h3 className="anton text-2xl text-white mb-4 text-center">{item.name}</h3>}
                  <button className="quick-add-btn label-text">Quick Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-left">
              <h3 className="newsletter-title anton">STAY CONNECTED</h3>
              <input type="email" placeholder="ENTER YOUR EMAIL" className="newsletter-input label-text" />
            </div>
            <div className="footer-right">
              <div className="footer-links label-text">
                <Link to="/">Inventory</Link>
                <Link to="/">Warehouses</Link>
                <Link to="/">Operations</Link>
              </div>
              <div className="footer-links label-text">
                <Link to="/">Instagram</Link>
                <Link to="/">Twitter</Link>
                <Link to="/">Pinterest</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom label-text">
            <span>© 2026 FLOWSTOCK</span>
            <span>TERMS & PRIVACY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
