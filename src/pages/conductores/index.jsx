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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import ConductorTable from '../../components/conductores/ConductorTable';
import { useConductores } from '../../hooks/useConductores';
import useAuth from '../../auth/UseAuth';
import { hasPermission, hasAnyPermission } from '../../utils/hasPermission';

const ConductoresPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const {
        conductores,
        loading,
        filtros,
        pagination,
        error,
        successMessage,
        aplicarFiltros,
        cambiarPagina,
        eliminarConductor,
        limpiarMensajes,
    } = useConductores();

    // Estado local para filtros de UI
    const [filtrosLocales, setFiltrosLocales] = useState({
        search: '',
        estado: '',
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const puedeCrear = hasPermission(currentUser, 'crear_conductores');
    const puedeEditar = hasPermission(currentUser, 'editar_conductores');
    const puedeEliminar = hasPermission(currentUser, 'eliminar_conductores');
    
    // Para acciones que requieren cualquiera de estos permisos
    const puedeEscribir = hasAnyPermission(currentUser, [
        'crear_conductores',
        'editar_conductores',
        'eliminar_conductores'
    ]);

    // Sincronizar filtros locales con los aplicados
    useEffect(() => {
        setFiltrosLocales({
            search: filtros.search || '',
            estado: filtros.estado || '',
        });
    }, [filtros]);

    // Cerrar alertas automáticamente
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
        setFiltrosLocales({ search: '', estado: '' });
        aplicarFiltros({});
    };

    const handleRefresh = () => {
        aplicarFiltros(filtros);
    };

    const handleNuevoConductor = () => {
        navigate('/conductores/crear');
    };

    const handleEditarConductor = (conductor) => {
        navigate(`/conductores/editar/${conductor.id}`);
    };

    const handleVerDetalle = (conductor) => {
        navigate(`/conductores/${conductor.id}`);
    };

    const handleVerHistorial = (conductor) => {
        navigate(`/conductores/${conductor.id}/historial`);
    };

    const handleEliminarConductor = (conductor) => {
        if (window.confirm(`¿Está seguro de ${conductor.estado ? 'desactivar' : 'activar'} al conductor "${conductor.nombre_completo}"?`)) {
            eliminarConductor(conductor.id);
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
                        Gestión de Conductores
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
                                onClick={handleNuevoConductor}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Nuevo Conductor
                            </Button>
                        )}
                    </Box>
                </Box>

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
                        Registro de personal autorizado para conducir vehículos institucionales.
                        Los conductores inactivos no pueden ser asignados.
                    </Typography>
                </Alert>

                {/* BARRA DE BÚSQUEDA */}
                <Paper elevation={2} sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Grid container spacing="1rem" alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por nombre, CI o licencia..."
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
                        <Grid size={{ xs: 12, md: 6 }}>
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
                                {(filtrosLocales.search || filtrosLocales.estado) && (
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
                                            value={filtrosLocales.estado}
                                            onChange={(e) => handleFiltroChange('estado', e.target.value)}
                                            label="Estado"
                                        >
                                            <MenuItem value="">Todos</MenuItem>
                                            <MenuItem value="activo">Activos</MenuItem>
                                            <MenuItem value="inactivo">Inactivos</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>

                {/* Tabla de conductores */}
                <ConductorTable
                    conductores={conductores}
                    loading={loading}
                    onEdit={puedeEditar ? handleEditarConductor : null}
                    onDelete={puedeEliminar ? handleEliminarConductor : null}
                    onView={handleVerDetalle}
                    onHistory={handleVerHistorial}
                    pagination={pagination}
                    onPageChange={cambiarPagina}
                    puedeEditar={puedeEditar}
                    puedeEliminar={puedeEliminar}
                />
            </Box>
        </Layout>
    );
};

export default ConductoresPage;