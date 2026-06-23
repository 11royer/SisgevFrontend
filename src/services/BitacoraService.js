import api from '../api/axios';

export const bitacoraService = {
    /**
     * Obtener todos los registros de bitácora
     * ORDENADOS: Los más recientes primero (por el backend)
     */
    getAll: (params = {}) => api.get('/bitacoras', { params }),

    /**
     * Obtener un registro por ID
     */
    getById: (id) => api.get(`/bitacoras/${id}`),

    /**
     * Crear un nuevo registro de bitácora
     */
    create: (data) => api.post('/bitacoras', data),

    /**
     * Actualizar un registro
     */
    update: (id, data) => api.put(`/bitacoras/${id}`, data),

    /**
     * Eliminar un registro
     */
    delete: (id) => api.delete(`/bitacoras/${id}`),
};

export default bitacoraService;