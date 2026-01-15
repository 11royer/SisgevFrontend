// src/layout/Navbar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useTheme,
  IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useAuth from '../auth/UseAuth';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../theme/ThemeContextRef';

export default function Navbar({ drawerWidth, handleDrawerToggle }) {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toggleColorMode } = useThemeContext();

  // ============================================
  // MANEJADOR DE CIERRE DE SESIÓN
  // ============================================
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        // DIMENSIONES RESPONSIVAS
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        marginLeft: { sm: `${drawerWidth}px` },
        
        // COLORES DEL TEMA
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        
        // ELEVACIÓN Y POSICIONAMIENTO
        zIndex: theme.zIndex.drawer + 1,
        height: '4rem',
        
        // SOMBRA Y BORDES
        boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.1)',
        borderBottom: `0.0625rem solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* BOTÓN DE MENÚ PARA MÓVIL */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            marginRight: '1rem',
            display: { sm: 'none' } // OCULTO EN ESCRITORIO
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* TÍTULO DE LA PÁGINA ACTUAL */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        {/* BOTÓN PARA CAMBIAR MODO CLARO/OSCURO */}
        <IconButton
          sx={{ marginLeft: '0.5rem', color: theme.palette.text.primary }}
          onClick={toggleColorMode}
          color="inherit"
          aria-label="toggle light/dark mode"
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* BOTÓN DE CERRAR SESIÓN */}
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: theme.palette.primary.main,
            marginLeft: '0.5rem',
            
            // EFECTO HOVER SUAVE
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }
          }}
          startIcon={<LogoutIcon />}
        >
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}