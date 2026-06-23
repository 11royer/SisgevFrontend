import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    CardMedia,
    IconButton,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { reporteService } from '../../services/ReporteService';
import useAuth from '../../auth/UseAuth';

const KardexView = ({ vehiculo, fotos = [], onFotoSubida, onFotoEliminada }) => {
    const { user: currentUser } = useAuth();
    const puedeEditar = ['Administrador', 'Operador', 'Técnico'].includes(currentUser?.rol?.nombre);

    // Estado para el diálogo de subida de foto
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Abrir diálogo para subir foto
     */
    const handleOpenDialog = () => {
        setSelectedFile(null);
        setDescripcion('');
        setError(null);
        setOpenDialog(true);
    };

    /**
     * Cerrar diálogo
     */
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFile(null);
        setDescripcion('');
        setError(null);
    };

    /**
     * Manejar selección de archivo
     */
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validar tamaño (máx 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('La imagen no debe superar los 2MB');
                return;
            }
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten imágenes');
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    /**
     * Subir foto al Kárdex
     */
    const handleSubirFoto = async () => {
        if (!selectedFile) {
            setError('Seleccione una imagen');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            
            const result = await reporteService.subirFotoKardex(vehiculo.id, selectedFile, descripcion);
            
            // Notificar al padre
            if (onFotoSubida) {
                onFotoSubida(result.data);
            }
            
            handleCloseDialog();
            
        } catch (error) {
            console.error('Error subiendo foto:', error);
            setError(error.response?.data?.message || 'Error al subir la foto');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Eliminar foto del Kárdex
     */
    const handleEliminarFoto = async (documentoId) => {
        if (!window.confirm('¿Está seguro de eliminar esta foto del Kárdex?')) return;
        
        try {
            await reporteService.eliminarFotoKardex(documentoId);
            if (onFotoEliminada) {
                onFotoEliminada(documentoId);
            }
        } catch (error) {
            console.error('Error eliminando foto:', error);
            alert('Error al eliminar la foto');
        }
    };

    // Verificar si hay fotos
    const fotosArray = Array.isArray(fotos) ? fotos : [];
    const tieneFotos = fotosArray.length > 0;

    return (
        <Box>
            {/* Encabezado del Kárdex */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexWrap: 'wrap',
                gap: 1,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhotoCameraIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Kárdex del Vehículo
                    </Typography>
                    <Chip
                        label={`${fotosArray.length}/4 fotos`}
                        size="small"
                        color={tieneFotos ? 'primary' : 'default'}
                    />
                </Box>
                {puedeEditar && fotosArray.length < 4 && (
                    <Button
                        variant="outlined"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={handleOpenDialog}
                        size="small"
                        sx={{ borderRadius: '0.5rem' }}
                    >
                        Subir Foto
                    </Button>
                )}
            </Box>

            {/* Grid de fotos */}
            <Grid container spacing={2}>
                {tieneFotos ? (
                    fotosArray.map((foto) => (
                        <Grid item xs={12} sm={6} md={3} key={foto.id}>
                            <Paper
                                elevation={2}
                                sx={{
                                    borderRadius: '0.75rem',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    height: '180px',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={foto.archivo_url}
                                    alt={foto.descripcion || 'Foto Kárdex'}
                                    sx={{
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                {puedeEditar && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.7)',
                                            }
                                        }}
                                        onClick={() => handleEliminarFoto(foto.id)}
                                    >
                                        <DeleteIcon fontSize="small" sx={{ color: 'white' }} />
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
                                            padding: '4px 8px',
                                            fontSize: '0.7rem',
                                        }}
                                    >
                                        {foto.descripcion}
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                borderRadius: '0.75rem',
                                backgroundColor: 'action.hover',
                            }}
                        >
                            <PhotoCameraIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 1 }} />
                            <Typography color="text.secondary">
                                No hay fotos en el Kárdex
                            </Typography>
                            {puedeEditar && (
                                <Button
                                    variant="contained"
                                    startIcon={<AddPhotoAlternateIcon />}
                                    onClick={handleOpenDialog}
                                    sx={{ mt: 2 }}
                                    size="small"
                                >
                                    Subir primera foto
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Diálogo para subir foto */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold" component="div">
                        Subir Foto al Kárdex
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                                {error}
                            </Alert>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            {fotosArray.length}/4 fotos subidas. Formato: JPG, PNG. Máx. 2MB.
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{
                                py: 2,
                                borderRadius: '0.75rem',
                                borderStyle: 'dashed',
                            }}
                        >
                            {selectedFile ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PhotoCameraIcon color="primary" />
                                    <Typography>{selectedFile.name}</Typography>
                                </Box>
                            ) : (
                                'Seleccionar imagen'
                            )}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        <TextField
                            fullWidth
                            label="Descripción (opcional)"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            size="small"
                            sx={{ mt: 2 }}
                            placeholder="Ej: Vista frontal del vehículo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={uploading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubirFoto}
                        variant="contained"
                        disabled={!selectedFile || uploading}
                        startIcon={uploading ? <CircularProgress size={20} /> : <AddPhotoAlternateIcon />}
                    >
                        {uploading ? 'Subiendo...' : 'Subir Foto'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default KardexView;