import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '../services/api';
import './WelcomePage.css';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }

    authApi.verifyEmail(token)
      .then(() => { setStatus('success'); setMessage('Your email has been verified!'); })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed. The link may have expired.');
      });
  }, [searchParams]);

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <header className="welcome-header">
        <Link to="/" className="logo">-FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Inventory</Link>
          <Link to="/">Warehouses</Link>
          <Link to="/">Operations</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Link to="/login" className="cart-btn label-text">Sign In</Link>
      </header>

      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '8rem 2rem 4rem 2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '4rem',
          borderRadius: '3rem',
          boxShadow: '0 25px 50px -12px rgba(1, 71, 46, 0.2)',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          {status === 'loading' && (
            <div style={{ padding: '2rem 0' }}>
              <Loader2 className="animate-spin" size={48} style={{ color: 'var(--color-forest)', margin: '0 auto 1.5rem auto' }} />
              <h2 className="anton" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-forest)' }}>
                VERIFYING...
              </h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Please wait while we confirm your email.</p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ padding: '2rem 0' }}>
              <div style={{ display: 'inline-flex', background: 'var(--color-sage)', color: 'var(--color-forest)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={48} />
              </div>
              <h2 className="anton" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-forest)' }}>
                EMAIL VERIFIED
              </h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>{message}</p>
              <Link to="/login" style={{
                display: 'inline-block',
                background: 'var(--color-forest)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '2rem',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}>
                SIGN IN
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div style={{ padding: '2rem 0' }}>
              <div style={{ display: 'inline-flex', background: '#ffe0b2', color: '#e65100', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <XCircle size={48} />
              </div>
              <h2 className="anton" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-forest)' }}>
                VERIFICATION FAILED
              </h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>{message}</p>
              <Link to="/login" style={{
                display: 'inline-block',
                background: 'var(--color-olive)',
                color: 'var(--color-forest)',
                padding: '1rem 2rem',
                borderRadius: '2rem',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}>
                BACK TO SIGN IN
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
