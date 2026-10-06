import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, AuthResponse } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<AuthResponse>('/auth/me');
        if (res.data.success && res.data.data) {
          setCurrentUser(res.data.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: any) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    if (res.data.success && res.data.data) {
      localStorage.setItem('token', res.data.data.token!);
      setCurrentUser(res.data.data.user);
      setIsAuthenticated(true);
    }
  };

  const register = async (data: any) => {
    await api.post<AuthResponse>('/auth/register', data);
    // After register, redirect to login is handled in component
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
