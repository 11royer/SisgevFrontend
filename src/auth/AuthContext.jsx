import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContextRef';

export const AuthProvider = ({ children }) => {
  // Estados para almacenar el token, el usuario y si el sistema está cargando
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  // Función para obtener los datos del usuario desde Laravel
  const cargarUsuario = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/me');
      
      // OBTENER DATOS DEL USUARIO
      const userData = res.data.data || res.data;
      
      // GUARDAR USUARIO CON PERMISOS Y UNIDAD A NIVEL RAIZ
      setUser({
        ...userData,
        permisos: userData.rol?.permisos || [],
        unidad: userData.unidad || null,
        unidad_id: userData.unidad_id || null,
      });
      
    } catch (err) {
      console.error('Error al recuperar usuario:', err);
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  // Función para iniciar sesión
  const login = async ({ credencial, contraseña }) => {
    const res = await api.post('/login', { credencial, contraseña });
    const nuevoToken = res.data.token;
    
    localStorage.setItem('token', nuevoToken);
    setToken(nuevoToken);
    
    // Si el login devuelve el usuario con permisos, lo guardamos
    if (res.data.usuario) {
      const userData = res.data.usuario;
      setUser({
        ...userData,
        permisos: userData.rol?.permisos || [],
        unidad: userData.unidad || null,
        unidad_id: userData.unidad_id || null,
      });
    }
    
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const esAdministrador = useCallback(() => {
    return user?.rol?.nombre === 'Administrador';
  }, [user]);

  const tieneUnidad = useCallback(() => {
    return !!user?.unidad_id;
  }, [user]);

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        loading, 
        login, 
        logout, 
        cargarUsuario,
        esAdministrador,
        tieneUnidad,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;