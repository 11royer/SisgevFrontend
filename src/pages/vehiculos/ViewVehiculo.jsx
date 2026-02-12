import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import EstadoBadge from '../../components/vehiculos/EstadoBadge';
import { vehiculoService } from '../../services/VehiculoService';

const ViewVehiculo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vehiculo, setVehiculo] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    cargarDatosVehiculo();
  }, [id]);
  
  const cargarDatosVehiculo = async () => {
    try {
      setLoading(true);
      const response = await vehiculoService.getById(id);
      setVehiculo(response.data.data);
      
      const historialResponse = await vehiculoService.getHistorial(id);
      setHistorial(historialResponse.data.historial_completo);
    } catch (error) {
      console.error('Error cargando vehículo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditar = () => navigate(`/vehiculos/editar/${id}`);
  const handleVolver = () => navigate('/vehiculos');
  
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }
  
  if (!vehiculo) {
    return (
      <Layout>
        <Alert severity="error">Vehículo no encontrado</Alert>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
        
        {/* Encabezado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleVolver} size="small">
              Volver
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {vehiculo.marca} {vehiculo.modelo}
            </Typography>
            <Chip label={`Placa: ${vehiculo.placa}`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
            {vehiculo.sigla && <Chip label={`Sigla: ${vehiculo.sigla}`} color="secondary" variant="filled" size="small" />}
          </Box>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditar}>
            Editar Vehículo
          </Button>
        </Box>
        
        {/* Tarjeta de Información Detallada */}
        <Paper elevation={3} sx={{ p: '1.5rem', mb: '1.5rem', borderRadius: '0.75rem' }}>
          <Grid container spacing="2rem">
            
            {/* Columna 1: Identificación y Técnica */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #eee' }}>
                Datos Técnicos e Identificación
              </Typography>
              
              <Grid container spacing="1rem">
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nº Chasis (VIN)</Typography>
                  <Typography variant="body1" fontWeight="medium">{vehiculo.numero_chasis || 'No registrado'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nº Motor</Typography>
                  <Typography variant="body1" fontWeight="medium">{vehiculo.numero_motor || 'No registrado'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Marca / Modelo</Typography>
                  <Typography variant="body1">{vehiculo.marca} {vehiculo.modelo}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Año / Origen</Typography>
                  <Typography variant="body1">{vehiculo.anio} - {vehiculo.origen || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tipo / Color</Typography>
                  <Typography variant="body1">{vehiculo.tipo} - {vehiculo.color}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Motor / Capacidad</Typography>
                  <Typography variant="body1">{vehiculo.cilindrada ? `${vehiculo.cilindrada} cc` : 'N/A'} / {vehiculo.ocupantes} Pas.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Clasificación</Typography>
                  <Typography variant="body1">{vehiculo.clasificacion?.nombre || "Sin clasificación"}</Typography>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Columna 2: Estado y Logística */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #eee' }}>
                Ubicación y Estado Actual
              </Typography>
              
              <Grid container spacing="1rem">
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Estado Operativo</Typography>
                  <Box mt={0.5}><EstadoBadge estado={vehiculo.estado_operativo} /></Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Condición Física</Typography>
                  <Typography variant="body1" fontWeight="medium">{vehiculo.estado}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Ubicación (Distrito - Unidad)</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    {vehiculo.distrito} - {vehiculo.unidad ? vehiculo.unidad.nombre : 'Sin Unidad'}
                  </Typography>
                  {vehiculo.destino && (
                    <Typography variant="body2" color="text.secondary" ml={3}>
                      Destino: {vehiculo.destino}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Kilometraje Actual</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <SpeedIcon fontSize="small" color="action" />
                    {vehiculo.kilometraje_actual?.toLocaleString()} km
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Fuente Recepción</Typography>
                  <Typography variant="body1">{vehiculo.fuente_recepcion || 'Compra Regular'}</Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Observaciones */}
            {vehiculo.observaciones && (
              <Grid item xs={12}>
                <Divider sx={{ my: '0.5rem' }} />
                <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                <Paper variant="outlined" sx={{ p: '0.75rem', bgcolor: 'action.hover', mt: '0.25rem' }}>
                  <Typography variant="body2">{vehiculo.observaciones}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
        
        {/* Historial (Tabs) - Se mantiene igual que antes pero limpio */}
        <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Mantenimientos" icon={<BuildIcon />} iconPosition="start" />
            <Tab label="Asignaciones" icon={<AssignmentIcon />} iconPosition="start" />
            <Tab label="Documentos" icon={<DescriptionIcon />} iconPosition="start" />
          </Tabs>
          
          <Box sx={{ p: '1.5rem' }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Registros de Mantenimiento</Typography>
                {historial?.mantenimientos?.length > 0 ? (
                  <List dense>
                    {historial.mantenimientos.map((m, i) => (
                      <ListItem key={i} divider>
                        <ListItemIcon><BuildIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary={`${m.tipo} - ${new Date(m.fecha).toLocaleDateString()}`}
                          secondary={`${m.descripcion} (${m.estado_mantenimiento})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : <Alert severity="info">No hay mantenimientos registrados.</Alert>}
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Historial de Asignaciones</Typography>
                {historial?.asignaciones?.length > 0 ? (
                  <List dense>
                    {historial.asignaciones.map((a, i) => (
                      <ListItem key={i} divider>
                        <ListItemIcon><AssignmentIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary={a.destino}
                          secondary={`Asignado: ${new Date(a.fecha_asignacion).toLocaleDateString()} - Conductor: ${a.conductor?.nombre_completo || 'N/A'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : <Alert severity="info">No hay asignaciones registradas.</Alert>}
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Documentación Digital</Typography>
                {historial?.documentos?.length > 0 ? (
                  <Grid container spacing={2}>
                    {historial.documentos.map((d, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <DescriptionIcon color="error" fontSize="large" />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{d.tipo_documento}</Typography>
                            <Typography variant="caption" display="block">{new Date(d.fecha_subida).toLocaleDateString()}</Typography>
                            <Button size="small" href={d.archivo_url} target="_blank">Ver Archivo</Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : <Alert severity="info">No hay documentos adjuntos.</Alert>}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ViewVehiculo;