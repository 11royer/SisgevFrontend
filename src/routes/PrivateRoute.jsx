import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../auth/UseAuth';

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  // 1. Mientras verifica si hay sesión, mostramos un estado de carga.
  // En una tesis, es mejor mostrar un Spinner que una pantalla en blanco (null).
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Cargando sistema...
      </div>
    );
  }

  // 2. Si no hay token, lo mandamos al login.
  // 'state={{ from: location }}' permite que, tras loguearse, el sistema lo devuelva a donde quería ir.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si hay token, renderizamos el componente hijo.
  return children;
}