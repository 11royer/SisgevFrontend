import React, { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    CircularProgress,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { reporteService } from '../../services/ReporteService';

/**
 * Botón con menú desplegable para exportar formularios oficiales
 */
const FormularioExportButton = ({
    vehiculoId,
    variant = 'contained',
    size = 'small'
}) => {
    // Estado para el menú
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    // Estado para el diálogo de confirmación de Kárdex
    const [openKardexDialog, setOpenKardexDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Abrir el menú
     */
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Cerrar el menú
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    /**
     * Exportar un formulario específico
    */
    const handleExportarFormulario = async (tipo) => {
        try {
            setLoading(true);
            console.log(`📄 Exportando FORM. ${tipo}...`);
            await reporteService.exportarFormulario(tipo, vehiculoId);
            console.log(`✅ FORM. ${tipo} exportado correctamente`);
        } catch (error) {
            console.error(`❌ Error exportando FORM. ${tipo}:`, error);
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    /**
     * Exportar Kárdex (FORM. 12) con fotos
     */
    const handleExportarKardex = async () => {
        try {
            setLoading(true);
            setOpenKardexDialog(false);
            console.log(`📷 Exportando Kárdex para vehículo ID: ${vehiculoId}...`);
            await reporteService.exportarKardex(vehiculoId);
            console.log('✅ Kárdex exportado correctamente');
        } catch (error) {
            console.error('❌ Error exportando Kárdex:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Abrir diálogo de confirmación para Kárdex
     */
    const handleOpenKardexDialog = () => {
        handleClose();
        setOpenKardexDialog(true);
    };

    // Lista de formularios según el reglamento
    const formularios = [
        { id: '01', nombre: 'Inventario de Vehículos', tipo: 'inventario' },
        { id: '02', nombre: 'Diagnóstico Técnico de Vehículo', tipo: 'tecnico' },
        { id: '03', nombre: 'Inventario de Motocicletas', tipo: 'inventario' },
        { id: '05', nombre: 'Mantenimiento Correctivo de Vehículo', tipo: 'tecnico' },
        { id: '07', nombre: 'Inventario de Motocicleta', tipo: 'inventario' },
        { id: '08', nombre: 'Diagnóstico de Motocicleta', tipo: 'tecnico' },
        { id: '09', nombre: 'Identificación de Motocicleta', tipo: 'inventario' },
        { id: '11', nombre: 'Mantenimiento Correctivo Moto', tipo: 'tecnico' },
    ];

    return (
        <>
            {/* Botón principal */}
            <Button
                variant={variant}
                startIcon={<DescriptionIcon />}
                onClick={handleClick}
                size={size}
                disabled={loading}
                sx={{ borderRadius: '0.5rem' }}
            >
                Exportar formularios
            </Button>

            {/* Menú desplegable */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        maxHeight: 400,
                        width: '280px',
                        borderRadius: '0.75rem',
                        mt: 1,
                    }
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        px: 2,
                        py: 1,
                        color: 'text.secondary',
                        display: 'block',
                        fontWeight: 'bold',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    📄 Exportar Formulario
                </Typography>

                {/* Submenú: Inventario */}
                <MenuItem
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'action.hover',
                        pointerEvents: 'none',
                        opacity: 0.8,
                    }}
                >
                    <ListItemIcon>
                        <PictureAsPdfIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="📋 Inventario" />
                </MenuItem>

                {formularios
                    .filter(f => f.tipo === 'inventario')
                    .map(f => (
                        <MenuItem
                            key={f.id}
                            onClick={() => handleExportarFormulario(f.id)}
                            sx={{ pl: 4 }}
                        >
                            <ListItemText
                                primary={`FORM. ${f.id}: ${f.nombre}`}
                                primaryTypographyProps={{ fontSize: '0.8rem' }}
                            />
                        </MenuItem>
                    ))
                }

                <Divider sx={{ my: 1 }} />

                {/* Submenú: Técnico */}
                <MenuItem
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'action.hover',
                        pointerEvents: 'none',
                        opacity: 0.8,
                    }}
                >
                    <ListItemIcon>
                        <PictureAsPdfIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="🔧 Técnico" />
                </MenuItem>

                {formularios
                    .filter(f => f.tipo === 'tecnico')
                    .map(f => (
                        <MenuItem
                            key={f.id}
                            onClick={() => handleExportarFormulario(f.id)}
                            sx={{ pl: 4 }}
                        >
                            <ListItemText
                                primary={`FORM. ${f.id}: ${f.nombre}`}
                                primaryTypographyProps={{ fontSize: '0.8rem' }}
                            />
                        </MenuItem>
                    ))
                }

                <Divider sx={{ my: 1 }} />

                {/* Opción: Kárdex (FORM. 12) */}
                <MenuItem onClick={handleOpenKardexDialog}>
                    <ListItemIcon>
                        <PhotoCameraIcon color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="📷 Kárdex (FORM. 12)"
                        secondary="Con fotos del vehículo"
                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                    />
                </MenuItem>
            </Menu>

            {/* Diálogo de confirmación para Kárdex - CORREGIDO */}
            <Dialog
                open={openKardexDialog}
                onClose={() => setOpenKardexDialog(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold" component="div">
                        Exportar Kárdex
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Se generará un PDF con la información completa del vehículo
                        y sus fotos del Kárdex (máximo 4 imágenes).
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        ⚠️ Asegúrese de que el vehículo tenga fotos subidas.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenKardexDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleExportarKardex}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <PhotoCameraIcon />}
                    >
                        {loading ? 'Generando...' : 'Exportar Kárdex'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FormularioExportButton;