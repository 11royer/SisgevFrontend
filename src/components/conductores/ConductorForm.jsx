import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    Divider,
    CircularProgress,
    FormControlLabel,
    Switch,
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

/**
 * Formulario para crear/editar conductores
 * @param {Object} props
 * @param {Object} props.conductor - Datos del conductor (para edición)
 * @param {Function} props.onSubmit - Función al enviar
 * @param {Function} props.onCancel - Función al cancelar
 * @param {boolean} props.loading - Estado de carga
 */
const ConductorForm = ({ conductor, onSubmit, onCancel, loading }) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre_completo: conductor?.nombre_completo || '',
        ci: conductor?.ci || '',
        licencia: conductor?.licencia || '',
        telefono: conductor?.telefono || '',
        direccion: conductor?.direccion || '',
        estado: conductor?.estado ?? true,
        fecha_ingreso: conductor?.fecha_ingreso || new Date().toISOString().split('T')[0],
        observaciones: conductor?.observaciones || '',
    });

    const [error, setError] = useState(null);

    // Manejar cambios en los campos
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Validar antes de enviar
    const validateForm = () => {
        if (!formData.nombre_completo.trim()) {
            setError('El nombre completo es obligatorio');
            return false;
        }
        if (!formData.ci.trim()) {
            setError('El número de CI es obligatorio');
            return false;
        }
        if (!formData.licencia.trim()) {
            setError('El número de licencia es obligatorio');
            return false;
        }
        if (!formData.fecha_ingreso) {
            setError('La fecha de ingreso es obligatoria');
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
                <PersonAddIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {conductor ? 'Editar Conductor' : 'Registrar Nuevo Conductor'}
                </Typography>
            </Box>

            <Divider sx={{ mb: '2rem' }} />

            {/* Mostrar error si existe */}
            {error && (
                <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    {error}
                </Alert>
            )}

            {/* Nota informativa */}
            <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                Los campos marcados con (*) son obligatorios. El CI debe ser único en el sistema.
            </Alert>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Nombre Completo */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nombre Completo *"
                            name="nombre_completo"
                            value={formData.nombre_completo}
                            onChange={handleChange}
                            required
                            size="small"
                            placeholder="Ej: Juan Carlos Pérez Mamani"
                        />
                    </Grid>

                    {/* CI */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Cédula de Identidad *"
                            name="ci"
                            value={formData.ci}
                            onChange={handleChange}
                            required
                            size="small"
                            placeholder="Ej: 1234567"
                            inputProps={{ pattern: '[0-9]*' }}
                        />
                    </Grid>

                    {/* Licencia */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Número de Licencia *"
                            name="licencia"
                            value={formData.licencia}
                            onChange={handleChange}
                            required
                            size="small"
                            placeholder="Ej: 12345678"
                        />
                    </Grid>

                    {/* Teléfono */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Teléfono / Celular"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            size="small"
                            placeholder="Ej: 71234567"
                            inputProps={{ pattern: '[0-9]*' }}
                        />
                    </Grid>

                    {/* Fecha Ingreso */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Fecha de Ingreso *"
                            name="fecha_ingreso"
                            type="date"
                            value={formData.fecha_ingreso}
                            onChange={handleChange}
                            required
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Estado (Activo/Inactivo) */}
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="estado"
                                    checked={formData.estado}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label={formData.estado ? 'Activo' : 'Inactivo'}
                            sx={{ height: '100%', alignItems: 'center' }}
                        />
                    </Grid>

                    {/* Dirección */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Dirección Domiciliaria"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            size="small"
                            placeholder="Ej: Zona Central, Calle Junín N° 123"
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
                            placeholder="Notas adicionales sobre el conductor..."
                        />
                    </Grid>
                </Grid>

                {/* Botones de acción */}
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
                        {loading ? 'Guardando...' : 'Guardar Conductor'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default ConductorForm;