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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BuildIcon from '@mui/icons-material/Build';
import { useParams, useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import { repuestoService } from '../../services/RepuestoService';
import StockBadge from '../../components/repuestos/StockBadge';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const ViewRepuesto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [repuesto, setRepuesto] = useState(null);
    const [salidas, setSalidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const puedeEditar = hasPermission(currentUser, 'editar_repuestos');

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const response = await repuestoService.getById(id);
            const data = response.data.data || response.data;
            setRepuesto(data);
            setSalidas(data.salidas_repuestos || []);
        } catch (error) {
            console.error('Error cargando repuesto:', error);
            setError('Error al cargar los datos del repuesto');
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = () => {
        navigate(`/repuestos/editar/${id}`);
    };

    const handleVolver = () => {
        navigate('/repuestos');
    };

    // Calcular porcentaje de stock
    const getStockPorcentaje = () => {
        if (!repuesto) return 0;
        const maximo = repuesto.cantidad_minima * 3;
        const porcentaje = (repuesto.cantidad_actual / maximo) * 100;
        return Math.min(porcentaje, 100);
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

    if (error || !repuesto) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>{error || 'Repuesto no encontrado'}</Alert>
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
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleVolver} size="small">
                            Volver
                        </Button>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {repuesto.nombre_repuesto}
                        </Typography>
                        <Chip
                            label={repuesto.codigo_interno}
                            color="primary"
                            variant="outlined"
                        />
                        <StockBadge 
                            cantidadActual={repuesto.cantidad_actual}
                            cantidadMinima={repuesto.cantidad_minima}
                        />
                    </Box>
                    {/* BOTÓN EDITAR - SOLO SI TIENE PERMISO */}
                    {puedeEditar && (
                        <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditar}>
                            Editar Repuesto
                        </Button>
                    )}
                </Box>

                {/* INFORMACIÓN PRINCIPAL */}
                <Paper elevation={3} sx={{ p: '1.5rem', mb: '1.5rem', borderRadius: '0.75rem' }}>
                    <Grid container spacing="3rem">
                        {/* Stock */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Control de Stock
                            </Typography>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Stock Actual</Typography>
                                        <Typography variant="h3" color="primary.main" fontWeight="bold">
                                            {repuesto.cantidad_actual}
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={getStockPorcentaje()}
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4,
                                            mb: 2,
                                            bgcolor: 'action.hover',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: getStockPorcentaje() < 30 ? 'error.main' : 'success.main'
                                            }
                                        }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Stock Mínimo: {repuesto.cantidad_minima} unidades
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                        {repuesto.cantidad_actual <= repuesto.cantidad_minima 
                                            ? '⚠️ Se recomienda reponer stock' 
                                            : '✓ Stock suficiente'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Ubicación y Vida Útil */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Almacenamiento y Vida Útil
                            </Typography>
                            <Card variant="outlined">
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="body2" color="text.secondary">Ubicación</Typography>
                                            <Typography variant="body1">
                                                {repuesto.ubicacion || 'No especificada'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                <SpeedIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                Vida Útil (km)
                                            </Typography>
                                            <Typography variant="body1">
                                                {repuesto.vida_util_km ? `${repuesto.vida_util_km.toLocaleString()} km` : 'No definida'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                Vida Útil (días)
                                            </Typography>
                                            <Typography variant="body1">
                                                {repuesto.vida_util_dias ? `${repuesto.vida_util_dias} días` : 'No definida'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Descripción */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: '1rem' }} />
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                Descripción
                            </Typography>
                            <Paper variant="outlined" sx={{ p: '0.75rem', bgcolor: 'action.hover' }}>
                                <Typography variant="body2">
                                    {repuesto.descripcion || 'Sin descripción registrada'}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Historial de salidas */}
                <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <Box sx={{ p: '1.5rem', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <BuildIcon color="primary" />
                            Historial de Salidas (Mantenimientos)
                        </Typography>
                    </Box>
                    
                    {salidas.length === 0 ? (
                        <Box sx={{ p: '3rem', textAlign: 'center' }}>
                            <InventoryIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: '1rem' }} />
                            <Typography color="text.secondary">
                                No hay registros de salidas para este repuesto
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {salidas.map((salida, index) => (
                                <ListItem key={salida.id || index} divider={index < salidas.length - 1}>
                                    <ListItemIcon>
                                        <BuildIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {salida.cantidad_usada} unidades
                                                </Typography>
                                                <Chip
                                                    label={new Date(salida.fecha).toLocaleDateString()}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="caption" display="block">
                                                    Mantenimiento #{salida.mantenimiento?.id}
                                                    {salida.mantenimiento?.vehiculo && ` - ${salida.mantenimiento.vehiculo.placa}`}
                                                </Typography>
                                                {salida.observaciones && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {salida.observaciones}
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

export default ViewRepuesto;