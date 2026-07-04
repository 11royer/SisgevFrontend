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
    Alert,
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

import useAuth from '../auth/UseAuth';
import { hasPermission, hasAnyPermission } from '../utils/hasPermission';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    // PERMISOS - CONTROL DE ACCESO A ELEMENTOS DEL DASHBOARD
    const puedeVerVehiculos = hasPermission(currentUser, 'ver_vehiculos');
    const puedeVerMantenimientos = hasPermission(currentUser, 'ver_mantenimientos');
    const puedeVerAsignaciones = hasPermission(currentUser, 'ver_asignaciones');
    const puedeVerRepuestos = hasPermission(currentUser, 'ver_repuestos');
    const puedeVerReportes = hasPermission(currentUser, 'ver_reportes');
    const puedeVerAlertas = hasPermission(currentUser, 'ver_alertas');

    const tieneAlgunPermiso = hasAnyPermission(currentUser, [
        'ver_vehiculos',
        'ver_mantenimientos',
        'ver_asignaciones',
        'ver_repuestos',
        'ver_reportes',
        'ver_alertas'
    ]);

    const [stats, setStats] = useState({
        vehiculos: { total: 0, operativos: 0, enTaller: 0 },
        mantenimientos: { total: 0, pendientes: 0 },
        asignaciones: { activas: 0, total: 0 },
        repuestos: { stockBajo: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    useEffect(() => {
        cargarEstadisticas();
        const interval = setInterval(cargarEstadisticas, 30000);
        return () => clearInterval(interval);
    }, []);
    
    const cargarEstadisticas = async () => {
        try {
            setLoading(true);
            setErrors([]);
            
            // CONSTRUIR PROMESAS SOLO PARA MÓDULOS CON PERMISOS
            const promesas = [];
            const keys = [];
            
            if (puedeVerVehiculos) {
                promesas.push(vehiculoService.getAll({ per_page: 1 }));
                keys.push('vehiculos');
            }
            
            if (puedeVerMantenimientos) {
                promesas.push(mantenimientoService.getAll({ per_page: 1 }));
                keys.push('mantenimientos');
            }
            
            if (puedeVerAsignaciones) {
                promesas.push(asignacionService.getAll({ per_page: 1 }));
                keys.push('asignaciones');
            }
            
            if (puedeVerRepuestos) {
                promesas.push(repuestoService.getStockBajo());
                keys.push('repuestos');
            }
            
            // EJECUTAR PROMESAS CON MANEJO INDIVIDUAL DE ERRORES
            const resultados = await Promise.allSettled(promesas);
            
            // Procesar cada resultado
            const nuevosStats = {
                vehiculos: { total: 0, operativos: 0, enTaller: 0 },
                mantenimientos: { total: 0, pendientes: 0 },
                asignaciones: { activas: 0, total: 0 },
                repuestos: { stockBajo: 0 }
            };
            
            const nuevosErrors = [];
            
            resultados.forEach((resultado, index) => {
                const key = keys[index];
                
                if (resultado.status === 'rejected') {
                    nuevosErrors.push(`Error al cargar ${key}: ${resultado.reason?.message || 'Sin permisos'}`);
                    return;
                }
                
                const response = resultado.value;
                const data = response.data || {};
                
                switch (key) {
                    case 'vehiculos':
                        nuevosStats.vehiculos = {
                            total: data.meta?.total || 0,
                            operativos: data.estadisticas?.operativos || 0,
                            enTaller: data.estadisticas?.en_taller || 0,
                        };
                        break;
                    
                    case 'mantenimientos':
                        nuevosStats.mantenimientos = {
                            total: data.meta?.total || 0,
                            pendientes: data.estadisticas?.por_estado?.pendiente || 0,
                        };
                        break;
                    
                    case 'asignaciones':
                        nuevosStats.asignaciones = {
                            activas: data.meta?.activas || 0,
                            total: data.meta?.total || 0,
                        };
                        break;
                    
                    case 'repuestos':
                        const stockBajoCount = data?.count || 
                                               data?.data?.length || 
                                               data?.length || 0;
                        nuevosStats.repuestos = {
                            stockBajo: stockBajoCount,
                        };
                        break;
                    
                    default:
                        break;
                }
            });
            
            setStats(nuevosStats);
            setErrors(nuevosErrors);
            
        } catch (error) {
            console.error('Error general cargando estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const getStockColor = () => {
        if (stats.repuestos.stockBajo === 0) return 'success.main';
        if (stats.repuestos.stockBajo <= 3) return 'warning.main';
        return 'error.main';
    };
    
    const StatCard = ({ title, value, icon, color, subtitle, onClick, permiso }) => {
        if (permiso && !hasPermission(currentUser, permiso)) {
            return null;
        }
        
        return (
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
    };
    
    const irAReporteVehiculos = () => {
        if (puedeVerReportes) navigate('/reportes', { state: { tipo: 'vehiculos' } });
    };
    
    const irAReporteMantenimientos = () => {
        if (puedeVerReportes) navigate('/reportes', { state: { tipo: 'mantenimientos' } });
    };
    
    const irAReporteRepuestos = () => {
        if (puedeVerReportes) navigate('/reportes', { state: { tipo: 'repuestos' } });
    };
    
    const irARepuestos = () => {
        if (puedeVerRepuestos) navigate('/repuestos');
    };

    if (!tieneAlgunPermiso) {
        return (
            <Layout>
                <Box sx={{ p: 3 }}>
                    <Alert severity="warning" sx={{ borderRadius: '0.75rem' }}>
                        <Typography variant="h6" gutterBottom>
                            Acceso Restringido
                        </Typography>
                        <Typography variant="body2">
                            No tienes permisos para visualizar el contenido del Dashboard.
                            Contacta al administrador para solicitar acceso.
                        </Typography>
                    </Alert>
                </Box>
            </Layout>
        );
    }
    
    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.5rem', md: '0.75rem' } }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Panel de Control
                </Typography>
                
                {/* Mostrar errores si los hay (sin interrumpir la experiencia) */}
                {errors.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                        <Typography variant="body2">
                            Algunas estadísticas no pudieron cargarse. 
                            {errors.map((err, i) => (
                                <span key={i}><br />• {err}</span>
                            ))}
                        </Typography>
                    </Alert>
                )}
                
                {puedeVerAlertas && (
                    <Box sx={{ mb: 3 }}>
                        <AlertasPanel />
                    </Box>
                )}
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {puedeVerVehiculos && (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Flota Vehicular"
                                value={stats.vehiculos.total}
                                icon={<DirectionsCarIcon sx={{ fontSize: '2rem' }} />}
                                color="primary.main"
                                subtitle={`${stats.vehiculos.operativos} operativos`}
                                onClick={irAReporteVehiculos}
                                permiso="ver_vehiculos"
                            />
                        </Grid>
                    )}
                    
                    {puedeVerMantenimientos && (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Mantenimientos"
                                value={stats.mantenimientos.total}
                                icon={<BuildIcon sx={{ fontSize: '2rem' }} />}
                                color={stats.mantenimientos.pendientes > 0 ? 'warning.main' : 'success.main'}
                                subtitle={`${stats.mantenimientos.pendientes} pendientes`}
                                onClick={irAReporteMantenimientos}
                                permiso="ver_mantenimientos"
                            />
                        </Grid>
                    )}
                    
                    {puedeVerAsignaciones && (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Asignaciones Activas"
                                value={stats.asignaciones.activas}
                                icon={<AssignmentIcon sx={{ fontSize: '2rem' }} />}
                                color="info.main"
                                subtitle={`Total: ${stats.asignaciones.total}`}
                                permiso="ver_asignaciones"
                            />
                        </Grid>
                    )}
                    
                    {puedeVerRepuestos && (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Repuestos con Stock Bajo"
                                value={stats.repuestos.stockBajo}
                                icon={<InventoryIcon sx={{ fontSize: '2rem' }} />}
                                color={getStockColor()}
                                subtitle={stats.repuestos.stockBajo > 0 ? 'Requiere atención' : 'Stock OK'}
                                onClick={irARepuestos}
                                permiso="ver_repuestos"
                            />
                        </Grid>
                    )}
                </Grid>
                
                {puedeVerReportes && (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                            Reportes Rápidos
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {/*  Reportes Rápidos */}
                        <Grid container spacing={2}>
                            {puedeVerVehiculos && (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                            )}
                            
                            {puedeVerMantenimientos && (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                            )}
                            
                            {puedeVerRepuestos && (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                            )}
                        </Grid>
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default Dashboard;