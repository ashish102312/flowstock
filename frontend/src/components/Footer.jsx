import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="global-footer">
      <div className="global-footer-container">
        <div className="global-footer-top">
          <div className="global-footer-brand">
            <h2 className="anton logo">FLOWSTOCK</h2>
            <p className="footer-desc">
              Enterprise-grade Supply Chain & Warehouse Management Platform. Modernizing logistics with cutting-edge technology.
            </p>
          </div>
          
          <div className="global-footer-links-group">
            <h3 className="label-text">Platform</h3>
            <Link to="/inventory">Inventory</Link>
            <Link to="/warehouses">Warehouses</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/suppliers">Suppliers</Link>
          </div>

          <div className="global-footer-links-group">
            <h3 className="label-text">Company</h3>
            <Link to="/">About Us</Link>
            <Link to="/">Careers</Link>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                toast((t) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Contact Us:</p>
                    <a href="tel:+917814607949" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500' }}>+91 7814607949</a>
                    <a href="https://www.instagram.com/flowstock.mg?utm_source=qr" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500' }}>Instagram</a>
                  </div>
                ), { duration: 6000 });
              }}
            >
              Contact
            </a>
            <Link to="/">Partners</Link>
          </div>

          <div className="global-footer-newsletter">
            <h3 className="label-text">Stay Updated</h3>
            <div className="newsletter-input-group">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button className="newsletter-btn label-text">→</button>
            </div>
          </div>
        </div>
        
        <div className="global-footer-bottom">
          <p className="label-text copyright">© {new Date().getFullYear()} FLOWSTOCK PLATFORM. ALL RIGHTS RESERVED.</p>
          <div className="global-footer-legal">
            <Link to="/" className="label-text">Privacy Policy</Link>
            <Link to="/" className="label-text">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
