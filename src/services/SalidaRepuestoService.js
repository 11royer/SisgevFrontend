import api from '../api/axios';

export const salidaRepuestoService = {
    /**
     * Obtener lista de salidas
     */
    getAll: (params = {}) => api.get('/salidasrepuestos', { params }),

    /**
     * Obtener una salida por ID
     */
    getById: (id) => api.get(`/salidasrepuestos/${id}`),

    /**
     * Crear nueva salida (consumo en mantenimiento)
     */
    create: (data) => api.post('/salidasrepuestos', data),

    /**
     * Actualizar observaciones de una salida
     */
    update: (id, data) => api.put(`/salidasrepuestos/${id}`, data),

    /**
     * Eliminar una salida (revertir stock)
     */
    delete: (id) => api.delete(`/salidasrepuestos/${id}`),

    /**
     * Obtener salidas por mantenimiento
     */
    getByMantenimiento: (mantenimientoId) => api.get(`/mantenimientos/${mantenimientoId}/salidas`),
};

export default salidaRepuestoService;