import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  roles: string[];
  profilePictureUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserFromToken: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      const { accessToken, user: userData } = data.data;
      sessionStorage.setItem('access_token', accessToken);
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
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const setUserFromToken = useCallback((token: string, userData: User) => {
    sessionStorage.setItem('access_token', token);
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
