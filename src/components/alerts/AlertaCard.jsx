import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const AlertaCard = ({ alerta, onClose }) => {
    const theme = useTheme();
    
    const getIcon = () => {
        switch (alerta.nivel) {
            case 'danger': return <ErrorIcon sx={{ fontSize: '2rem', color: theme.palette.error.main }} />;
            case 'warning': return <WarningIcon sx={{ fontSize: '2rem', color: theme.palette.warning.main }} />;
            default: return <InfoIcon sx={{ fontSize: '2rem', color: theme.palette.info.main }} />;
        }
    };
    
    const getBorderColor = () => {
        switch (alerta.nivel) {
            case 'danger': return theme.palette.error.main;
            case 'warning': return theme.palette.warning.main;
            default: return theme.palette.info.main;
        }
    };
    
    const getTipoLabel = () => {
        const tipos = {
            'mantenimiento_km': 'Mantenimiento por KM',
            'mantenimiento_fecha': 'Mantenimiento por Fecha',
            'soat': 'SOAT',
            'itv': 'ITV',
        };
        return tipos[alerta.tipo] || alerta.tipo;
    };
    
    const getColor = () => {
        switch (alerta.nivel) {
            case 'danger': return 'error';
            case 'warning': return 'warning';
            default: return 'info';
        }
    };
    
    return (
        <Card 
            sx={{ 
                mb: 1.5, 
                borderRadius: '0.75rem',
                borderLeft: `4px solid ${getBorderColor()}`,
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 2,
                }
            }}
        >
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    {getIcon()}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                {alerta.titulo}
                            </Typography>
                            <Chip 
                                label={getTipoLabel()} 
                                size="small" 
                                color={getColor()}
                                variant="outlined"
                                sx={{ fontWeight: 500 }}
                            />
                            {alerta.alertable && (
                                <Chip 
                                    icon={<DirectionsCarIcon />}
                                    label={alerta.alertable.placa || alerta.alertable.nombre_repuesto || alerta.alertable.nombre}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                />
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {alerta.descripcion}
                        </Typography>
                        {alerta.fecha_limite && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                📅 Fecha límite: {new Date(alerta.fecha_limite).toLocaleDateString()}
                            </Typography>
                        )}
                    </Box>
                    <IconButton 
                        size="small" 
                        onClick={() => onClose(alerta.id)}
                        sx={{ 
                            '&:hover': { backgroundColor: 'action.hover' }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AlertaCard;