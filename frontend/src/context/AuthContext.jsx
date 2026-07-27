import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      const { accessToken, user: userData } = data.data;
      sessionStorage.setItem('access_token', accessToken);
      if (userData?.id) sessionStorage.setItem('user_id', userData.id);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // ignore errors — still clear local state
    } finally {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user_id');
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const setUserFromToken = useCallback((token, userData) => {
    sessionStorage.setItem('access_token', token);
    if (userData?.id) sessionStorage.setItem('user_id', userData.id);
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      setUserFromToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
