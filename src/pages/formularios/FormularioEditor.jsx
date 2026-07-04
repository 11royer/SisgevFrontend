import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Divider,
    Snackbar,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import Layout from '../../layout/Layout';
import { useFormulario } from '../../hooks/useFormulario';
import FormularioDinamico from '../../components/formularios/FormularioDinamico';
import FormularioHeader from '../../components/formularios/FormularioHeader';

const FormularioEditor = () => {
    const { tipo, vehiculoId } = useParams();
    const navigate = useNavigate();

    const {
        estructura,
        datos,
        loading,
        error,
        success,
        formularioId,
        vehiculo,
        actualizarCampo,
        guardarBorrador,
        finalizar,
        exportarPDF,
        limpiarMensajes,
    } = useFormulario(tipo, vehiculoId);

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Efecto para mostrar snackbar
    useEffect(() => {
        if (success || error) {
            setSnackbarOpen(true);
        }
    }, [success, error]);

    const handleVolver = () => {
        navigate(`/vehiculos/${vehiculoId}`);
    };

    const handleVerHistorial = () => {
        navigate(`/formularios/historial/${vehiculoId}/${tipo}`);
    };

    const handleGuardar = async () => {
        await guardarBorrador();
    };

    const handleFinalizar = async () => {
        if (window.confirm('¿Está seguro de finalizar este formulario? No podrá modificarlo después.')) {
            await finalizar();
            if (!error) {
                setTimeout(() => navigate(`/vehiculos/${vehiculoId}`), 2000);
            }
        }
    };

    const handleExportar = async () => {
        await exportarPDF();
    };

    // Validación de vehiculoId
    if (!vehiculoId) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    Error: No se ha especificado un vehículo válido.
                </Alert>
                <Button variant="contained" onClick={() => navigate('/vehiculos')}>
                    Volver a Vehículos
                </Button>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (!estructura) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    Formulario no encontrado. El tipo "{tipo}" no está configurado.
                </Alert>
                <Button variant="contained" onClick={() => navigate(`/vehiculos/${vehiculoId}`)}>
                    Volver al Vehículo
                </Button>
            </Layout>
        );
    }

    const camposObligatorios = Object.entries(estructura.campos || {})
        .filter(([_, config]) => config.obligatorio)
        .length;

    const camposCompletos = Object.entries(estructura.campos || {})
        .filter(([nombre, config]) => {
            if (!config.obligatorio) return true;
            const valor = datos[nombre];
            return valor !== undefined && valor !== null && valor !== '';
        })
        .length;

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                {/* Encabezado */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Tooltip title="Volver al vehículo">
                            <IconButton onClick={handleVolver} size="small">
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {estructura.titulo}
                        </Typography>
                        {vehiculo && (
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
                            </Typography>
                        )}
                        {formularioId && (
                            <Typography variant="caption" color="text.secondary">
                                ID: #{formularioId}
                            </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {camposCompletos}/{camposObligatorios} obligatorios completos
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Tooltip title="Ver historial">
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<HistoryIcon />}
                                onClick={handleVerHistorial}
                            >
                                Historial
                            </Button>
                        </Tooltip>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<SaveIcon />}
                            onClick={handleGuardar}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Borrador'}
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={handleExportar}
                            disabled={loading}
                        >
                            Exportar PDF
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleFinalizar}
                            disabled={loading || !formularioId}
                        >
                            Finalizar
                        </Button>
                    </Box>
                </Box>

                {/* Mensajes */}
                {error && (
                    <Alert severity="error" onClose={limpiarMensajes} sx={{ mb: 2, borderRadius: '0.5rem' }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" onClose={limpiarMensajes} sx={{ mb: 2, borderRadius: '0.5rem' }}>
                        {success}
                    </Alert>
                )}

                {/* Nota informativa */}
                <Alert severity="info" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        Complete los campos del formulario. Los campos con <strong style={{ color: 'red' }}>*</strong> son obligatorios.
                        Los datos del vehículo se precargan automáticamente.
                    </Typography>
                </Alert>

                {/* Formulario */}
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: '0.75rem' }}>
                    {/* Encabezado institucional */}
                    <FormularioHeader encabezado={estructura.encabezado} />
                    <Divider sx={{ my: 2 }} />

                    {/* Campos dinámicos */}
                    <FormularioDinamico
                        estructura={estructura}
                        datos={datos}
                        actualizarCampo={actualizarCampo}
                    />

                    <Divider sx={{ my: 3 }} />

                    {/* Botones de acción */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            onClick={handleVolver}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<SaveIcon />}
                            onClick={handleGuardar}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Borrador'}
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={handleExportar}
                            disabled={loading}
                        >
                            Exportar PDF
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleFinalizar}
                            disabled={loading || !formularioId}
                        >
                            Finalizar
                        </Button>
                    </Box>
                </Paper>

                {/* Snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={error ? 'error' : 'success'}
                        variant="filled"
                    >
                        {error || success}
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    );
};

export default FormularioEditor;