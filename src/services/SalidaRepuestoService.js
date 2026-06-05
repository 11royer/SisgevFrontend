import api from '../api/axios';

export const salidaRepuestoService = {
    /**
     * Obtener lista de salidas
     * @param {Object} params - Filtros
     */
    getAll: (params = {}) => api.get('/salidasrepuestos', { params }),

    /**
     * Obtener una salida por ID
     * @param {number} id
     */
    getById: (id) => api.get(`/salidasrepuestos/${id}`),

    /**
     * Crear nueva salida (consumo en mantenimiento)
     * @param {Object} data - { repuesto_id, mantenimiento_id, cantidad_usada, fecha, observaciones }
     */
    create: (data) => api.post('/salidasrepuestos', data),

    /**
     * Actualizar observaciones de una salida
     * @param {number} id
     * @param {Object} data
     */
    update: (id, data) => api.put(`/salidasrepuestos/${id}`, data),

    /**
     * Eliminar una salida (revertir stock)
     * @param {number} id
     */
    delete: (id) => api.delete(`/salidasrepuestos/${id}`),

    /**
     * Obtener salidas por mantenimiento
     * @param {number} mantenimientoId
     */
    getByMantenimiento: (mantenimientoId) => api.get(`/mantenimientos/${mantenimientoId}/salidas`),
};

export default salidaRepuestoService;