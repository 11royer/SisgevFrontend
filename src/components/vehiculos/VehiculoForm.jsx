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
import ClasificacionService from "../../services/ClasificacionService";

const VehiculoForm = ({ vehiculo, onSubmit, onCancel, loading }) => {

  // ESTADO INICIAL CON VALORES DEL PROP 'vehiculo'
  const [formData, setFormData] = useState({
    // IDENTIFICACIÓN
    placa: vehiculo?.placa || '',
    sigla: vehiculo?.sigla || '',
    numero_chasis: vehiculo?.numero_chasis || '',
    numero_motor: vehiculo?.numero_motor || '',
    clasificacion_id: vehiculo?.clasificacion_id || '',

    // DATOS TÉCNICOS
    marca: vehiculo?.marca || '',
    modelo: vehiculo?.modelo || '',
    anio: vehiculo?.anio || new Date().getFullYear(),
    color: vehiculo?.color || '',
    tipo: vehiculo?.tipo || '',
    origen: vehiculo?.origen || '',
    cilindrada: vehiculo?.cilindrada || '',
    ocupantes: vehiculo?.ocupantes || 5,

    // ESTADO
    estado: vehiculo?.estado || 'Bueno',
    estado_operativo: vehiculo?.estado_operativo || 'Operativo',
    en_servicio: vehiculo?.en_servicio ?? true,
    kilometraje_actual: vehiculo?.kilometraje_actual || 0,

    // UBICACIÓN
    unidad_id: vehiculo?.unidad_id || '',
    distrito: vehiculo?.distrito || 'Potosí',
    destino: vehiculo?.destino || '',
    fecha_adquisicion: vehiculo?.fecha_adquisicion || '',
    fuente_recepcion: vehiculo?.fuente_recepcion || '',
    observaciones: vehiculo?.observaciones || '',
  });

  const [unidades, setUnidades] = useState([]);
  const [cargandoUnidades, setCargandoUnidades] = useState(true);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [cargandoClasificaciones, setCargandoClasificaciones] = useState(true);

  // ACTUALIZAR CUANDO EL PROP 'vehiculo' CAMBIA
  useEffect(() => {
    if (vehiculo) {
      setFormData({
        placa: vehiculo.placa || '',
        sigla: vehiculo.sigla || '',
        numero_chasis: vehiculo.numero_chasis || '',
        numero_motor: vehiculo.numero_motor || '',
        clasificacion_id: vehiculo.clasificacion_id || '',
        marca: vehiculo.marca || '',
        modelo: vehiculo.modelo || '',
        anio: vehiculo.anio || new Date().getFullYear(),
        color: vehiculo.color || '',
        tipo: vehiculo.tipo || '',
        origen: vehiculo.origen || '',
        cilindrada: vehiculo.cilindrada || '',
        ocupantes: vehiculo.ocupantes || 5,
        estado: vehiculo.estado || 'Bueno',
        estado_operativo: vehiculo.estado_operativo || 'Operativo',
        en_servicio: vehiculo.en_servicio ?? true,
        kilometraje_actual: vehiculo.kilometraje_actual || 0,
        unidad_id: vehiculo.unidad_id || '',
        distrito: vehiculo.distrito || 'Potosí',
        destino: vehiculo.destino || '',
        fecha_adquisicion: vehiculo.fecha_adquisicion || '',
        fuente_recepcion: vehiculo.fuente_recepcion || '',
        observaciones: vehiculo.observaciones || '',
      });
    }
  }, [vehiculo]);

  // Cargar Unidades
  useEffect(() => {
    const cargarUnidades = async () => {
      try {
        setCargandoUnidades(true);
        // Aquí deberías obtener las unidades desde la API
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

  // Cargar Clasificaciones
  useEffect(() => {
    const cargarClasificaciones = async () => {
      try {
        setCargandoClasificaciones(true);
        const data = await ClasificacionService.getAll();
        setClasificaciones(Array.isArray(data) ? data : []);
        console.log('📋 Clasificaciones cargadas:', data); // Depuración
      } catch (error) {
        console.error('Error cargando clasificaciones:', error);
        setClasificaciones([]);
      } finally {
        setCargandoClasificaciones(false);
      }
    };
    cargarClasificaciones();
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

  const tiposVehiculo = ['Sedán', 'Camioneta', 'Patrullero', 'Motocicleta', 'Bus', 'Ambulancia', 'Camión', 'Vagoneta', 'Otro'];
  const colores = ['Blanco', 'Negro', 'Gris', 'Plateado', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Naranja', 'Verde Olivo', 'Otro'];
  const distritos = ['Potosí', 'Uyuni', 'Tupiza', 'Villazón', 'Llallagua', 'Uncía', 'Cotagaita', 'Otro'];
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
        <Grid container spacing={3}>

          {/* IDENTIFICACIÓN */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid #eee', pb: '0.5rem' }}>
              IDENTIFICACIÓN OFICIAL
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Placa *" name="placa" value={formData.placa} onChange={handleChange} required size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Sigla Policial" name="sigla" value={formData.sigla} onChange={handleChange} size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Nº Chasis (VIN) *" name="numero_chasis" value={formData.numero_chasis} onChange={handleChange} required size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Nº Motor *" name="numero_motor" value={formData.numero_motor} onChange={handleChange} required size="small" />
          </Grid>

          {/* CAMPO: CLASIFICACIÓN - CON VALIDACIÓN DE CARGA */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Clasificación</InputLabel>
              <Select
                name="clasificacion_id"
                value={cargandoClasificaciones ? '' : (formData.clasificacion_id || '')}
                onChange={handleChange}
                label="Clasificación"
                disabled={cargandoClasificaciones}
              >
                <MenuItem value="">
                  <em>Seleccionar</em>
                </MenuItem>
                {clasificaciones.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre}
                  </MenuItem>
                ))}
              </Select>
              {cargandoClasificaciones && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Cargando clasificaciones...
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* DATOS TÉCNICOS */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid #eee', pb: '0.5rem', mt: '1rem' }}>
              DATOS TÉCNICOS
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Marca *" name="marca" value={formData.marca} onChange={handleChange} required size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Modelo *" name="modelo" value={formData.modelo} onChange={handleChange} required size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField fullWidth label="Año *" name="anio" type="number" value={formData.anio} onChange={handleChange} required size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField fullWidth label="Cilindrada (cc)" name="cilindrada" type="number" value={formData.cilindrada} onChange={handleChange} size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField fullWidth label="Ocupantes" name="ocupantes" type="number" value={formData.ocupantes} onChange={handleChange} size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Tipo</InputLabel>
              <Select name="tipo" value={formData.tipo} onChange={handleChange} label="Tipo">
                {tiposVehiculo.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Color</InputLabel>
              <Select name="color" value={formData.color} onChange={handleChange} label="Color">
                {colores.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="País de Origen" name="origen" value={formData.origen} onChange={handleChange} size="small" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Kilometraje Actual *" name="kilometraje_actual" type="number" value={formData.kilometraje_actual} onChange={handleChange} required size="small" />
          </Grid>

          {/* UBICACIÓN Y ESTADO */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid #eee', pb: '0.5rem', mt: '1rem' }}>
              UBICACIÓN Y ESTADO
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Distrito</InputLabel>
              <Select name="distrito" value={formData.distrito} onChange={handleChange} label="Distrito">
                {distritos.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField 
              fullWidth 
              label="Destino Operativo" 
              name="destino" 
              value={formData.destino || ""} 
              onChange={handleChange} 
              size="small" 
            />
          </Grid>

          {/* CAMPO: UNIDAD INSTITUCIONAL - CON VALIDACIÓN DE CARGA */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Unidad Institucional</InputLabel>
              <Select 
                name="unidad_id" 
                value={cargandoUnidades ? '' : (formData.unidad_id || '')} 
                onChange={handleChange} 
                label="Unidad Institucional" 
                disabled={cargandoUnidades}
              >
                <MenuItem value=""><em>Sin asignar</em></MenuItem>
                {unidades.map(u => <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>)}
              </Select>
              {cargandoUnidades && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Cargando unidades...
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Estado Físico</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange} label="Estado Físico">
                {estadosFisicos.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
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

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Fecha Adquisición" name="fecha_adquisicion" type="date"
              value={formData.fecha_adquisicion}
              onChange={handleChange}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Fuente Recepción" name="fuente_recepcion"
              value={formData.fuente_recepcion}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Observaciones Generales"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              multiline rows={2}
              size="small"
            />
          </Grid>

        </Grid>

        <Box sx={{ mt: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="error" onClick={onCancel}
            startIcon={<CancelIcon />}
            disabled={loading}
            sx={{ borderRadius: '0.5rem' }}
          >
            Cancelar
          </Button>

          <Button type="submit"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            //  Deshabilitar mientras cargan clasificaciones o unidades
            disabled={loading || cargandoClasificaciones || cargandoUnidades}
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