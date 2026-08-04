import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams, Link } from 'react-router-dom';
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
import OrdersPage from './pages/OrdersPage';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { authApi } from './services/api';
import toast from 'react-hot-toast';
import Footer from './components/Footer';
import './pages/WelcomePage.css';

import AdminPanel from './pages/dashboards/AdminPanel';
import ManagerPanel from './pages/dashboards/ManagerPanel';
import UserPanel from './pages/dashboards/UserPanel';
import { InventoryProvider } from './context/InventoryContext';

function ProtectedRoute({ children }) {
  const { user, setUserFromToken } = useAuth();
  const token = localStorage.getItem('access_token');
  const [isResolving, setIsResolving] = React.useState(!!token && !user);

  useEffect(() => {
    if (token && !user) {
      setIsResolving(true);
      authApi.getProfile()
        .then(({ data }) => {
          setUserFromToken(token, data.data);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_id');
        })
        .finally(() => setIsResolving(false));
    } else {
      setIsResolving(false);
    }
  }, [token, user, setUserFromToken]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isResolving) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('access_token', token);
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
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justify-content: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-olive)', borderTopColor: 'var(--color-forest)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
        <p className="label-text" style={{ marginTop: '1rem', color: 'var(--color-forest)' }}>COMPLETING SIGN IN...</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login');
  };

  if (user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN')) {
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  if (user?.roles?.includes('ROLE_MANAGER') || user?.roles?.includes('MANAGER')) {
    return <ManagerPanel user={user} onLogout={handleLogout} />;
  }

  return <UserPanel user={user} onLogout={handleLogout} />;
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <InventoryProvider>
          <BrowserRouter>
            <Toaster position="top-right" toastOptions={{
              className: 'label-text',
              style: { background: 'var(--color-forest)', color: 'var(--color-cream)', borderRadius: '1rem', padding: '1rem' },
              duration: 4000,
            }} />
            <CartDrawer />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <div style={{ flex: 1 }}>
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
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </InventoryProvider>
      </AuthProvider>
    </CartProvider>
  );
}
