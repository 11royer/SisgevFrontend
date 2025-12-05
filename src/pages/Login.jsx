// src/pages/Login.jsx
import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import LoginForm from '../components/LoginForm';
import ShieldIcon from '../icons/ShieldIcon';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme(); 

  const handleLogin = async (creds) => {
    await login(creds);
    navigate('/dashboard');
  };

  // Opacidades más suaves para el fondo degradado
  const primaryDarkRgbaStart = theme.palette.mode === 'dark' ? 'rgba(10, 10, 30, 0.85)' : 'rgba(10, 10, 30, 0.85)';
  const primaryDarkRgbaEnd = theme.palette.mode === 'dark' ? 'rgba(2, 6, 23, 0.75)' : 'rgba(2, 6, 23, 0.75)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        // FONDO SUAVE
        background:
          `linear-gradient(135deg, ${primaryDarkRgbaStart}, ${primaryDarkRgbaEnd}), url('/img/elegant-bg.jpg')`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: '1rem', 
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: { xs: '92%', sm: 420, md: 420 },
          borderRadius: '1rem', 
          p: { xs: '1.5rem', md: '2rem' }, 

          // GLASSMORPHISM SUAVE DEL CONTENEDOR PRINCIPAL
          background: 'rgba(255,255,255,0.04)', // Opacidad reducida
          backdropFilter: 'blur(0.625rem)',
          border: '0.0625rem solid rgba(255,255,255,0.10)',
          boxShadow: '0 0.625rem 2.1875rem rgba(0,0,0,0.30)',

          textAlign: 'center'
        }}
      >
        <Box sx={{ mb: '1rem', display: 'flex', justifyContent: 'center' }}>
          {/* Icono usa color principal del tema */}
          <ShieldIcon size={90} color={theme.palette.primary.main} /> 
        </Box>

        {/* Título usa text.primary (blanco en modo oscuro) */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: '0.5rem', color: theme.palette.text.primary }}>
          SISGEV-P
        </Typography>

        {/*Subtítulo usa text.secondary (gris claro) */}
        <Typography variant="body2" sx={{ mb: '1.5rem', color: theme.palette.text.secondary }}>
          Sistema de Gestión de la Flota Vehicular — Policía Boliviana
        </Typography>

        <Box
          sx={{
            display: 'inline-block',
            width: "100%",
            p: '1rem',
            borderRadius: '0.5rem',

            // FORM CONTAINER SUAVE
            backgroundColor: theme.palette.mode === 'light'
                ? 'rgba(255,255,255,0.20)'
                : 'rgba(20,20,20,0.20)',

            backdropFilter: 'blur(0.25rem)',
            border: "0.0625rem solid rgba(255,255,255,0.1)"
          }}
        >
          <LoginForm onSubmit={handleLogin} />
        </Box>
      </Paper>
    </Box>
  );
}