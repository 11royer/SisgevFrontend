// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// IMPORTACIONES DE CONTEXTOS
import ThemeProvider from './theme/ThemeContext';
import AuthProvider from './auth/AuthContext'; 
import AppRoutes from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. El Tema envuelve todo para que los colores existan desde el inicio */}
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* AuthProvider va dentro del tema para que si hay alertas en el login tengan estilo */}
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);