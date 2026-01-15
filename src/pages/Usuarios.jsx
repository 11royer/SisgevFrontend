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
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../layout/Layout';
import UsuarioTable from '../components/usuarios/UsuarioTable';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import { usuarioService } from '../services/UsuarioService';
import useAuth from '../auth/UseAuth';

const Usuarios = () => {
  const { user: currentUser } = useAuth();

  // --- ESTADOS DE DATOS ---
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- ESTADOS DE INTERFAZ ---
  const [showForm, setShowForm] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // --- LÓGICA DE CARGA ---
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

  // --- MANEJADORES DE EVENTOS ---
  const mostrarSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const cerrarSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const handleNuevoUsuario = () => { setUsuarioEdit(null); setShowForm(true); };
  const handleEditarUsuario = (u) => { setUsuarioEdit(u); setShowForm(true); };

  const handleEliminarUsuario = (u) => {
    if (u.id === currentUser?.id) return mostrarSnackbar('No puedes eliminar tu propia cuenta', 'error');
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
    } catch (error) { throw error; } finally { setFormLoading(false); }
  };

  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
        
        {/* ENCABEZADO UNIFICADO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1rem' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Gestión de Usuarios</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNuevoUsuario}>Nuevo Usuario</Button>
        </Box>

        {/* NOTA UNIFICADA */}
        <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          Control de acceso para funcionarios policiales. Solo administradores pueden gestionar estas cuentas.
        </Alert>

        {/* CONTENIDO PRINCIPAL */}
        {showForm ? (
          <UsuarioForm usuario={usuarioEdit} onSubmit={handleSubmitUsuario} onCancel={() => setShowForm(false)} loading={formLoading} />
        ) : (
          <Box sx={{ width: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: '5rem' }}><CircularProgress /></Box>
            ) : (
              <UsuarioTable usuarios={usuarios} onEdit={handleEditarUsuario} onDelete={handleEliminarUsuario} />
            )}
          </Box>
        )}

        {/* DIÁLOGO DE ELIMINACIÓN */}
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>¿Eliminar Usuario?</DialogTitle>
          <DialogContent><Typography>Esta acción no se puede deshacer para {usuarioToDelete?.nombre_completo}.</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={confirmarEliminarUsuario} color="error" variant="contained" disabled={deleteLoading}>Confirmar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={cerrarSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Usuarios;