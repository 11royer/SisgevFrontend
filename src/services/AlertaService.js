import api from '../api/axios';

export const alertaService = {
    /**
     * Obtener todas las alertas activas
     */
    getActivas: () => api.get('/alertas'),
    
    /**
     * Generar nuevas alertas (manual o por cron)
     */
    generar: () => api.post('/alertas/generar'),
    
    /**
     * Marcar alerta como vista
     */
    marcarVista: (id) => api.post(`/alertas/${id}/vista`),
    
    /**
     * Marcar todas las alertas como vistas
     */
    marcarTodasVista: () => api.post('/alertas/marcar-todas'),
};

export default alertaService;