// src/pages/Usuarios.jsx
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../layout/Layout';
import UsuarioTable from '../components/usuarios/UsuarioTable';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import { usuarioService } from '../services/UsuarioService';
import useAuth from '../auth/UseAuth';

/**
 * Página principal de gestión de usuarios 
 */
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const { user: currentUser } = useAuth();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  /**
   * CARGA DE USUARIOS - AQUÍ ESTABA EL ERROR
   */
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAll();
      
      // EXPLICACIÓN DEL CAMBIO:
      // response.data es la respuesta de Axios.
      // response.data.data es el array que envía el UsuarioResource de Laravel.
      const dataLimpia = response.data.data || response.data; 
      
      setUsuarios(dataLimpia);
      
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      mostrarSnackbar('Error al cargar usuarios', 'error');
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

  const handleNuevoUsuario = () => {
    setUsuarioEdit(null);
    setShowForm(true);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEdit(usuario);
    setShowForm(true);
  };

  const handleVerUsuario = (usuario) => {
    mostrarSnackbar(`Viendo detalles de ${usuario.name}`, 'info');
  };

  const handleEliminarUsuario = (usuario) => {
    if (usuario.id === currentUser?.id) {
      mostrarSnackbar('No puedes eliminarte a ti mismo', 'error');
      return;
    }
    if (usuario.id === 1) {
      mostrarSnackbar('No se puede eliminar al administrador principal', 'error');
      return;
    }
    setUsuarioToDelete(usuario);
    setShowDeleteDialog(true);
  };

  const confirmarEliminarUsuario = async () => {
    if (!usuarioToDelete) return;
    try {
      setDeleteLoading(true);
      await usuarioService.delete(usuarioToDelete.id);
      setUsuarios(prev => prev.filter(u => u.id !== usuarioToDelete.id));
      mostrarSnackbar('Usuario eliminado correctamente', 'success');
      setShowDeleteDialog(false);
      setUsuarioToDelete(null);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      mostrarSnackbar(error.response?.data?.message || 'Error al eliminar usuario', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmitUsuario = async (formData) => {
    try {
      setFormLoading(true);
      if (usuarioEdit) {
        await usuarioService.update(usuarioEdit.id, formData);
        mostrarSnackbar('Usuario actualizado correctamente', 'success');
      } else {
        await usuarioService.create(formData);
        mostrarSnackbar('Usuario creado correctamente', 'success');
      }
      await cargarUsuarios();
      setShowForm(false);
      setUsuarioEdit(null);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setUsuarioEdit(null);
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="text.primary">
            Gestión de Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevoUsuario}
            disabled={loading}
          >
            Nuevo Usuario
          </Button>
        </Box>

        {showForm ? (
          <UsuarioForm
            usuario={usuarioEdit}
            onSubmit={handleSubmitUsuario}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        ) : (
          <>
            <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'rgba(2, 136, 209, 0.1)' }}>
              <Typography variant="body2">
                <strong>Nota:</strong> Administra los usuarios del sistema. Solo usuarios con rol 
                "Administrador" pueden acceder a esta página.
              </Typography>
            </Paper>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <UsuarioTable
                usuarios={usuarios}
                onEdit={handleEditarUsuario}
                onDelete={handleEliminarUsuario}
                onView={handleVerUsuario}
                loading={loading}
              />
            )}
          </>
        )}

        <Dialog
          open={showDeleteDialog}
          onClose={() => !deleteLoading && setShowDeleteDialog(false)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de eliminar al usuario{' '}
              <strong>{usuarioToDelete?.name || usuarioToDelete?.nombre_completo}</strong>?
              <br />
              <small>Esta acción no se puede deshacer.</small>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmarEliminarUsuario} 
              color="error" 
              disabled={deleteLoading}
              startIcon={deleteLoading && <CircularProgress size={20} />}
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={cerrarSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={cerrarSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Usuarios;