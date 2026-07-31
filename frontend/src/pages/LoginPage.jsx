import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './WelcomePage.css';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    }
  };

  const handleGoogleLogin = () => {
    const authBase = import.meta.env.VITE_AUTH_URL || 'http://localhost:8081';
    window.location.href = `${authBase}/oauth2/authorization/google`;
  };

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Header */}
      <header className="welcome-header">
        <Link to="/" className="logo">FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Inventory</Link>
          <Link to="/">Warehouses</Link>
          <Link to="/">Operations</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Link to="/register" className="cart-btn label-text">Register</Link>
      </header>

      {/* Main Content */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '10rem 2rem 4rem 2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '4rem',
          borderRadius: '3rem',
          boxShadow: '0 25px 50px -12px rgba(1, 71, 46, 0.2)',
          width: '100%',
          maxWidth: '500px'
        }}>
          <h2 className="anton" style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', textAlign: 'center', color: 'var(--color-forest)' }}>
            SIGN IN
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '3rem', opacity: 0.6, fontSize: '0.9rem' }}>
            Welcome back to your workspace.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" className="label-text">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register('email')}
                style={{
                  padding: '1rem',
                  borderRadius: '1.5rem',
                  border: `2px solid ${errors.email ? '#e65100' : 'var(--color-olive)'}`,
                  background: 'var(--color-cream)',
                  color: 'var(--color-forest)',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
              {errors.email && (
                <p className="label-text" style={{ color: '#e65100', fontSize: '9px', marginTop: '0.2rem' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password" className="label-text">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-moss)', textDecoration: 'none' }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 1rem',
                    borderRadius: '1.5rem',
                    border: `2px solid ${errors.password ? '#e65100' : 'var(--color-olive)'}`,
                    background: 'var(--color-cream)',
                    color: 'var(--color-forest)',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-forest)',
                    opacity: 0.5
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="label-text" style={{ color: '#e65100', fontSize: '9px', marginTop: '0.2rem' }}>
                  {errors.password.message}
                </p>
              )}
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
                gap: '0.5rem',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLoading ? <><Loader2 className="animate-spin" size={18} /> SIGNING IN...</> : 'SIGN IN'}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '2rem 0',
            opacity: 0.3
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-forest)' }} />
            <span className="label-text">OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-forest)' }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              background: 'white',
              color: 'var(--color-forest)',
              border: '2px solid var(--color-olive)',
              padding: '1rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--color-olive)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.6 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-forest)', fontWeight: 'bold', textDecoration: 'none' }}>
              Create account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
