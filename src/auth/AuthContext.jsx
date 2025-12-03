// src/auth/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'light');

  useEffect(() => {
    if (token) {
      setLoading(true);
      api.get('/me')
        .then(res => {
          setUser(res.data.user || res.data.usuario || res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const login = async ({ credencial, contraseña }) => {
    const res = await api.post('/login', { credencial, contraseña });
    const t = res.data.token || res.data.token_plain || res.data.access_token;
    if (!t) throw new Error('No se recibió token');
    localStorage.setItem('token', t);
    setToken(t);
    const usuario = res.data.usuario || res.data.user || res.data;
    setUser(usuario);
    return res;
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch (e) { /* ignore */ }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    localStorage.setItem('themeMode', next);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, themeMode, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};
