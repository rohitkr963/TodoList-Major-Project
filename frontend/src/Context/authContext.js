import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import server from '../enviroment';

const AuthContext = createContext();

const BACKEND_URL = `${server}`;

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    axios.defaults.baseURL = BACKEND_URL;
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) return;
      try {
        const res = await axios.get('/api/auth/user');
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (err) {
        console.error("Auth check error:", err.response?.data?.msg || err.message);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, [token]);

  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      throw new Error(err?.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      throw new Error(err?.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
