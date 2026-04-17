import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    Grid,
    Alert,
    Collapse,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import AsignacionTable from '../../components/asignaciones/AsignacionTable';
import { useAsignaciones } from '../../hooks/useAsignaciones';
import useAuth from '../../auth/UseAuth';

const AsignacionesPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const {
        asignaciones,
        loading,
        filtros,
        pagination,
        error,
        successMessage,
        aplicarFiltros,
        cambiarPagina,
        finalizarAsignacion,
        eliminarAsignacion,
        limpiarMensajes,
    } = useAsignaciones();

    // Estado local para filtros
    const [filtrosLocales, setFiltrosLocales] = useState({
        search: '',
        estado: 'activa',
        fecha_desde: '',
        fecha_hasta: '',
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    
    const puedeEscribir = ['Administrador', 'Operador'].includes(currentUser?.rol?.nombre);

    useEffect(() => {
        setFiltrosLocales(prev => ({
            ...prev,
            search: filtros.search || '',
            estado: filtros.estado || 'activa',
            fecha_desde: filtros.fecha_desde || '',
            fecha_hasta: filtros.fecha_hasta || '',
        }));
    }, [filtros]);

    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => limpiarMensajes(), 5000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage, limpiarMensajes]);

    const handleFiltroChange = (name, value) => {
        setFiltrosLocales(prev => ({ ...prev, [name]: value }));
    };

    const handleAplicarFiltros = () => {
        aplicarFiltros(filtrosLocales);
    };

    const handleLimpiarFiltros = () => {
        setFiltrosLocales({ search: '', estado: 'activa', fecha_desde: '', fecha_hasta: '' });
        aplicarFiltros({ estado: 'activa' });
    };

    const handleRefresh = () => {
        aplicarFiltros(filtros);
    };

    const handleNuevaAsignacion = () => {
        navigate('/asignaciones/crear');
    };

    const handleVerDetalle = (asignacion) => {
        navigate(`/asignaciones/${asignacion.id}`);
    };

    const handleFinalizar = async (asignacion) => {
        if (window.confirm(`¿Finalizar asignación del vehículo ${asignacion.vehiculo?.placa}?`)) {
            await finalizarAsignacion(asignacion.id);
        }
    };

    const handleEliminar = (asignacion) => {
        if (window.confirm(`¿Eliminar esta asignación? Esta acción no se puede deshacer.`)) {
            eliminarAsignacion(asignacion.id);
        }
    };

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                {/* Encabezado */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Gestión de Asignaciones
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip title="Refrescar">
                            <IconButton onClick={handleRefresh} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        {puedeEscribir && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleNuevaAsignacion}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Nueva Asignación
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Estadísticas rápidas */}
                <Grid container spacing={2} sx={{ mb: '1.5rem' }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                                {pagination.activas || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Asignaciones Activas
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                            <Typography variant="h4" color="text.primary" fontWeight="bold">
                                {pagination.total || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Asignaciones
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Alertas */}
                <Collapse in={!!error || !!successMessage}>
                    <Box sx={{ mb: '1rem' }}>
                        {error && (
                            <Alert severity="error" onClose={limpiarMensajes} sx={{ borderRadius: '0.5rem' }}>
                                {error}
                            </Alert>
                        )}
                        {successMessage && (
                            <Alert severity="success" onClose={limpiarMensajes} sx={{ borderRadius: '0.5rem' }}>
                                {successMessage}
                            </Alert>
                        )}
                    </Box>
                </Collapse>

                {/* Nota informativa */}
                <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        Registro de asignaciones de vehículos a conductores. Las asignaciones activas no pueden ser editadas.
                    </Typography>
                </Alert>

                {/* Barra de búsqueda */}
                <Paper elevation={2} sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Grid container spacing="1rem" alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por vehículo, conductor o destino..."
                                value={filtrosLocales.search}
                                onChange={(e) => handleFiltroChange('search', e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleAplicarFiltros()}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={filtrosLocales.estado}
                                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                                    label="Estado"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="activa">Activas</MenuItem>
                                    <MenuItem value="finalizada">Finalizadas</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', gap: '1rem' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                >
                                    {mostrarFiltros ? 'Ocultar Filtros' : 'Más Filtros'}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleAplicarFiltros}
                                    disabled={loading}
                                >
                                    Buscar
                                </Button>
                                {(filtrosLocales.search || filtrosLocales.estado !== 'activa') && (
                                    <Button
                                        variant="text"
                                        startIcon={<ClearIcon />}
                                        onClick={handleLimpiarFiltros}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Filtros avanzados */}
                    {mostrarFiltros && (
                        <Box sx={{ mt: '1.5rem', pt: '1rem', borderTop: '1px solid', borderColor: 'divider' }}>
                            <Grid container spacing="1rem">
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Fecha Desde"
                                        type="date"
                                        value={filtrosLocales.fecha_desde}
                                        onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Fecha Hasta"
                                        type="date"
                                        value={filtrosLocales.fecha_hasta}
                                        onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>

                {/* Tabla de asignaciones */}
                <AsignacionTable
                    asignaciones={asignaciones}
                    loading={loading}
                    onView={handleVerDetalle}
                    onFinalizar={puedeEscribir ? handleFinalizar : null}
                    onDelete={puedeEscribir ? handleEliminar : null}
                    pagination={pagination}
                    onPageChange={cambiarPagina}
                />
            </Box>
        </Layout>
    );
};

export default AsignacionesPage;