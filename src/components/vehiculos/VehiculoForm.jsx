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
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const VehiculoForm = ({ vehiculo, onSubmit, onCancel, loading }) => {
  // 1. Estado actualizado con los nuevos atributos del Backend
  const [formData, setFormData] = useState({
    // Identificación
    placa: vehiculo?.placa || '',
    sigla: vehiculo?.sigla || '',               // NUEVO
    numero_chasis: vehiculo?.numero_chasis || '', // NUEVO
    numero_motor: vehiculo?.numero_motor || '',   // NUEVO
    
    // Datos Técnicos
    marca: vehiculo?.marca || '',
    modelo: vehiculo?.modelo || '',
    anio: vehiculo?.anio || new Date().getFullYear(),
    color: vehiculo?.color || '',
    tipo: vehiculo?.tipo || '',
    origen: vehiculo?.origen || '',             // NUEVO
    cilindrada: vehiculo?.cilindrada || '',     // NUEVO
    ocupantes: vehiculo?.ocupantes || 5,        // NUEVO

    // Estado
    estado: vehiculo?.estado || 'Bueno',        // Actualizado default
    estado_operativo: vehiculo?.estado_operativo || 'Operativo',
    en_servicio: vehiculo?.en_servicio ?? true,
    kilometraje_actual: vehiculo?.kilometraje_actual || 0,

    // Ubicación y Admin
    unidad_id: vehiculo?.unidad_id || '',
    distrito: vehiculo?.distrito || 'Potosí',   // NUEVO
    destino: vehiculo?.destino || '',           // NUEVO
    fecha_adquisicion: vehiculo?.fecha_adquisicion || '',
    fuente_recepcion: vehiculo?.fuente_recepcion || '', // NUEVO
    observaciones: vehiculo?.observaciones || '',
  });

  const [unidades, setUnidades] = useState([]);
  const [cargandoUnidades, setCargandoUnidades] = useState(false);

  useEffect(() => {
    const cargarUnidades = async () => {
      try {
        setCargandoUnidades(true);
        // Simulación temporal (reemplazar con servicio real)
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

  // Listas estáticas
  const tiposVehiculo = ['Sedán', 'Camioneta', 'Patrullero', 'Motocicleta', 'Bus', 'Ambulancia', 'Camión', 'Vagoneta', 'Otro'];
  const colores = ['Blanco', 'Negro', 'Gris', 'Plateado', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Naranja', 'Verde Olivo'];
  const distritos = ['Potosí', 'Uyuni', 'Tupiza', 'Villazón', 'Llallagua', 'Uncía', 'Cotagaita'];
  const estadosFisicos = ['Bueno', 'Regular', 'Deteriorado', 'Fuera de Uso'];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: '1rem', md: '2rem' },
        borderRadius: '0.75rem',
        width: '100%',
      }}
    >
      <Typography variant="h6" sx={{ mb: '1.5rem', fontWeight: 'bold', color: 'primary.main' }}>
        {vehiculo ? 'Editar Ficha Técnica del Vehículo' : 'Registrar Nuevo Vehículo'}
      </Typography>

      <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
        Los campos marcados con (*) son obligatorios para el registro legal del parque automotor.
      </Alert>

      <form onSubmit={handleSubmit}>
        <Grid container spacing="1.5rem">
          
          {/* --- SECCIÓN 1: IDENTIFICACIÓN POLICIAL (CRÍTICO) --- */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid #eee', pb: '0.5rem' }}>
              IDENTIFICACIÓN OFICIAL
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Placa *" name="placa"
              value={formData.placa} onChange={handleChange}
              required size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Sigla Policial" name="sigla"
              value={formData.sigla} onChange={handleChange}
              size="small" placeholder="Ej: M-105"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Nº Chasis (VIN) *" name="numero_chasis"
              value={formData.numero_chasis} onChange={handleChange}
              required size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Nº Motor *" name="numero_motor"
              value={formData.numero_motor} onChange={handleChange}
              required size="small"
            />
          </Grid>

          {/* --- SECCIÓN 2: CARACTERÍSTICAS TÉCNICAS --- */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid #eee', pb: '0.5rem', mt: '1rem' }}>
              DATOS TÉCNICOS
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Marca *" name="marca"
              value={formData.marca} onChange={handleChange}
              required size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Modelo *" name="modelo"
              value={formData.modelo} onChange={handleChange}
              required size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth label="Año *" name="anio" type="number"
              value={formData.anio} onChange={handleChange}
              required size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth label="Cilindrada (cc)" name="cilindrada" type="number"
              value={formData.cilindrada} onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth label="Ocupantes" name="ocupantes" type="number"
              value={formData.ocupantes} onChange={handleChange}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Tipo</InputLabel>
              <Select name="tipo" value={formData.tipo} onChange={handleChange} label="Tipo">
                {tiposVehiculo.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Color</InputLabel>
              <Select name="color" value={formData.color} onChange={handleChange} label="Color">
                {colores.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="País de Origen" name="origen"
              value={formData.origen} onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Kilometraje Actual *" name="kilometraje_actual" type="number"
              value={formData.kilometraje_actual} onChange={handleChange}
              required size="small"
            />
          </Grid>

          {/* --- SECCIÓN 3: ESTADO Y LOGÍSTICA --- */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid #eee', pb: '0.5rem', mt: '1rem' }}>
              UBICACIÓN Y ESTADO
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Distrito</InputLabel>
              <Select name="distrito" value={formData.distrito} onChange={handleChange} label="Distrito">
                {distritos.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Destino Operativo" name="destino"
              value={formData.destino} onChange={handleChange}
              size="small" placeholder="Ej: Radio Patrullas 110"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Unidad Institucional</InputLabel>
              <Select name="unidad_id" value={formData.unidad_id} onChange={handleChange} label="Unidad Institucional" disabled={cargandoUnidades}>
                <MenuItem value=""><em>Sin asignar</em></MenuItem>
                {unidades.map(u => <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Estado Físico</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange} label="Estado Físico">
                {estadosFisicos.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Estado Operativo</InputLabel>
              <Select name="estado_operativo" value={formData.estado_operativo} onChange={handleChange} label="Estado Operativo">
                <MenuItem value="Operativo">Operativo</MenuItem>
                <MenuItem value="En Taller">En Taller</MenuItem>
                <MenuItem value="Inoperativo">Inoperativo</MenuItem>
                <MenuItem value="Baja">Baja</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Fecha Adquisición" name="fecha_adquisicion" type="date"
              value={formData.fecha_adquisicion} onChange={handleChange}
              size="small" InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth label="Fuente Recepción" name="fuente_recepcion"
              value={formData.fuente_recepcion} onChange={handleChange}
              size="small" placeholder="Ej: DIRCABI, Donación"
            />
          </Grid>

          {/* Observaciones */}
          <Grid item xs={12}>
            <TextField
              fullWidth label="Observaciones Generales" name="observaciones"
              value={formData.observaciones} onChange={handleChange}
              multiline rows={2} size="small"
            />
          </Grid>

        </Grid>

        {/* Botones */}
        <Box sx={{ mt: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="error" onClick={onCancel} startIcon={<CancelIcon />} disabled={loading} sx={{ borderRadius: '0.5rem' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} disabled={loading} sx={{ borderRadius: '0.5rem' }}>
            {loading ? 'Guardando...' : 'Guardar Vehículo'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default VehiculoForm;