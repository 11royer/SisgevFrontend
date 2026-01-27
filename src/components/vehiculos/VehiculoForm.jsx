import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const VehiculoForm = ({ vehiculo, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    placa: vehiculo?.placa || '',
    marca: vehiculo?.marca || '',
    modelo: vehiculo?.modelo || '',
    anio: vehiculo?.anio || new Date().getFullYear(),
    color: vehiculo?.color || '',
    tipo: vehiculo?.tipo || '',
    estado: vehiculo?.estado || 'Activo',
    estado_operativo: vehiculo?.estado_operativo || 'Operativo',
    en_servicio: vehiculo?.en_servicio ?? true,
    kilometraje_actual: vehiculo?.kilometraje_actual || 0,
    unidad_id: vehiculo?.unidad_id || '',
    fecha_adquisicion: vehiculo?.fecha_adquisicion || '',
    observaciones: vehiculo?.observaciones || '',
  });

  const [unidades, setUnidades] = useState([]);
  const [cargandoUnidades, setCargandoUnidades] = useState(false);

  // Cargar unidades disponibles
  useEffect(() => {
    const cargarUnidades = async () => {
      try {
        setCargandoUnidades(true);
        // Aquí iría la llamada al servicio de unidades
        // const response = await unidadService.getAll();
        // setUnidades(response.data);
        
        // Simulación temporal
        setUnidades([
          { id: 1, nombre: 'Comando Departamental de Potosí', sigla: 'CDP' },
          { id: 2, nombre: 'EPI D-11 Achachicala', sigla: 'EPI D-11' },
        ]);
      } catch (error) {
        console.error('Error cargando unidades:', error);
      } finally {
        setCargandoUnidades(false);
      }
    };
    
    cargarUnidades();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const tiposVehiculo = [
    'Sedán', 'Camioneta', 'Patrullero', 'Motocicleta', 
    'Bus', 'Ambulancia', 'Camión', 'Otro'
  ];

  const colores = [
    'Blanco', 'Negro', 'Gris', 'Plateado', 'Azul', 
    'Rojo', 'Verde', 'Amarillo', 'Naranja', 'Marrón'
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: '1rem', md: '2rem' },
        borderRadius: '0.75rem',
        width: '100%',
      }}
    >
      <Typography variant="h6" sx={{ mb: '1.5rem', fontWeight: 'bold' }}>
        {vehiculo ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}
      </Typography>

      <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
        Complete todos los campos obligatorios (*) para registrar el vehículo en la flota institucional.
      </Alert>

      <form onSubmit={handleSubmit}>
        <Grid container spacing="1rem">
          
          {/* Placa (identificador único) */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Placa *"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              required
              size="small"
              helperText="Identificador único del vehículo"
            />
          </Grid>

          {/* Marca */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Marca *"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>

          {/* Modelo */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Modelo *"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>

          {/* Año */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Año *"
              name="anio"
              type="number"
              value={formData.anio}
              onChange={handleChange}
              required
              size="small"
              inputProps={{ 
                min: 1900, 
                max: new Date().getFullYear() + 1 
              }}
            />
          </Grid>

          {/* Color */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Color *</InputLabel>
              <Select
                name="color"
                value={formData.color}
                onChange={handleChange}
                label="Color *"
              >
                <MenuItem value=""><em>Seleccionar color</em></MenuItem>
                {colores.map(color => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Tipo */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Tipo *</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                label="Tipo *"
              >
                <MenuItem value=""><em>Seleccionar tipo</em></MenuItem>
                {tiposVehiculo.map(tipo => (
                  <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Estado Operativo */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Estado Operativo *</InputLabel>
              <Select
                name="estado_operativo"
                value={formData.estado_operativo}
                onChange={handleChange}
                label="Estado Operativo *"
              >
                <MenuItem value="Operativo">Operativo</MenuItem>
                <MenuItem value="En Taller">En Taller</MenuItem>
                <MenuItem value="Inoperativo">Inoperativo</MenuItem>
                <MenuItem value="Baja">Baja</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Unidad asignada */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Unidad Asignada</InputLabel>
              <Select
                name="unidad_id"
                value={formData.unidad_id}
                onChange={handleChange}
                label="Unidad Asignada"
                disabled={cargandoUnidades}
              >
                <MenuItem value=""><em>Sin asignar</em></MenuItem>
                {unidades.map(unidad => (
                  <MenuItem key={unidad.id} value={unidad.id}>
                    {unidad.nombre} ({unidad.sigla})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Kilometraje */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Kilometraje Actual *"
              name="kilometraje_actual"
              type="number"
              value={formData.kilometraje_actual}
              onChange={handleChange}
              required
              size="small"
              inputProps={{ min: 0 }}
              helperText="En kilómetros"
            />
          </Grid>

          {/* Fecha de adquisición */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha de Adquisición"
              name="fecha_adquisicion"
              type="date"
              value={formData.fecha_adquisicion}
              onChange={handleChange}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Observaciones */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              multiline
              rows={3}
              size="small"
              placeholder="Notas técnicas, características especiales, etc."
            />
          </Grid>

        </Grid>

        {/* Botones de acción */}
        <Box sx={{ 
          mt: '2rem', 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end' 
        }}>
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
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={loading}
            sx={{ borderRadius: '0.5rem' }}
          >
            {loading ? 'Guardando...' : 'Guardar Vehículo'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default VehiculoForm;
