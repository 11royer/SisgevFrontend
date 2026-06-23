import api from '../api/axios';

export const formularioService = {
    /**
     * Obtener la estructura de un formulario
     */
    getEstructura: (tipo) => api.get(`/formularios/estructura/${tipo}`),

    /**
     * Obtener historial de formularios de un vehículo
     */
    getHistorial: (vehiculoId, tipo = null) => {
        const url = tipo 
            ? `/formularios/historial/${vehiculoId}/${tipo}`
            : `/formularios/historial/${vehiculoId}`;
        return api.get(url);
    },

    /**
     * Obtener un formulario específico
     */
    getById: (id) => api.get(`/formularios/${id}`),

    /**
     * Guardar borrador de formulario
     */
    guardarBorrador: (data) => api.post('/formularios/guardar', data),

    /**
     * Finalizar un formulario
     */
    finalizar: (id) => api.post(`/formularios/${id}/finalizar`),

    /**
     * Exportar formulario con datos dinámicos
     */
    exportarConDatos: async (vehiculoId, tipo, datos) => {
        try {
            const response = await api.post('/formularios/exportar', {
                vehiculo_id: vehiculoId,
                tipo: tipo,
                datos: datos
            }, {
                responseType: 'blob'
            });

            // Crear URL para descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FORM_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return true;

        } catch (error) {
            console.error('Error exportando formulario:', error);
            const message = error.response?.data?.message || 'Error al exportar el formulario';
            throw new Error(message);
        }
    }
};

export default formularioService;