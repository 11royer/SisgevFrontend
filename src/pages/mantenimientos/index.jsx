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
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import MantenimientoTable from '../../components/mantenimientos/MantenimientoTable';
import { useMantenimientos } from '../../hooks/useMantenimientos';
import useAuth from '../../auth/UseAuth';
import { hasPermission, hasAnyPermission } from '../../utils/hasPermission';

const MantenimientosPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const {
        mantenimientos,
        loading,
        filtros,
        pagination,
        estadisticas,
        error,
        successMessage,
        aplicarFiltros,
        cambiarPagina,
        cambiarEstado,
        eliminarMantenimiento,
        limpiarMensajes,
    } = useMantenimientos();

    const [filtrosLocales, setFiltrosLocales] = useState({
        search: '',
        tipo: '',
        estado_mantenimiento: '',
        fecha_desde: '',
        fecha_hasta: '',
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const puedeCrear = hasPermission(currentUser, 'crear_mantenimientos');
    const puedeEditar = hasPermission(currentUser, 'editar_mantenimientos');
    const puedeEliminar = hasPermission(currentUser, 'eliminar_mantenimientos');
    const puedeCambiarEstado = hasPermission(currentUser, 'cambiar_estado_mantenimientos');
    
    // Para acciones que requieren cualquiera de estos permisos
    const puedeEscribir = hasAnyPermission(currentUser, [
        'crear_mantenimientos',
        'editar_mantenimientos',
        'eliminar_mantenimientos',
        'cambiar_estado_mantenimientos'
    ]);

    useEffect(() => {
        setFiltrosLocales(prev => ({
            ...prev,
            search: filtros.search || '',
            tipo: filtros.tipo || '',
            estado_mantenimiento: filtros.estado_mantenimiento || '',
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
        setFiltrosLocales({
            search: '',
            tipo: '',
            estado_mantenimiento: '',
            fecha_desde: '',
            fecha_hasta: '',
        });
        aplicarFiltros({});
    };

    const handleRefresh = () => {
        aplicarFiltros(filtros);
    };

    const handleNuevoMantenimiento = () => {
        navigate('/mantenimientos/crear');
    };

    const handleEditarMantenimiento = (mantenimiento) => {
        navigate(`/mantenimientos/editar/${mantenimiento.id}`);
    };

    const handleVerDetalle = (mantenimiento) => {
        navigate(`/mantenimientos/${mantenimiento.id}`);
    };

    const handleEliminar = (mantenimiento) => {
        if (window.confirm(`¿Eliminar el mantenimiento #${mantenimiento.id}? Esta acción no se puede deshacer.`)) {
            eliminarMantenimiento(mantenimiento.id);
        }
    };

    const tiposMantenimiento = [
        { value: '', label: 'Todos' },
        { value: 'Predictivo', label: 'Predictivo' },
        { value: 'Preventivo', label: 'Preventivo' },
        { value: 'Correctivo', label: 'Correctivo' },
    ];

    const estadosMantenimiento = [
        { value: '', label: 'Todos' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'en_proceso', label: 'En Proceso' },
        { value: 'finalizado', label: 'Finalizado' },
    ];

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
                        Gestión de Mantenimientos
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip title="Refrescar">
                            <span>
                                <IconButton onClick={handleRefresh} disabled={loading}>
                                    <RefreshIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {puedeCrear && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleNuevoMantenimiento}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Nuevo Mantenimiento
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* ESTADÍSTICAS */}
                {estadisticas && (
                    <Grid container spacing={2} sx={{ mb: '1.5rem' }}>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="secondary.main" fontWeight="bold">
                                    {estadisticas.totales_por_tipo?.Predictivo || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Predictivo</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="primary.main" fontWeight="bold">
                                    {estadisticas.totales_por_tipo?.Preventivo || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Preventivo</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="error.main" fontWeight="bold">
                                    {estadisticas.totales_por_tipo?.Correctivo || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Correctivo</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="warning.main" fontWeight="bold">
                                    {estadisticas.por_estado?.pendiente || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Pendientes</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="info.main" fontWeight="bold">
                                    {estadisticas.por_estado?.en_proceso || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">En Proceso</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="success.main" fontWeight="bold">
                                    {estadisticas.por_estado?.finalizado || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Finalizados</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

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

                {/* Nota informativa - Reglamento */}
                <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        Según Reglamento 2025 - Artículo 5.c: Mantenimiento Predictivo (detección de fallas), 
                        Preventivo (cada 5000 km o trimestral), Correctivo (reparación de piezas deterioradas).
                    </Typography>
                </Alert>

                {/* BARRA DE BÚSQUEDA */}
                <Paper elevation={2} sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Grid container spacing="1rem" alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por vehículo o descripción..."
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
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={filtrosLocales.tipo}
                                    onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                                    label="Tipo"
                                >
                                    {tiposMantenimiento.map(t => (
                                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
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
                                {(filtrosLocales.search || filtrosLocales.tipo || filtrosLocales.estado_mantenimiento) && (
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
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Estado</InputLabel>
                                        <Select
                                            value={filtrosLocales.estado_mantenimiento}
                                            onChange={(e) => handleFiltroChange('estado_mantenimiento', e.target.value)}
                                            label="Estado"
                                        >
                                            {estadosMantenimiento.map(e => (
                                                <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
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
                                <Grid size={{ xs: 12, md: 4 }}>
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

                {/* Tabla */}
                <MantenimientoTable
                    mantenimientos={mantenimientos}
                    loading={loading}
                    onEdit={puedeEditar ? handleEditarMantenimiento : null}
                    onDelete={puedeEliminar ? handleEliminar : null}
                    onView={handleVerDetalle}
                    onCambiarEstado={puedeCambiarEstado ? cambiarEstado : null}
                    pagination={pagination}
                    onPageChange={cambiarPagina}
                    puedeEditar={puedeEditar}
                    puedeEliminar={puedeEliminar}
                    puedeCambiarEstado={puedeCambiarEstado}
                />
            </Box>
        </Layout>
    );
};

export default MantenimientosPage;