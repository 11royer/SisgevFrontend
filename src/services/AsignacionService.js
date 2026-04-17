import api from '../api/axios';

/**
 * Servicio para gestionar asignaciones de vehículos
 */
export const asignacionService = {
    /**
     * Obtener lista paginada de asignaciones
     */
    getAll: (params = {}) => api.get('/asignaciones', { params }),

    /**
     * Obtener una asignación por ID
     */
    getById: (id) => api.get(`/asignaciones/${id}`),

    /**
     * Crear una nueva asignación
     */
    create: (data) => api.post('/asignaciones', data),

    /**
     * Actualizar una asignación (solo datos no críticos)
     */
    update: (id, data) => api.put(`/asignaciones/${id}`, data),

    /**
     * Finalizar una asignación (registrar fecha de retorno)
     */
    finalizar: (id) => api.post(`/asignaciones/${id}/finalizar`),

    /**
     * Eliminar una asignación (solo si está finalizada)
     */
    delete: (id) => api.delete(`/asignaciones/${id}`),

    /**
     * Obtener estadísticas de asignaciones para dashboard
     */
    getEstadisticas: () => api.get('/asignaciones/estadisticas'),

    /**
     * Obtener asignaciones por vehículo
     */
    getByVehiculo: (vehiculoId) => api.get(`/vehiculos/${vehiculoId}/asignaciones`),
};

export default asignacionService;