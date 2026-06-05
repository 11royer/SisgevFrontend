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
import InventoryIcon from '@mui/icons-material/Inventory';

const RepuestoForm = ({ repuesto, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        codigo_interno: repuesto?.codigo_interno || '',
        nombre_repuesto: repuesto?.nombre_repuesto || '',
        descripcion: repuesto?.descripcion || '',
        cantidad_actual: repuesto?.cantidad_actual || 0,
        cantidad_minima: repuesto?.cantidad_minima || 5,
        activo: repuesto?.activo ?? true,
        ubicacion: repuesto?.ubicacion || '',
        vida_util_km: repuesto?.vida_util_km || '',
        vida_util_dias: repuesto?.vida_util_dias || '',
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        if (!formData.codigo_interno.trim()) {
            setError('El código interno es obligatorio');
            return false;
        }
        if (!formData.nombre_repuesto.trim()) {
            setError('El nombre del repuesto es obligatorio');
            return false;
        }
        if (formData.cantidad_actual < 0) {
            setError('La cantidad actual no puede ser negativa');
            return false;
        }
        if (formData.cantidad_minima < 0) {
            setError('La cantidad mínima no puede ser negativa');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        // Convertir tipos
        const dataToSubmit = {
            ...formData,
            cantidad_actual: parseInt(formData.cantidad_actual),
            cantidad_minima: parseInt(formData.cantidad_minima),
            vida_util_km: formData.vida_util_km ? parseInt(formData.vida_util_km) : null,
            vida_util_dias: formData.vida_util_dias ? parseInt(formData.vida_util_dias) : null,
        };

        onSubmit(dataToSubmit);
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '1.5rem' }}>
                <InventoryIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {repuesto ? 'Editar Repuesto' : 'Registrar Nuevo Repuesto'}
                </Typography>
            </Box>

            <Divider sx={{ mb: '2rem' }} />

            {error && (
                <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    {error}
                </Alert>
            )}

            <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                El código interno debe ser único en el sistema. El stock bajo se activa cuando cantidad actual ≤ cantidad mínima.
            </Alert>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Código Interno */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Código Interno *"
                            name="codigo_interno"
                            value={formData.codigo_interno}
                            onChange={handleChange}
                            required
                            size="small"
                            placeholder="Ej: FIL-001"
                            disabled={repuesto && !repuesto.activo}
                        />
                    </Grid>

                    {/* Nombre */}
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            label="Nombre del Repuesto *"
                            name="nombre_repuesto"
                            value={formData.nombre_repuesto}
                            onChange={handleChange}
                            required
                            size="small"
                            placeholder="Ej: Filtro de Aceite"
                        />
                    </Grid>

                    {/* Cantidad Actual */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Cantidad Actual *"
                            name="cantidad_actual"
                            type="number"
                            value={formData.cantidad_actual}
                            onChange={handleChange}
                            required
                            size="small"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>

                    {/* Cantidad Mínima */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Cantidad Mínima *"
                            name="cantidad_minima"
                            type="number"
                            value={formData.cantidad_minima}
                            onChange={handleChange}
                            required
                            size="small"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>

                    {/* Ubicación */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Ubicación en Almacén"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            size="small"
                            placeholder="Ej: Estante A2, Balda 3"
                        />
                    </Grid>

                    {/* Vida Útil KM */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Vida Útil (km)"
                            name="vida_util_km"
                            type="number"
                            value={formData.vida_util_km}
                            onChange={handleChange}
                            size="small"
                            placeholder="Ej: 10000"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>

                    {/* Vida Útil Días */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Vida Útil (días)"
                            name="vida_util_dias"
                            type="number"
                            value={formData.vida_util_dias}
                            onChange={handleChange}
                            size="small"
                            placeholder="Ej: 180"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>

                    {/* Descripción */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Descripción"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            size="small"
                            placeholder="Descripción detallada del repuesto..."
                        />
                    </Grid>

                    {/* Activo */}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="activo"
                                    checked={formData.activo}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label={formData.activo ? 'Activo (disponible para uso)' : 'Inactivo (no disponible)'}
                        />
                    </Grid>
                </Grid>

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
                        {loading ? 'Guardando...' : (repuesto ? 'Actualizar' : 'Registrar Repuesto')}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default RepuestoForm;