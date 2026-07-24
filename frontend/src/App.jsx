import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import WarehousePage from './pages/WarehousePage';
import SupplierPage from './pages/SupplierPage';
import InventoryPage from './pages/InventoryPage';
import { authApi } from './services/api';
import toast from 'react-hot-toast';

import AdminPanel from './pages/dashboards/AdminPanel';
import ManagerPanel from './pages/dashboards/ManagerPanel';
import UserPanel from './pages/dashboards/UserPanel';

// ── Protected Route wrapper ──────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, user, setUserFromToken } = useAuth();
  const token = sessionStorage.getItem('access_token');

  // Try to load user profile if token exists but no user in state
  useEffect(() => {
    if (token && !user) {
      authApi.getProfile()
        .then(({ data }) => {
          setUserFromToken(token, data.data);
        })
        .catch(() => {
          sessionStorage.removeItem('access_token');
        });
    }
  }, [token, user, setUserFromToken]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// ── OAuth2 Callback Handler ──────────────────────────────────────────────────
function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      sessionStorage.setItem('access_token', token);
      // Fetch user profile to populate state
      authApi.getProfile()
        .then(({ data }) => {
          setUserFromToken(token, data.data);
          toast.success('Signed in with Google!');
          navigate('/dashboard');
        })
        .catch(() => {
          toast.error('OAuth2 authentication failed');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setUserFromToken]);

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-white/60">Completing sign in…</p>
      </div>
    </div>
  );
}

// ── Dashboard Component ──────────────────────────────────────────────────────
function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-brand-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">FlowStock</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg text-sm transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full flex flex-col justify-start animate-slide-up mt-8">
        
        {/* Dynamic Role Dashboard */}
        {user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_SUPER_ADMIN') ? (
          <AdminPanel user={user} />
        ) : user?.roles?.includes('ROLE_MANAGER') ? (
          <ManagerPanel user={user} />
        ) : (
          <UserPanel user={user} />
        )}

        <div className="auth-card p-10 space-y-6 mt-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}!</h1>
            <p className="text-white/40 mt-1">You have successfully authenticated to the FlowStock platform.</p>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4 text-sm text-white/70">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="font-semibold text-white/50">Full Name</span>
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="font-semibold text-white/50">Email Address</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="font-semibold text-white/50">Roles</span>
              <span className="flex gap-1">
                {user?.roles?.map(role => (
                  <span key={role} className="bg-brand-500/20 text-brand-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {role}
                  </span>
                ))}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-white/50">Email Verified</span>
              <span className={user?.emailVerified ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {user?.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Main App Routes ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/warehouses" element={<WarehousePage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        className: 'bg-brand-900 border border-white/10 text-white text-sm rounded-xl',
        duration: 4000,
      }} />
    </AuthProvider>
  );
}
