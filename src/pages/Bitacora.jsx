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
  // -- ESTADOS DE DATOS --
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarLogs();
  }, []);

  // -- LÓGICA DE CARGA --
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
        
        {/* ENCABEZADO */}
        <Box sx={{ mb: '1rem' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Bitácora de Auditoría
          </Typography>
        </Box>

        {/* NOTA */}
        <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          <Typography variant="body2">
            <strong>Nota:</strong> Registro histórico de todas las acciones realizadas en el sistema.
          </Typography>
        </Alert>

        {/* TABLA SIMPLIFICADA */}
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '0.5rem', maxHeight: 600 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', width: '15%' }}>
                  Fecha y Hora
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', width: '20%' }}>
                  Usuario Responsable
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', width: '15%' }}>
                  Acción Realizada
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', width: '30%' }}>
                  Detalles de la Actividad
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', width: '20%' }}>
                  IP / Navegador
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: '5rem' }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    {/* FECHA Y HORA */}
                    <TableCell sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>

                    {/* USUARIO */}
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {log.usuario?.nombre_completo || 'Sistema Automático'}
                    </TableCell>

                    {/* ACCIÓN */}
                    <TableCell>
                      <Chip
                        label={log.accion}
                        size="small"
                        variant="filled"
                        color={
                          log.accion.includes('Crear') || log.accion === 'Login' ? 'success' :
                          log.accion.includes('Eliminar') ? 'error' : 
                          log.accion.includes('Editar') || log.accion === 'Logout' ? 'warning' : 'default'
                        }
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>

                    {/* DETALLES */}
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {log.descripcion || 'Sin detalles'}
                    </TableCell>

                    {/* IP / NAVEGADOR */}
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      <Box>
                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                          IP: {log.ip_usuario || 'N/A'}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {log.dispositivo ? 
                            log.dispositivo.substring(0, 50) + (log.dispositivo.length > 50 ? '...' : '') 
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="text.secondary">
                      No hay registros de bitácora disponibles.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    </Layout>
  );
};

export default Bitacora;