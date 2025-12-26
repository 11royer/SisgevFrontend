import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContextRef';

export const AuthProvider = ({ children }) => {
  // Estados para almacenar el token, el usuario y si el sistema está cargando
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token); // Si hay token, empezamos cargando

  // Función para obtener los datos del usuario desde Laravel
  const cargarUsuario = useCallback(async () => {
    // Si no hay token, no tiene sentido preguntar al servidor
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Petición a la ruta de perfil (asegúrate que en Laravel sea /api/me)
      const res = await api.get('/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error al recuperar usuario:', err);
      // Si el servidor dice que el token no vale (401), cerramos sesión
      if (err.response?.status === 401) logout();
    } finally {
      // Terminamos el estado de carga independientemente del resultado
      setLoading(false);
    }
  }, [token]);

  // Se ejecuta cada vez que el token cambia
  useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  // Función para iniciar sesión
  const login = async ({ credencial, contraseña }) => {
    // Enviamos datos al backend
    const res = await api.post('/login', { credencial, contraseña });
    const nuevoToken = res.data.token;
    
    // Guardamos en LocalStorage y en el estado de React
    localStorage.setItem('token', nuevoToken);
    setToken(nuevoToken);
    return res;
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Proveemos los datos y funciones a toda la aplicación
  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, cargarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;