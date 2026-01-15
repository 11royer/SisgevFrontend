// src/components/roles/RoleForm.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SecurityIcon from '@mui/icons-material/Security';

const RoleForm = ({ role, onSubmit, onCancel, loading }) => {
  // --- ESTADOS ---
  const [formData, setFormData] = useState({
    nombre: role?.nombre || '',
    descripcion: role?.descripcion || '',
  });
  const [error, setError] = useState(null);

  // --- MANEJADORES ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: '2rem', borderRadius: '0.5rem', width: '100%' }}>
      {/* ENCABEZADO DEL FORMULARIO */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '1.5rem' }}>
        <SecurityIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {role ? `Editar Rol: ${role.nombre}` : 'Registrar Nuevo Rol de Acceso'}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: '2rem' }} />

      {error && (
        <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing="1.5rem">
          {/* NOMBRE DEL ROL */}
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Nombre del Rol"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Operador de Guardia"
              required
              size="small"
              helperText="El nombre debe ser único en el sistema"
              disabled={role?.id <= 4} // Evita renombrar roles base
            />
          </Grid>

          {/* DESCRIPCIÓN */}
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              label="Descripción de Funciones"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describa los permisos o nivel de acceso..."
              multiline
              rows={1}
              size="small"
            />
          </Grid>
        </Grid>

        {/* NOTA ACLARATORIA */}
        <Box sx={{ mt: '2rem', p: '1rem', bgcolor: 'action.hover', borderRadius: '0.4rem' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            * Los roles definen qué módulos puede ver el usuario. Al crear un rol personalizado, 
            asegúrese de que el nombre sea descriptivo para la jerarquía policial.
          </Typography>
        </Box>

        {/* ACCIONES */}
        <Box sx={{ mt: '3rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={onCancel} 
            startIcon={<CancelIcon />}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default RoleForm;