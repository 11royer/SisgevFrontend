// src/pages/Dashboard.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';
import Layout from '../layout/Layout';

export default function Dashboard() {
  return (
    // Envuelve el contenido en el Layout
    <Layout> 
      <Box>
        <Typography variant="h4" color="text.primary" sx={{ mb: '1.5rem', fontWeight: 600 }}>
          Bienvenido a SISGEV-P
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Aquí se mostrarán las estadísticas principales, el estado de la flota y accesos rápidos.
        </Typography>
        
        {/* Aquí irá el contenido del Dashboard real, como tarjetas de resumen y gráficos. */}
      </Box>
    </Layout>
  );
}