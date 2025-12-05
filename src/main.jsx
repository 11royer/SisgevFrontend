// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// Importamos el Contexto de Autenticación, sigue siendo necesario
import { AuthProvider } from './auth/AuthContext'; 

// Importamos el nuevo Contexto del Tema
import { ThemeContextProvider } from './theme/ThemeContext'; 

// Importamos el componente principal de rutas
import AppRoutes from './App'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Proveedor del Tema: Maneja el modo oscuro/claro */}
    <ThemeContextProvider> 
      <CssBaseline /> {/* Aplica la normalización de estilos de MUI */}
      
      {/* 2. Proveedor de Autenticación: Maneja el estado del usuario */}
      <AuthProvider> 
        
        {/* 3. Enrutador: Permite la navegación */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        
      </AuthProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
