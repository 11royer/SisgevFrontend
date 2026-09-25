import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ApartmentIcon from '@mui/icons-material/Apartment';

/**
 * Formulario para crear o editar unidades institucionales.
 */
const UnidadForm = ({ unidad, onSubmit, onCancel, loading }) => {
  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    nombre: unidad?.nombre || '',
    sigla: unidad?.sigla || '',
    tipo: unidad?.tipo || '',
    ubicacion: unidad?.ubicacion || '',
    telefono_contacto: unidad?.telefono_contacto || '',
    estado: unidad?.estado ?? true,
  });

  const [error, setError] = useState(null);

  const tiposUnidad = [
    { value: 'Comando', label: 'Comando' },
    { value: 'Sub Comando', label: 'Sub Comando' },
    { value: 'Direccion', label: 'Dirección Departamental' },
    { value: 'Direccion Provincial', label: 'Dirección Provincial' },
    { value: 'Departamento', label: 'Departamento' },
    { value: 'Jefatura', label: 'Jefatura' },
    { value: 'EPI', label: 'Estación Policial Integral (EPI)' },
    { value: 'Unidad', label: 'Unidad' },
    { value: 'Unidad Especializada', label: 'Unidad Especializada' },
    { value: 'Comando Frontera', label: 'Comando de Frontera' },
    { value: 'Batalion', label: 'Batallón' },
    { value: 'Centro', label: 'Centro' },
    { value: 'Facultad', label: 'Facultad' },
    { value: 'Instituto', label: 'Instituto' },
    { value: 'Asesoria', label: 'Asesoría' },
    { value: 'Inspectoria', label: 'Inspectoría' },
    { value: 'Fiscalia', label: 'Fiscalía' },
    { value: 'Tribunal', label: 'Tribunal Disciplinario' },
    { value: 'Grupo', label: 'Grupo' },
    { value: 'Banda', label: 'Banda' },
    { value: 'Radio', label: 'Radio' },
    { value: 'Comision', label: 'Comisión' },
    { value: 'Otro', label: 'Otro' },
  ];

  // MANEJADORES
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre de la unidad es obligatorio');
      return false;
    }
    if (formData.nombre.length > 150) {
      setError('El nombre no puede superar los 150 caracteres');
      return false;
    }
    if (formData.sigla && formData.sigla.length > 50) {
      setError('La sigla no puede superar los 50 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    onSubmit(formData);
  };

  // RENDER
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: '1.5rem', md: '2rem' },
        borderRadius: '0.75rem',
        width: '100%',
      }}
    >
      {/* ENCABEZADO */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '1.5rem' }}>
        <ApartmentIcon color="primary" fontSize="large" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {unidad ? 'Editar Unidad Institucional' : 'Registrar Nueva Unidad'}
        </Typography>
      </Box>

      <Divider sx={{ mb: '2rem' }} />

      {/* ERROR */}
      {error && (
        <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          {error}
        </Alert>
      )}

      {/* NOTA INFORMATIVA */}
      <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
        Los campos marcados con (*) son obligatorios. El nombre debe ser único en el sistema.
      </Alert>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* NOMBRE */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Nombre de la Unidad *"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              size="small"
              placeholder="Ej: ESTACION POLICIAL INTEGRAL NRO.7"
              helperText="Máximo 150 caracteres"
            />
          </Grid>

          {/* SIGLA */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Sigla"
              name="sigla"
              value={formData.sigla}
              onChange={handleChange}
              size="small"
              placeholder="Ej: EPI-7"
              helperText="Máximo 50 caracteres"
            />
          </Grid>

          {/* TIPO */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Unidad</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                label="Tipo de Unidad"
              >
                <MenuItem value="">
                  <em>Sin especificar</em>
                </MenuItem>
                {tiposUnidad.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* TELÉFONO */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Teléfono de Contacto"
              name="telefono_contacto"
              value={formData.telefono_contacto}
              onChange={handleChange}
              size="small"
              placeholder="Ej: 71234567"
              inputProps={{ pattern: '[0-9]*' }}
            />
          </Grid>

          {/* UBICACIÓN */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Ubicación / Dirección"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              size="small"
              placeholder="Ej: Potosí, Av. Universitaria N° 123"
              multiline
              rows={2}
            />
          </Grid>

          {/* ESTADO */}
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  name="estado"
                  checked={formData.estado}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={formData.estado ? 'Activa (disponible para asignación)' : 'Inactiva'}
            />
          </Grid>
        </Grid>

        {/* BOTONES */}
        <Box
          sx={{
            mt: '3rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
            startIcon={<CancelIcon />}
            disabled={loading}
            sx={{ borderRadius: '0.5rem' }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
            }
            disabled={loading}
            sx={{ borderRadius: '0.5rem' }}
          >
            {loading
              ? 'Guardando...'
              : unidad
              ? 'Actualizar Unidad'
              : 'Registrar Unidad'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UnidadForm;