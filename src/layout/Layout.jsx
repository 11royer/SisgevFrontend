// src/layout/Layout.jsx
import React, { useState } from 'react';
import { Box, useTheme, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';


// ANCHO FIJO DEL SIDEBAR (240px en rem)
const DRAWER_WIDTH = 240;

export default function Layout({ children }) {
  const theme = useTheme();
  
  
  // ESTADO PARA CONTROLAR SIDEBAR EN MÓVIL
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* BARRA SUPERIOR */}
      <Navbar
        drawerWidth={DRAWER_WIDTH}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* MENÚ LATERAL */}
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* CONTENIDO PRINCIPAL DE LA PÁGINA */}
      <Box
        component="main"
        sx={{
          // FONDO Y DIMENSIONES
          backgroundColor: theme.palette.background.default,
          flexGrow: 1,
          minHeight: '100vh',
          
          // ESPACIADO Y PADDING
          padding: '2rem',
          
          // RESPONSIVE: AJUSTAR ANCHO EN ESCRITORIO
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginLeft: { sm: '0' }
        }}
      >
        {/* ESPACIO PARA LA TOOLBAR FIJA */}
        <Toolbar />
        
        {/* CONTENIDO DINÁMICO DE LAS PÁGINAS */}
        {children}
      </Box>
    </Box>
  );
}