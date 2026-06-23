import api from '../api/axios';

export const vehiculoService = {
    // Obtener todos los vehículos con filtros
    getAll: (params = {}) => api.get('/vehiculos', { params }),

    // Obtener vehículo por ID
    getById: (id) => api.get(`/vehiculos/${id}`),

    // Crear nuevo vehículo
    create: (data) => api.post('/vehiculos', data),

    // Actualizar vehículo
    update: (id, data) => api.put(`/vehiculos/${id}`, data),

    // ===== ELIMINAR VEHÍCULO =====
    delete: (id) => api.delete(`/vehiculos/${id}`),

    // Cambiar estado operativo
    cambiarEstado: (id, estado) => api.post(`/vehiculos/${id}/cambiar-estado`, { 
        estado_operativo: estado 
    }),

    // Obtener estadísticas
    getEstadisticas: () => api.get('/vehiculos/estadisticas'),

    // Obtener historial completo
    getHistorial: (id) => api.get(`/vehiculos/${id}/historial`),

    // Obtener opciones para filtros
    getOpcionesFiltro: () => api.get('/vehiculos/opciones-filtro'),
};

export default vehiculoService;