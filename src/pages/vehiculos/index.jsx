import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Alert,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Chip,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import VehiculoTable from '../../components/vehiculos/VehiculoTable';
import { useVehiculos } from '../../hooks/useVehiculos';
import useAuth from '../../auth/UseAuth';

// ===== LISTA COMPLETA DE DISTRITOS (SINCRONIZADA CON EL BACKEND) =====
const DISTRITOS_COMPLETOS = [
    'Potosí',
    'Uyuni',
    'Tupiza',
    'Villazón',
    'Llallagua',
    'Uncia',
    'Cotagaita'
];

const VehiculosPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const {
        vehiculos,
        loading,
        filtros,
        pagination,
        estadisticas,
        distritosDisponibles,
        error,
        successMessage,
        aplicarFiltros,
        cambiarPagina,
        cambiarEstado,
        eliminarVehiculo,
        limpiarMensajes,
    } = useVehiculos();

    const [filtrosLocales, setFiltrosLocales] = useState({
        search: '',
        estado_operativo: '',
        distrito: '',
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    
    // Estado para diálogo de eliminación
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vehiculoToDelete, setVehiculoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const puedeEscribir = ['Administrador', 'Operador'].includes(currentUser?.rol?.nombre);

    // ===== COMBINAR DISTRITOS: los que vienen del backend + los completos =====
    const distritosParaFiltro = React.useMemo(() => {
        // Si hay distritos disponibles del backend, usarlos (pueden tener más)
        // Si no, usar la lista completa
        if (distritosDisponibles && distritosDisponibles.length > 0) {
            // Combinar y eliminar duplicados
            const combinados = [...new Set([...DISTRITOS_COMPLETOS, ...distritosDisponibles])];
            return combinados.sort();
        }
        return DISTRITOS_COMPLETOS;
    }, [distritosDisponibles]);

    // Sincronizar filtros locales
    useEffect(() => {
        setFiltrosLocales({
            search: filtros.search || '',
            estado_operativo: filtros.estado_operativo || '',
            distrito: filtros.distrito || '',
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
        setFiltrosLocales({
            search: '',
            estado_operativo: '',
            distrito: '',
        });
        aplicarFiltros({});
    };

    const handleRefresh = () => {
        aplicarFiltros(filtros);
    };

    const handleNuevoVehiculo = () => {
        navigate('/vehiculos/crear');
    };

    const handleEditarVehiculo = (vehiculo) => {
        navigate(`/vehiculos/editar/${vehiculo.id}`);
    };

    const handleVerDetalle = (vehiculo) => {
        navigate(`/vehiculos/${vehiculo.id}`);
    };

    // ===== MANEJADOR DE ELIMINACIÓN CON DIÁLOGO =====
    const handleEliminarClick = (vehiculo) => {
        setVehiculoToDelete(vehiculo);
        setDeleteDialogOpen(true);
    };

    const handleConfirmarEliminar = async () => {
        if (!vehiculoToDelete) return;
        
        try {
            setDeleting(true);
            await eliminarVehiculo(vehiculoToDelete.id);
            setDeleteDialogOpen(false);
            setVehiculoToDelete(null);
        } catch (error) {
            console.error('Error en eliminación:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelarEliminar = () => {
        setDeleteDialogOpen(false);
        setVehiculoToDelete(null);
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
                        Gestión de Vehículos
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Tooltip title="Refrescar">
                            <IconButton onClick={handleRefresh} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        {puedeEscribir && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleNuevoVehiculo}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Nuevo Vehículo
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Estadísticas rápidas */}
                {estadisticas && (
                    <Grid container spacing={2} sx={{ mb: '1.5rem' }}>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="primary.main" fontWeight="bold">
                                    {estadisticas.total || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Total</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="success.main" fontWeight="bold">
                                    {estadisticas.operativos || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Operativos</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="warning.main" fontWeight="bold">
                                    {estadisticas.en_taller || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">En Taller</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="error.main" fontWeight="bold">
                                    {estadisticas.baja || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Baja</Typography>
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

                {/* Nota informativa */}
                <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        Control de la flota vehicular institucional. Los vehículos con asignaciones activas o 
                        mantenimientos no pueden ser eliminados, solo desactivados.
                    </Typography>
                </Alert>

                {/* Barra de búsqueda y filtros */}
                <Paper elevation={2} sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Grid container spacing="1rem" alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por placa, marca, modelo o distrito..."
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
                        <Grid item xs={12} md={7}>
                            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                    sx={{ flexShrink: 0 }}
                                >
                                    {mostrarFiltros ? 'Ocultar Filtros' : 'Más Filtros'}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleAplicarFiltros}
                                    disabled={loading}
                                    sx={{ flexShrink: 0 }}
                                >
                                    Buscar
                                </Button>
                                {(filtrosLocales.search || filtrosLocales.estado_operativo || filtrosLocales.distrito) && (
                                    <Button
                                        variant="text"
                                        startIcon={<ClearIcon />}
                                        onClick={handleLimpiarFiltros}
                                        sx={{ flexShrink: 0 }}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Filtros avanzados (colapsable) */}
                    {mostrarFiltros && (
                        <Box sx={{ mt: '1.5rem', pt: '1rem', borderTop: '1px solid', borderColor: 'divider' }}>
                            <Grid container spacing="1rem">
                                {/* FILTRO POR ESTADO OPERATIVO */}
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Estado Operativo</InputLabel>
                                        <Select
                                            value={filtrosLocales.estado_operativo}
                                            onChange={(e) => handleFiltroChange('estado_operativo', e.target.value)}
                                            label="Estado Operativo"
                                        >
                                            <MenuItem value="">Todos</MenuItem>
                                            <MenuItem value="Operativo">Operativo</MenuItem>
                                            <MenuItem value="En Taller">En Taller</MenuItem>
                                            <MenuItem value="Inoperativo">Inoperativo</MenuItem>
                                            <MenuItem value="Baja">Baja</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* ===== FILTRO POR DISTRITO - CON TODOS LOS DISTRITOS ===== */}
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Distrito</InputLabel>
                                        <Select
                                            value={filtrosLocales.distrito}
                                            onChange={(e) => handleFiltroChange('distrito', e.target.value)}
                                            label="Distrito"
                                        >
                                            <MenuItem value="">Todos los distritos</MenuItem>
                                            {distritosParaFiltro.map((distrito) => (
                                                <MenuItem key={distrito} value={distrito}>
                                                    {distrito}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Chip
                                        label={`${vehiculos.length} vehículos encontrados`}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>

                {/* Tabla de vehículos */}
                <VehiculoTable
                    vehiculos={vehiculos}
                    loading={loading}
                    onEdit={puedeEscribir ? handleEditarVehiculo : null}
                    onDelete={puedeEscribir ? handleEliminarClick : null}
                    onView={handleVerDetalle}
                    onEstadoChange={puedeEscribir ? cambiarEstado : null}
                    pagination={pagination}
                    onPageChange={cambiarPagina}
                />

                {/* ===== DIÁLOGO DE CONFIRMACIÓN PARA ELIMINAR ===== */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleCancelarEliminar}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteIcon color="error" />
                        Confirmar Eliminación
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Está seguro de que desea eliminar el vehículo?
                        </DialogContentText>
                        {vehiculoToDelete && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: '0.5rem' }}>
                                <Typography variant="body1">
                                    <strong>Placa:</strong> {vehiculoToDelete.placa}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Marca/Modelo:</strong> {vehiculoToDelete.marca} {vehiculoToDelete.modelo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Distrito:</strong> {vehiculoToDelete.distrito || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Estado:</strong> {vehiculoToDelete.estado_operativo}
                                </Typography>
                            </Box>
                        )}
                        <DialogContentText sx={{ mt: 2, color: 'warning.main' }}>
                            <strong>Nota:</strong> Los vehículos con asignaciones activas o mantenimientos 
                            no pueden ser eliminados completamente, solo se marcarán como BAJA.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelarEliminar} disabled={deleting}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmarEliminar}
                            variant="contained"
                            color="error"
                            disabled={deleting}
                            startIcon={deleting ? null : <DeleteIcon />}
                        >
                            {deleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default VehiculosPage;