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
import useAuth from '../auth/UseAuth';
import { hasPermission } from '../utils/hasPermission';

// CONFIGURACIÓN DE ITEMS DEL MENÚ CON PERMISO REQUERIDO
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', permiso: null },
  { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/perfil', permiso: null },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios', permiso: 'ver_usuarios' },
  { text: 'Roles', icon: <SecurityIcon />, path: '/roles', permiso: 'gestionar_roles' },
  { text: 'Bitácora', icon: <AccessTimeIcon />, path: '/bitacora', permiso: 'ver_bitacora' },
  { text: 'Vehículos', icon: <DirectionsCarIcon />, path: '/vehiculos', permiso: 'ver_vehiculos' },
  { text: 'Conductores', icon: <PeopleIcon />, path: '/conductores', permiso: 'ver_conductores' },
  { text: 'Asignaciones', icon: <AssignmentIcon />, path: '/asignaciones', permiso: 'ver_asignaciones' },
  { text: 'Mantenimientos', icon: <BuildIcon />, path: '/mantenimientos', permiso: 'ver_mantenimientos' },
  { text: 'Repuestos', icon: <InventoryIcon />, path: '/repuestos', permiso: 'ver_repuestos' },
  { text: 'Reportes', icon: <BarChartIcon />, path: '/reportes', permiso: 'ver_reportes' },
];

export default function Sidebar({ drawerWidth, mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user: currentUser } = useAuth();

  const isDarkMode = theme.palette.mode === 'dark';

  const itemsPermitidos = menuItems.filter(item => {
    // Si no requiere permiso, siempre visible (Dashboard, Perfil)
    if (!item.permiso) return true;
    // Verificar si el usuario tiene el permiso
    return hasPermission(currentUser, item.permiso);
  });

  const drawer = (
    <div>
      {/* ENCABEZADO DEL SIDEBAR */}
      <Toolbar sx={{
        minHeight: '4rem',
        borderBottom: `0.0625rem solid ${theme.palette.divider}`,
        padding: '1rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '1.25rem' 
      }}>
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

      {/* LISTA DE ITEMS DEL MENÚ - SOLO LOS PERMITIDOS */}
      <List sx={{ pt: '0.5rem' }}>
        {itemsPermitidos.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) {
                    handleDrawerToggle();
                  }
                }}
                sx={{
                  margin: '0 0.75rem',
                  marginBottom: '0.25rem',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1rem',
                  backgroundColor: isActive
                    ? theme.palette.primary.dark
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? theme.palette.primary.dark
                      : isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <ListItemIcon sx={{
                  color: isActive 
                    ? theme.palette.primary.light 
                    : isDarkMode 
                      ? 'rgba(255, 255, 255, 0.6)'
                      : 'rgba(0, 0, 0, 0.54)',
                  minWidth: '2.25rem'
                }}>
                  {item.icon}
                </ListItemIcon>
                
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive 
                      ? (isDarkMode ? '#ffffff' : theme.palette.primary.contrastText) 
                      : isDarkMode 
                        ? 'rgba(255, 255, 255, 0.75)'
                        : 'rgba(0, 0, 0, 0.87)'
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
      {/* VERSIÓN MÓVIL */}
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

      {/* VERSIÓN ESCRITORIO */}
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