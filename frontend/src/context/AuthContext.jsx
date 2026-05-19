import { createContext, useContext, useEffect, useState } from 'react';
import backendAuthService from '../services/backendAuthService';
import { disconnectSocket, initializeSocket } from '../services/socketClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await backendAuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Initialize socket when user is authenticated
          initializeSocket();
        }
      } catch (err) {
        console.error('Error checking current user:', err);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();

    return () => {
      disconnectSocket();
    };
  }, []);

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await backendAuthService.signup(userData);
      if (result.success) {
        setUser(result.user);
        initializeSocket();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await backendAuthService.login(credentials);
      if (result.success) {
        setUser(result.user);
        initializeSocket();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await backendAuthService.logout();
      setUser(null);
      disconnectSocket();
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await backendAuthService.updateProfile(profileData);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
