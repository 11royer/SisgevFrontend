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

/** Formulario para crear/editar conductores */
const ConductorForm = ({ conductor, onSubmit, onCancel, loading }) => {
    // FUNCIÓN PARA NORMALIZAR FECHA A FORMATO YYYY-MM-DD
    const normalizarFecha = (fecha) => {
        if (!fecha) return new Date().toISOString().split('T')[0];
        
        // Si ya está en formato YYYY-MM-DD, devolverlo
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return fecha;
        }
        
        // Si está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
        if (fecha.includes('/')) {
            const partes = fecha.split('/');
            if (partes.length === 3) {
                return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
            }
        }
        
        // Si está en otro formato, intentar crear una fecha válida
        try {
            const date = new Date(fecha);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        } catch (e) {
            // Si falla, usar fecha actual
        }
        
        return new Date().toISOString().split('T')[0];
    };

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre_completo: conductor?.nombre_completo || '',
        ci: conductor?.ci || '',
        licencia: conductor?.licencia || '',
        telefono: conductor?.telefono || '',
        direccion: conductor?.direccion || '',
        estado: conductor?.estado ?? true,
        // NORMALIZAR FECHA DE INGRESO
        fecha_ingreso: normalizarFecha(conductor?.fecha_ingreso),
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
                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12, md: 3 }}>
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
                    <Grid size={{ xs: 12, md: 3 }}>
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
                    <Grid size={{ xs: 12, md: 4 }}>
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

                    {/* FECHA INGRESO */}
                    <Grid size={{ xs: 12, md: 4 }}>
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
                            // Asegurar que el valor siempre sea YYYY-MM-DD
                            inputProps={{
                                pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}'
                            }}
                        />
                    </Grid>

                    {/* Estado (Activo/Inactivo) */}
                    <Grid size={{ xs: 12, md: 4 }}>
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
                    <Grid size={{ xs: 12 }}>
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
                    <Grid size={{ xs: 12 }}>
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