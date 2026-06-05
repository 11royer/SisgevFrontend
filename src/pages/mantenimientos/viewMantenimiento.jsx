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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';

import Layout from '../../layout/Layout';
import { mantenimientoService } from '../../services/MantenimientoService';
import { salidaRepuestoService } from '../../services/SalidaRepuestoService';
import { repuestoService } from '../../services/RepuestoService';
import EstadoMantenimientoBadge from '../../components/mantenimientos/EstadoMantenimientoBadge';
import useAuth from '../../auth/UseAuth';

const ViewMantenimiento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [mantenimiento, setMantenimiento] = useState(null);
    const [salidas, setSalidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para diálogo de agregar repuesto
    const [openDialog, setOpenDialog] = useState(false);
    const [repuestosDisponibles, setRepuestosDisponibles] = useState([]);
    const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null);
    const [cantidadUsada, setCantidadUsada] = useState(1);
    const [addingRepuesto, setAddingRepuesto] = useState(false);
    const [stockError, setStockError] = useState(null);
    
    // Estado para eliminar repuesto
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [salidaToDelete, setSalidaToDelete] = useState(null);

    const puedeEditar = ['Administrador', 'Técnico'].includes(currentUser?.rol?.nombre);
    const puedeFinalizar = puedeEditar && mantenimiento && mantenimiento.estado_mantenimiento !== 'finalizado';

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [mantenimientoRes, salidasRes] = await Promise.all([
                mantenimientoService.getById(id),
                salidaRepuestoService.getByMantenimiento(id)
            ]);
            
            setMantenimiento(mantenimientoRes.data.data || mantenimientoRes.data);
            setSalidas(salidasRes.data.data || salidasRes.data || []);
        } catch (error) {
            console.error('Error cargando mantenimiento:', error);
            setError('Error al cargar los datos del mantenimiento');
        } finally {
            setLoading(false);
        }
    };

    // Cargar repuestos disponibles para el diálogo
    const cargarRepuestosDisponibles = async () => {
        try {
            const response = await repuestoService.getAll({ activo: 'true', per_page: 100 });
            const data = response.data.data || response.data;
            // Filtrar repuestos con stock > 0
            const conStock = (Array.isArray(data) ? data : []).filter(r => r.cantidad_actual > 0);
            setRepuestosDisponibles(conStock);
        } catch (error) {
            console.error('Error cargando repuestos:', error);
        }
    };

    const handleOpenDialog = () => {
        cargarRepuestosDisponibles();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRepuestoSeleccionado(null);
        setCantidadUsada(1);
        setStockError(null);
    };

    const handleAgregarRepuesto = async () => {
        if (!repuestoSeleccionado) {
            setStockError('Debe seleccionar un repuesto');
            return;
        }
        if (cantidadUsada < 1) {
            setStockError('La cantidad debe ser mayor a 0');
            return;
        }
        if (cantidadUsada > repuestoSeleccionado.cantidad_actual) {
            setStockError(`Stock insuficiente. Disponible: ${repuestoSeleccionado.cantidad_actual}`);
            return;
        }

        try {
            setAddingRepuesto(true);
            await salidaRepuestoService.create({
                repuesto_id: repuestoSeleccionado.id,
                mantenimiento_id: parseInt(id),
                cantidad_usada: cantidadUsada,
                fecha: mantenimiento?.fecha || new Date().toISOString().split('T')[0],
                observaciones: `Consumo en mantenimiento #${id}`
            });
            
            // Recargar datos
            await cargarDatos();
            handleCloseDialog();
            
        } catch (error) {
            console.error('Error agregando repuesto:', error);
            setStockError(error.response?.data?.message || 'Error al agregar repuesto');
        } finally {
            setAddingRepuesto(false);
        }
    };

    const handleOpenDeleteDialog = (salida) => {
        setSalidaToDelete(salida);
        setDeleteDialogOpen(true);
    };

    const handleDeleteRepuesto = async () => {
        if (!salidaToDelete) return;
        
        try {
            await salidaRepuestoService.delete(salidaToDelete.id);
            await cargarDatos();
            setDeleteDialogOpen(false);
            setSalidaToDelete(null);
        } catch (error) {
            console.error('Error eliminando repuesto:', error);
            alert('Error al eliminar el repuesto');
        }
    };

    const handleEditar = () => {
        navigate(`/mantenimientos/editar/${id}`);
    };

    const handleVolver = () => {
        navigate('/mantenimientos');
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

    if (error || !mantenimiento) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>{error || 'Mantenimiento no encontrado'}</Alert>
            </Layout>
        );
    }

    const tiposColores = {
        'Predictivo': 'secondary',
        'Preventivo': 'primary',
        'Correctivo': 'error',
    };

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleVolver} size="small">
                            Volver
                        </Button>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Mantenimiento #{mantenimiento.id}
                        </Typography>
                        <Chip
                            label={mantenimiento.tipo}
                            color={tiposColores[mantenimiento.tipo] || 'default'}
                            size="medium"
                        />
                        <EstadoMantenimientoBadge estado={mantenimiento.estado_mantenimiento} />
                    </Box>
                    {puedeEditar && (
                        <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditar}>
                            Editar Mantenimiento
                        </Button>
                    )}
                </Box>

                {/* Información principal */}
                <Paper elevation={3} sx={{ p: '1.5rem', mb: '1.5rem', borderRadius: '0.75rem' }}>
                    <Grid container spacing="3rem">
                        {/* Vehículo */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <DirectionsCarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Vehículo
                            </Typography>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        {mantenimiento.vehiculo?.placa || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {mantenimiento.vehiculo?.marca} {mantenimiento.vehiculo?.modelo} - {mantenimiento.vehiculo?.anio}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Técnico */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Técnico Responsable
                            </Typography>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {mantenimiento.tecnico_responsable}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Registrado por: {mantenimiento.usuario?.nombre_completo || 'Sistema'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Detalles del mantenimiento */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: '1rem' }} />
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main' }}>
                                <BuildIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Detalles del Servicio
                            </Typography>
                            <Grid container spacing="2rem">
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="text.secondary">Fecha</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 0.5 }}>
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        {mantenimiento.fecha_formateada || new Date(mantenimiento.fecha).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="text.secondary">Kilometraje</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 0.5 }}>
                                        <SpeedIcon fontSize="small" color="action" />
                                        {mantenimiento.km_mantenimiento?.toLocaleString()} km
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="text.secondary">Costo</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 0.5 }}>
                                        <AttachMoneyIcon fontSize="small" color="action" />
                                        {mantenimiento.costo_formateado || `Bs. ${mantenimiento.costo?.toLocaleString() || 0}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">Descripción</Typography>
                                    <Paper variant="outlined" sx={{ p: '0.75rem', bgcolor: 'action.hover', mt: 0.5 }}>
                                        <Typography variant="body2">{mantenimiento.descripcion}</Typography>
                                    </Paper>
                                </Grid>
                                {mantenimiento.observaciones && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                                        <Paper variant="outlined" sx={{ p: '0.75rem', bgcolor: 'action.hover', mt: 0.5 }}>
                                            <Typography variant="body2">{mantenimiento.observaciones}</Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Repuestos Utilizados */}
                <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <Box sx={{ 
                        p: '1.5rem', 
                        borderBottom: '1px solid', 
                        borderColor: 'divider', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <InventoryIcon color="primary" />
                            Repuestos Utilizados
                            {salidas.length > 0 && (
                                <Chip label={`${salidas.length} repuesto(s)`} size="small" />
                            )}
                        </Typography>
                        {puedeEditar && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={handleOpenDialog}
                            >
                                Agregar Repuesto
                            </Button>
                        )}
                    </Box>
                    
                    {salidas.length === 0 ? (
                        <Box sx={{ p: '3rem', textAlign: 'center' }}>
                            <InventoryIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: '1rem' }} />
                            <Typography color="text.secondary">
                                No se registraron repuestos utilizados en este mantenimiento
                            </Typography>
                            {puedeEditar && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenDialog}
                                    sx={{ mt: 2 }}
                                >
                                    Agregar Repuesto
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Repuesto</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Cantidad</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                        {puedeEditar && <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salidas.map((salida) => (
                                        <TableRow key={salida.id} hover>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {salida.repuesto?.codigo_interno || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {salida.repuesto?.nombre_repuesto || 'N/A'}
                                                </Typography>
                                                {salida.observaciones && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {salida.observaciones}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={`${salida.cantidad_usada} unidad(es)`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(salida.fecha).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            {puedeEditar && (
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenDeleteDialog(salida)}
                                                        title="Eliminar repuesto"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>

            {/* Diálogo para agregar repuesto */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Agregar Repuesto al Mantenimiento</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {stockError && (
                            <Alert severity="warning" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setStockError(null)}>
                                {stockError}
                            </Alert>
                        )}
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={repuestosDisponibles}
                            getOptionLabel={(option) => `${option.codigo_interno} - ${option.nombre_repuesto} (Stock: ${option.cantidad_actual})`}
                            value={repuestoSeleccionado}
                            onChange={(event, newValue) => {
                                setRepuestoSeleccionado(newValue);
                                setStockError(null);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Seleccionar repuesto" required />
                            )}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Cantidad"
                            type="number"
                            size="small"
                            value={cantidadUsada}
                            onChange={(e) => {
                                setCantidadUsada(parseInt(e.target.value) || 1);
                                setStockError(null);
                            }}
                            InputProps={{ inputProps: { min: 1 } }}
                            helperText="Ingrese la cantidad de unidades utilizadas"
                            sx={{ mb: 2 }}
                        />
                        {repuestoSeleccionado && (
                            <Alert severity="info" sx={{ borderRadius: '0.5rem' }}>
                                Stock disponible: {repuestoSeleccionado.cantidad_actual} unidades
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={addingRepuesto}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAgregarRepuesto}
                        variant="contained"
                        color="primary"
                        disabled={addingRepuesto || !repuestoSeleccionado || cantidadUsada < 1}
                    >
                        {addingRepuesto ? <CircularProgress size={20} /> : 'Agregar Repuesto'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para eliminar repuesto */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Eliminar Repuesto</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro de eliminar el repuesto "{salidaToDelete?.repuesto?.nombre_repuesto}"?
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Esta acción revertirá el stock del repuesto.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteRepuesto} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default ViewMantenimiento;