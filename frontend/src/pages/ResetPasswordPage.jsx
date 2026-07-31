import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import './WelcomePage.css';

const schema = z.object({
  newPassword: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase')
    .regex(/[a-z]/, 'Must include lowercase')
    .regex(/\d/, 'Must include a number')
    .regex(/[@$!%*?&]/, 'Must include a special character'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const Rule = ({ met, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: met ? 'var(--color-forest)' : 'rgba(1, 71, 46, 0.4)', transition: 'color 0.2s' }}>
    <Check size={12} style={{ opacity: met ? 1 : 0.3 }} />
    {label}
  </div>
);

export default function ResetPasswordPage() {
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const pw = watch('newPassword', '');
  const rules = {
    length: pw.length >= 8, upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw), digit: /\d/.test(pw),
    special: /[@$!%*?&]/.test(pw),
  };

  const onSubmit = async (data) => {
    if (!token) { toast.error('Invalid reset link.'); return; }
    setIsLoading(true);
    try {
      await authApi.resetPassword(token, data.newPassword);
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset failed. The link may have expired.');
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
        <Link to="/" className="logo">FLOWSTOCK</Link>
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
          {!done ? (
            <>
              <h2 className="anton" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', textAlign: 'center', color: 'var(--color-forest)' }}>
                SET NEW PASSWORD
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>
                Choose a strong password. You'll be logged in after reset.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="newPassword" className="label-text">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="newPassword"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      {...register('newPassword')}
                      style={{ ...inputStyle(errors.newPassword), paddingRight: '3rem' }}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-forest)' }}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <Rule met={rules.length} label="8+ chars" />
                    <Rule met={rules.upper} label="Uppercase" />
                    <Rule met={rules.lower} label="Lowercase" />
                    <Rule met={rules.digit} label="Number" />
                    <Rule met={rules.special} label="Special" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="confirmPassword" className="label-text">Confirm Password</label>
                  <input id="confirmPassword" type="password" placeholder="Repeat your password" {...register('confirmPassword')} style={inputStyle(errors.confirmPassword)} />
                  {errors.confirmPassword && <p className="label-text" style={{ color: '#e65100', fontSize: '9px' }}>{errors.confirmPassword.message}</p>}
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
                  {isLoading ? <><Loader2 className="animate-spin" size={18} /> RESETTING...</> : 'RESET PASSWORD'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ display: 'inline-flex', background: 'var(--color-sage)', color: 'var(--color-forest)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 className="anton" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-forest)' }}>
                PASSWORD RESET!
              </h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Redirecting you to sign in…</p>
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
