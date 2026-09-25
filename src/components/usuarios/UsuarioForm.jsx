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
import { useCatalogoUnidades } from '../../hooks/useCatalogoUnidades';
import useAuth from '../../auth/UseAuth';

const UsuarioForm = ({ usuario, onSubmit, onCancel, loading }) => {
  const { esAdministrador } = useAuth();
  const esAdmin = esAdministrador();

  // Hook del catálogo de unidades
  const {
    unidades,
    loading: cargandoUnidades
  } = useCatalogoUnidades();

  // ESTADOS
  const [formData, setFormData] = useState({
    nombre_completo: usuario?.nombre_completo || '',
    usuario: usuario?.usuario || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    cargo: usuario?.cargo || '',
    id_rol: usuario?.id_rol || '',
    unidad_id: usuario?.unidad_id || '',
    contraseña: '',
  });

  const [roles, setRoles] = useState([]);
  const [cargandoRoles, setCargandoRoles] = useState(false);

  // EFECTO PARA CARGAR ROLES
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

  // MANEJADORES
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir unidad_id vacío ("") a null antes de enviar
    // para que el backend reciba null en lugar de cadena vacía.
    const dataAEnviar = {
      ...formData,
      unidad_id: formData.unidad_id === '' ? null : formData.unidad_id,
    };

    onSubmit(dataAEnviar);
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
          <Grid size={{ xs: 12, md: 6 }}>
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
          <Grid size={{ xs: 12, md: 6 }}>
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

          {/* campo: Cargo */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Cargo / Función"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              size="small"
              placeholder="Ej: Comandante, Jefe de Unidad, Oficial..."
            />
          </Grid>

          {/* Campo: Email */}
          <Grid size={{ xs: 12, md: 6 }}>
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

          {/* Campo: Rol - DINÁMICO */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Asignar Rol</InputLabel>
              <Select
                name="id_rol"
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

          {/* Campo Unidad Institucional */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Unidad Institucional</InputLabel>
              <Select
                name="unidad_id"
                value={formData.unidad_id}
                onChange={handleChange}
                label="Unidad Institucional"
                disabled={cargandoUnidades}
              >
                <MenuItem value="">
                  <em>Sin unidad asignada (acceso global)</em>
                </MenuItem>
                {unidades.map((unidad) => (
                  <MenuItem key={unidad.id} value={unidad.id}>
                    {unidad.sigla 
                      ? `${unidad.sigla} - ${unidad.nombre}` 
                      : unidad.nombre
                    }
                  </MenuItem>
                ))}
              </Select>
              {cargandoUnidades && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  Cargando unidades...
                </Typography>
              )}
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                {esAdmin 
                  ? 'Opcional: si se deja vacío, el usuario verá todas las unidades.'
                  : 'Asigne la unidad a la que pertenece el usuario.'
                }
              </Typography>
            </FormControl>
          </Grid>

          {/* Campo: Teléfono */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Teléfono/Celular"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          {/*  SECCIÓN DE CONTRASEÑA */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={usuario ? "Nueva Contraseña (Dejar vacío para no cambiar)" : "Contraseña Inicial"}
              name="contraseña"
              type="password"
              onChange={handleChange}
              required={!usuario} 
              size="small"
              helperText={usuario 
                  ? "Escriba aquí solo si desea resetear la clave del usuario." 
                  : "Mínimo 6 caracteres"
              }
              value={formData.contraseña || ''} 
            />
          </Grid>

        </Grid>

        {/* Botones de Acción */}
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
            disabled={loading || cargandoRoles || cargandoUnidades}
          >
            {loading ? 'Guardando...' : 'Guardar Funcionario'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UsuarioForm;