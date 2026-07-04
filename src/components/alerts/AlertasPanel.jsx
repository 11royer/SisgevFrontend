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
    Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { alertaService } from '../../services/AlertaService';
import AlertaCard from './AlertaCard';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const AlertasPanel = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    // PERMISOS - CONTROL DE ACCESO A ALERTAS
    const puedeVerAlertas = hasPermission(currentUser, 'ver_alertas');
    const puedeGenerarAlertas = hasPermission(currentUser, 'generar_alertas');

    const [alertas, setAlertas] = useState([]);
    const [resumen, setResumen] = useState({ total: 0, por_nivel: { danger: 0, warning: 0, info: 0 } });
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [error, setError] = useState(null);
    
    const cargarAlertas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await alertaService.getActivas();
            setAlertas(response.data.data || response.data.lista || []);
            setResumen({
                total: response.data.total || response.data.lista?.length || 0,
                por_nivel: response.data.por_nivel || { danger: 0, warning: 0, info: 0 }
            });
        } catch (error) {
            console.error('Error cargando alertas:', error);
            setError('Error al cargar las alertas');
            setAlertas([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (puedeVerAlertas) {
            cargarAlertas();
            const interval = setInterval(cargarAlertas, 60000);
            return () => clearInterval(interval);
        }
    }, [puedeVerAlertas]);
    
    const handleMarcarVista = async (id) => {
        try {
            await alertaService.marcarVista(id);
            await cargarAlertas();
        } catch (error) {
            console.error('Error:', error);
            setError('Error al marcar alerta como vista');
        }
    };
    
    const handleMarcarTodas = async () => {
        try {
            await alertaService.marcarTodasVista();
            await cargarAlertas();
        } catch (error) {
            console.error('Error:', error);
            setError('Error al marcar todas las alertas como vistas');
        }
    };
    
    const handleVerTodas = () => {
        navigate('/bitacora');
    };
    
    const handleGenerarAlertas = async () => {
        try {
            setLoading(true);
            await alertaService.generar();
            await cargarAlertas();
        } catch (error) {
            console.error('Error:', error);
            setError('Error al generar alertas');
        } finally {
            setLoading(false);
        }
    };

    // SI NO TIENE PERMISO PARA VER ALERTAS, MOSTRAR MENSAJE
    if (!puedeVerAlertas) {
        return (
            <Paper sx={{ p: 2, borderRadius: '0.75rem' }}>
                <Alert severity="info" sx={{ borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        No tienes permisos para ver las alertas del sistema. 
                        Se requiere el permiso: <strong>ver_alertas</strong>
                    </Typography>
                </Alert>
            </Paper>
        );
    }
    
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
                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                            {error}
                        </Alert>
                    )}
                    
                    {alertas.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <NotificationsIcon sx={{ fontSize: '2rem', color: 'text.secondary', mb: 1 }} />
                            <Typography color="text.secondary">
                                No hay alertas activas
                            </Typography>
                            {/* BOTÓN GENERAR ALERTAS - SOLO SI TIENE PERMISO */}
                            {puedeGenerarAlertas && (
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    sx={{ mt: 1 }}
                                    onClick={handleGenerarAlertas}
                                    disabled={loading}
                                >
                                    {loading ? 'Generando...' : 'Generar alertas manualmente'}
                                </Button>
                            )}
                        </Box>
                    ) : (
                        alertas.map(alerta => (
                            <AlertaCard 
                                key={alerta.id} 
                                alerta={alerta} 
                                onClose={handleMarcarVista}
                                // PASAR PERMISO PARA CONTROLAR CIERRE
                                puedeCerrar={true}
                            />
                        ))
                    )}
                </Box>
            </Collapse>
        </Paper>
    );
};

export default AlertasPanel;