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
import MenuIcon from '@mui/icons-material/Menu'; // Icono de Menú
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useAuth from '../auth/UseAuth';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../theme/ThemeContext'; 

// Recibe handleDrawerToggle
export default function Navbar({ drawerWidth, handleDrawerToggle }) { 
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toggleColorMode } = useThemeContext(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: theme.palette.background.paper, 
        color: theme.palette.text.primary, 
        zIndex: theme.zIndex.drawer + 1, 
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider || 'rgba(255, 255, 255, 0.12)'}`,
      }}
    >
      <Toolbar>
        
        {/* Icono de Menú (visible solo en móvil) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle} // Llama al toggle
          sx={{ 
            mr: '1rem', 
            display: { sm: 'none' } // Oculto en escritorio
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        
        {/* Switch de modo oscuro/claro */}
        <IconButton 
            sx={{ ml: 1, color: theme.palette.text.primary }} 
            onClick={toggleColorMode} 
            color="inherit"
            aria-label="toggle light/dark mode"
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* Botón de Logout */}
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: theme.palette.primary.main, 
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