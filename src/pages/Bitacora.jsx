// src/pages/Bitacora.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import Layout from '../layout/Layout';
import BitacoraFilters from '../components/bitacora/BitacoraFilters';

// Servicios
import { bitacoraService } from '../services/BitacoraService';
import { usuarioService } from '../services/UsuarioService';

/**
 * Página de consulta de bitácora/auditoría
 * Recupera la estética original con protección de datos
 */
const Bitacora = () => {
  // Estados principales
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [modulos] = useState([
    'Autenticación', 'Usuarios', 'Roles', 'Vehículos', 'Conductores',
    'Asignaciones', 'Mantenimientos', 'Repuestos', 'Documentos', 'Bitácora'
  ]);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Efecto de carga inicial
  useEffect(() => {
    cargarUsuarios();
    cargarBitacora();
  }, [filtros]);

  /**
   * Cargar usuarios para el selector de filtros
   */
  const cargarUsuarios = async () => {
    try {
      const response = await usuarioService.getAll();
      setUsuarios(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  /**
   * Cargar registros con validación de Resource de Laravel
   */
  const cargarBitacora = async () => {
    try {
      setLoading(true);
      const response = await bitacoraService.getAll(filtros);
      
      // ✅ Soporte para datos directos o envueltos en .data (por el Resource)
      const dataFinal = response.data?.data || response.data || [];
      setRegistros(Array.isArray(dataFinal) ? dataFinal : []);
    } catch (error) {
      console.error('Error cargando bitácora:', error);
      mostrarSnackbar('Error al cargar registros', 'error');
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * Formateador de fecha profesional
   */
  const formatearFecha = (fechaHora) => {
    if (!fechaHora) return 'N/A';
    try {
      return new Date(fechaHora).toLocaleString('es-BO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) { return 'Fecha inválida'; }
  };

  /**
   * Lógica de colores para los Chips de acción
   */
  const getColorAccion = (accion) => {
    if (!accion) return 'default';
    const a = accion.toLowerCase();
    if (a.includes('crear') || a.includes('insertar')) return 'success';
    if (a.includes('editar') || a.includes('actualizar')) return 'info';
    if (a.includes('eliminar') || a.includes('borrar')) return 'error';
    if (a.includes('login')) return 'primary';
    return 'default';
  };

  return (
    <Layout>
      <Box sx={{ p: 1 }}>
        {/* Título y botón de refrescar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Bitácora de Auditoría
          </Typography>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={cargarBitacora} disabled={loading} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 🟡 NOTA AMARILLA (Tu característica solicitada) */}
        <Alert 
          severity="warning" 
          variant="outlined" 
          sx={{ mb: 3, bgcolor: '#fffde7', borderColor: '#ffd600', color: '#827717' }}
        >
          <Typography variant="body2">
            <strong>Nota Importante:</strong> Esta bitácora registra de forma permanente todas las acciones 
            realizadas por los usuarios. Incluye detalles técnicos como IP y dispositivo para fines de 
            seguridad y auditoría institucional.
          </Typography>
        </Alert>

        {/* Filtros */}
        <BitacoraFilters 
          onFilter={(f) => setFiltros(f)} 
          usuarios={usuarios} 
          modulos={modulos} 
        />

        {/* Tabla principal */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={{ mt: 2, borderRadius: 2, maxHeight: '65vh' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Fecha / Hora</TableCell>
                  <TableCell sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
                  <TableCell sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Módulo</TableCell>
                  <TableCell sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Acción</TableCell>
                  <TableCell sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                  <TableCell sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Origen (IP)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>No se encontraron registros</TableCell></TableRow>
                ) : (
                  registros.map((reg) => {
                    const u = reg.usuario || {}; // Objeto de usuario seguro
                    return (
                      <TableRow key={reg.id || Math.random()} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {formatearFecha(reg.fecha_hora || reg.created_at)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={u.foto_url} sx={{ width: 28, height: 28, bgcolor: '#1976d2' }}>
                              {!u.foto_url && <PersonIcon fontSize="small" />}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', lineHeight: 1 }}>
                                {u.nombre_completo || 'Sistema'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {u.usuario || 'Automático'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={reg.modulo || 'Gral'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={reg.accion} 
                            color={getColorAccion(reg.accion)} 
                            size="small" 
                            sx={{ fontWeight: 'bold', minWidth: 70 }}
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" noWrap title={reg.descripcion}>
                            {reg.descripcion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={reg.dispositivo || 'N/A'}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'help' }}>
                              {reg.ip_usuario || '0.0.0.0'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={cerrarSnackbar}>
          <Alert onClose={cerrarSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Bitacora;