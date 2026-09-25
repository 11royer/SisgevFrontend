import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import UnidadTable from '../../components/unidades/UnidadTable';
import UnidadForm from '../../components/unidades/UnidadForm';
import UnidadDeleteDialog from '../../components/unidades/UnidadDeleteDialog';
import { useUnidades } from '../../hooks/useUnidades';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

/**
 * Página de gestión de unidades institucionales.
 */
const UnidadesPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // HOOK DE UNIDADES
  const {
    unidades,
    loading,
    error,
    successMessage,
    cargarUnidades,
    crearUnidad,
    actualizarUnidad,
    eliminarUnidad,
    limpiarMensajes,
  } = useUnidades();

  // PERMISOS
  const puedeGestionar = hasPermission(currentUser, 'gestionar_unidades');

  // ESTADOS DE UI
  const [showForm, setShowForm] = useState(false);
  const [unidadEdit, setUnidadEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unidadToDelete, setUnidadToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // FILTROS
  const [filtrosLocales, setFiltrosLocales] = useState({
    search: '',
    tipo: '',
    estado: '',
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // MANEJADORES DE MENSAJES
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Auto-cerrar mensajes después de 5 segundos
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => limpiarMensajes(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, limpiarMensajes]);

  // MANEJADORES DE FILTROS
  const handleFiltroChange = (name, value) => {
    setFiltrosLocales((prev) => ({ ...prev, [name]: value }));
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({ search: '', tipo: '', estado: '' });
  };

  const handleRefresh = () => {
    cargarUnidades();
  };

  // MANEJADORES DE CRUD
  const handleNuevaUnidad = () => {
    setUnidadEdit(null);
    setShowForm(true);
  };

  const handleEditarUnidad = (unidad) => {
    setUnidadEdit(unidad);
    setShowForm(true);
  };

  const handleCancelarForm = () => {
    setShowForm(false);
    setUnidadEdit(null);
  };

  const handleSubmitUnidad = async (formData) => {
    try {
      setFormLoading(true);
      limpiarMensajes();

      if (unidadEdit) {
        await actualizarUnidad(unidadEdit.id, formData);
        mostrarSnackbar('Unidad actualizada correctamente', 'success');
      } else {
        await crearUnidad(formData);
        mostrarSnackbar('Unidad registrada exitosamente', 'success');
      }

      setShowForm(false);
      setUnidadEdit(null);
    } catch (err) {
      // El hook ya estableció el error, solo aseguramos que el form no se cierre
      console.error('Error al guardar unidad:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEliminarClick = (unidad) => {
    setUnidadToDelete(unidad);
    setDeleteDialogOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!unidadToDelete) return;

    try {
      setDeleteLoading(true);
      await eliminarUnidad(unidadToDelete.id);
      mostrarSnackbar('Unidad eliminada correctamente', 'success');
      setDeleteDialogOpen(false);
      setUnidadToDelete(null);
    } catch (err) {
      // El hook ya maneja el mensaje de error
      console.error('Error al eliminar unidad:', err);
      setDeleteDialogOpen(false);
      setUnidadToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelarEliminar = () => {
    setDeleteDialogOpen(false);
    setUnidadToDelete(null);
  };

  // FILTRADO LOCAL (frontend)
  const unidadesFiltradas = React.useMemo(() => {
    return unidades.filter((unidad) => {
      const matchSearch =
        !filtrosLocales.search ||
        unidad.nombre.toLowerCase().includes(filtrosLocales.search.toLowerCase()) ||
        (unidad.sigla &&
          unidad.sigla.toLowerCase().includes(filtrosLocales.search.toLowerCase()));

      const matchTipo = !filtrosLocales.tipo || unidad.tipo === filtrosLocales.tipo;

      const matchEstado =
        filtrosLocales.estado === '' ||
        (filtrosLocales.estado === 'activa' && unidad.estado) ||
        (filtrosLocales.estado === 'inactiva' && !unidad.estado);

      return matchSearch && matchTipo && matchEstado;
    });
  }, [unidades, filtrosLocales]);

  // Contar filtros activos
  const filtrosActivosCount = Object.values(filtrosLocales).filter(
    (v) => v && v !== ''
  ).length;

  // VERIFICACIÓN DE PERMISOS
  if (!puedeGestionar) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: '0.75rem' }}>
            <Typography variant="h6" gutterBottom>
              Acceso Restringido
            </Typography>
            <Typography variant="body2">
              No tienes permisos para gestionar las unidades institucionales. Se requiere
              el permiso: <strong>gestionar_unidades</strong>.
            </Typography>
          </Alert>
        </Box>
      </Layout>
    );
  }

  // RENDER PRINCIPAL
  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
        {/*   ENCABEZADO  */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: '1rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Gestión de Unidades
          </Typography>

          {!showForm && (
            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Tooltip title="Refrescar">
                <span>
                  <IconButton onClick={handleRefresh} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNuevaUnidad}
                sx={{ borderRadius: '0.5rem' }}
              >
                Nueva Unidad
              </Button>
            </Box>
          )}
        </Box>

        {/*  ALERTAS DE ERROR / ÉXITO  */}
        <Collapse in={!!error || !!successMessage}>
          <Box sx={{ mb: '1rem' }}>
            {error && (
              <Alert
                severity="error"
                onClose={limpiarMensajes}
                sx={{ borderRadius: '0.5rem' }}
              >
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert
                severity="success"
                onClose={limpiarMensajes}
                sx={{ borderRadius: '0.5rem' }}
              >
                {successMessage}
              </Alert>
            )}
          </Box>
        </Collapse>

        {/*  NOTA INFORMATIVA  */}
        {!showForm && (
          <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
            <Typography variant="body2">
              Catálogo de unidades institucionales del Comando Departamental de Potosí.
              Solo los administradores pueden gestionar estas unidades.
            </Typography>
          </Alert>
        )}

        {/*  CONTENIDO PRINCIPAL: FORMULARIO O TABLA   */}
        {showForm ? (
          <UnidadForm
            unidad={unidadEdit}
            onSubmit={handleSubmitUnidad}
            onCancel={handleCancelarForm}
            loading={formLoading}
          />
        ) : (
          <>
            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <Paper
              elevation={2}
              sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.5rem' }}
            >
              <Grid container spacing="1rem" alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por nombre o sigla..."
                    value={filtrosLocales.search}
                    onChange={(e) => handleFiltroChange('search', e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: filtrosLocales.search && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => handleFiltroChange('search', '')}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '1rem',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      onClick={() => setMostrarFiltros(!mostrarFiltros)}
                      sx={{ flexShrink: 0 }}
                    >
                      {mostrarFiltros ? 'Ocultar Filtros' : 'Más Filtros'}
                    </Button>

                    {filtrosActivosCount > 0 && (
                      <Button
                        variant="text"
                        startIcon={<ClearIcon />}
                        onClick={handleLimpiarFiltros}
                        sx={{ flexShrink: 0 }}
                      >
                        Limpiar ({filtrosActivosCount})
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Filtros avanzados colapsables */}
              {mostrarFiltros && (
                <Box
                  sx={{
                    mt: '1rem',
                    pt: '1rem',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Grid container spacing="1rem">
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Tipo de Unidad</InputLabel>
                        <Select
                          value={filtrosLocales.tipo}
                          onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                          label="Tipo de Unidad"
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="Comando">Comando</MenuItem>
                          <MenuItem value="EPI">EPI</MenuItem>
                          <MenuItem value="Direccion">Dirección</MenuItem>
                          <MenuItem value="Unidad">Unidad</MenuItem>
                          <MenuItem value="Departamento">Departamento</MenuItem>
                          <MenuItem value="Jefatura">Jefatura</MenuItem>
                          <MenuItem value="Centro">Centro</MenuItem>
                          <MenuItem value="Facultad">Facultad</MenuItem>
                          <MenuItem value="Otro">Otro</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Estado</InputLabel>
                        <Select
                          value={filtrosLocales.estado}
                          onChange={(e) => handleFiltroChange('estado', e.target.value)}
                          label="Estado"
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="activa">Activas</MenuItem>
                          <MenuItem value="inactiva">Inactivas</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            {/* RESUMEN DE RESULTADOS */}
            {filtrosActivosCount > 0 && (
              <Box sx={{ mb: '1rem' }}>
                <Typography variant="caption" color="text.secondary">
                  Mostrando <strong>{unidadesFiltradas.length}</strong> de{' '}
                  <strong>{unidades.length}</strong> unidades
                </Typography>
              </Box>
            )}

            {/* TABLA */}
            <UnidadTable
              unidades={unidadesFiltradas}
              loading={loading}
              onEdit={handleEditarUnidad}
              onDelete={handleEliminarClick}
            />
          </>
        )}

        {/* DIÁLOGO DE ELIMINACIÓN */}
        <UnidadDeleteDialog
          open={deleteDialogOpen}
          unidad={unidadToDelete}
          onConfirm={handleConfirmarEliminar}
          onCancel={handleCancelarEliminar}
          loading={deleteLoading}
        />

        {/* SNACKBAR DE FEEDBACK */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={cerrarSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={cerrarSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: '0.5rem' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default UnidadesPage;