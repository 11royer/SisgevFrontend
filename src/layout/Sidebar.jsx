// src/layout/Sidebar.jsx
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
import SecurityIcon from '@mui/icons-material/Security'; // ✅ AGREGADO
import InventoryIcon from '@mui/icons-material/Inventory'; // Para repuestos
import AssignmentIcon from '@mui/icons-material/Assignment'; // Para asignaciones

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

  const drawer = (
    <div>
      <Toolbar sx={{
        color: theme.palette.text.primary,
        p: '1rem 0'
      }}>
        <Typography variant="h6" sx={{
          ml: '1.5rem',
          fontWeight: 700,
          color: theme.palette.primary.main
        }}>
          SISGEV-P
        </Typography>
      </Toolbar>
      
      <List>
        {menuItems.map((item) => {
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
                  mx: '1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: isActive
                    ? theme.palette.primary.dark
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? theme.palette.primary.dark
                      : 'rgba(255, 255, 255, 0.08)',
                  }
                }}
              >
                <ListItemIcon sx={{
                  color: isActive ? theme.palette.primary.light : theme.palette.text.secondary,
                  minWidth: '2.5rem'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{
                  color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                }}/>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Versión móvil */}
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
      
      {/* Versión escritorio */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider || 'rgba(255, 255, 255, 0.12)'}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}