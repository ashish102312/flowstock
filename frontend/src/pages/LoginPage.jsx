import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-brand-950 flex">
      {/* ── Left Panel — Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 border-r border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">FlowStock</span>
        </div>

        <div className="space-y-8 animate-slide-up">
          <div>
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Enterprise Platform
            </p>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Supply Chain,
              <br />
              <span className="text-brand-400">Reimagined.</span>
            </h1>
            <p className="mt-5 text-white/50 text-lg leading-relaxed max-w-sm">
              Cloud-native warehouse management built for the speed of modern e-commerce.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Warehouses', value: '500+' },
              { label: 'Orders/day', value: '2M+' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Countries', value: '18' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-white/40 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} FlowStock Technologies. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">FlowStock</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white">Sign in</h2>
            <p className="text-white/40 mt-2 text-sm">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="field-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...register('email')}
                  className={`field-input pl-10 ${errors.email ? 'field-input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="field-error">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="field-label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`field-input pl-10 pr-10 ${errors.password ? 'field-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-7">
            <span>or continue with</span>
          </div>

          {/* Google OAuth2 */}
          <button
            id="google-login-btn"
            type="button"
            onClick={handleGoogleLogin}
            className="btn-ghost flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Register link */}
          <p className="text-center text-white/40 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
