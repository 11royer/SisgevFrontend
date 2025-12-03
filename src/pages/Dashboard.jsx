// src/pages/Dashboard.jsx
import React from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Switch } from '@mui/material';
import useAuth from '../auth/useAuth';
import { DashboardIcon } from '../icons';

export default function Dashboard() {
  const { user, logout, themeMode, toggleTheme } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            {/* menu icon placeholder */}
            <DashboardIcon size={22} color="#fff" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>SISGEV-P</Typography>
          <Typography sx={{ mr: 2 }}>{user?.nombre_completo || user?.nombre || ''}</Typography>
          <Switch checked={themeMode === 'dark'} onChange={toggleTheme} color="default" />
          <Typography sx={{ mr: 2 }}>{themeMode === 'dark' ? 'Oscuro' : 'Claro'}</Typography>
          <IconButton color="inherit" onClick={logout}>Salir</IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Bienvenido{user ? `, ${user.nombre_completo || user.nombre}` : ''}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Panel base — aquí se colocarán indicadores y accesos a módulos.</Typography>
      </Box>
    </Box>
  );
}
