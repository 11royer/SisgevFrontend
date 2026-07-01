import api from '../api/axios';

export const formularioService = {
    /**
     * Obtener estructura de un formulario
     */
    getEstructura: (tipo) => api.get(`/formularios/estructura/${tipo}`),

    /**
     * Obtener un formulario por ID
     */
    getById: (id) => api.get(`/formularios/${id}`),

    /**
     * Obtener formularios por vehículo (para la pestaña)
     */
    getByVehiculo: (vehiculoId) => api.get(`/vehiculos/${vehiculoId}/formularios`),

    /**
     * Obtener historial de formularios
     */
    getHistorial: (vehiculoId, tipo = null) => {
        const url = tipo 
            ? `/formularios/historial/${vehiculoId}/${tipo}`
            : `/formularios/historial/${vehiculoId}`;
        return api.get(url);
    },

    /**
     * Guardar borrador
     */
    guardarBorrador: (data) => api.post('/formularios/guardar', data),

    /**
     * Finalizar formulario
     */
    finalizar: (id) => api.post(`/formularios/${id}/finalizar`),

    /**
     * Exportar PDF
     */
    exportar: (data) => api.post('/formularios/exportar', data, {
        responseType: 'blob'
    }),

    /**
     * Exportar Kárdex
     */
    exportarKardex: (vehiculoId) => api.get(`/vehiculos/${vehiculoId}/kardex`, {
        responseType: 'blob'
    }),

    /**
     * Subir foto al Kárdex
     */
    subirFotoKardex: (vehiculoId, foto, descripcion = '') => {
        const formData = new FormData();
        formData.append('foto', foto);
        if (descripcion) formData.append('descripcion', descripcion);
        return api.post(`/vehiculos/${vehiculoId}/kardex/foto`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    /**
     * Eliminar foto del Kárdex
     */
    eliminarFotoKardex: (documentoId) => api.delete(`/documentos/${documentoId}/kardex`),
};