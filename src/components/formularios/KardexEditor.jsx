import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Divider,
    Button,
    TextField,
    CircularProgress,
    Alert,
    IconButton,
    Snackbar,
    Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import EstadoBadge from '../../components/vehiculos/EstadoBadge';
import { formularioService } from '../../services/formularioService';

const KardexEditor = ({
    vehiculoId,
    datos,
    actualizarCampo,
    guardarBorrador,
    exportarPDF,
    finalizar,
    loading,
    error,
    success,
    limpiarMensajes,
    vehiculo,
}) => {
    const navigate = useNavigate();
    const [fotos, setFotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [localSuccess, setLocalSuccess] = useState(null);

    useEffect(() => {
        cargarFotos();
    }, [vehiculoId]);

    // Efecto para mostrar snackbar
    useEffect(() => {
        if (error || success || localError || localSuccess) {
            setSnackbarOpen(true);
        }
    }, [error, success, localError, localSuccess]);

    const cargarFotos = async () => {
        try {
            const response = await formularioService.getByVehiculo(vehiculoId);
            setFotos(response.data.fotos || []);
        } catch (error) {
            console.error('Error cargando fotos:', error);
        }
    };

    const handleVolver = () => {
        navigate(`/vehiculos/${vehiculoId}`);
    };

    const handleVerHistorial = () => {
        navigate(`/formularios/historial/${vehiculoId}/12`);
    };

    const handleSubirFoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tamaño (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setLocalError('La imagen no debe superar los 2MB');
            return;
        }

        try {
            setUploading(true);
            await formularioService.subirFotoKardex(vehiculoId, file);
            await cargarFotos();
            setLocalSuccess('Foto subida correctamente');
            setTimeout(() => setLocalSuccess(null), 3000);
        } catch (error) {
            console.error('Error subiendo foto:', error);
            setLocalError('Error al subir la foto');
        } finally {
            setUploading(false);
        }
    };

    const handleEliminarFoto = async (documentoId) => {
        if (!window.confirm('¿Eliminar esta foto del Kárdex?')) return;
        try {
            await formularioService.eliminarFotoKardex(documentoId);
            await cargarFotos();
            setLocalSuccess('Foto eliminada correctamente');
            setTimeout(() => setLocalSuccess(null), 3000);
        } catch (error) {
            console.error('Error eliminando foto:', error);
            setLocalError('Error al eliminar la foto');
        }
    };

    const handleExportarKardex = async () => {
        try {
            const response = await formularioService.exportarKardex(vehiculoId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `KARDEX_${vehiculo?.placa || 'vehiculo'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exportando Kárdex:', error);
            setLocalError('Error al exportar el Kárdex');
        }
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

    if (!vehiculo) {
        return (
            <Layout>
                <Alert severity="error">Vehículo no encontrado</Alert>
            </Layout>
        );
    }

    // Obtener observaciones y firmas de datos o del vehículo
    const observaciones = datos?.observaciones || vehiculo.observaciones || '';
    const firmaJefeTransportes = datos?.firma_jefe_transportes || '';
    const firmaResponsable = datos?.firma_responsable || '';
    const firmaConductor = datos?.firma_conductor || '';
    const firmaJefeCemapol = datos?.firma_jefe_cemapol || '';

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
                            Kárdex del Vehículo (FORM. 12)
                        </Typography>
                        <Chip label={vehiculo.placa} color="primary" size="small" />
                        <Chip 
                            label={`${fotos.length}/4 fotos`} 
                            color={fotos.length > 0 ? 'success' : 'default'} 
                            size="small" 
                            variant="outlined"
                        />
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
                            onClick={handleExportarKardex}
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
                            disabled={loading}
                        >
                            Finalizar
                        </Button>
                    </Box>
                </Box>

                {/* Mensajes */}
                {(error || localError) && (
                    <Alert severity="error" onClose={limpiarMensajes || (() => setLocalError(null))} sx={{ mb: 2, borderRadius: '0.5rem' }}>
                        {error || localError}
                    </Alert>
                )}
                {(success || localSuccess) && (
                    <Alert severity="success" onClose={limpiarMensajes || (() => setLocalSuccess(null))} sx={{ mb: 2, borderRadius: '0.5rem' }}>
                        {success || localSuccess}
                    </Alert>
                )}

                {/* ============================================================
                    KÁRDEX COMPLETO
                    ============================================================ */}
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: '0.75rem' }}>
                    
                    {/* Encabezado institucional */}
                    <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px solid #1a3c5e' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a3c5e' }}>
                            COMANDO GENERAL
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                            DIR. NAL. ADMINISTRATIVA
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                            DPTO. NAL. DE TRANSPORTES
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                            "CE.MA.POL."
                        </Typography>
                        <Typography variant="h5" sx={{
                            fontWeight: 'bold',
                            color: '#1a3c5e',
                            mt: 1,
                            p: 1,
                            backgroundColor: '#e8edf2',
                            border: '1px solid #1a3c5e',
                            borderRadius: '0.5rem',
                            fontSize: '1.1rem'
                        }}>
                            KÁRDEX DEL VEHÍCULO - FORM. "CE.MA.POL." Nº 12
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                            Fecha de generación: {new Date().toLocaleString()}
                        </Typography>
                    </Box>

                    {/* ============================================================
                        REGISTRO FOTOGRÁFICO
                        ============================================================ */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            📸 REGISTRO FOTOGRÁFICO DEL VEHÍCULO
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                            {fotos.map((foto) => (
                                <Box
                                    key={foto.id}
                                    sx={{
                                        position: 'relative',
                                        width: 120,
                                        height: 90,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        border: '1px solid #ddd',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                >
                                    <img
                                        src={foto.archivo_url}
                                        alt={foto.descripcion}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 2,
                                            right: 2,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                        }}
                                        onClick={() => handleEliminarFoto(foto.id)}
                                    >
                                        <DeleteIcon sx={{ fontSize: 16, color: 'white' }} />
                                    </IconButton>
                                </Box>
                            ))}
                            {fotos.length < 4 && (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{ width: 120, height: 90, borderStyle: 'dashed', cursor: 'pointer' }}
                                    disabled={uploading}
                                >
                                    {uploading ? <CircularProgress size={24} /> : <AddIcon fontSize="large" />}
                                    <input type="file" hidden accept="image/*" onChange={handleSubirFoto} />
                                </Button>
                            )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            Máximo 4 fotos permitidas ({fotos.length}/4) - 2MB cada una
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* ============================================================
                        I. DATOS DE IDENTIFICACIÓN
                        ============================================================ */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        I. DATOS DE IDENTIFICACIÓN
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">PLACA</Typography>
                            <Typography variant="body2" fontWeight="bold">{vehiculo.placa}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">SIGLA</Typography>
                            <Typography variant="body2">{vehiculo.sigla || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">MARCA</Typography>
                            <Typography variant="body2">{vehiculo.marca}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">MODELO</Typography>
                            <Typography variant="body2">{vehiculo.modelo}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">AÑO</Typography>
                            <Typography variant="body2">{vehiculo.anio}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">COLOR</Typography>
                            <Typography variant="body2">{vehiculo.color}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Nº CHASIS (VIN)</Typography>
                            <Typography variant="body2">{vehiculo.numero_chasis || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Nº MOTOR</Typography>
                            <Typography variant="body2">{vehiculo.numero_motor || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">TIPO</Typography>
                            <Typography variant="body2">{vehiculo.tipo}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">CLASIFICACIÓN</Typography>
                            <Typography variant="body2">{vehiculo.clasificacion?.nombre || 'No clasificado'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">DISTRITO</Typography>
                            <Typography variant="body2">{vehiculo.distrito || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">UNIDAD</Typography>
                            <Typography variant="body2">{vehiculo.unidad?.nombre || 'No asignado'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">ESTADO OPERATIVO</Typography>
                            <Box mt={0.5}><EstadoBadge estado={vehiculo.estado_operativo} /></Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">KILOMETRAJE</Typography>
                            <Typography variant="body2">{vehiculo.kilometraje_actual?.toLocaleString()} km</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">ESTADO FÍSICO</Typography>
                            <Typography variant="body2">{vehiculo.estado}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">FUENTE RECEPCIÓN</Typography>
                            <Typography variant="body2">{vehiculo.fuente_recepcion || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">FECHA ADQUISICIÓN</Typography>
                            <Typography variant="body2">{vehiculo.fecha_adquisicion || 'N/A'}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* ============================================================
                        II. DATOS TÉCNICOS ADICIONALES
                        ============================================================ */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        II. DATOS TÉCNICOS ADICIONALES
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">CILINDRADA</Typography>
                            <Typography variant="body2">{vehiculo.cilindrada || 'N/A'} CC</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">OCUPANTES</Typography>
                            <Typography variant="body2">{vehiculo.ocupantes || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">ORIGEN</Typography>
                            <Typography variant="body2">{vehiculo.origen || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">DESTINO</Typography>
                            <Typography variant="body2">{vehiculo.destino || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">TRACCIÓN</Typography>
                            <Typography variant="body2">{vehiculo.traccion || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">TRANSMISIÓN</Typography>
                            <Typography variant="body2">{vehiculo.tipo_transmision || 'N/A'}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* ============================================================
                        III. HISTORIAL DE MANTENIMIENTOS (de BD)
                        ============================================================ */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        III. HISTORIAL DE MANTENIMIENTOS
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1, mb: 2, bgcolor: '#fafafa' }}>
                        <Typography variant="body2" color="text.secondary">
                            {vehiculo.mantenimientos?.length > 0 
                                ? `${vehiculo.mantenimientos.length} mantenimientos registrados` 
                                : 'Sin mantenimientos registrados'}
                        </Typography>
                        {/* Aquí se mostraría la tabla completa de mantenimientos si se desea */}
                    </Paper>

                    <Divider sx={{ my: 2 }} />

                    {/* ============================================================
                        IV. HISTORIAL DE ASIGNACIONES (de BD)
                        ============================================================ */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        IV. HISTORIAL DE ASIGNACIONES
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1, mb: 2, bgcolor: '#fafafa' }}>
                        <Typography variant="body2" color="text.secondary">
                            {vehiculo.asignaciones?.length > 0 
                                ? `${vehiculo.asignaciones.length} asignaciones registradas` 
                                : 'Sin asignaciones registradas'}
                        </Typography>
                    </Paper>

                    <Divider sx={{ my: 2 }} />

                    {/* ============================================================
                        V. DOCUMENTOS DEL VEHÍCULO (de BD)
                        ============================================================ */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        V. DOCUMENTOS DEL VEHÍCULO
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1, mb: 2, bgcolor: '#fafafa' }}>
                        <Typography variant="body2" color="text.secondary">
                            {vehiculo.documentos?.length > 0 
                                ? `${vehiculo.documentos.length} documentos registrados` 
                                : 'Sin documentos registrados'}
                        </Typography>
                    </Paper>

                    <Divider sx={{ my: 2 }} />

                    {/* ============================================================
                        VI. OBSERVACIONES GENERALES (EDITABLE)
                        ============================================================ */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        VI. OBSERVACIONES GENERALES
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={observaciones}
                        onChange={(e) => actualizarCampo('observaciones', e.target.value)}
                        placeholder="Ingrese observaciones generales..."
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                    />

                    <Divider sx={{ my: 2 }} />

                    {/* ============================================================
                        VII. FIRMAS (EDITABLES)
                        ============================================================ */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        VII. FIRMAS
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">JEFE DE TRANSPORTES</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Nombre completo"
                                value={firmaJefeTransportes}
                                onChange={(e) => actualizarCampo('firma_jefe_transportes', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">RESPONSABLE DEL VEHÍCULO</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Nombre completo"
                                value={firmaResponsable}
                                onChange={(e) => actualizarCampo('firma_responsable', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">CONDUCTOR ASIGNADO</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Nombre completo"
                                value={firmaConductor}
                                onChange={(e) => actualizarCampo('firma_conductor', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">JEFE CEMAPOL</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Nombre completo"
                                value={firmaJefeCemapol}
                                onChange={(e) => actualizarCampo('firma_jefe_cemapol', e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* ============================================================
                        BOTONES DE ACCIÓN
                        ============================================================ */}
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
                            onClick={handleExportarKardex}
                            disabled={loading}
                        >
                            Exportar PDF
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleFinalizar}
                            disabled={loading}
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
                        severity={(error || localError) ? 'error' : 'success'} 
                        variant="filled"
                    >
                        {error || localError || success || localSuccess}
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    );
};

export default KardexEditor;