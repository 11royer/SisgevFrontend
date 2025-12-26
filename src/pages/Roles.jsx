// src/pages/Roles.jsx
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../layout/Layout';
import RoleForm from '../components/roles/RoleForm';
import { roleService } from '../services/RoleService';

/**
 * Página principal de gestión de roles
 * Muestra lista de roles y permite CRUD
 */
const Roles = () => {
  // Estado para roles
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para formulario
  const [showForm, setShowForm] = useState(false);
  const [roleEdit, setRoleEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Estado para diálogo de confirmación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Cargar roles al montar el componente
  useEffect(() => {
    cargarRoles();
  }, []);

  /**
   * Cargar lista de roles desde la API
   */
  const cargarRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Error cargando roles:', error);
      mostrarSnackbar('Error al cargar roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mostrar notificación
   */
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  /**
   * Cerrar notificación
   */
  const cerrarSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * Manejar creación de nuevo rol
   */
  const handleNuevoRol = () => {
    setRoleEdit(null);
    setShowForm(true);
  };

  /**
   * Manejar edición de rol
   */
  const handleEditarRol = (role) => {
    setRoleEdit(role);
    setShowForm(true);
  };

  /**
   * Manejar solicitud de eliminación
   */
  const handleEliminarRol = (role) => {
    // No permitir eliminar roles del sistema (IDs 1-4)
    if (role.id <= 4) {
      mostrarSnackbar('No se puede eliminar un rol del sistema', 'error');
      return;
    }
    
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  /**
   * Confirmar eliminación de rol
   */
  const confirmarEliminarRol = async () => {
    if (!roleToDelete) return;
    
    try {
      setDeleteLoading(true);
      await roleService.delete(roleToDelete.id);
      
      // Actualizar lista
      setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
      
      mostrarSnackbar('Rol eliminado correctamente', 'success');
      setShowDeleteDialog(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error('Error eliminando rol:', error);
      mostrarSnackbar(
        error.response?.data?.message || 'Error al eliminar rol', 
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Manejar envío del formulario (crear/editar)
   */
  const handleSubmitRol = async (formData) => {
    try {
      setFormLoading(true);
      
      if (roleEdit) {
        // Editar rol existente
        await roleService.update(roleEdit.id, formData);
        mostrarSnackbar('Rol actualizado correctamente', 'success');
      } else {
        // Crear nuevo rol
        await roleService.create(formData);
        mostrarSnackbar('Rol creado correctamente', 'success');
      }
      
      // Recargar lista y cerrar formulario
      await cargarRoles();
      setShowForm(false);
      setRoleEdit(null);
    } catch (error) {
      console.error('Error guardando rol:', error);
      throw error; // Re-lanzar error para manejo en formulario
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Cancelar formulario
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setRoleEdit(null);
  };

  return (
    <Layout>
      <Box>
        {/* Header con título y botón */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="text.primary">
            Gestión de Roles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevoRol}
            disabled={loading}
          >
            Nuevo Rol
          </Button>
        </Box>

        {/* Mostrar formulario o tabla */}
        {showForm ? (
          <RoleForm
            role={roleEdit}
            onSubmit={handleSubmitRol}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        ) : (
          <>
            {/* Información sobre roles */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'info.light' }}>
              <Typography variant="body2">
                <strong>Nota:</strong> Administra los roles del sistema. Los roles con ID 1-4 son 
                del sistema y no se pueden eliminar. Los nuevos roles deben ser asignados 
                cuidadosamente considerando el principio de menor privilegio.
              </Typography>
            </Paper>

            {/* Tabla de roles */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead sx={{ bgcolor: 'primary.light' }}>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id} hover>
                        <TableCell>{role.id}</TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">{role.nombre}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {role.descripcion || 'Sin descripción'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={role.id <= 4 ? 'Sistema' : 'Personalizado'}
                            color={role.id <= 4 ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditarRol(role)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEliminarRol(role)}
                            color="error"
                            disabled={role.id <= 4}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Contador de roles */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Total de roles: {roles.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {roles.filter(r => r.id <= 4).length} roles del sistema,{' '}
                {roles.filter(r => r.id > 4).length} roles personalizados
              </Typography>
            </Box>
          </>
        )}

        {/* Diálogo de confirmación para eliminar */}
        <Dialog
          open={showDeleteDialog}
          onClose={() => !deleteLoading && setShowDeleteDialog(false)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de eliminar el rol{' '}
              <strong>{roleToDelete?.nombre}</strong>?
              <br />
              <small>
                Los usuarios con este rol quedarán sin rol asignado.
                Esta acción no se puede deshacer.
              </small>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowDeleteDialog(false)} 
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmarEliminarRol} 
              color="error" 
              disabled={deleteLoading}
              startIcon={deleteLoading && <CircularProgress size={20} />}
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={cerrarSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={cerrarSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Roles;