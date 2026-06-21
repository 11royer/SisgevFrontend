import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import LoginForm from '../components/LoginForm';
import useAuth from '../auth/UseAuth';
import { useNavigate } from 'react-router-dom';

// 1. Importación física del escudo optimizado en formato WebP desde tus assets
import EscudoPolicia from '../assets/escudo.webp';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (creds) => {
    await login(creds);
    navigate('/dashboard');
  };

  // Fondo degradado con opacidad según modo
  const backgroundGradient = mode => 
    mode === 'dark' 
      ? 'rgba(10, 10, 30, 0.85), rgba(2, 6, 23, 0.75)'
      : 'rgba(10, 10, 30, 0.85), rgba(2, 6, 23, 0.75)';

  return (
    <Box
      sx={{
        // CONFIGURACIÓN DEL CONTENEDOR PRINCIPAL
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
        // FONDO CON GRADIENTE Y IMAGEN
        background: `linear-gradient(135deg, ${backgroundGradient(theme.palette.mode)}), 
                     url('/img/elegant-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '1rem',
      }}
    >
      {/* TARJETA PRINCIPAL DEL LOGIN */}
      <Paper
        elevation={12}
        sx={{
          // RESPONSIVE: 92% en móvil, 26.25rem (420px) en desktop
          width: { xs: '92%', sm: '26.25rem', md: '26.25rem' },
          
          // BORDES REDONDEADOS Y ESPACIADO
          borderRadius: '1rem',
          padding: { xs: '1.5rem', md: '2rem' },
          
          // EFECTO GLASSMORPHISM MEJORADO
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(0.625rem)',
          border: '0.0625rem solid rgba(255,255,255,0.10)',
          boxShadow: '0 0.625rem 2.1875rem rgba(0,0,0,0.30)',
          
          // ALINEACIÓN CENTRAL
          textAlign: 'center'
        }}
      >
        {/* LOGO PRINCIPAL: Reemplazado por la etiqueta de imagen optimizada */}
        <Box sx={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={EscudoPolicia}
            alt="Escudo Institucional de la Policía Boliviana"
            sx={{
              width: '95px',
              height: '120px',          // Un alto mayor que el ancho para crear el óvalo
              borderRadius: '120px / 150px', // Radio elíptico (horizontal / vertical) estilo ovoide
              objectFit: 'contain',     // Mantiene la proporción del escudo intacta dentro del óvalo
              backgroundColor: 'rgba(0, 0, 0, 0.20)', // Fondo oscuro translúcido que acompaña tu tema elegante
              padding: '8px',           // Espaciado interno protector
    
              filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.35))',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
        />
        </Box>

        {/* TÍTULO DEL SISTEMA */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            marginBottom: '0.5rem',
            color: theme.palette.text.primary 
          }}
        >
          SISGEV-P
        </Typography>
        
        {/* SUBTÍTULO DESCRIPTIVO */}
        <Typography 
          variant="body2" 
          sx={{ 
            marginBottom: '1.5rem', 
            color: 'text.secondary' 
          }}
        >
          Sistema de Gestión de la Flota Vehicular Policial
        </Typography>

        {/* CONTENEDOR DEL FORMULARIO */}
        <Box
          sx={{
            display: 'inline-block',
            width: '100%',
            padding: '1rem',
            borderRadius: '0.5rem',
            
            // FONDO SEMITRANSPARENTE SEGÚN MODO
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(255,255,255,0.20)' 
              : 'rgba(20,20,20,0.20)',
            
            // EFECTO GLASS LIGERO
            backdropFilter: 'blur(0.25rem)',
            border: '0.0625rem solid rgba(255,255,255,0.1)'
          }}
        >
          {/* FORMULARIO DE LOGIN */}
          <LoginForm onSubmit={handleLogin} />
        </Box>
      </Paper>
    </Box>
  );
}