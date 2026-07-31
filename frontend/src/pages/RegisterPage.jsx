import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import './WelcomePage.css';

const schema = z.object({
  firstName: z.string().min(2, 'At least 2 characters').max(100),
  lastName: z.string().min(2, 'At least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/\d/, 'Must include a number')
    .regex(/[@$!%*?&]/, 'Must include a special character (@$!%*?&)'),
  confirmPassword: z.string(),
  role: z.enum(['USER', 'MANAGER', 'ADMIN']),
  adminSecret: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const PasswordRule = ({ met, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: met ? 'var(--color-forest)' : 'rgba(1, 71, 46, 0.4)', transition: 'color 0.2s' }}>
    <Check size={12} style={{ opacity: met ? 1 : 0.3 }} />
    {label}
  </div>
);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { role: 'USER' }
  });

  const selectedRole = watch('role');
  const pw = watch('password', '');
  const rules = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    special: /[@$!%*?&]/.test(pw),
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        adminSecret: data.adminSecret
      });
      toast.success('Account created! Check your email to verify.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed.');
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
          maxWidth: '600px'
        }}>
          <h2 className="anton" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', textAlign: 'center', color: 'var(--color-forest)' }}>
            CREATE ACCOUNT
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>
            Get started with FlowStock in minutes.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="firstName" className="label-text">First Name</label>
                <input id="firstName" placeholder="First Name" {...register('firstName')} style={inputStyle(errors.firstName)} />
                {errors.firstName && <p className="label-text" style={{ color: '#e65100', fontSize: '9px' }}>{errors.firstName.message}</p>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="lastName" className="label-text">Last Name</label>
                <input id="lastName" placeholder="Last Name" {...register('lastName')} style={inputStyle(errors.lastName)} />
                {errors.lastName && <p className="label-text" style={{ color: '#e65100', fontSize: '9px' }}>{errors.lastName.message}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="label-text">Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['USER', 'MANAGER', 'ADMIN'].map(role => (
                  <div key={role}
                    onClick={() => setValue('role', role, { shouldValidate: true })}
                    style={{
                      border: `2px solid ${selectedRole === role ? 'var(--color-forest)' : 'var(--color-olive)'}`,
                      background: selectedRole === role ? 'var(--color-olive)' : 'white',
                      padding: '1rem 0.5rem',
                      borderRadius: '1.5rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span className="label-text" style={{ color: 'var(--color-forest)' }}>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {(selectedRole === 'ADMIN' || selectedRole === 'MANAGER') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="adminSecret" className="label-text">Secret Code (Required)</label>
                <input id="adminSecret" placeholder="Enter authorization code" {...register('adminSecret')} style={inputStyle(errors.adminSecret)} />
                {errors.adminSecret && <p className="label-text" style={{ color: '#e65100', fontSize: '9px' }}>{errors.adminSecret.message}</p>}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" className="label-text">Email Address</label>
              <input id="email" type="email" placeholder="you@company.com" {...register('email')} style={inputStyle(errors.email)} />
              {errors.email && <p className="label-text" style={{ color: '#e65100', fontSize: '9px' }}>{errors.email.message}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="password" className="label-text">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  {...register('password')}
                  style={{ ...inputStyle(errors.password), paddingRight: '3rem' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-forest)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginTop: '0.25rem' }}>
                <PasswordRule met={rules.length} label="8+ chars" />
                <PasswordRule met={rules.upper} label="Uppercase" />
                <PasswordRule met={rules.lower} label="Lowercase" />
                <PasswordRule met={rules.digit} label="Number" />
                <PasswordRule met={rules.special} label="Special" />
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
              {isLoading ? <><Loader2 className="animate-spin" size={18} /> CREATING...</> : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.6 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-forest)', fontWeight: 'bold', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
