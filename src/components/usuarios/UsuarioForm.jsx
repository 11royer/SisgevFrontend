// src/components/usuarios/UsuarioForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import { roleService } from '../../services/RoleService';

/**
 * Formulario para crear/editar usuarios
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.usuario - Usuario a editar (opcional)
 * @param {Function} props.onSubmit - Función al enviar el formulario
 * @param {Function} props.onCancel - Función al cancelar
 * @param {boolean} props.loading - Estado de carga
 */
const UsuarioForm = ({ usuario, onSubmit, onCancel, loading }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_completo: '',
    usuario: '',
    email: '',
    contraseña: '',
    telefono: '',
    id_rol: '',
    estado: true,
    foto_perfil: null,
  });

  // Estado para roles disponibles
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Cargar roles al montar el componente
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const response = await roleService.getAll();
        setRoles(response.data);
      } catch (err) {
        setError('Error al cargar roles');
        console.error('Error cargando roles:', err);
      } finally {
        setRolesLoading(false);
      }
    };
    cargarRoles();
  }, []);

  // Si estamos editando, cargar datos del usuario
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre_completo: usuario.nombre_completo || '',
        usuario: usuario.usuario || '',
        email: usuario.email || '',
        contraseña: '', // Contraseña vacía por seguridad
        telefono: usuario.telefono || '',
        id_rol: usuario.id_rol || usuario.rol?.id || '',
        estado: usuario.estado !== undefined ? usuario.estado : true,
        foto_perfil: null,
      });
      if (usuario.foto_url) {
        setPreviewImage(usuario.foto_url);
      }
    }
  }, [usuario]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona una imagen válida');
        return;
      }
      
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no debe superar los 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, foto_perfil: file }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!formData.nombre_completo.trim()) {
      setError('El nombre completo es requerido');
      return;
    }

    if (!formData.usuario.trim()) {
      setError('El nombre de usuario es requerido');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    // Si es nuevo usuario, validar contraseña
    if (!usuario && !formData.contraseña) {
      setError('La contraseña es requerida para nuevos usuarios');
      return;
    }

    if (!formData.id_rol) {
      setError('Debe seleccionar un rol');
      return;
    }

    // Crear FormData para enviar archivos
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await onSubmit(formDataToSend);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Foto de perfil */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                }}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography color="text.secondary">Sin foto</Typography>
                )}
              </Box>
              <Button variant="outlined" component="label">
                Subir Foto
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
          </Grid>

          {/* Nombre completo */}
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

          {/* Nombre de usuario */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              size="small"
              disabled={!!usuario} // No se puede cambiar el username en edición
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>

          {/* Teléfono */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          {/* Contraseña (solo para nuevo usuario) */}
          {!usuario && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contraseña"
                name="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                required
                size="small"
                helperText="Mínimo 6 caracteres"
              />
            </Grid>
          )}

          {/* Rol */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Rol</InputLabel>
              <Select
                name="id_rol"
                value={formData.id_rol}
                onChange={handleChange}
                label="Rol"
                disabled={rolesLoading}
              >
                {rolesLoading ? (
                  <MenuItem disabled>Cargando roles...</MenuItem>
                ) : (
                  roles.map((rol) => (
                    <MenuItem key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Estado */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.estado}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    estado: e.target.checked 
                  }))}
                  name="estado"
                  color="primary"
                />
              }
              label={formData.estado ? "Usuario Activo" : "Usuario Inactivo"}
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
            disabled={loading || rolesLoading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UsuarioForm;