import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Layout from '../layout/Layout';
import UsuarioTable from '../components/usuarios/UsuarioTable';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import { usuarioService } from '../services/UsuarioService';
import { useCatalogoUnidades } from '../hooks/useCatalogoUnidades';
import useAuth from '../auth/UseAuth';
import { hasPermission } from '../utils/hasPermission';

const Usuarios = () => {
  const { user: currentUser, esAdministrador } = useAuth();
  const esAdmin = esAdministrador();

  const puedeVerUsuarios = hasPermission(currentUser, 'ver_usuarios');

  // Catálogo de unidades
  const {
    unidades: catalogoUnidades,
    loading: cargandoCatalogoUnidades,
  } = useCatalogoUnidades();

  // ESTADOS DE DATOS
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS DE INTERFAZ
  const [showForm, setShowForm] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  //Filtros locales
  const [filtrosLocales, setFiltrosLocales] = useState({
    search: '',
    unidad_id: '',
    id_rol: '',
  });

  // EFECTO INICIAL
  useEffect(() => {
    // Solo cargar si tiene permiso
    if (puedeVerUsuarios) {
      cargarUsuarios();
    } else {
      setLoading(false);
    }
  }, [puedeVerUsuarios]);

  // LÓGICA DE CARGA
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAll();
      setUsuarios(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Error al cargar la lista de usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  // MANEJADORES DE EVENTOS
  const mostrarSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });
  const cerrarSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const handleNuevoUsuario = () => {
    setUsuarioEdit(null);
    setShowForm(true);
  };

  const handleEditarUsuario = (u) => {
    setUsuarioEdit(u);
    setShowForm(true);
  };

  const handleEliminarUsuario = (u) => {
    if (u.id === currentUser?.id)
      return mostrarSnackbar('No puedes eliminar tu propia cuenta', 'error');
    setUsuarioToDelete(u);
    setShowDeleteDialog(true);
  };

  const confirmarEliminarUsuario = async () => {
    try {
      setDeleteLoading(true);
      await usuarioService.delete(usuarioToDelete.id);
      mostrarSnackbar('Usuario eliminado');
      cargarUsuarios();
      setShowDeleteDialog(false);
    } catch (error) {
      mostrarSnackbar('Error al eliminar', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmitUsuario = async (formData) => {
    try {
      setFormLoading(true);
      if (usuarioEdit) await usuarioService.update(usuarioEdit.id, formData);
      else await usuarioService.create(formData);
      mostrarSnackbar('Datos guardados correctamente');
      cargarUsuarios();
      setShowForm(false);
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // MANEJADORES DE FILTROS
  const handleFiltroChange = (name, value) => {
    setFiltrosLocales((prev) => ({ ...prev, [name]: value }));
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({ search: '', unidad_id: '', id_rol: '' });
  };

  const handleRefresh = () => {
    cargarUsuarios();
  };

  // FILTRADO LOCAL con useMemo
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const matchSearch =
        !filtrosLocales.search ||
        usuario.nombre_completo?.toLowerCase().includes(filtrosLocales.search.toLowerCase()) ||
        usuario.usuario?.toLowerCase().includes(filtrosLocales.search.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(filtrosLocales.search.toLowerCase());

      const matchUnidad =
        !filtrosLocales.unidad_id ||
        (filtrosLocales.unidad_id === 'sin_asignar' && !usuario.unidad_id) ||
        String(usuario.unidad_id) === String(filtrosLocales.unidad_id);

      const matchRol =
        !filtrosLocales.id_rol || String(usuario.id_rol) === String(filtrosLocales.id_rol);

      return matchSearch && matchUnidad && matchRol;
    });
  }, [usuarios, filtrosLocales]);

  const filtrosActivosCount = Object.values(filtrosLocales).filter(
    (v) => v && v !== ''
  ).length;

  const restringidoPorUnidad = !esAdmin && currentUser?.unidad_id;

  if (!puedeVerUsuarios) {
    return (
      <Layout>
        <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
          <Alert severity="error" sx={{ borderRadius: '0.75rem' }}>
            <Typography variant="h6" gutterBottom>
              Acceso Restringido
            </Typography>
            <Typography variant="body2">
              No tienes permisos para gestionar usuarios. Se requiere el permiso:{' '}
              <strong>ver_usuarios</strong>. Contacta al administrador si necesitas acceso.
            </Typography>
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>

        {/* ENCABEZADO UNIFICADO */}
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
            Gestión de Usuarios
          </Typography>
          <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Tooltip title="Refrescar">
              <span>
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            {!showForm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNuevoUsuario}
                sx={{ borderRadius: '0.5rem' }}
              >
                Nuevo Usuario
              </Button>
            )}
          </Box>
        </Box>

        {/* ALERT INFORMATIVO PARA NO-ADMINS */}
        {!showForm && restringidoPorUnidad && (
          <Alert
            severity="info"
            icon={<LockIcon />}
            sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2">
                Está viendo únicamente los usuarios asignados a su unidad:
              </Typography>
              <Chip
                icon={<ApartmentIcon />}
                label={currentUser.unidad.sigla || currentUser.unidad.nombre}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Alert>
        )}

        {/* NOTA UNIFICADA (solo para Admin sin unidad) */}
        {!showForm && !restringidoPorUnidad && (
          <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
            <Typography variant="body2">
              Control de acceso para funcionarios policiales. Solo administradores pueden
              gestionar estas cuentas.
            </Typography>
          </Alert>
        )}

        {/* CONTENIDO PRINCIPAL */}
        {showForm ? (
          <UsuarioForm
            usuario={usuarioEdit}
            onSubmit={handleSubmitUsuario}
            onCancel={() => setShowForm(false)}
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
                {/* Búsqueda */}
                <Grid size={{ xs: 12, md: esAdmin ? 5 : 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por nombre, usuario o correo..."
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

                {/* Filtro por unidad (SOLO ADMIN) */}
                {esAdmin && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Unidad Institucional</InputLabel>
                      <Select
                        value={filtrosLocales.unidad_id}
                        onChange={(e) => handleFiltroChange('unidad_id', e.target.value)}
                        label="Unidad Institucional"
                        disabled={cargandoCatalogoUnidades}
                      >
                        <MenuItem value="">Todas las unidades</MenuItem>
                        <MenuItem value="sin_asignar">
                          <em>Sin unidad asignada</em>
                        </MenuItem>
                        {catalogoUnidades.map((u) => (
                          <MenuItem key={u.id} value={u.id}>
                            {u.sigla ? `${u.sigla} - ${u.nombre}` : u.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Botón limpiar */}
                <Grid size={{ xs: 12, md: esAdmin ? 3 : 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    }}
                  >
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
                    <Chip
                      label={`${usuariosFiltrados.length} usuario(s)`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* TABLA */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: '5rem' }}>
                <CircularProgress />
              </Box>
            ) : (
              <UsuarioTable
                usuarios={usuariosFiltrados}
                onEdit={handleEditarUsuario}
                onDelete={handleEliminarUsuario}
              />
            )}
          </>
        )}

        {/* DIÁLOGO DE ELIMINACIÓN */}
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>¿Eliminar Usuario?</DialogTitle>
          <DialogContent>
            <Typography>
              Esta acción no se puede deshacer para {usuarioToDelete?.nombre_completo}.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button
              onClick={confirmarEliminarUsuario}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Eliminando...' : 'Confirmar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* SNACKBAR */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={cerrarSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Usuarios;