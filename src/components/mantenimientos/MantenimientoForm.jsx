import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Divider,
    CircularProgress,
    Alert,
    Chip,
    Autocomplete,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import { vehiculoService } from '../../services/VehiculoService';
import { repuestoService } from '../../services/RepuestoService';

const MantenimientoForm = ({ mantenimiento, onSubmit, onCancel, loading }) => {
    // Estados del formulario
    const [formData, setFormData] = useState({
        vehiculo_id: mantenimiento?.vehiculo_id || '',
        tipo: mantenimiento?.tipo || '',
        descripcion: mantenimiento?.descripcion || '',
        fecha: mantenimiento?.fecha || new Date().toISOString().split('T')[0],
        km_mantenimiento: mantenimiento?.km_mantenimiento || '',
        costo: mantenimiento?.costo || '',
        estado_mantenimiento: mantenimiento?.estado_mantenimiento || 'pendiente',
        tecnico_responsable: mantenimiento?.tecnico_responsable || '',
        observaciones: mantenimiento?.observaciones || '',
    });

    // Estados para repuestos
    const [repuestosSeleccionados, setRepuestosSeleccionados] = useState([]);
    const [repuestosDisponibles, setRepuestosDisponibles] = useState([]);
    const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null);
    const [cantidadRepuesto, setCantidadRepuesto] = useState(1);

    const [vehiculos, setVehiculos] = useState([]);
    const [loadingVehiculos, setLoadingVehiculos] = useState(false);
    const [loadingRepuestos, setLoadingRepuestos] = useState(false);
    const [error, setError] = useState(null);
    const [stockError, setStockError] = useState(null);

    // Tipos de mantenimiento
    const tiposMantenimiento = [
        { value: 'Predictivo', label: 'Predictivo', description: 'Detección de posibles fallas en etapas incipientes' },
        { value: 'Preventivo', label: 'Preventivo', description: 'Cada 5000 km o trimestral' },
        { value: 'Correctivo', label: 'Correctivo', description: 'Reparación de piezas deterioradas' },
    ];

    const estadosMantenimiento = [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'en_proceso', label: 'En Proceso' },
        { value: 'finalizado', label: 'Finalizado' },
    ];

    // Cargar vehículos
    useEffect(() => {
        const cargarVehiculos = async () => {
            try {
                setLoadingVehiculos(true);
                const response = await vehiculoService.getAll({ per_page: 100 });
                const data = response.data.data || response.data;
                setVehiculos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error cargando vehículos:', error);
            } finally {
                setLoadingVehiculos(false);
            }
        };
        cargarVehiculos();
    }, []);

    // Cargar repuestos disponibles
    useEffect(() => {
        const cargarRepuestos = async () => {
            try {
                setLoadingRepuestos(true);
                const response = await repuestoService.getAll({ activo: 'true', per_page: 100 });
                const data = response.data.data || response.data;
                setRepuestosDisponibles(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error cargando repuestos:', error);
            } finally {
                setLoadingRepuestos(false);
            }
        };
        cargarRepuestos();
    }, []);

    // Cargar repuestos existentes del mantenimiento (para edición)
    useEffect(() => {
        if (mantenimiento?.salidas_repuestos && mantenimiento.salidas_repuestos.length > 0) {
            const repuestosCargados = mantenimiento.salidas_repuestos.map(sr => ({
                id: sr.repuesto?.id || sr.repuesto_id,
                codigo_interno: sr.repuesto?.codigo_interno,
                nombre_repuesto: sr.repuesto?.nombre_repuesto,
                cantidad: sr.cantidad_usada,
                stock_actual: sr.repuesto?.cantidad_actual || 0
            }));
            setRepuestosSeleccionados(repuestosCargados);
        }
    }, [mantenimiento]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Agregar repuesto a la lista
    const handleAgregarRepuesto = () => {
        if (!repuestoSeleccionado) {
            setStockError('Debe seleccionar un repuesto');
            return;
        }
        if (cantidadRepuesto < 1) {
            setStockError('La cantidad debe ser mayor a 0');
            return;
        }
        if (cantidadRepuesto > repuestoSeleccionado.cantidad_actual) {
            setStockError(`Stock insuficiente. Disponible: ${repuestoSeleccionado.cantidad_actual}`);
            return;
        }

        // Verificar si ya está agregado
        const yaExiste = repuestosSeleccionados.find(r => r.id === repuestoSeleccionado.id);
        if (yaExiste) {
            setStockError('Este repuesto ya está agregado');
            return;
        }

        setRepuestosSeleccionados(prev => [
            ...prev,
            {
                id: repuestoSeleccionado.id,
                repuesto_id: repuestoSeleccionado.id,
                codigo_interno: repuestoSeleccionado.codigo_interno,
                nombre_repuesto: repuestoSeleccionado.nombre_repuesto,
                cantidad: cantidadRepuesto,
                stock_actual: repuestoSeleccionado.cantidad_actual
            }
        ]);

        setRepuestoSeleccionado(null);
        setCantidadRepuesto(1);
        setStockError(null);
    };

    // Eliminar repuesto de la lista
    const handleEliminarRepuesto = (index) => {
        setRepuestosSeleccionados(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!formData.vehiculo_id) {
            setError('Debe seleccionar un vehículo');
            return false;
        }
        if (!formData.tipo) {
            setError('El tipo de mantenimiento es obligatorio');
            return false;
        }
        if (!formData.descripcion.trim()) {
            setError('La descripción es obligatoria');
            return false;
        }
        if (!formData.fecha) {
            setError('La fecha es obligatoria');
            return false;
        }
        if (!formData.km_mantenimiento || formData.km_mantenimiento < 0) {
            setError('El kilometraje es obligatorio');
            return false;
        }
        if (!formData.tecnico_responsable.trim()) {
            setError('El nombre del técnico responsable es obligatorio');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setStockError(null);

        if (!validateForm()) return;

        // Preparar datos con repuestos
        const dataToSubmit = {
            ...formData,
            km_mantenimiento: parseInt(formData.km_mantenimiento),
            costo: formData.costo ? parseFloat(formData.costo) : 0,
            repuestos: repuestosSeleccionados.map(r => ({
                repuesto_id: r.id,
                cantidad: r.cantidad,
                nombre_repuesto: r.nombre_repuesto
            }))
        };

        onSubmit(dataToSubmit);
    };

    return (
        <Paper elevation={3} sx={{ p: { xs: '1.5rem', md: '2rem' }, borderRadius: '0.75rem', width: '100%' }}>
            {/* Encabezado */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '1.5rem' }}>
                <BuildIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {mantenimiento ? 'Editar Mantenimiento' : 'Registrar Nuevo Mantenimiento'}
                </Typography>
            </Box>

            <Divider sx={{ mb: '2rem' }} />

            {/* Errores */}
            {error && (
                <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {stockError && (
                <Alert severity="warning" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }} onClose={() => setStockError(null)}>
                    {stockError}
                </Alert>
            )}

            {/* Nota informativa */}
            <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                <Typography variant="body2" fontWeight="bold">📋 Según Reglamento 2025 - Artículo 5.c:</Typography>
                <Typography variant="caption" display="block">• Predictivo: Detección de posibles fallas en etapas incipientes</Typography>
                <Typography variant="caption" display="block">• Preventivo: Cada 5000 km o trimestral</Typography>
                <Typography variant="caption" display="block">• Correctivo: Reparación de piezas deterioradas</Typography>
            </Alert>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Vehículo */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Vehículo *</InputLabel>
                            <Select
                                name="vehiculo_id"
                                value={formData.vehiculo_id}
                                onChange={handleChange}
                                label="Vehículo *"
                                disabled={loadingVehiculos}
                            >
                                <MenuItem value=""><em>Seleccionar vehículo</em></MenuItem>
                                {vehiculos.map((v) => (
                                    <MenuItem key={v.id} value={v.id}>
                                        {v.placa} - {v.marca} {v.modelo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Tipo */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Tipo de Mantenimiento *</InputLabel>
                            <Select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                label="Tipo de Mantenimiento *"
                            >
                                <MenuItem value=""><em>Seleccionar tipo</em></MenuItem>
                                {tiposMantenimiento.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>
                                        <Box>
                                            <Typography variant="body2">{t.label}</Typography>
                                            <Typography variant="caption" color="text.secondary">{t.description}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Fecha */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Fecha *"
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Kilometraje */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Kilometraje al Servicio *"
                            name="km_mantenimiento"
                            type="number"
                            value={formData.km_mantenimiento}
                            onChange={handleChange}
                            required
                            size="small"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>

                    {/* Costo */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Costo (Bs)"
                            name="costo"
                            type="number"
                            value={formData.costo}
                            onChange={handleChange}
                            size="small"
                            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                        />
                    </Grid>

                    {/* Estado */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Estado *</InputLabel>
                            <Select
                                name="estado_mantenimiento"
                                value={formData.estado_mantenimiento}
                                onChange={handleChange}
                                label="Estado *"
                            >
                                {estadosMantenimiento.map((e) => (
                                    <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Técnico */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Técnico Responsable *"
                            name="tecnico_responsable"
                            value={formData.tecnico_responsable}
                            onChange={handleChange}
                            required
                            size="small"
                            placeholder="Nombre del técnico CEMAPOL"
                        />
                    </Grid>

                    {/* Descripción */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Descripción del Trabajo *"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            required
                            multiline
                            rows={2}
                            size="small"
                            placeholder="Describa las tareas realizadas, piezas cambiadas, etc."
                        />
                    </Grid>

                    {/* SECCIÓN DE REPUESTOS */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InventoryIcon fontSize="small" color="primary" />
                            Repuestos Utilizados
                        </Typography>

                        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                            <Autocomplete
                                sx={{ flex: 2, minWidth: 200 }}
                                size="small"
                                options={repuestosDisponibles}
                                getOptionLabel={(option) => `${option.codigo_interno} - ${option.nombre_repuesto} (Stock: ${option.cantidad_actual})`}
                                value={repuestoSeleccionado}
                                onChange={(event, newValue) => setRepuestoSeleccionado(newValue)}
                                renderInput={(params) => <TextField {...params} label="Seleccionar repuesto" size="small" />}
                                disabled={loadingRepuestos}
                            />
                            <TextField
                                sx={{ width: 120 }}
                                label="Cantidad"
                                type="number"
                                size="small"
                                value={cantidadRepuesto}
                                onChange={(e) => setCantidadRepuesto(parseInt(e.target.value) || 1)}
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAgregarRepuesto} size="small">
                                Agregar
                            </Button>
                        </Box>

                        {repuestosSeleccionados.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">Repuestos a utilizar:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', mt: 1 }}>
                                    {repuestosSeleccionados.map((rep, idx) => (
                                        <Chip
                                            key={idx}
                                            label={`${rep.codigo_interno} - ${rep.nombre_repuesto}: ${rep.cantidad} unidad(es)`}
                                            onDelete={() => handleEliminarRepuesto(idx)}
                                            color="primary"
                                            variant="outlined"
                                            deleteIcon={<DeleteIcon />}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {loadingRepuestos && (
                            <Typography variant="caption" color="text.secondary">Cargando repuestos...</Typography>
                        )}
                    </Grid>

                    {/* Observaciones */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Observaciones Adicionales"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            size="small"
                            placeholder="Notas adicionales sobre el mantenimiento..."
                        />
                    </Grid>
                </Grid>

                {/* Botones */}
                <Box sx={{ mt: '3rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" color="error" onClick={onCancel} startIcon={<CancelIcon />} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading}>
                        {loading ? 'Guardando...' : (mantenimiento ? 'Actualizar' : 'Registrar Mantenimiento')}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default MantenimientoForm;