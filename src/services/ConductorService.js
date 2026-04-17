import api from '../api/axios';

/**
 * Servicio para gestionar conductores
 * Endpoints: GET, POST, PUT, DELETE /api/conductores
 */
export const conductorService = {
    /**
     * Obtener lista paginada de conductores
     */
    getAll: (params = {}) => api.get('/conductores', { params }),

    /**
     * Obtener un conductor por ID
     */
    getById: (id) => api.get(`/conductores/${id}`),

    /**
     * Obtener historial de asignaciones de un conductor
     */
    getHistorial: (id) => api.get(`/conductores/${id}/historial`),

    /**
     * Crear un nuevo conductor
     */
    create: (data) => api.post('/conductores', data),

    /**
     * Actualizar un conductor existente
     */
    update: (id, data) => api.put(`/conductores/${id}`, data),

    /**
     * Eliminar/desactivar un conductor
     */
    delete: (id) => api.delete(`/conductores/${id}`),

    /**
     * Obtener opciones para filtros (estados, etc.)
     */
    getOpcionesFiltro: () => api.get('/conductores/opciones-filtro'),
};

export default conductorService;