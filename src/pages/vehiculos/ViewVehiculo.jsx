import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Divider,
    Tabs,
    Tab,
    Button,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import EstadoBadge from '../../components/vehiculos/EstadoBadge';
import { vehiculoService } from '../../services/VehiculoService';
import { formularioService } from '../../services/FormularioService';
import FormulariosTab from '../../components/vehiculos/FormulariosTab';
import DocumentUploader from '../../components/vehiculos/DocumentUploader';
import useAuth from '../../auth/UseAuth';
import { hasPermission, hasAnyPermission } from '../../utils/hasPermission';

// COMPONENTE: DocumentosTab (MEJORADO CON SUBIDA)
const DocumentosTab = ({ vehiculoId, vehiculoPlaca }) => {
    const [fotos, setFotos] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { user: currentUser } = useAuth();

    // Estados para el diálogo de subida de documentos
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        tipo_documento: '',
        descripcion: '',
        archivo: null,
    });
    const [dialogLoading, setDialogLoading] = useState(false);

    const puedeSubirDocumentos = hasPermission(currentUser, 'subir_documentos');
    const puedeEliminarDocumentos = hasPermission(currentUser, 'eliminar_documentos');
    const puedeVerDocumentos = hasPermission(currentUser, 'ver_documentos');

    const tiposDocumento = [
        'SOAT',
        'Revisión Técnica',
        'Tarjeta de Circulación',
        'Póliza de Seguro',
        'Factura de Compra',
        'Manual del Propietario',
        'Mantenimiento',
        'Otro'
    ];

    useEffect(() => {
        cargarDatos();
    }, [vehiculoId]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Cargar Fotos del Kárdex
            const responseKardex = await formularioService.getByVehiculo(vehiculoId);
            setFotos(responseKardex.data.fotos || []);

            // 2. Cargar Documentos Reales (SOAT, ITV, etc.)
            const responseDocs = await vehiculoService.getDocumentos(vehiculoId);
            setDocumentos(responseDocs.data.data || responseDocs.data || []);

        } catch (error) {
            console.error('Error cargando documentos:', error);
            setError('Error al cargar los documentos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubirFoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setError('La imagen no debe superar los 2MB');
            return;
        }
        try {
            setUploading(true);
            await formularioService.subirFotoKardex(vehiculoId, file);
            await cargarDatos();
            setSuccess('Foto subida correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error subiendo foto:', error);
            setError('Error al subir la foto');
        } finally {
            setUploading(false);
        }
    };

    const handleEliminarFoto = async (documentoId) => {
        if (!window.confirm('¿Eliminar esta foto del Kárdex?')) return;
        try {
            await formularioService.eliminarFotoKardex(documentoId);
            await cargarDatos();
            setSuccess('Foto eliminada correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error eliminando foto:', error);
            setError('Error al eliminar la foto');
        }
    };

    const handleExportarKardex = async () => {
        try {
            const response = await formularioService.exportarKardex(vehiculoId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `KARDEX_${vehiculoPlaca || 'vehiculo'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exportando Kárdex:', error);
            setError('Error al exportar el Kárdex');
        }
    };

    // MANEJADORES DE DOCUMENTOS
    const handleOpenDialog = () => {
        setFormData({ tipo_documento: '', descripcion: '', archivo: null });
        setError(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ tipo_documento: '', descripcion: '', archivo: null });
    };

    const handleFileSelect = (file) => {
        setFormData(prev => ({ ...prev, archivo: file }));
    };

    const handleSubirDocumento = async () => {
        if (!formData.tipo_documento || !formData.archivo) {
            setError('Por favor complete todos los campos obligatorios');
            return;
        }

        try {
            setDialogLoading(true);
            setError(null);

            const data = new FormData();
            data.append('vehiculo_id', vehiculoId);
            data.append('tipo_documento', formData.tipo_documento);
            data.append('archivo', formData.archivo);
            if (formData.descripcion) {
                data.append('descripcion', formData.descripcion);
            }

            await vehiculoService.subirDocumento(data);

            await cargarDatos();
            setSuccess('Documento subido exitosamente');
            setTimeout(() => setSuccess(null), 3000);
            handleCloseDialog();

        } catch (error) {
            console.error('Error subiendo documento:', error);
            setError(error.response?.data?.message || 'Error al subir el documento');
        } finally {
            setDialogLoading(false);
        }
    };

    const handleEliminarDocumento = async (documentoId) => {
        if (!window.confirm('¿Eliminar este documento?')) return;
        try {
            await vehiculoService.eliminarDocumento(documentoId);
            await cargarDatos();
            setSuccess('Documento eliminado correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error eliminando documento:', error);
            setError('Error al eliminar el documento');
        }
    };

    // ============================================================
    // FUNCIÓN DE DESCARGA ROBUSTA (Maneja Base64 y URLs viejas)
    // ============================================================
    const descargarDocumento = (documento) => {
        try {
            const url = documento.archivo_url;

            // CASO 1: Es un data:URL (Base64 - documento nuevo)
            if (url && url.startsWith('data:')) {
                const partes = url.split(',');
                if (partes.length < 2) {
                    setError('El formato del documento es inválido');
                    return;
                }

                const header = partes[0];
                const base64Data = partes[1];

                if (!header.includes('base64')) {
                    setError('El documento no está en formato Base64');
                    return;
                }

                const mimeType = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream';

                // Determinar extensión
                let extension = 'bin';
                if (mimeType.includes('pdf')) extension = 'pdf';
                else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
                else if (mimeType.includes('png')) extension = 'png';

                // Convertir Base64 a Blob
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });

                // Crear URL temporal y descargar
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${documento.tipo_documento.replace(/\s+/g, '_')}_${documento.id}.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                return;
            }

            // CASO 2: Es un /storage/... (documento viejo - URL relativa)
            if (url && (url.startsWith('/storage') || url.startsWith('storage'))) {
                const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                const cleanBase = baseURL.replace(/\/api$/, '').replace(/\/$/, '');
                const cleanUrl = url.startsWith('/') ? url : '/' + url;
                const urlCompleta = `${cleanBase}${cleanUrl}`;
                window.open(urlCompleta, '_blank');
                return;
            }

            // CASO 3: Ya es una URL absoluta (http/https)
            if (url && url.startsWith('http')) {
                window.open(url, '_blank');
                return;
            }

            // CASO 4: No hay URL o formato desconocido
            setError('El documento no tiene una URL válida');

        } catch (error) {
            console.error('Error al descargar documento:', error);
            setError('Error al descargar el documento: ' + error.message);
        }
    };

    if (!puedeVerDocumentos) {
        return (
            <Alert severity="info" sx={{ borderRadius: '0.5rem' }}>
                No tienes permisos para ver los documentos del vehículo.
                Se requiere el permiso: <strong>ver_documentos</strong>
            </Alert>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* SECCIÓN KÁRDEX (FOTOS) */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: '0.75rem',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    backgroundColor: 'background.paper',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoCameraIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                            Kárdex del Motorizado
                        </Typography>
                        <Chip
                            label={`${fotos.length}/4 fotos`}
                            size="small"
                            color={fotos.length > 0 ? 'primary' : 'default'}
                            variant={fotos.length > 0 ? 'filled' : 'outlined'}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Exportar Kárdex (con fotos)">
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={handleExportarKardex}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Exportar PDF
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>

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
                                border: '1px solid',
                                borderColor: 'divider',
                                backgroundColor: 'action.hover',
                            }}
                        >
                            <img
                                src={foto.archivo_url}
                                alt={foto.descripcion || 'Foto del vehículo'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {puedeEliminarDocumentos && (
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                                    }}
                                    onClick={() => handleEliminarFoto(foto.id)}
                                >
                                    <DeleteIcon sx={{ fontSize: 16, color: 'white' }} />
                                </IconButton>
                            )}
                            {foto.descripcion && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        padding: '2px 4px',
                                        fontSize: '0.6rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    {foto.descripcion}
                                </Typography>
                            )}
                        </Box>
                    ))}

                    {fotos.length < 4 && puedeSubirDocumentos && (
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                width: 120,
                                height: 90,
                                borderStyle: 'dashed',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    borderColor: 'primary.dark',
                                    color: 'primary.dark',
                                },
                            }}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <CircularProgress size={24} color="primary" />
                            ) : (
                                <>
                                    <AddIcon fontSize="large" />
                                    <Typography variant="caption">Subir foto</Typography>
                                </>
                            )}
                            <input type="file" hidden accept="image/*" onChange={handleSubirFoto} />
                        </Button>
                    )}
                </Box>

                <Typography variant="caption" color="text.secondary">
                    Máximo 4 fotos (2MB cada una) - El Kárdex incluye el historial completo del vehículo
                </Typography>
            </Paper>

            {/*  SECCIÓN DOCUMENTOS DEL VEHÍCULO (SOAT, ITV, etc.) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    📄 Documentos del Vehículo
                </Typography>
                {puedeSubirDocumentos && (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleOpenDialog}
                        sx={{ borderRadius: '0.5rem' }}
                    >
                        Subir Documento
                    </Button>
                )}
            </Box>

            {documentos.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '0.5rem' }}>
                    No hay documentos adicionales registrados.
                    {puedeSubirDocumentos && ' Puedes subir SOAT, ITV, facturas, etc.'}
                </Alert>
            ) : (
                <Grid container spacing={2}>
                    {documentos.map((doc) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    borderRadius: '0.75rem',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: 2,
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <DescriptionIcon color="primary" fontSize="large" />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {doc.tipo_documento}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {new Date(doc.fecha_subida).toLocaleDateString()}
                                    </Typography>
                                    {doc.descripcion && (
                                        <Typography variant="caption" display="block" color="text.secondary" noWrap>
                                            {doc.descripcion}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Button
                                            size="small"
                                            onClick={() => descargarDocumento(doc)}
                                            color="primary"
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            sx={{ borderRadius: '0.5rem' }}
                                        >
                                            Descargar
                                        </Button>
                                        {puedeEliminarDocumentos && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleEliminarDocumento(doc.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/*  DIÁLOGO PARA SUBIR DOCUMENTO */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold" component="div">
                        Subir Nuevo Documento
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                                {error}
                            </Alert>
                        )}

                        <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
                            <InputLabel>Tipo de Documento *</InputLabel>
                            <Select
                                value={formData.tipo_documento}
                                onChange={(e) => setFormData(prev => ({ ...prev, tipo_documento: e.target.value }))}
                                label="Tipo de Documento *"
                                disabled={dialogLoading}
                            >
                                <MenuItem value=""><em>Seleccionar tipo</em></MenuItem>
                                {tiposDocumento.map(tipo => (
                                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Descripción (opcional)"
                            value={formData.descripcion}
                            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                            multiline
                            rows={2}
                            size="small"
                            disabled={dialogLoading}
                            sx={{ mb: 2 }}
                        />

                        <DocumentUploader
                            onFileSelect={handleFileSelect}
                            onError={(err) => setError(err)}
                            acceptedTypes=".pdf,.jpg,.jpeg,.png"
                            maxSizeMB={5}
                            label="Seleccionar archivo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} disabled={dialogLoading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubirDocumento}
                        variant="contained"
                        color="primary"
                        disabled={dialogLoading || !formData.tipo_documento || !formData.archivo}
                        startIcon={dialogLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    >
                        {dialogLoading ? 'Subiendo...' : 'Subir Documento'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};


// COMPONENTE PRINCIPAL: ViewVehiculo
const ViewVehiculo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [vehiculo, setVehiculo] = useState(null);
    const [historial, setHistorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const puedeEditar = hasPermission(currentUser, 'editar_vehiculos');
    const puedeVerDocumentos = hasPermission(currentUser, 'ver_documentos');
    const puedeVerFormularios = hasPermission(currentUser, 'ver_formularios');

    useEffect(() => {
        cargarDatosVehiculo();
    }, [id]);

    const cargarDatosVehiculo = async () => {
        try {
            setLoading(true);
            const response = await vehiculoService.getById(id);
            setVehiculo(response.data.data);

            const historialResponse = await vehiculoService.getHistorial(id);
            setHistorial(historialResponse.data.historial_completo);
        } catch (error) {
            console.error('Error cargando vehículo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = () => navigate(`/vehiculos/editar/${id}`);
    const handleVolver = () => navigate('/vehiculos');

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (!vehiculo) {
        return (
            <Layout>
                <Alert severity="error">Vehículo no encontrado</Alert>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                {/* ENCABEZADO */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleVolver} size="small">
                            Volver
                        </Button>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {vehiculo.marca} {vehiculo.modelo}
                        </Typography>
                        <Chip label={`Placa: ${vehiculo.placa}`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                        {vehiculo.sigla && <Chip label={`Sigla: ${vehiculo.sigla}`} color="secondary" variant="filled" size="small" />}
                    </Box>
                    {puedeEditar && (
                        <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditar}>
                            Editar Vehículo
                        </Button>
                    )}
                </Box>

                {/* TARJETA DE INFORMACIÓN */}
                <Paper elevation={3} sx={{ p: '1.5rem', mb: '1.5rem', borderRadius: '0.75rem' }}>
                    <Grid container spacing="2rem">
                        {/* Columna 1: Identificación y Técnica */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #eee' }}>
                                Datos Técnicos e Identificación
                            </Typography>
                            <Grid container spacing="1rem">
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Nº Chasis (VIN)</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {vehiculo.numero_chasis || 'No registrado'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Nº Motor</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {vehiculo.numero_motor || 'No registrado'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Marca / Modelo</Typography>
                                    <Typography variant="body1">{vehiculo.marca} {vehiculo.modelo}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Año / Origen</Typography>
                                    <Typography variant="body1">{vehiculo.anio} - {vehiculo.origen || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Tipo / Color</Typography>
                                    <Typography variant="body1">{vehiculo.tipo} - {vehiculo.color}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Motor / Capacidad</Typography>
                                    <Typography variant="body1">
                                        {vehiculo.cilindrada ? `${vehiculo.cilindrada} cc` : 'N/A'} / {vehiculo.ocupantes} Pas.
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="caption" color="text.secondary">Clasificación</Typography>
                                    <Typography variant="body1">{vehiculo.clasificacion?.nombre || "Sin clasificación"}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Columna 2: Estado y Logística */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ mb: '1rem', fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #eee' }}>
                                Ubicación y Estado Actual
                            </Typography>
                            <Grid container spacing="1rem">
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Estado Operativo</Typography>
                                    <Box mt={0.5}><EstadoBadge estado={vehiculo.estado_operativo} /></Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Condición Física</Typography>
                                    <Typography variant="body1" fontWeight="medium">{vehiculo.estado}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary">Ubicación (Distrito - Unidad)</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <LocationOnIcon fontSize="small" color="action" />
                                        {vehiculo.distrito} - {vehiculo.unidad ? vehiculo.unidad.nombre : 'Sin Unidad'}
                                    </Typography>
                                    {vehiculo.destino && (
                                        <Typography variant="body2" color="text.secondary" ml={3}>
                                            Destino: {vehiculo.destino}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Kilometraje Actual</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <SpeedIcon fontSize="small" color="action" />
                                        {vehiculo.kilometraje_actual?.toLocaleString()} km
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Fuente Recepción</Typography>
                                    <Typography variant="body1">{vehiculo.fuente_recepcion || 'Compra Regular'}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Observaciones */}
                        {vehiculo.observaciones && (
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: '0.5rem' }} />
                                <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                                <Paper variant="outlined" sx={{ p: '0.75rem', bgcolor: 'action.hover', mt: '0.25rem' }}>
                                    <Typography variant="body2">{vehiculo.observaciones}</Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Paper>

                {/* TABS  */}
                <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, v) => setActiveTab(v)}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Mantenimientos" icon={<BuildIcon />} iconPosition="start" />
                        <Tab label="Asignaciones" icon={<AssignmentIcon />} iconPosition="start" />
                        {puedeVerDocumentos && (
                            <Tab label="Documentos" icon={<DescriptionIcon />} iconPosition="start" />
                        )}
                        {puedeVerFormularios && (
                            <Tab label="Formularios" icon={<DescriptionIcon />} iconPosition="start" />
                        )}
                    </Tabs>

                    <Box sx={{ p: '1.5rem' }}>
                        {activeTab === 0 && (
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Registros de Mantenimiento</Typography>
                                {historial?.mantenimientos?.length > 0 ? (
                                    <List dense>
                                        {historial.mantenimientos.map((m, i) => (
                                            <ListItem key={i} divider>
                                                <ListItemIcon><BuildIcon color="primary" /></ListItemIcon>
                                                <ListItemText
                                                    primary={`${m.tipo} - ${new Date(m.fecha).toLocaleDateString()}`}
                                                    secondary={`${m.descripcion} (${m.estado_mantenimiento})`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : <Alert severity="info">No hay mantenimientos registrados.</Alert>}
                            </Box>
                        )}

                        {activeTab === 1 && (
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Historial de Asignaciones</Typography>
                                {historial?.asignaciones?.length > 0 ? (
                                    <List dense>
                                        {historial.asignaciones.map((a, i) => (
                                            <ListItem key={i} divider>
                                                <ListItemIcon><AssignmentIcon color="primary" /></ListItemIcon>
                                                <ListItemText
                                                    primary={a.destino}
                                                    secondary={`Asignado: ${new Date(a.fecha_asignacion).toLocaleDateString()} - Conductor: ${a.conductor?.nombre_completo || 'N/A'}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : <Alert severity="info">No hay asignaciones registradas.</Alert>}
                            </Box>
                        )}

                        {activeTab === 2 && puedeVerDocumentos && (
                            <DocumentosTab vehiculoId={vehiculo.id} vehiculoPlaca={vehiculo.placa} />
                        )}

                        {activeTab === 3 && puedeVerFormularios && (
                            <FormulariosTab vehiculoId={vehiculo.id} vehiculoPlaca={vehiculo.placa} />
                        )}
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
};

export default ViewVehiculo;