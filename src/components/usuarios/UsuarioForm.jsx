// src/components/usuarios/UsuarioForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { roleService } from '../../services/RoleService';

const UsuarioForm = ({ usuario, onSubmit, onCancel, loading }) => {
  // -- ESTADOS --
  const [formData, setFormData] = useState({
    nombre_completo: usuario?.nombre_completo || '',
    usuario: usuario?.usuario || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    id_rol: usuario?.id_rol || '',
  });

  const [roles, setRoles] = useState([]); // Nuevo estado para roles
  const [cargandoRoles, setCargandoRoles] = useState(false); // Estado de carga

  // -- EFECTO PARA CARGAR ROLES --
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setCargandoRoles(true);
        const response = await roleService.getAll();
        setRoles(response.data);
      } catch (error) {
        console.error('Error cargando roles:', error);
      } finally {
        setCargandoRoles(false);
      }
    };

    cargarRoles();
  }, []);

  // -- MANEJADORES --
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
          {/* Campo: Nombre Completo */}
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
          
          {/* Campo: Usuario */}
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
          
          {/* Campo: Email */}
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
          
          {/* Campo: Rol - AHORA DINÁMICO */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Asignar Rol</InputLabel>
              <Select
                name="id_rol" // Cambiado a id_rol
                value={formData.id_rol}
                onChange={handleChange}
                label="Asignar Rol"
                disabled={cargandoRoles}
              >
                <MenuItem value="">
                  <em>Seleccionar un rol</em>
                </MenuItem>
                {roles.map((rol) => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </MenuItem>
                ))}
              </Select>
              {cargandoRoles && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  Cargando roles...
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          {/* Campo: Teléfono */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono/Celular"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          
          {/* Campo: Contraseña solo para nuevos usuarios */}
          {!usuario && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contraseña Inicial"
                name="contraseña" // Nombre exacto que espera tu backend
                type="password"
                onChange={handleChange}
                required
                size="small"
                helperText="Mínimo 6 caracteres"
              />
            </Grid>
          )}
        </Grid>
        
        {/* Botones */}
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
            disabled={loading || cargandoRoles}
          >
            {loading ? 'Guardando...' : 'Guardar Funcionario'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UsuarioForm;