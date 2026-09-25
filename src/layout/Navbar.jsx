import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useTheme,
  IconButton,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ApartmentIcon from '@mui/icons-material/Apartment';
import useAuth from '../auth/UseAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../theme/ThemeContextRef';

const titulosRutas = {
  '/dashboard': 'Panel Principal',
  '/perfil': 'Mi Perfil',
  '/usuarios': 'Gestión de Usuarios',
  '/roles': 'Seguridad y Roles',
  '/bitacora': 'Bitácora de Sistema',
  '/unidades': 'Gestión de Unidades',
  '/vehiculos': 'Control de Vehículos',
  '/conductores': 'Registro de Conductores',
  '/asignaciones': 'Asignación vehicular',
  '/mantenimientos': 'Mantenimiento Vehicular',
  '/repuestos': 'Inventario de Repuestos',
  '/reportes': 'Reportes y Formularios',
};

export default function Navbar({ drawerWidth, handleDrawerToggle }) {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorMode } = useThemeContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determinar el título de la página actual dinámicamente
  const tituloActual = titulosRutas[location.pathname] || 'SISGEV-P';

  // Determinar si mostrar el chip de unidad
  const mostrarChipUnidad = !!user?.unidad;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        marginLeft: { sm: `${drawerWidth}px` },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer + 1,
        height: '4rem',
        boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.1)',
        borderBottom: `0.0625rem solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ height: '100%' }}>
        {/* BOTÓN DE MENÚ PARA MÓVIL */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            marginRight: '1rem',
            display: { sm: 'none' }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* TÍTULO + CHIP DE UNIDAD */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ fontWeight: 600 }}
          >
            {tituloActual}
          </Typography>

          {/*  Chip con el nombre de la unidad activa */}
          {mostrarChipUnidad && (
            <Tooltip 
              title={`Unidad activa: ${user.unidad.nombre}`}
              arrow
            >
              <Chip
                icon={<ApartmentIcon />}
                label={user.unidad.sigla || user.unidad.nombre}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: { xs: 'none', sm: 'flex' },
                  maxWidth: '200px',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
            </Tooltip>
          )}
        </Box>

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