import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Collapse,
    IconButton,
    Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { alertaService } from '../../services/AlertaService';
import AlertaCard from './AlertaCard';

const AlertasPanel = () => {
    const navigate = useNavigate(); // PARA NAVEGAR
    const [alertas, setAlertas] = useState([]);
    const [resumen, setResumen] = useState({ total: 0, por_nivel: { danger: 0, warning: 0, info: 0 } });
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    
    const cargarAlertas = async () => {
        try {
            setLoading(true);
            const response = await alertaService.getActivas();
            // Asegurar que alertas es un array
            setAlertas(response.data.data || response.data.lista || []);
            setResumen({
                total: response.data.total || response.data.lista?.length || 0,
                por_nivel: response.data.por_nivel || { danger: 0, warning: 0, info: 0 }
            });
        } catch (error) {
            console.error('Error cargando alertas:', error);
            setAlertas([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        cargarAlertas();
        const interval = setInterval(cargarAlertas, 60000); // cada minuto
        return () => clearInterval(interval);
    }, []);
    
    const handleMarcarVista = async (id) => {
        try {
            await alertaService.marcarVista(id);
            await cargarAlertas();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const handleMarcarTodas = async () => {
        try {
            await alertaService.marcarTodasVista();
            await cargarAlertas();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    // Ver todas las alertas (navegar a bitácora o reportes)
    const handleVerTodas = () => {
        navigate('/bitacora'); // o a una página de alertas si la tienes
    };
    
    if (loading && alertas.length === 0) {
        return (
            <Paper sx={{ p: 2, borderRadius: '0.75rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={30} />
                </Box>
            </Paper>
        );
    }
    
    return (
        <Paper sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
            {/* Header */}
            <Box 
                sx={{ 
                    p: 1.5, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    bgcolor: 'background.default'
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge badgeContent={resumen.total} color={resumen.por_nivel.danger > 0 ? 'error' : 'warning'}>
                        <NotificationsIcon color="action" />
                    </Badge>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Alertas y Notificaciones
                    </Typography>
                    {resumen.por_nivel.danger > 0 && (
                        <Typography variant="caption" color="error">
                            {resumen.por_nivel.danger} crítica(s)
                        </Typography>
                    )}
                    {resumen.por_nivel.warning > 0 && (
                        <Typography variant="caption" color="warning.main">
                            {resumen.por_nivel.warning} advertencia(s)
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {alertas.length > 0 && (
                        <>
                            <Button 
                                size="small" 
                                startIcon={<VisibilityIcon />}
                                onClick={(e) => { e.stopPropagation(); handleVerTodas(); }}
                            >
                                Ver todas
                            </Button>
                            <Button 
                                size="small" 
                                startIcon={<DoneAllIcon />}
                                onClick={(e) => { e.stopPropagation(); handleMarcarTodas(); }}
                            >
                                Marcar todas
                            </Button>
                        </>
                    )}
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
            </Box>
            
            {/* Body */}
            <Collapse in={expanded}>
                <Box sx={{ p: 1.5 }}>
                    {alertas.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <NotificationsIcon sx={{ fontSize: '2rem', color: 'text.secondary', mb: 1 }} />
                            <Typography color="text.secondary">
                                No hay alertas activas
                            </Typography>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                sx={{ mt: 1 }}
                                onClick={() => alertaService.generar().then(cargarAlertas)}
                            >
                                Generar alertas manualmente
                            </Button>
                        </Box>
                    ) : (
                        alertas.map(alerta => (
                            <AlertaCard 
                                key={alerta.id} 
                                alerta={alerta} 
                                onClose={handleMarcarVista}
                            />
                        ))
                    )}
                </Box>
            </Collapse>
        </Paper>
    );
};

export default AlertasPanel;