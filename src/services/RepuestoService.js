// Gestiona el inventario de repuestos y control de stock.
import api from '../api/axios';

export const repuestoService = {
    /**
     * Obtener lista paginada de repuestos
     * @param {Object} params - Filtros (search, activo, stock_bajo)
     */
    getAll: (params = {}) => api.get('/repuestos', { params }),

    /**
     * Obtener un repuesto por ID
     * @param {number} id
     */
    getById: (id) => api.get(`/repuestos/${id}`),

    /**
     * Crear un nuevo repuesto
     * @param {Object} data
     */
    create: (data) => api.post('/repuestos', data),

    /**
     * Actualizar un repuesto
     * @param {number} id
     * @param {Object} data
     */
    update: (id, data) => api.put(`/repuestos/${id}`, data),

    /**
     * Eliminar/desactivar un repuesto
     * @param {number} id
     */
    delete: (id) => api.delete(`/repuestos/${id}`),

    /**
     * Obtener repuestos con stock bajo
     */
    getStockBajo: () => api.get('/repuestos/stock/bajo'),

    /**
     * Actualizar stock (entrada/salida manual)
     * @param {number} id
     * @param {Object} data - { cantidad, tipo, observaciones }
     */
    actualizarStock: (id, data) => api.post(`/repuestos/${id}/stock`, data),

    /**
     * Obtener estadísticas
     */
    getEstadisticas: () => api.get('/repuestos/estadisticas'),
};

export default repuestoService;