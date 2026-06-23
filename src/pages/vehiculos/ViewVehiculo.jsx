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
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useParams, useNavigate } from 'react-router-dom';

// Importaciones de Layout y componentes
import Layout from '../../layout/Layout';
import EstadoBadge from '../../components/vehiculos/EstadoBadge';
import FormularioExportButton from '../../components/vehiculos/FormularioExportButton';
import KardexView from '../../components/vehiculos/KardexView';

// Importaciones de servicios
import { vehiculoService } from '../../services/VehiculoService';
import { documentoService } from '../../services/DocumentoService';

const ViewVehiculo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [vehiculo, setVehiculo] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [fotosKardex, setFotosKardex] = useState([]);
  
  // Estados para el menú de formularios
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Cargar datos del vehículo
  useEffect(() => {
    cargarDatosVehiculo();
  }, [id]);

  const cargarDatosVehiculo = async () => {
    try {
      setLoading(true);

      // 1. Cargar datos del vehículo
      const response = await vehiculoService.getById(id);
      setVehiculo(response.data.data);

      // 2. Cargar historial completo (mantenimientos, asignaciones, documentos)
      const historialResponse = await vehiculoService.getHistorial(id);
      setHistorial(historialResponse.data.historial_completo);

      // 3. Cargar fotos del Kárdex
      const fotosResponse = await documentoService.getByVehiculo(id);
      const fotos = fotosResponse.data.data || fotosResponse.data || [];

      // Filtrar solo fotos del Kárdex (tipo_documento === 'kardex')
      const fotosKardex = fotos.filter(doc => doc.tipo_documento === 'kardex');
      setFotosKardex(fotosKardex);

    } catch (error) {
      console.error('Error cargando vehículo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar subida de foto al Kárdex
  const handleFotoSubida = (nuevaFoto) => {
    setFotosKardex(prev => [...prev, nuevaFoto]);
  };

  // Manejar eliminación de foto del Kárdex
  const handleFotoEliminada = (documentoId) => {
    setFotosKardex(prev => prev.filter(f => f.id !== documentoId));
  };

  // Navegación
  const handleEditar = () => navigate(`/vehiculos/editar/${id}`);
  const handleVolver = () => navigate('/vehiculos');

  /**
   * Abrir el editor de un formulario específico
   */
  const handleAbrirEditor = (tipo) => {
    navigate(`/formularios/editar/${tipo}/${vehiculo.id}`);
    handleMenuClose();
  };

  /**
   * Abrir el menú de formularios
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Cerrar el menú de formularios
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Lista de formularios para el menú
  const tiposFormularios = [
    { id: '01', nombre: 'Inventario de Vehículos' },
    { id: '02', nombre: 'Diagnóstico Técnico' },
    { id: '03', nombre: 'Inventario de Motocicletas' },
    { id: '04', nombre: 'Orden de Trabajo y Solicitud de Mantenimiento' },
    { id: '05', nombre: 'Mantenimiento Correctivo' },
    { id: '06', nombre: 'Orden de Servicio por Taller Externo' },
    { id: '07', nombre: 'Inventario de Motocicleta' },
    { id: '08', nombre: 'Diagnóstico de Motocicleta' },
    { id: '09', nombre: 'Identificación de Motocicleta' },
    { id: '10', nombre: 'Mantenimiento Preventivo' },
    { id: '11', nombre: 'Mantenimiento Correctivo Moto' },
    { id: '12', nombre: 'Kárdex del Vehículo' },
  ];

  // Mostrar loading
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Mostrar error si no hay vehículo
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

        {/* ===== ENCABEZADO CON BOTONES DE FORMULARIOS ===== */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleVolver} size="small">
              Volver
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {vehiculo.marca} {vehiculo.modelo}
            </Typography>
            <Chip label={`Placa: ${vehiculo.placa}`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
            {vehiculo.sigla && <Chip label={`Sigla: ${vehiculo.sigla}`} color="secondary" variant="filled" size="small" />}
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Botón para exportar formularios (PDF fijos) */}
            <FormularioExportButton vehiculoId={vehiculo.id} variant="outlined" size="small" />
            
            {/* ============================================
                NUEVO: Botón para editar formularios dinámicos
                ============================================ */}
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DescriptionIcon />}
              onClick={handleMenuOpen}
              size="small"
              sx={{ borderRadius: '0.5rem' }}
            >
              Editar Formulario
            </Button>
            
            {/* Menú desplegable de formularios */}
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  maxHeight: 400,
                  width: '320px',
                  borderRadius: '0.75rem',
                  mt: 1,
                }
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  color: 'text.secondary',
                  display: 'block',
                  fontWeight: 'bold',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                ✏️ Seleccionar Formulario para Editar
              </Typography>
              
              {tiposFormularios.map((f) => (
                <MenuItem
                  key={f.id}
                  onClick={() => handleAbrirEditor(f.id)}
                  sx={{ py: 1 }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" fontWeight="medium">
                      FORM. {f.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {f.nombre}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditar}>
              Editar Vehículo
            </Button>
          </Box>
        </Box>

        {/* ===== TARJETA DE INFORMACIÓN DETALLADA ===== */}
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

        {/* ===== HISTORIAL CON PESTAÑAS (INCLUYE KÁRDEX) ===== */}
        <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Mantenimientos" icon={<BuildIcon />} iconPosition="start" />
            <Tab label="Asignaciones" icon={<AssignmentIcon />} iconPosition="start" />
            <Tab label="Documentos" icon={<DescriptionIcon />} iconPosition="start" />
            <Tab label="Kárdex (FORM. 12)" icon={<PhotoCameraIcon />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: '1.5rem' }}>

            {/* ===== PESTAÑA 0: MANTENIMIENTOS ===== */}
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
                ) : (
                  <Alert severity="info">No hay mantenimientos registrados.</Alert>
                )}
              </Box>
            )}

            {/* ===== PESTAÑA 1: ASIGNACIONES ===== */}
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
                ) : (
                  <Alert severity="info">No hay asignaciones registradas.</Alert>
                )}
              </Box>
            )}

            {/* ===== PESTAÑA 2: DOCUMENTOS ===== */}
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
                ) : (
                  <Alert severity="info">No hay documentos adjuntos.</Alert>
                )}
              </Box>
            )}

            {/* ===== PESTAÑA 3: KÁRDEX (FORM. 12) ===== */}
            {activeTab === 3 && (
              <Box>
                <KardexView
                  vehiculo={vehiculo}
                  fotos={fotosKardex}
                  onFotoSubida={handleFotoSubida}
                  onFotoEliminada={handleFotoEliminada}
                />
              </Box>
            )}

          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ViewVehiculo;