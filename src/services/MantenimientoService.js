import api from '../api/axios';

export const mantenimientoService = {
    /**
     * Obtener lista paginada de mantenimientos
     * @param {Object} params - Filtros (vehiculo_id, tipo, estado, fechas)
     */
    getAll: (params = {}) => api.get('/mantenimientos', { params }),

    /**
     * Obtener un mantenimiento por ID
     * @param {number} id
     */
    getById: (id) => api.get(`/mantenimientos/${id}`),

    /**
     * Crear un nuevo mantenimiento
     * @param {Object} data - Datos del mantenimiento (incluye repuestos si aplica)
     */
    create: (data) => {
        // Asegurar formato correcto de repuestos
        if (data.repuestos && Array.isArray(data.repuestos)) {
            // Filtrar repuestos con cantidad > 0
            const repuestosValidos = data.repuestos.filter(r => r.cantidad > 0 && r.id);
            data.repuestos = repuestosValidos;
        } else {
            data.repuestos = [];
        }
        
        return api.post('/mantenimientos', data);
    },

    /**
     * Actualizar un mantenimiento existente
     * @param {number} id
     * @param {Object} data - Datos actualizados
     */
    update: (id, data) => {
        // Asegurar formato correcto de repuestos
        if (data.repuestos && Array.isArray(data.repuestos)) {
            // Filtrar repuestos con cantidad > 0
            const repuestosValidos = data.repuestos.filter(r => r.cantidad > 0 && r.id);
            data.repuestos = repuestosValidos;
        }
        
        return api.put(`/mantenimientos/${id}`, data);
    },

    /**
     * Cambiar estado del mantenimiento
     * @param {number} id
     * @param {string} estado - pendiente, en_proceso, finalizado
     */
    cambiarEstado: (id, estado) => api.post(`/mantenimientos/${id}/cambiar-estado`, { estado_mantenimiento: estado }),

    /**
     * Eliminar un mantenimiento
     * @param {number} id
     */
    delete: (id) => api.delete(`/mantenimientos/${id}`),

    /**
     * Obtener estadísticas de mantenimientos
     */
    getEstadisticas: () => api.get('/mantenimientos/estadisticas'),

    /**
     * Obtener mantenimientos por vehículo
     * @param {number} vehiculoId
     */
    getByVehiculo: (vehiculoId) => api.get(`/vehiculos/${vehiculoId}/mantenimientos`),
};

export default mantenimientoService;