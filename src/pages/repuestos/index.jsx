// PÁGINA PRINCIPAL DE REPUESTOS
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
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import RepuestoTable from '../../components/repuestos/RepuestoTable';
import StockUpdateDialog from '../../components/repuestos/StockUpdateDialog';
import { useRepuestos } from '../../hooks/useRepuestos';
import useAuth from '../../auth/UseAuth';

const RepuestosPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const {
        repuestos,
        loading,
        filtros,
        pagination,
        estadisticas,
        stockBajoCount,
        error,
        successMessage,
        aplicarFiltros,
        cambiarPagina,
        actualizarStock,
        eliminarRepuesto,
        limpiarMensajes,
    } = useRepuestos();

    const [filtrosLocales, setFiltrosLocales] = useState({
        search: '',
        activo: '',
        stock_bajo: false,
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [selectedRepuesto, setSelectedRepuesto] = useState(null);
    const [stockTipo, setStockTipo] = useState(null);
    const [updatingStock, setUpdatingStock] = useState(false);
    
    const puedeEscribir = ['Administrador', 'Técnico'].includes(currentUser?.rol?.nombre);

    useEffect(() => {
        setFiltrosLocales(prev => ({
            ...prev,
            search: filtros.search || '',
            activo: filtros.activo || '',
            stock_bajo: filtros.stock_bajo === true || filtros.stock_bajo === 'true',
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
            activo: '',
            stock_bajo: false,
        });
        aplicarFiltros({});
    };

    const handleRefresh = () => {
        aplicarFiltros(filtros);
    };

    const handleNuevoRepuesto = () => {
        navigate('/repuestos/crear');
    };

    const handleEditarRepuesto = (repuesto) => {
        navigate(`/repuestos/editar/${repuesto.id}`);
    };

    const handleVerDetalle = (repuesto) => {
        navigate(`/repuestos/${repuesto.id}`);
    };

    const handleActualizarStock = (repuesto, tipo) => {
        setSelectedRepuesto(repuesto);
        setStockTipo(tipo);
        setStockDialogOpen(true);
    };

    const handleConfirmStockUpdate = async (cantidad, observaciones) => {
        try {
            setUpdatingStock(true);
            await actualizarStock(selectedRepuesto.id, cantidad, stockTipo, observaciones);
            setStockDialogOpen(false);
            setSelectedRepuesto(null);
            setStockTipo(null);
        } catch (error) {
            console.error('Error actualizando stock:', error);
        } finally {
            setUpdatingStock(false);
        }
    };

    const handleEliminar = (repuesto) => {
        const mensaje = repuesto.activo 
            ? `¿Desactivar el repuesto "${repuesto.nombre_repuesto}"?`
            : `¿Eliminar permanentemente el repuesto "${repuesto.nombre_repuesto}"?`;
        
        if (window.confirm(mensaje)) {
            eliminarRepuesto(repuesto.id);
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
                        Gestión de Repuestos
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
                                onClick={handleNuevoRepuesto}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Nuevo Repuesto
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Tarjetas de estadísticas */}
                {estadisticas && (
                    <Grid container spacing={2} sx={{ mb: '1.5rem' }}>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="primary.main" fontWeight="bold">
                                    {estadisticas.total_repuestos || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Total Repuestos</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="success.main" fontWeight="bold">
                                    {estadisticas.activos || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Activos</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper 
                                sx={{ 
                                    p: '1rem', 
                                    textAlign: 'center', 
                                    borderRadius: '0.75rem',
                                    bgcolor: stockBajoCount > 0 ? 'error.light' : 'inherit',
                                    color: stockBajoCount > 0 ? 'white' : 'inherit'
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">
                                    {stockBajoCount || 0}
                                </Typography>
                                <Typography variant="caption">Stock Bajo</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                                <Typography variant="h5" color="info.main" fontWeight="bold">
                                    Bs. {estadisticas.valor_inventario?.toLocaleString() || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Valor Inventario</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {/* Alertas de stock bajo */}
                {stockBajoCount > 0 && (
                    <Alert 
                        severity="warning" 
                        icon={<WarningIcon />}
                        sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}
                        action={
                            <Button 
                                color="inherit" 
                                size="small" 
                                onClick={() => handleFiltroChange('stock_bajo', true)}
                            >
                                Ver
                            </Button>
                        }
                    >
                        Hay {stockBajoCount} repuesto(s) con stock bajo o crítico. Revise el inventario.
                    </Alert>
                )}

                {/* Alertas generales */}
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
                        Gestión de inventario de repuestos para mantenimientos. 
                        El stock bajo se activa cuando la cantidad actual es menor o igual a la cantidad mínima.
                    </Typography>
                </Alert>

                {/* Barra de búsqueda */}
                <Paper elevation={2} sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Grid container spacing="1rem" alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por código o nombre..."
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
                        <Grid item xs={12} md={6}>
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
                                {(filtrosLocales.search || filtrosLocales.activo || filtrosLocales.stock_bajo) && (
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
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Estado</InputLabel>
                                        <Select
                                            value={filtrosLocales.activo}
                                            onChange={(e) => handleFiltroChange('activo', e.target.value)}
                                            label="Estado"
                                        >
                                            <MenuItem value="">Todos</MenuItem>
                                            <MenuItem value="true">Activos</MenuItem>
                                            <MenuItem value="false">Inactivos</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Stock</InputLabel>
                                        <Select
                                            value={filtrosLocales.stock_bajo}
                                            onChange={(e) => handleFiltroChange('stock_bajo', e.target.value)}
                                            label="Stock"
                                        >
                                            <MenuItem value={false}>Todos</MenuItem>
                                            <MenuItem value={true}>Stock Bajo / Crítico</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>

                {/* Tabla */}
                <RepuestoTable
                    repuestos={repuestos}
                    loading={loading}
                    onEdit={puedeEscribir ? handleEditarRepuesto : null}
                    onDelete={puedeEscribir ? handleEliminar : null}
                    onView={handleVerDetalle}
                    onActualizarStock={puedeEscribir ? handleActualizarStock : null}
                    pagination={pagination}
                    onPageChange={cambiarPagina}
                />

                {/* Diálogo de actualización de stock */}
                <StockUpdateDialog
                    open={stockDialogOpen}
                    repuesto={selectedRepuesto}
                    tipo={stockTipo}
                    onClose={() => {
                        setStockDialogOpen(false);
                        setSelectedRepuesto(null);
                        setStockTipo(null);
                    }}
                    onConfirm={handleConfirmStockUpdate}
                    loading={updatingStock}
                />
            </Box>
        </Layout>
    );
};

export default RepuestosPage;