import { createContext, useState, useEffect } from 'react';
import api from '../services/api';











export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
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

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    if (res.data.success && res.data.data) {
      localStorage.setItem('token', res.data.data.token);
      setCurrentUser(res.data.data.user);
      setIsAuthenticated(true);
    }
  };

  const register = async (data) => {
    await api.post('/auth/register', data);
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
    </AuthContext.Provider>);

};