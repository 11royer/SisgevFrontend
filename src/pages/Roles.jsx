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

const Roles = () => {
  // --- ESTADOS DE DATOS ---
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE FORMULARIO Y DIÁLOGOS ---
  const [showForm, setShowForm] = useState(false);
  const [roleEdit, setRoleEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    cargarRoles();
  }, []);

  // --- LÓGICA DE CARGA ---
  const cargarRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Error cargando roles:', error);
      mostrarSnackbar('Error al cargar la lista de roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJADORES DE EVENTOS ---
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleNuevoRol = () => {
    setRoleEdit(null);
    setShowForm(true);
  };

  const handleEditarRol = (role) => {
    setRoleEdit(role);
    setShowForm(true);
  };

  const handleEliminarRol = (role) => {
    if (role.id <= 4) {
      mostrarSnackbar('No se puede eliminar un rol base del sistema', 'error');
      return;
    }
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  const confirmarEliminarRol = async () => {
    if (!roleToDelete) return;
    try {
      setDeleteLoading(true);
      await roleService.delete(roleToDelete.id);
      setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
      mostrarSnackbar('Rol eliminado correctamente', 'success');
      setShowDeleteDialog(false);
    } catch (error) {
      mostrarSnackbar('Error al eliminar el rol', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmitRol = async (formData) => {
    try {
      setFormLoading(true);
      if (roleEdit) {
        await roleService.update(roleEdit.id, formData);
        mostrarSnackbar('Rol actualizado correctamente');
      } else {
        await roleService.create(formData);
        mostrarSnackbar('Rol creado correctamente');
      }
      await cargarRoles();
      setShowForm(false);
    } catch (error) {
      console.error('Error guardando rol:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
        
        {/* ENCABEZADO UNIFICADO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1rem' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Gestión de Roles</Typography>
          {!showForm && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleNuevoRol} disabled={loading}>
              Nuevo Rol
            </Button>
          )}
        </Box>

        {/* NOTA UNIFICADA */}
        <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          <Typography variant="body2">
            <strong>Nota:</strong> Administra los niveles de acceso. Los roles del sistema (ID 1-4) son estructurales y no pueden eliminarse del SISGEV-P.
          </Typography>
        </Alert>

        {/* CONTENIDO PRINCIPAL */}
        {showForm ? (
          <RoleForm role={roleEdit} onSubmit={handleSubmitRol} onCancel={() => setShowForm(false)} loading={formLoading} />
        ) : (
          <>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: '5rem' }}><CircularProgress /></Box>
            ) : (
              <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '0.5rem' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Nombre del Rol</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Descripción</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id} hover>
                        <TableCell>{role.id}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>{role.nombre}</TableCell>
                        <TableCell color="text.secondary">{role.descripcion || 'Sin descripción'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={role.id <= 4 ? 'Sistema' : 'Personalizado'} 
                            color={role.id <= 4 ? 'primary' : 'default'} 
                            size="small" 
                            variant="outlined" 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary" onClick={() => handleEditarRol(role)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" disabled={role.id <= 4} onClick={() => handleEliminarRol(role)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* DIÁLOGOS Y NOTIFICACIONES */}
        <Dialog open={showDeleteDialog} onClose={() => !deleteLoading && setShowDeleteDialog(false)} fullWidth maxWidth="xs">
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>¿Estás seguro de eliminar el rol <strong>{roleToDelete?.nombre}</strong>?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>Cancelar</Button>
            <Button onClick={confirmarEliminarRol} color="error" variant="contained" disabled={deleteLoading}>
              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={cerrarSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '0.5rem' }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Roles;