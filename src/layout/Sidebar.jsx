import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EscudoMiniatura from '../assets/escudo.webp';

// CONFIGURACIÓN DE ITEMS DEL MENÚ (Se mantiene intacto)
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/perfil' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios' },
  { text: 'Roles', icon: <SecurityIcon />, path: '/roles' },
  { text: 'Bitácora', icon: <AccessTimeIcon />, path: '/bitacora' },
  { text: 'Vehículos', icon: <DirectionsCarIcon />, path: '/vehiculos' },
  { text: 'Conductores', icon: <PeopleIcon />, path: '/conductores' },
  { text: 'Asignaciones', icon: <AssignmentIcon />, path: '/asignaciones' },
  { text: 'Mantenimientos', icon: <BuildIcon />, path: '/mantenimientos' },
  { text: 'Repuestos', icon: <InventoryIcon />, path: '/repuestos' },
  { text: 'Reportes', icon: <BarChartIcon />, path: '/reportes' },
];

export default function Sidebar({ drawerWidth, mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Detectamos si el modo actual es oscuro (luna) o claro (sol)
  const isDarkMode = theme.palette.mode === 'dark';

  // CONTENIDO PRINCIPAL DEL DRAWER
  const drawer = (
    <div>
      {/* ENCABEZADO DEL SIDEBAR CON ESCUDO INCORPORADO */}
      <Toolbar sx={{
        minHeight: '4rem',
        borderBottom: `0.0625rem solid ${theme.palette.divider}`,
        padding: '1rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '1.25rem' 
      }}>
        {/* Componente de Imagen para el Escudo de la Policía */}
        <Box
          component="img"
          src={EscudoMiniatura}
          alt="Escudo Policía"
          sx={{
            height: '34px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        <Typography variant="h6" sx={{
          marginLeft: '0.75rem', 
          fontWeight: 800,
          color: theme.palette.primary.main,
          fontSize: '1.125rem',
          letterSpacing: '0.5px'
        }}>
          SISGEV-P
        </Typography>
      </Toolbar>

      {/* LISTA DE ITEMS DEL MENÚ */}
      <List sx={{ pt: '0.5rem' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  // CERRAR SIDEBAR EN MÓVIL AL SELECCIONAR
                  if (mobileOpen) {
                    handleDrawerToggle();
                  }
                }}
                sx={{
                  // ESPACIADO Y MÁRGENES
                  margin: '0 0.75rem',
                  marginBottom: '0.25rem',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1rem',
                  
                  // COLOR SEGÚN ACTIVO/INACTIVO
                  backgroundColor: isActive
                    ? theme.palette.primary.dark
                    : 'transparent',
                  
                  // EFECTO HOVER ADAPTADO POR MODO
                  '&:hover': {
                    backgroundColor: isActive
                      ? theme.palette.primary.dark
                      : isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' // Modo Oscuro: hover claro sutil
                        : 'rgba(0, 0, 0, 0.04)',     // Modo Claro: hover oscuro sutil
                  }
                }}
              >
                {/* ICONO DEL ITEM - Contraste Dinámico según Sol/Luna */}
                <ListItemIcon sx={{
                  color: isActive 
                    ? theme.palette.primary.light 
                    : isDarkMode 
                      ? 'rgba(255, 255, 255, 0.6)'  // Modo Oscuro: Blanco traslúcido
                      : 'rgba(0, 0, 0, 0.54)',      // Modo Claro: Gris oscuro/negro legible
                  minWidth: '2.25rem'
                }}>
                  {item.icon}
                </ListItemIcon>
                
                {/* TEXTO DEL ITEM - Contraste Dinámico según Sol/Luna */}
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive 
                      ? (isDarkMode ? '#ffffff' : theme.palette.primary.contrastText) 
                      : isDarkMode 
                        ? 'rgba(255, 255, 255, 0.75)' // Modo Oscuro: Texto blanco legible
                        : 'rgba(0, 0, 0, 0.87)'       // Modo Claro: Texto oscuro de alto contraste
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* VERSIÓN MÓVIL - TEMPORAL */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* VERSIÓN ESCRITORIO - PERMANENTE */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `0.0625rem solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}