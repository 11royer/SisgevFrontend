import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { vehiculoService } from '../../services/VehiculoService';
import { conductorService } from '../../services/ConductorService';

/**
 * Formulario para crear/editar asignaciones
 */
const AsignacionForm = ({ asignacion, onSubmit, onCancel, loading }) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        vehiculo_id: asignacion?.vehiculo_id || '',
        conductor_id: asignacion?.conductor_id || '',
        fecha_asignacion: asignacion?.fecha_asignacion || new Date().toISOString().slice(0, 16),
        fecha_retorno: asignacion?.fecha_retorno || '',
        destino: asignacion?.destino || '',
        observaciones: asignacion?.observaciones || '',
    });

    // Estados para selects dinámicos
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [loadingVehiculos, setLoadingVehiculos] = useState(false);
    const [loadingConductores, setLoadingConductores] = useState(false);
    const [error, setError] = useState(null);

    // Cargar vehículos disponibles al montar
    useEffect(() => {
        const cargarVehiculos = async () => {
            try {
                setLoadingVehiculos(true);
                // Solo vehículos operativos
                const response = await vehiculoService.getAll({ 
                    estado_operativo: 'Operativo',
                    per_page: 100 
                });
                const data = response.data.data || response.data;
                setVehiculos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error cargando vehículos:', error);
            } finally {
                setLoadingVehiculos(false);
            }
        };

        const cargarConductores = async () => {
            try {
                setLoadingConductores(true);
                // Solo conductores activos
                const response = await conductorService.getAll({ 
                    estado: 'activo',
                    per_page: 100 
                });
                const data = response.data.data || response.data;
                setConductores(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error cargando conductores:', error);
            } finally {
                setLoadingConductores(false);
            }
        };

        cargarVehiculos();
        cargarConductores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.vehiculo_id) {
            setError('Debe seleccionar un vehículo');
            return false;
        }
        if (!formData.conductor_id) {
            setError('Debe seleccionar un conductor');
            return false;
        }
        if (!formData.destino.trim()) {
            setError('El destino es obligatorio');
            return false;
        }
        if (!formData.fecha_asignacion) {
            setError('La fecha de asignación es obligatoria');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        onSubmit(formData);
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: { xs: '1.5rem', md: '2rem' }, 
                borderRadius: '0.75rem',
                width: '100%'
            }}
        >
            {/* Encabezado */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '1.5rem' }}>
                <AssignmentIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {asignacion ? 'Editar Asignación' : 'Nueva Asignación de Vehículo'}
                </Typography>
            </Box>

            <Divider sx={{ mb: '2rem' }} />

            {/* Mostrar error */}
            {error && (
                <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    {error}
                </Alert>
            )}

            {/* Nota informativa */}
            <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                Solo se muestran vehículos operativos y conductores activos para asignación.
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
                                disabled={loadingVehiculos || (asignacion && asignacion.fecha_retorno)}
                            >
                                <MenuItem value="">
                                    <em>Seleccionar vehículo</em>
                                </MenuItem>
                                {vehiculos.map((v) => (
                                    <MenuItem key={v.id} value={v.id}>
                                        {v.placa} - {v.marca} {v.modelo}
                                    </MenuItem>
                                ))}
                            </Select>
                            {loadingVehiculos && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Cargando vehículos...
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Conductor */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Conductor *</InputLabel>
                            <Select
                                name="conductor_id"
                                value={formData.conductor_id}
                                onChange={handleChange}
                                label="Conductor *"
                                disabled={loadingConductores || (asignacion && asignacion.fecha_retorno)}
                            >
                                <MenuItem value="">
                                    <em>Seleccionar conductor</em>
                                </MenuItem>
                                {conductores.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.nombre_completo} - CI: {c.ci}
                                    </MenuItem>
                                ))}
                            </Select>
                            {loadingConductores && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Cargando conductores...
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Fecha Asignación */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Asignación *"
                            name="fecha_asignacion"
                            type="datetime-local"
                            value={formData.fecha_asignacion}
                            onChange={handleChange}
                            required
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            disabled={asignacion && asignacion.fecha_retorno}
                        />
                    </Grid>

                    {/* Fecha Retorno (solo lectura en edición) */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Retorno"
                            name="fecha_retorno"
                            type="datetime-local"
                            value={formData.fecha_retorno}
                            onChange={handleChange}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            disabled={!asignacion || !!asignacion.fecha_retorno}
                            helperText={asignacion?.fecha_retorno ? 'Asignación ya finalizada' : ''}
                        />
                    </Grid>

                    {/* Destino */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Destino / Misión *"
                            name="destino"
                            value={formData.destino}
                            onChange={handleChange}
                            required
                            size="small"
                            placeholder="Ej: Comisión a Uyuni - Traslado de personal"
                        />
                    </Grid>

                    {/* Observaciones */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Observaciones"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            size="small"
                            placeholder="Notas adicionales sobre la asignación..."
                        />
                    </Grid>
                </Grid>

                {/* Botones */}
                <Box sx={{ mt: '3rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onCancel}
                        startIcon={<CancelIcon />}
                        disabled={loading}
                        sx={{ borderRadius: '0.5rem' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                        sx={{ borderRadius: '0.5rem' }}
                    >
                        {loading ? 'Guardando...' : (asignacion ? 'Actualizar' : 'Asignar Vehículo')}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default AsignacionForm;