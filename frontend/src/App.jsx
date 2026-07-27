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
import './pages/WelcomePage.css';

import AdminPanel from './pages/dashboards/AdminPanel';
import ManagerPanel from './pages/dashboards/ManagerPanel';
import UserPanel from './pages/dashboards/UserPanel';

function ProtectedRoute({ children }) {
  const { user, setUserFromToken } = useAuth();
  const token = sessionStorage.getItem('access_token');
  const [isResolving, setIsResolving] = React.useState(!!token && !user);

  useEffect(() => {
    if (token && !user) {
      setIsResolving(true);
      authApi.getProfile()
        .then(({ data }) => {
          setUserFromToken(token, data.data);
        })
        .catch(() => {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('user_id');
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
      sessionStorage.setItem('access_token', token);
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
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Navbar */}
      <header className="welcome-header" style={{ position: 'relative', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Link to="/" className="logo">-FLOWSTOCK</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span className="label-text" style={{ opacity: 0.5 }}>{user?.email}</span>
          <button onClick={handleLogout} className="cart-btn label-text" style={{ cursor: 'pointer', border: 'none' }}>
            SIGN OUT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Dynamic Role Dashboard */}
        {user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_SUPER_ADMIN') ? (
          <AdminPanel user={user} />
        ) : user?.roles?.includes('ROLE_MANAGER') ? (
          <ManagerPanel user={user} />
        ) : (
          <UserPanel user={user} />
        )}

        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '3rem',
          boxShadow: '0 25px 50px -12px rgba(1, 71, 46, 0.05)',
          marginTop: '3rem'
        }}>
          <div>
            <h1 className="anton" style={{ fontSize: '2.5rem', color: 'var(--color-forest)', margin: '0 0 0.5rem 0' }}>
              WELCOME BACK, {user?.firstName?.toUpperCase() || 'USER'}!
            </h1>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>You have successfully authenticated to the FlowStock platform.</p>
          </div>

          <div style={{ borderTop: '2px solid var(--color-olive)', marginTop: '2rem', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-olive)' }}>
              <span className="label-text" style={{ opacity: 0.5 }}>FULL NAME</span>
              <span style={{ fontWeight: 'bold' }}>{user?.firstName} {user?.lastName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-olive)' }}>
              <span className="label-text" style={{ opacity: 0.5 }}>EMAIL ADDRESS</span>
              <span style={{ fontWeight: 'bold' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-olive)' }}>
              <span className="label-text" style={{ opacity: 0.5 }}>ROLES</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {user?.roles?.map(role => (
                  <span key={role} className="label-text" style={{ background: 'var(--color-olive)', color: 'var(--color-forest)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="label-text" style={{ opacity: 0.5 }}>EMAIL VERIFIED</span>
              <span style={{ fontWeight: 'bold', color: user?.emailVerified ? 'var(--color-forest)' : '#e65100' }}>
                {user?.emailVerified ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            className: 'label-text',
            style: { background: 'var(--color-forest)', color: 'var(--color-cream)', borderRadius: '1rem', padding: '1rem' },
            duration: 4000,
          }} />
          <CartDrawer />
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
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}
