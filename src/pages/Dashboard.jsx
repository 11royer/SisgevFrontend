import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Divider,
} from '@mui/material';
import Layout from '../layout/Layout';
import AlertasPanel from '../components/alerts/AlertasPanel';
import { vehiculoService } from '../services/VehiculoService';
import { asignacionService } from '../services/AsignacionService';
import { mantenimientoService } from '../services/MantenimientoService';
import { repuestoService } from '../services/RepuestoService';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        vehiculos: { total: 0, operativos: 0, enTaller: 0 },
        mantenimientos: { total: 0, pendientes: 0 },
        asignaciones: { activas: 0, total: 0 },
        repuestos: { stockBajo: 0 }
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        cargarEstadisticas();
        // Recargar cada 30 segundos
        const interval = setInterval(cargarEstadisticas, 30000);
        return () => clearInterval(interval);
    }, []);
    
    const cargarEstadisticas = async () => {
        try {
            setLoading(true);
            
            // OBTENER STOCK BAJO CORRECTAMENTE
            const [vehiculosRes, mantenimientosRes, asignacionesRes, repuestosStockRes] = await Promise.all([
                vehiculoService.getAll({ per_page: 1 }),
                mantenimientoService.getAll({ per_page: 1 }),
                asignacionService.getAll({ per_page: 1 }),
                repuestoService.getStockBajo(), // Endpoint específico para stock bajo
            ]);
            
            const vehiculosMeta = vehiculosRes.data.meta || {};
            const mantenimientosMeta = mantenimientosRes.data.meta || {};
            const asignacionesMeta = asignacionesRes.data.meta || {};
            
            // Obtener el conteo de stock bajo
            const stockBajoCount = repuestosStockRes.data?.count || 
                                    repuestosStockRes.data?.data?.length || 
                                    repuestosStockRes.data?.length || 0;
            
            setStats({
                vehiculos: {
                    total: vehiculosMeta.total || 0,
                    operativos: vehiculosRes.data.estadisticas?.operativos || 0,
                    enTaller: vehiculosRes.data.estadisticas?.en_taller || 0,
                },
                mantenimientos: {
                    total: mantenimientosMeta.total || 0,
                    pendientes: mantenimientosRes.data.estadisticas?.por_estado?.pendiente || 0,
                },
                asignaciones: {
                    activas: asignacionesMeta.activas || 0,
                    total: asignacionesMeta.total || 0,
                },
                repuestos: {
                    stockBajo: stockBajoCount,
                }
            });
            
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Función para obtener color según el valor
    const getStockColor = () => {
        if (stats.repuestos.stockBajo === 0) return 'success.main';
        if (stats.repuestos.stockBajo <= 3) return 'warning.main';
        return 'error.main';
    };
    
    const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
        <Card 
            sx={{ 
                borderRadius: '0.75rem', 
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease-in-out',
                '&:hover': onClick ? { 
                    transform: 'translateY(-2px)', 
                    boxShadow: 4,
                    backgroundColor: 'action.hover'
                } : {}
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
                            {loading ? <CircularProgress size={24} /> : value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ 
                        color: color,
                        backgroundColor: 'action.hover',
                        borderRadius: '1rem',
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
    
    // Funciones de navegación
    const irAReporteVehiculos = () => {
        navigate('/reportes', { state: { tipo: 'vehiculos' } });
    };
    
    const irAReporteMantenimientos = () => {
        navigate('/reportes', { state: { tipo: 'mantenimientos' } });
    };
    
    const irAReporteRepuestos = () => {
        navigate('/reportes', { state: { tipo: 'repuestos' } });
    };
    
    const irARepuestos = () => {
        navigate('/repuestos');
    };
    
    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Panel de Control
                </Typography>
                
                {/* Alertas Panel */}
                <Box sx={{ mb: 3 }}>
                    <AlertasPanel />
                </Box>
                
                {/* Tarjetas de estadísticas */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Flota Vehicular"
                            value={stats.vehiculos.total}
                            icon={<DirectionsCarIcon sx={{ fontSize: '2rem' }} />}
                            color="primary.main"
                            subtitle={`${stats.vehiculos.operativos} operativos`}
                            onClick={irAReporteVehiculos}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Mantenimientos"
                            value={stats.mantenimientos.total}
                            icon={<BuildIcon sx={{ fontSize: '2rem' }} />}
                            color={stats.mantenimientos.pendientes > 0 ? 'warning.main' : 'success.main'}
                            subtitle={`${stats.mantenimientos.pendientes} pendientes`}
                            onClick={irAReporteMantenimientos}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Asignaciones Activas"
                            value={stats.asignaciones.activas}
                            icon={<AssignmentIcon sx={{ fontSize: '2rem' }} />}
                            color="info.main"
                            subtitle={`Total: ${stats.asignaciones.total}`}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Repuestos con Stock Bajo"
                            value={stats.repuestos.stockBajo}
                            icon={<InventoryIcon sx={{ fontSize: '2rem' }} />}
                            color={getStockColor()}
                            subtitle={stats.repuestos.stockBajo > 0 ? 'Requiere atención' : 'Stock OK'}
                            onClick={irARepuestos} // Navega directamente a repuestos
                        />
                    </Grid>
                </Grid>
                
                {/* Sección de acceso rápido a reportes */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                    Reportes Rápidos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card 
                            sx={{ 
                                borderRadius: '0.75rem', 
                                cursor: 'pointer', 
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': { 
                                    bgcolor: 'action.hover', 
                                    transform: 'translateY(-2px)' 
                                } 
                            }}
                            onClick={irAReporteVehiculos}
                        >
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Vehículos por Estado
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Reporte de la flota clasificada por estado operativo
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card 
                            sx={{ 
                                borderRadius: '0.75rem', 
                                cursor: 'pointer', 
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': { 
                                    bgcolor: 'action.hover', 
                                    transform: 'translateY(-2px)' 
                                } 
                            }}
                            onClick={irAReporteMantenimientos}
                        >
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Mantenimientos por Período
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Historial de mantenimientos con filtros
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card 
                            sx={{ 
                                borderRadius: '0.75rem', 
                                cursor: 'pointer', 
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': { 
                                    bgcolor: 'action.hover', 
                                    transform: 'translateY(-2px)' 
                                } 
                            }}
                            onClick={irAReporteRepuestos}
                        >
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Repuestos con Stock Bajo
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Inventario crítico para reposición
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default Dashboard;