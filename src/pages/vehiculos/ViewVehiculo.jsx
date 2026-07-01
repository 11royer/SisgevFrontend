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
    IconButton,
    Tooltip,
    Card,
    CardContent,
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import EstadoBadge from '../../components/vehiculos/EstadoBadge';
import { vehiculoService } from '../../services/VehiculoService';
import { formularioService } from '../../services/FormularioService';
import FormulariosTab from '../../components/vehiculos/FormulariosTab';
import useAuth from '../../auth/UseAuth';

// COMPONENTE: DocumentosTab
const DocumentosTab = ({ vehiculoId, vehiculoPlaca }) => {
    const [fotos, setFotos] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { user: currentUser } = useAuth();

    const puedeEditar = ['Administrador', 'Operador'].includes(currentUser?.rol?.nombre);

    useEffect(() => {
        cargarDatos();
    }, [vehiculoId]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar fotos del Kárdex
            const response = await formularioService.getByVehiculo(vehiculoId);
            setFotos(response.data.fotos || []);

            // Aquí podrías cargar otros documentos (SOAT, ITV, etc.)
            // si tienes un endpoint para ellos
            // const docsResponse = await documentoService.getByVehiculo(vehiculoId);
            // setDocumentos(docsResponse.data || []);

        } catch (error) {
            console.error('Error cargando documentos:', error);
            setError('Error al cargar los documentos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubirFoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('La imagen no debe superar los 2MB');
            return;
        }

        try {
            setUploading(true);
            await formularioService.subirFotoKardex(vehiculoId, file);
            await cargarDatos();
            setSuccess('Foto subida correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error subiendo foto:', error);
            setError('Error al subir la foto');
        } finally {
            setUploading(false);
        }
    };

    const handleEliminarFoto = async (documentoId) => {
        if (!window.confirm('¿Eliminar esta foto del Kárdex?')) return;

        try {
            await formularioService.eliminarFotoKardex(documentoId);
            await cargarDatos();
            setSuccess('Foto eliminada correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error eliminando foto:', error);
            setError('Error al eliminar la foto');
        }
    };

    const handleExportarKardex = async () => {
        try {
            const response = await formularioService.exportarKardex(vehiculoId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `KARDEX_${vehiculoPlaca || 'vehiculo'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exportando Kárdex:', error);
            setError('Error al exportar el Kárdex');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/*
                SECCIÓN: KÁRDEX DEL MOTORIZADO - CON COLORES DEL TEMA
                */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: '0.75rem',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    backgroundColor: 'background.paper',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoCameraIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                            Kárdex del Motorizado
                        </Typography>
                        <Chip
                            label={`${fotos.length}/4 fotos`}
                            size="small"
                            color={fotos.length > 0 ? 'primary' : 'default'}
                            variant={fotos.length > 0 ? 'filled' : 'outlined'}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Exportar Kárdex (con fotos)">
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={handleExportarKardex}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Exportar PDF
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Grid de Fotos */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                    {fotos.map((foto) => (
                        <Box
                            key={foto.id}
                            sx={{
                                position: 'relative',
                                width: 120,
                                height: 90,
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                                backgroundColor: 'action.hover',
                            }}
                        >
                            <img
                                src={foto.archivo_url}
                                alt={foto.descripcion || 'Foto del vehículo'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {puedeEditar && (
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                                    }}
                                    onClick={() => handleEliminarFoto(foto.id)}
                                >
                                    <DeleteIcon sx={{ fontSize: 16, color: 'white' }} />
                                </IconButton>
                            )}
                            {foto.descripcion && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        padding: '2px 4px',
                                        fontSize: '0.6rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    {foto.descripcion}
                                </Typography>
                            )}
                        </Box>
                    ))}

                    {fotos.length < 4 && puedeEditar && (
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                width: 120,
                                height: 90,
                                borderStyle: 'dashed',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    borderColor: 'primary.dark',
                                    color: 'primary.dark',
                                },
                            }}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <CircularProgress size={24} color="primary" />
                            ) : (
                                <>
                                    <AddIcon fontSize="large" />
                                    <Typography variant="caption">Subir foto</Typography>
                                </>
                            )}
                            <input type="file" hidden accept="image/*" onChange={handleSubirFoto} />
                        </Button>
                    )}
                </Box>

                <Typography variant="caption" color="text.secondary">
                    Máximo 4 fotos (2MB cada una) - El Kárdex incluye el historial completo del vehículo
                </Typography>
            </Paper>

            {/*
                SECCIÓN: OTROS DOCUMENTOS (SOAT, ITV, etc.)
                */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                📄 Documentos del Vehículo
            </Typography>

            {documentos.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '0.5rem' }}>
                    No hay documentos adicionales registrados. Puedes subir SOAT, ITV, facturas, etc.
                </Alert>
            ) : (
                <Grid container spacing={2}>
                    {documentos.map((doc) => (
                        <Grid item xs={12} sm={6} md={4} key={doc.id}>
                            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <DescriptionIcon color="primary" fontSize="large" />
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">
                                        {doc.tipo_documento}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {new Date(doc.fecha_subida).toLocaleDateString()}
                                    </Typography>
                                    <Button size="small" href={doc.archivo_url} target="_blank" color="primary">
                                        Ver Archivo
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

// COMPONENTE PRINCIPAL: ViewVehiculo
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
                {/* ENCABEZADO */}
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

                {/* TARJETA DE INFORMACIÓN */}
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

                {/* TABS: MANTENIMIENTOS | ASIGNACIONES | DOCUMENTOS | FORMULARIOS */}
                <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, v) => setActiveTab(v)}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Mantenimientos" icon={<BuildIcon />} iconPosition="start" />
                        <Tab label="Asignaciones" icon={<AssignmentIcon />} iconPosition="start" />
                        <Tab label="Documentos" icon={<DescriptionIcon />} iconPosition="start" />
                        <Tab label="Formularios" icon={<DescriptionIcon />} iconPosition="start" />
                    </Tabs>

                    <Box sx={{ p: '1.5rem' }}>
                        {/* PESTAÑA 0: MANTENIMIENTOS */}
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

                        {/* PESTAÑA 1: ASIGNACIONES */}
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

                        {/* PESTAÑA 2: DOCUMENTOS ← KÁRDEX */}
                        {activeTab === 2 && (
                            <DocumentosTab vehiculoId={vehiculo.id} vehiculoPlaca={vehiculo.placa} />
                        )}

                        {/* PESTAÑA 3: FORMULARIOS */}
                        {activeTab === 3 && (
                            <FormulariosTab vehiculoId={vehiculo.id} vehiculoPlaca={vehiculo.placa} />
                        )}
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
};

export default ViewVehiculo;