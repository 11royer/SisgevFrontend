// Gestiona el inventario de repuestos y control de stock.
import api from '../api/axios';

export const repuestoService = {
    /**
     * Obtener lista paginada de repuestos
     */
    getAll: (params = {}) => api.get('/repuestos', { params }),

    /**
     * Obtener un repuesto por ID
     */
    getById: (id) => api.get(`/repuestos/${id}`),

    /**
     * Crear un nuevo repuesto
     */
    create: (data) => api.post('/repuestos', data),

    /**
     * Actualizar un repuesto
     */
    update: (id, data) => api.put(`/repuestos/${id}`, data),

    /**
     * Eliminar/desactivar un repuesto
     */
    delete: (id) => api.delete(`/repuestos/${id}`),

    /**
     * Obtener repuestos con stock bajo
     */
    getStockBajo: () => api.get('/repuestos/stock/bajo'),

    /**
     * Actualizar stock (entrada/salida manual)
     */
    actualizarStock: (id, data) => api.post(`/repuestos/${id}/stock`, data),

    /**
     * Obtener estadísticas
     */
    getEstadisticas: () => api.get('/repuestos/estadisticas'),
};

export default repuestoService;