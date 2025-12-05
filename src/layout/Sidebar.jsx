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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';

const menuItems = [
  { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/dashboard' },
  { text: 'Vehículos', icon: <DirectionsCarIcon />, path: '/vehiculos' },
  { text: 'Conductores', icon: <PeopleIcon />, path: '/conductores' },
  { text: 'Mantenimientos', icon: <BuildIcon />, path: '/mantenimientos' },
  { text: 'Usuarios y Roles', icon: <PeopleIcon />, path: '/usuarios' },
  { text: 'Bitácora', icon: <AccessTimeIcon />, path: '/bitacora' },
  { text: 'Reportes', icon: <BarChartIcon />, path: '/reportes' },
];


// Recibe mobileOpen y handleDrawerToggle
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
                  // Cierra el Drawer en móvil después de navegar
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
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 } 
      }}
      aria-label="mailbox folders"
    >
      {/* 1. Versión Móvil: Drawer Temporal */}
      <Drawer
        variant="temporary"
        open={mobileOpen} // Usamos el estado de apertura/cierre
        onClose={handleDrawerToggle} // Permite cerrar al hacer clic fuera
        ModalProps={{ keepMounted: true }} 
        sx={{
          display: { xs: 'block', sm: 'none' }, // Visible solo en móvil
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* 2. Versión Escritorio: Drawer Permanente */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' }, // Visible solo en escritorio
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