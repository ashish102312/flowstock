import React from 'react';
import { Link } from 'react-router-dom';
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
            <Link to="/">Contact</Link>
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
