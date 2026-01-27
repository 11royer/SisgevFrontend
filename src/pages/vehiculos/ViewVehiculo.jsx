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
      
      // Cargar historial
      const historialResponse = await vehiculoService.getHistorial(id);
      setHistorial(historialResponse.data.historial_completo);
    } catch (error) {
      console.error('Error cargando vehículo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditar = () => {
    navigate(`/vehiculos/editar/${id}`);
  };
  
  const handleVolver = () => {
    navigate('/vehiculos');
  };
  
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
        
        {/* Encabezado con botones */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleVolver}
              size="small"
            >
              Volver
            </Button>
            
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {vehiculo.marca} {vehiculo.modelo}
            </Typography>
            
            <Chip
              label={`Placa: ${vehiculo.placa}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditar}
          >
            Editar Vehículo
          </Button>
        </Box>
        
        {/* Tarjeta de información principal */}
        <Paper elevation={3} sx={{ p: '1.5rem', mb: '1.5rem', borderRadius: '0.75rem' }}>
          <Grid container spacing="1.5rem">
            
            {/* Columna izquierda - Información básica */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold' }}>
                Información del Vehículo
              </Typography>
              
              <Grid container spacing="0.75rem">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
                    <DirectionsCarIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">Marca/Modelo:</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {vehiculo.marca} {vehiculo.modelo}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
                    <CalendarTodayIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">Año:</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {vehiculo.anio}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
                    <SpeedIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">Kilometraje:</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {vehiculo.kilometraje_actual.toLocaleString()} km
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
                    <LocationOnIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">Color:</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {vehiculo.color}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Columna derecha - Estados y unidad */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold' }}>
                Estado y Ubicación
              </Typography>
              
              <Grid container spacing="0.75rem">
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: '0.5rem' }}>
                    Estado Operativo:
                  </Typography>
                  <EstadoBadge estado={vehiculo.estado_operativo} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: '0.5rem' }}>
                    Estado General:
                  </Typography>
                  <EstadoBadge estado={vehiculo.estado} />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: '0.5rem' }}>
                    Unidad Asignada:
                  </Typography>
                  {vehiculo.unidad ? (
                    <Chip
                      label={`${vehiculo.unidad.sigla} - ${vehiculo.unidad.nombre}`}
                      variant="outlined"
                      sx={{ fontWeight: 'medium' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sin asignar
                    </Typography>
                  )}
                </Grid>
                
                {vehiculo.fecha_adquisicion && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: '0.5rem' }}>
                      Fecha de Adquisición:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(vehiculo.fecha_adquisicion).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            
            {/* Observaciones */}
            {vehiculo.observaciones && (
              <Grid item xs={12}>
                <Divider sx={{ my: '1rem' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: '0.5rem' }}>
                  Observaciones:
                </Typography>
                <Paper variant="outlined" sx={{ p: '1rem', bgcolor: 'action.hover' }}>
                  <Typography variant="body1">
                    {vehiculo.observaciones}
                  </Typography>
                </Paper>
              </Grid>
            )}
            
          </Grid>
        </Paper>
        
        {/* Tabs para historial */}
        <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Mantenimientos" icon={<BuildIcon />} iconPosition="start" />
            <Tab label="Asignaciones" icon={<AssignmentIcon />} iconPosition="start" />
            <Tab label="Documentos" icon={<DescriptionIcon />} iconPosition="start" />
          </Tabs>
          
          {/* Contenido de las tabs */}
          <Box sx={{ p: '1.5rem' }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: '1rem' }}>
                  Historial de Mantenimientos ({historial?.mantenimientos?.length || 0})
                </Typography>
                
                {historial?.mantenimientos?.length > 0 ? (
                  <List>
                    {historial.mantenimientos.map((mantenimiento, index) => (
                      <ListItem key={index} divider={index < historial.mantenimientos.length - 1}>
                        <ListItemIcon>
                          <BuildIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={mantenimiento.tipo}
                          secondary={`${mantenimiento.descripcion} - ${new Date(mantenimiento.fecha).toLocaleDateString()}`}
                        />
                        <Chip 
                          label={mantenimiento.estado_mantenimiento} 
                          size="small" 
                          color={mantenimiento.estado_mantenimiento === 'finalizado' ? 'success' : 'warning'}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">
                    No se encontraron registros de mantenimiento para este vehículo.
                  </Alert>
                )}
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: '1rem' }}>
                  Historial de Asignaciones ({historial?.asignaciones?.length || 0})
                </Typography>
                
                {historial?.asignaciones?.length > 0 ? (
                  <List>
                    {historial.asignaciones.map((asignacion, index) => (
                      <ListItem key={index} divider={index < historial.asignaciones.length - 1}>
                        <ListItemIcon>
                          <AssignmentIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={asignacion.destino || 'Sin destino especificado'}
                          secondary={`${new Date(asignacion.fecha_asignacion).toLocaleDateString()} - Conductor: ${asignacion.conductor?.nombre_completo || 'N/A'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">
                    No se encontraron asignaciones para este vehículo.
                  </Alert>
                )}
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: '1rem' }}>
                  Documentos Adjuntos ({historial?.documentos?.length || 0})
                </Typography>
                
                {historial?.documentos?.length > 0 ? (
                  <Grid container spacing="1rem">
                    {historial.documentos.map((documento, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper variant="outlined" sx={{ p: '1rem', borderRadius: '0.5rem' }}>
                          <DescriptionIcon sx={{ fontSize: '2rem', color: 'primary.main', mb: '0.5rem' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {documento.tipo_documento}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(documento.fecha_subida).toLocaleDateString()}
                          </Typography>
                          <Button
                            size="small"
                            href={documento.archivo_url}
                            target="_blank"
                            sx={{ mt: '0.5rem' }}
                          >
                            Ver documento
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No se encontraron documentos adjuntos para este vehículo.
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>
        
      </Box>
    </Layout>
  );
};

export default ViewVehiculo;