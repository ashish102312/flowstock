import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '../services/api';
import './WelcomePage.css';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch {
      // Always show success to prevent email enumeration
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (error) => ({
    width: '100%',
    padding: '1rem',
    borderRadius: '1.5rem',
    border: `2px solid ${error ? '#e65100' : 'var(--color-olive)'}`,
    background: 'var(--color-cream)',
    color: 'var(--color-forest)',
    outline: 'none',
    fontSize: '0.9rem'
  });

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
          padding: '3rem',
          borderRadius: '3rem',
          boxShadow: '0 25px 50px -12px rgba(1, 71, 46, 0.2)',
          width: '100%',
          maxWidth: '500px'
        }}>
          {!sent ? (
            <>
              <h2 className="anton" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', textAlign: 'center', color: 'var(--color-forest)' }}>
                RESET PASSWORD
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>
                Enter your email and we'll send you a reset link valid for 15 minutes.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="email" className="label-text">Email Address</label>
                  <input id="email" type="email" placeholder="you@company.com" {...register('email')} style={inputStyle(errors.email)} />
                  {errors.email && <p className="label-text" style={{ color: '#e65100', fontSize: '9px' }}>{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: 'var(--color-forest)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '2rem',
                    marginTop: '1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isLoading ? <><Loader2 className="animate-spin" size={18} /> SENDING...</> : 'SEND RESET LINK'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ display: 'inline-flex', background: 'var(--color-sage)', color: 'var(--color-forest)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 className="anton" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-forest)' }}>
                CHECK YOUR INBOX
              </h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: '1.5' }}>
                If <span style={{ fontWeight: 'bold' }}>{getValues('email')}</span> is registered, a reset link has been sent. Check your spam folder too.
              </p>
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(1, 71, 46, 0.1)', marginTop: '2rem', paddingTop: '2rem', textAlign: 'center' }}>
            <Link to="/login" style={{ color: 'var(--color-forest)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>
              BACK TO SIGN IN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
