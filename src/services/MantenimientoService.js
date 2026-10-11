import api from '../api/axios';

export const mantenimientoService = {
    /**
     * Obtener lista paginada de mantenimientos
     */
    getAll: (params = {}) => api.get('/mantenimientos', { params }),

    /**
     * Obtener un mantenimiento por ID
     */
    getById: (id) => api.get(`/mantenimientos/${id}`),

    /**
     * Crear un nuevo mantenimiento
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
     */
    cambiarEstado: (id, estado) => api.post(`/mantenimientos/${id}/cambiar-estado`, { estado_mantenimiento: estado }),

    /**
     * Eliminar un mantenimiento
     */
    delete: (id) => api.delete(`/mantenimientos/${id}`),

    /**
     * Obtener estadísticas de mantenimientos
     */
    getEstadisticas: () => api.get('/mantenimientos/estadisticas'),

    /**
     * Obtener mantenimientos por vehículo
     */
    getByVehiculo: (vehiculoId) => api.get(`/vehiculos/${vehiculoId}/mantenimientos`),
};

export default mantenimientoService;