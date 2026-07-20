import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';

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
  <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-green-400' : 'text-white/30'}`}>
    <Check className="w-3 h-3" />
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

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">

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
          {!done ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Set new password</h1>
                <p className="text-white/40 text-sm mt-1.5">
                  Choose a strong password. You'll be logged in after reset.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <label htmlFor="newPassword" className="field-label">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <input id="newPassword" type={showPw ? 'text' : 'password'}
                      autoComplete="new-password" placeholder="Create a strong password"
                      {...register('newPassword')}
                      className={`field-input pl-10 pr-10 ${errors.newPassword ? 'field-input-error' : ''}`} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-1">
                    <Rule met={rules.length} label="8+ characters" />
                    <Rule met={rules.upper}  label="Uppercase" />
                    <Rule met={rules.lower}  label="Lowercase" />
                    <Rule met={rules.digit}  label="Number" />
                    <Rule met={rules.special} label="Special character" />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="field-label">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <input id="confirmPassword" type="password" autoComplete="new-password"
                      placeholder="Repeat your password"
                      {...register('confirmPassword')}
                      className={`field-input pl-10 ${errors.confirmPassword ? 'field-input-error' : ''}`} />
                  </div>
                  {errors.confirmPassword && (
                    <p className="field-error"><AlertCircle className="w-3 h-3" />{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button id="reset-submit-btn" type="submit" disabled={isLoading}
                  className="btn-primary flex items-center justify-center gap-2 mt-2">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Resetting…</> : 'Reset password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full mb-5">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password reset!</h2>
              <p className="text-white/40 text-sm">Redirecting you to sign in…</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/8">
            <Link to="/login"
              className="flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
