import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useParams, useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import { asignacionService } from '../../services/AsignacionService';
import EstadoAsignacionBadge from '../../components/asignaciones/EstadoAsignacionBadge';
import useAuth from '../../auth/UseAuth';
import { hasPermission, hasAnyPermission } from '../../utils/hasPermission';

const ViewAsignacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [asignacion, setAsignacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [finalizando, setFinalizando] = useState(false);

    // PERMISOS - VERIFICACIÓN POR PERMISOS
    const puedeFinalizar = hasPermission(currentUser, 'finalizar_asignaciones');
    const puedeEditar = hasPermission(currentUser, 'editar_asignaciones');
    
    // Para acciones que requieren cualquiera de estos permisos
    const puedeEscribir = hasAnyPermission(currentUser, [
        'finalizar_asignaciones',
        'editar_asignaciones'
    ]);

    const esActiva = asignacion && !asignacion.fecha_retorno;

    useEffect(() => {
        cargarAsignacion();
    }, [id]);

    const cargarAsignacion = async () => {
        try {
            setLoading(true);
            const response = await asignacionService.getById(id);
            setAsignacion(response.data.data || response.data);
        } catch (error) {
            console.error('Error cargando asignación:', error);
            setError('Asignación no encontrada');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizar = async () => {
        if (!window.confirm('¿Finalizar esta asignación?')) return;
        
        try {
            setFinalizando(true);
            await asignacionService.finalizar(id);
            await cargarAsignacion();
        } catch (error) {
            console.error('Error finalizando asignación:', error);
            setError('Error al finalizar la asignación');
        } finally {
            setFinalizando(false);
        }
    };

    const handleVolver = () => {
        navigate('/asignaciones');
    };

    const handleEditar = () => {
        navigate(`/asignaciones/editar/${id}`);
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

    if (error || !asignacion) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>{error || 'Asignación no encontrada'}</Alert>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                {/* Encabezado */}
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
                            Asignación #{asignacion.id}
                        </Typography>
                        <EstadoAsignacionBadge esActiva={esActiva} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        {/* BOTÓN FINALIZAR - Solo si está activa Y tiene permiso */}
                        {esActiva && puedeFinalizar && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={handleFinalizar}
                                disabled={finalizando}
                            >
                                {finalizando ? 'Finalizando...' : 'Finalizar Asignación'}
                            </Button>
                        )}
                        {/* BOTÓN EDITAR - Solo si está finalizada Y tiene permiso */}
                        {!esActiva && puedeEditar && (
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={handleEditar}
                            >
                                Editar
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* TARJETA PRINCIPAL */}
                <Paper elevation={3} sx={{ p: '1.5rem', borderRadius: '0.75rem' }}>
                    <Grid container spacing="3rem">
                        {/* Vehículo asignado */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <DirectionsCarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Vehículo Asignado
                            </Typography>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        {asignacion.vehiculo?.placa || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {asignacion.vehiculo?.marca} {asignacion.vehiculo?.modelo} - {asignacion.vehiculo?.anio}
                                    </Typography>
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                        Sigla: {asignacion.vehiculo?.sigla || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Conductor */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Conductor
                            </Typography>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {asignacion.conductor?.nombre_completo || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        CI: {asignacion.conductor?.ci || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Licencia: {asignacion.conductor?.licencia || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Detalles de la asignación */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: '1rem' }} />
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Detalles de la Comisión
                            </Typography>
                            <Grid container spacing="2rem">
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Fecha de Asignación</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 0.5 }}>
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        {new Date(asignacion.fecha_asignacion).toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Fecha de Retorno</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 0.5 }}>
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        {asignacion.fecha_retorno 
                                            ? new Date(asignacion.fecha_retorno).toLocaleString() 
                                            : 'Pendiente'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary">Destino / Misión</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 0.5 }}>
                                        <LocationOnIcon fontSize="small" color="action" />
                                        {asignacion.destino}
                                    </Typography>
                                </Grid>
                                {asignacion.observaciones && (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                                        <Paper variant="outlined" sx={{ p: '0.75rem', bgcolor: 'action.hover', mt: 0.5 }}>
                                            <Typography variant="body2">{asignacion.observaciones}</Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                        {/* Registrado por */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: '1rem' }} />
                            <Typography variant="caption" color="text.secondary">
                                Registrado por: {asignacion.usuario?.nombre_completo || 'Sistema'}
                                {asignacion.created_at && ` - ${new Date(asignacion.created_at).toLocaleString()}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Layout>
    );
};

export default ViewAsignacion;