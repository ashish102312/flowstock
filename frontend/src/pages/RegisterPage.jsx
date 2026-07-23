import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, Check, Building2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';

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
  <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-green-400' : 'text-white/30'}`}>
    <Check className={`w-3 h-3 ${met ? 'opacity-100' : 'opacity-30'}`} />
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
    defaultValues: {
      role: 'USER'
    }
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
      });
      toast.success('Account created! Check your email to verify.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-slide-up">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">FlowStock</span>
        </div>

        <div className="auth-card p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-white/40 text-sm mt-1.5">Get started with FlowStock in minutes.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="field-label">First name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input id="firstName" type="text" placeholder="Ashish"
                    {...register('firstName')}
                    className={`field-input pl-10 ${errors.firstName ? 'field-input-error' : ''}`} />
                </div>
                {errors.firstName && <p className="field-error"><AlertCircle className="w-3 h-3" />{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="field-label">Last name</label>
                <input id="lastName" type="text" placeholder="Bhardwaj"
                  {...register('lastName')}
                  className={`field-input ${errors.lastName ? 'field-input-error' : ''}`} />
                {errors.lastName && <p className="field-error"><AlertCircle className="w-3 h-3" />{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Role Cards */}
            <div>
              <label className="field-label mb-3 block">Account Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Standard User */}
                <div 
                  role="button"
                  tabIndex={0}
                  onClick={() => setValue('role', 'USER', { shouldValidate: true })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setValue('role', 'USER', { shouldValidate: true }); } }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent ${
                    selectedRole === 'USER' 
                    ? 'bg-brand-500/20 border-brand-500 ring-1 ring-brand-500' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <User className={`w-6 h-6 mb-2 ${selectedRole === 'USER' ? 'text-brand-400' : 'text-white/40'}`} />
                  <h3 className="font-semibold text-sm text-white">Standard User</h3>
                  <p className="text-xs text-white/50 mt-1">Basic access profile</p>
                </div>

                {/* Warehouse Owner */}
                <div 
                  role="button"
                  tabIndex={0}
                  onClick={() => setValue('role', 'MANAGER', { shouldValidate: true })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setValue('role', 'MANAGER', { shouldValidate: true }); } }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent ${
                    selectedRole === 'MANAGER' 
                    ? 'bg-brand-500/20 border-brand-500 ring-1 ring-brand-500' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mb-2 ${selectedRole === 'MANAGER' ? 'text-brand-400' : 'text-white/40'}`} />
                  <h3 className="font-semibold text-sm text-white">Warehouse</h3>
                  <p className="text-xs text-white/50 mt-1">Manage inventory</p>
                </div>

                {/* Administrator */}
                <div 
                  role="button"
                  tabIndex={0}
                  onClick={() => setValue('role', 'ADMIN', { shouldValidate: true })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setValue('role', 'ADMIN', { shouldValidate: true }); } }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent ${
                    selectedRole === 'ADMIN' 
                    ? 'bg-red-500/20 border-red-500 ring-1 ring-red-500' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Shield className={`w-6 h-6 mb-2 ${selectedRole === 'ADMIN' ? 'text-red-400' : 'text-white/40'}`} />
                  <h3 className="font-semibold text-sm text-white">Administrator</h3>
                  <p className="text-xs text-white/50 mt-1">Full system access</p>
                </div>
              </div>
              <input type="hidden" {...register('role')} />
              {errors.role && <p className="field-error mt-2"><AlertCircle className="w-3 h-3" />{errors.role.message}</p>}
            </div>

            {/* Admin Secret Code (Conditionally Rendered) */}
            {(selectedRole === 'ADMIN' || selectedRole === 'MANAGER') && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="adminSecret" className="field-label flex items-center justify-between">
                  <span>Secret Registration Code</span>
                  <span className="text-[10px] text-brand-400 uppercase tracking-wider font-bold bg-brand-500/10 px-2 py-0.5 rounded">Required for role</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400/50 pointer-events-none" />
                  <input id="adminSecret" type="text" placeholder="Enter authorization code"
                    {...register('adminSecret')}
                    className="field-input pl-10 border-brand-500/30 focus:border-brand-500" />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="field-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input id="email" type="email" autoComplete="email" placeholder="you@company.com"
                  {...register('email')}
                  className={`field-input pl-10 ${errors.email ? 'field-input-error' : ''}`} />
              </div>
              {errors.email && <p className="field-error"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input id="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="Create a strong password"
                  {...register('password')}
                  className={`field-input pl-10 pr-10 ${errors.password ? 'field-input-error' : ''}`} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength rules */}
              <div className="mt-2.5 grid grid-cols-2 gap-1">
                <PasswordRule met={rules.length}  label="8+ characters" />
                <PasswordRule met={rules.upper}   label="Uppercase letter" />
                <PasswordRule met={rules.lower}   label="Lowercase letter" />
                <PasswordRule met={rules.digit}   label="Number" />
                <PasswordRule met={rules.special} label="Special character" />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="field-label">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input id="confirmPassword" type="password" autoComplete="new-password"
                  placeholder="Repeat your password"
                  {...register('confirmPassword')}
                  className={`field-input pl-10 ${errors.confirmPassword ? 'field-input-error' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="field-error"><AlertCircle className="w-3 h-3" />{errors.confirmPassword.message}</p>}
            </div>

            <button id="register-btn" type="submit" disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2 mt-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</> : 'Create account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
