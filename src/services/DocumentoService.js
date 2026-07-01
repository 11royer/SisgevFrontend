import api from '../api/axios';

export const documentoService = {
    /**
     * Obtener todos los documentos
     */
    getAll: (params = {}) => api.get('/documentos', { params }),
    
    /**
     * Obtener un documento por ID
     */
    getById: (id) => api.get(`/documentos/${id}`),
    
    /**
     * Obtener documentos por vehículo (usando el endpoint correcto)
     */
    getByVehiculo: (vehiculoId) => {
        // Usar el endpoint específico que tienes en tu API
        return api.get(`/vehiculos/${vehiculoId}/documentos`);
    },
    
    /**
     * Crear un nuevo documento
     * Soporta tanto JSON como FormData (para imágenes)
     */
    create: (data) => {
        // Si es FormData (para subir imágenes), enviar como multipart
        if (data instanceof FormData) {
            return api.post('/documentos', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        // Si es JSON normal, enviar como application/json
        return api.post('/documentos', data);
    },
    
    /**
     * Actualizar un documento
     */
    update: (id, data) => {
        // Si es FormData, enviar como multipart con método PUT
        if (data instanceof FormData) {
            // Laravel necesita _method=PUT para FormData
            data.append('_method', 'PUT');
            return api.post(`/documentos/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        return api.put(`/documentos/${id}`, data);
    },
    
    /**
     * Eliminar un documento
     */
    delete: (id) => api.delete(`/documentos/${id}`),
};

export default documentoService;