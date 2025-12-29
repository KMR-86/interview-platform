import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure Axios base URL (adjust if your backend port differs)
  const api = axios.create({
    baseURL: 'https://bug-free-space-doodle-75gjxg6g54r2xxq7-8000.app.github.dev/', 
    withCredentials: true, // IMPORTANT: Needed for session/cookies
  });

  // 1. Fetch User on App Load (Persist Login)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If a token exists in localStorage, apply it to axios headers so
        // the /api/auth/user/ call can be authenticated.
        const token = localStorage.getItem('access_token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Token ${token}`;
        }

        const { data } = await api.get('/api/auth/user/');
        setUser(data); // "data" now includes { interviewer_status: '...' }
      } catch (error) {
        console.log("Not logged in");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      // Login endpoint (dj-rest-auth standard)
      const res = await api.post('/api/auth/login/', { email, password });
      
      // IMPORTANT: The login response usually contains the 'key' (token).
      // We need to fetch the user details immediately after to get the Roles/Status.
      // Alternatively, if your login response already includes user data, set it here.
      
      // Let's fetch the full user object to be safe and consistent
      const userRes = await api.get('/api/auth/user/');
      setUser(userRes.data);
      
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { 
        success: false, 
        error: error.response?.data?.non_field_errors?.[0] || "Login failed" 
      };
    }
  };

  // 3. Logout Function
  const logout = async () => {
    const getCookie = (name) => {
      const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
      return match ? decodeURIComponent(match.split('=')[1]) : null;
    };

    try {
      const token = localStorage.getItem('access_token');

      if (token) {
        // If we have a token, include it explicitly (token auth path)
        await api.post('/api/auth/logout/', null, {
          headers: { Authorization: `Token ${token}` }
        });
      } else {
        // Session logout: include CSRF token header
        const csrf = getCookie('csrftoken') || getCookie('csrf');
        await api.post('/api/auth/logout/', null, {
          headers: csrf ? { 'X-CSRFToken': csrf } : {}
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Always clear local client state
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      // Redirect back to public homepage after logout
      try { window.location.href = '/'; } catch (e) {}
    }
  };

  // 5. Refresh current user state from backend
  const refreshUser = async () => {
    try {
      const { data } = await api.get('/api/auth/user/');
      setUser(data);
      return data;
    } catch (error) {
      console.error('Failed to refresh user', error);
      setUser(null);
      return null;
    }
  };

  // 4. Signup Function (Optional helper)
  const signup = async (userData) => {
    // userData = { email, password, username, ... }
    return api.post('/api/auth/registration/', userData);
  };

  // Helper to set token (used by external login flows) and refresh user state
  const setAuthToken = async (token) => {
    try {
      if (!token) return null;
      localStorage.setItem('access_token', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      const { data } = await api.get('/api/auth/user/');
      setUser(data);
      return data;
    } catch (error) {
      console.error('Failed to set auth token', error);
      return null;
    }
  };

  const value = {
    user,           // Contains: { id, is_interviewer, interviewer_status, ... }
    isLoading,
    login,
    logout,
    signup,
    setAuthToken,
    refreshUser,
    api             // Export axios instance for other components to use
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);