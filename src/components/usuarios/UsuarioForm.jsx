// src/components/usuarios/UsuarioForm.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Divider,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const UsuarioForm = ({ usuario, onSubmit, onCancel, loading }) => {
  // --- ESTADOS ---
  const [formData, setFormData] = useState({
    nombre_completo: usuario?.nombre_completo || '',
    usuario: usuario?.usuario || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    rol_id: usuario?.rol_id || '',
    password: '', // Solo para nuevos o cambio opcional
  });

  // --- MANEJADORES ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: '2rem', borderRadius: '0.5rem', width: '100%' }}>
      <Typography variant="h6" sx={{ mb: '1.5rem', fontWeight: 'bold' }}>
        {usuario ? 'Editar Funcionario' : 'Registrar Nuevo Funcionario'}
      </Typography>
      <Divider sx={{ mb: '2rem' }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing="1.5rem">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre Completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre de Usuario (Acceso)"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Correo Institucional"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Asignar Rol"
              name="rol_id"
              value={formData.rol_id}
              onChange={handleChange}
              required
              size="small"
            >
              <MenuItem value={1}>Administrador</MenuItem>
              <MenuItem value={2}>Operador</MenuItem>
              <MenuItem value={3}>Consultor</MenuItem>
            </TextField>
          </Grid>
          {!usuario && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contraseña Inicial"
                name="password"
                type="password"
                onChange={handleChange}
                required
                size="small"
              />
            </Grid>
          )}
        </Grid>

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
            {loading ? 'Guardando...' : 'Guardar Funcionario'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UsuarioForm;