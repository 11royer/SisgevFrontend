// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" replace />;
}
