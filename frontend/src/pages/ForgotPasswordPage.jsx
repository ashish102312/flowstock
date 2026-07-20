import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../services/api';

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

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">WareFlow</span>
        </div>

        <div className="auth-card p-8 md:p-10">
          {!sent ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Reset your password</h1>
                <p className="text-white/40 text-sm mt-1.5">
                  Enter your email and we'll send you a reset link valid for 15 minutes.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <label htmlFor="email" className="field-label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <input id="email" type="email" autoComplete="email"
                      placeholder="you@company.com"
                      {...register('email')}
                      className={`field-input pl-10 ${errors.email ? 'field-input-error' : ''}`} />
                  </div>
                  {errors.email && (
                    <p className="field-error"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>
                  )}
                </div>

                <button id="forgot-submit-btn" type="submit" disabled={isLoading}
                  className="btn-primary flex items-center justify-center gap-2">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : 'Send reset link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full mb-5">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                If <span className="text-white/70">{getValues('email')}</span> is registered, a reset link has been sent. Check your spam folder too.
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/8">
            <Link to="/login"
              className="flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
