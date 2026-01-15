// src/pages/Bitacora.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  CircularProgress,
  Alert 
} from '@mui/material';
import Layout from '../layout/Layout';
import { bitacoraService } from '../services/BitacoraService';

const Bitacora = () => {
  // --- ESTADOS DE DATOS ---
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarLogs();
  }, []);

  // --- LÓGICA DE CARGA ---
  const cargarLogs = async () => {
    try {
      setLoading(true);
      const response = await bitacoraService.getAll();
      setLogs(response.data.data || response.data);
    } catch (error) {
      console.error("Error cargando bitácora:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
        
        {/* ENCABEZADO UNIFICADO */}
        <Box sx={{ mb: '1rem' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Bitácora de Auditoría</Typography>
        </Box>

        {/* NOTA UNIFICADA */}
        <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          <Typography variant="body2">
            <strong>Nota:</strong> Registro histórico e inmutable de todas las acciones críticas realizadas por los usuarios en el sistema.
          </Typography>
        </Alert>

        {/* CONTENIDO PRINCIPAL: TABLA OCUPANDO EL 100% */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: '5rem' }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '0.5rem' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Fecha y Hora</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Usuario Responsable</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Acción Realizada</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Módulo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Detalles de la Actividad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {log.usuario?.nombre_completo || 'Sistema Automático'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={log.accion} 
                        size="small" 
                        variant="filled"
                        color={
                          log.accion.includes('Crear') ? 'success' : 
                          log.accion.includes('Eliminar') ? 'error' : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{log.modulo}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {log.descripcion}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Layout>
  );
};

export default Bitacora;