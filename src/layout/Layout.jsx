// src/layout/Layout.jsx
import React, { useState } from 'react';
import { Box, useTheme, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 240;

export default function Layout({ children }) {
  const theme = useTheme();
  // Estado para manejar la apertura/cierre en móvil
  const [mobileOpen, setMobileOpen] = useState(false); 

  const handleDrawerToggle = () => {
    // Función para alternar el estado (abrir/cerrar)
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* 1. NAVBAR (Pasa la función de toggle) */}
      <Navbar 
        drawerWidth={DRAWER_WIDTH} 
        handleDrawerToggle={handleDrawerToggle} // Permite abrir la Sidebar desde la Navbar
      />

      {/* 2. SIDEBAR (Pasa el estado y la función de toggle) */}
      <Sidebar 
        drawerWidth={DRAWER_WIDTH} 
        mobileOpen={mobileOpen} // Pasa el estado actual
        handleDrawerToggle={handleDrawerToggle} // Permite cerrar la Sidebar al seleccionar una opción
      />

      {/* 3. CONTENIDO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          backgroundColor: theme.palette.background.default, 
          flexGrow: 1,
          p: '2rem',
          minHeight: '100vh',
          // Margen y ancho solo en escritorio (sm y superior)
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, 
          marginLeft: { sm: `0` }
        }}
      >
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  );
}