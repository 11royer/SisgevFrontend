import React from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Chip, 
    IconButton, 
    Tooltip,
    Divider 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const FormularioHistorialItem = ({ formulario, onVer, onReutilizar, onExportar }) => {
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'finalizado': return 'success';
            case 'borrador': return 'warning';
            case 'archivado': return 'default';
            default: return 'default';
        }
    };

    const getEstadoLabel = (estado) => {
        switch (estado) {
            case 'finalizado': return 'Finalizado';
            case 'borrador': return 'Borrador';
            case 'archivado': return 'Archivado';
            default: return estado;
        }
    };

    return (
        <Paper 
            elevation={1} 
            sx={{ 
                p: 2, 
                mb: 1.5, 
                borderRadius: '0.75rem',
                borderLeft: `4px solid ${formulario.estado === 'finalizado' ? '#2e7d32' : '#ed6c02'}`,
                '&:hover': {
                    boxShadow: 3,
                    backgroundColor: 'action.hover'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {formulario.titulo || `FORM. ${formulario.tipo}`}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                        <Chip 
                            label={`#${formulario.id}`} 
                            size="small" 
                            variant="outlined" 
                        />
                        <Chip 
                            label={getEstadoLabel(formulario.estado)} 
                            color={getEstadoColor(formulario.estado)} 
                            size="small" 
                        />
                        <Chip 
                            label={`v${formulario.version}`} 
                            size="small" 
                            variant="outlined" 
                        />
                        {formulario.fecha_emision && (
                            <Chip 
                                label={`Emisión: ${new Date(formulario.fecha_emision).toLocaleDateString()}`} 
                                size="small" 
                                variant="outlined" 
                            />
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Ver Detalle">
                        <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => onVer(formulario.id)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reutilizar">
                        <IconButton 
                            size="small" 
                            color="info" 
                            onClick={() => onReutilizar(formulario)}
                        >
                            <FileCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Exportar PDF">
                        <IconButton 
                            size="small" 
                            color="success" 
                            onClick={() => onExportar(formulario)}
                        >
                            <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                    Creado por: {formulario.creador?.nombre_completo || 'Sistema'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Fecha: {new Date(formulario.created_at).toLocaleString()}
                </Typography>
                {formulario.vehiculo && (
                    <Typography variant="caption" color="text.secondary">
                        Vehículo: {formulario.vehiculo.placa} - {formulario.vehiculo.marca} {formulario.vehiculo.modelo}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default FormularioHistorialItem;