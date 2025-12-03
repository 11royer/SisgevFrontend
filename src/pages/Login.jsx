// src/pages/Login.jsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LoginForm from '../components/LoginForm';
import ShieldIcon from '../icons/ShieldIcon';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (creds) => {
    await login(creds);
    navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(42,177,91,0.06), rgba(42,177,91,0.01))', p: 2 }}>
      <Paper elevation={10} sx={{ width: { xs: '95%', sm: 760 }, borderRadius: 3, py: { xs: 3, md: 6 }, px: { xs: 2, md: 6 } }}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <ShieldIcon size={110} color="var(--shield-color, #2ab15b)" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>SISGEV-P</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Sistema de Gestión de la Flota Vehicular — Policía Boliviana</Typography>
          <Box sx={{ display: 'inline-block', minWidth: 360, maxWidth: '100%', p: 2, borderRadius: 2, backdropFilter: 'blur(6px)', backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.72)' : 'rgba(20,20,20,0.48)' }}>
            <LoginForm onSubmit={handleLogin} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
