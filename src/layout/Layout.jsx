import React, { useState } from 'react';
import { Box, useTheme, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// ANCHO FIJO DEL SIDEBAR (Mantienes tus 240px o la medida que configures)
const DRAWER_WIDTH = 200;

export default function Layout({ children }) {
  const theme = useTheme();
  
  // ESTADO PARA CONTROLAR SIDEBAR EN MÓVIL
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* BARRA SUPERIOR (Pasando el ancho correcto) */}
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
          padding: { xs: '0.25rem', sm: '0.5rem', md: '0.75rem' },
          
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