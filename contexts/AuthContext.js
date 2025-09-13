import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStorage } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedToken = await authStorage.getToken();
      const storedUser = await authStorage.getUser();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, userData) => {
    try {
      await authStorage.saveAuth(token, userData);
      setToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const logout = async () => {
    try {
      await authStorage.clearAuth();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      await authStorage.saveAuth(token, userData);
      setUser(userData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



