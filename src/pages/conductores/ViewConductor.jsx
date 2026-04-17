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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Card,
    CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useParams, useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import { conductorService } from '../../services/ConductorService';
import useAuth from '../../auth/UseAuth';

const ViewConductor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [conductor, setConductor] = useState(null);
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const puedeEditar = ['Administrador', 'Operador'].includes(currentUser?.rol?.nombre);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const response = await conductorService.getHistorial(id);
            const data = response.data.data || response.data;
            setConductor(data.conductor || data);
            setAsignaciones(data.asignaciones || []);
        } catch (error) {
            console.error('Error cargando conductor:', error);
            setError('Error al cargar los datos del conductor');
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = () => {
        navigate(`/conductores/editar/${id}`);
    };

    const handleVolver = () => {
        navigate('/conductores');
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

    if (error || !conductor) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>{error || 'Conductor no encontrado'}</Alert>
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
                            {conductor.nombre_completo}
                        </Typography>
                        <Chip
                            label={conductor.estado ? 'Activo' : 'Inactivo'}
                            color={conductor.estado ? 'success' : 'error'}
                            size="small"
                        />
                    </Box>
                    {puedeEditar && (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEditar}
                        >
                            Editar Conductor
                        </Button>
                    )}
                </Box>

                {/* Tarjeta de información personal */}
                <Paper elevation={3} sx={{ p: '1.5rem', mb: '1.5rem', borderRadius: '0.75rem' }}>
                    <Grid container spacing="2rem">
                        {/* Avatar y datos básicos */}
                        <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: '8rem',
                                    height: '8rem',
                                    bgcolor: 'primary.main',
                                    mx: 'auto',
                                    mb: 1,
                                    fontSize: '3rem'
                                }}
                            >
                                <PersonIcon sx={{ fontSize: '4rem' }} />
                            </Avatar>
                            <Typography variant="h6">{conductor.nombre_completo}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {conductor.id}
                            </Typography>
                        </Grid>

                        {/* Datos personales */}
                        <Grid item xs={12} md={9}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                Datos Personales
                            </Typography>
                            <Grid container spacing="1.5rem">
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Cédula de Identidad</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <BadgeIcon fontSize="small" color="action" />
                                        {conductor.ci}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Licencia de Conducir</Typography>
                                    <Typography variant="body1">{conductor.licencia}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Teléfono</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <PhoneIcon fontSize="small" color="action" />
                                        {conductor.telefono || 'No registrado'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Fecha de Ingreso</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        {conductor.fecha_ingreso_formateada || conductor.fecha_ingreso}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">Dirección</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <HomeIcon fontSize="small" color="action" />
                                        {conductor.direccion || 'No registrada'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Observaciones */}
                        {conductor.observaciones && (
                            <Grid item xs={12}>
                                <Divider sx={{ my: '1rem' }} />
                                <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                                <Paper variant="outlined" sx={{ p: '0.75rem', bgcolor: 'action.hover', mt: '0.25rem' }}>
                                    <Typography variant="body2">{conductor.observaciones}</Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Paper>

                {/* Historial de asignaciones */}
                <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <Box sx={{ p: '1.5rem', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <AssignmentIcon color="primary" />
                            Historial de Asignaciones
                        </Typography>
                    </Box>
                    
                    {asignaciones.length === 0 ? (
                        <Box sx={{ p: '3rem', textAlign: 'center' }}>
                            <AssignmentIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: '1rem' }} />
                            <Typography color="text.secondary">
                                No hay asignaciones registradas para este conductor
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {asignaciones.map((asignacion, index) => (
                                <ListItem
                                    key={asignacion.id || index}
                                    divider={index < asignaciones.length - 1}
                                    sx={{ py: '1rem' }}
                                >
                                    <ListItemIcon>
                                        <DirectionsCarIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {asignacion.vehiculo?.placa} - {asignacion.vehiculo?.marca} {asignacion.vehiculo?.modelo}
                                                </Typography>
                                                <Chip
                                                    label={asignacion.fecha_retorno ? 'Finalizada' : 'Activa'}
                                                    size="small"
                                                    color={asignacion.fecha_retorno ? 'default' : 'success'}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="caption" display="block">
                                                    Asignación: {new Date(asignacion.fecha_asignacion).toLocaleString()}
                                                    {asignacion.fecha_retorno && ` - Retorno: ${new Date(asignacion.fecha_retorno).toLocaleDateString()}`}
                                                </Typography>
                                                <Typography variant="body2" color="primary">
                                                    Destino: {asignacion.destino}
                                                </Typography>
                                                {asignacion.observaciones && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {asignacion.observaciones}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Layout>
    );
};

export default ViewConductor;