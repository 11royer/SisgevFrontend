// src/components/roles/RoleForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';

/**
 * Formulario para crear/editar roles
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.role - Rol a editar (opcional)
 * @param {Function} props.onSubmit - Función al enviar el formulario
 * @param {Function} props.onCancel - Función al cancelar
 * @param {boolean} props.loading - Estado de carga
 */
const RoleForm = ({ role, onSubmit, onCancel, loading }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  const [error, setError] = useState(null);

  // Si estamos editando, cargar datos del rol
  useEffect(() => {
    if (role) {
      setFormData({
        nombre: role.nombre || '',
        descripcion: role.descripcion || '',
      });
    }
  }, [role]);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Limpiar error al cambiar
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre del rol es requerido');
      return;
    }

    if (formData.nombre.length > 50) {
      setError('El nombre no debe exceder los 50 caracteres');
      return;
    }

    if (formData.descripcion && formData.descripcion.length > 255) {
      setError('La descripción no debe exceder los 255 caracteres');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar rol');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {role ? 'Editar Rol' : 'Nuevo Rol'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Nombre del rol */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Rol"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              size="small"
              helperText="Ej: Administrador, Operador, Técnico, Consulta"
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              multiline
              rows={3}
              size="small"
              helperText="Describa las funciones y permisos de este rol"
            />
          </Grid>
        </Grid>

        {/* Botones de acción */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Guardando...' : role ? 'Actualizar' : 'Crear'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoleForm;