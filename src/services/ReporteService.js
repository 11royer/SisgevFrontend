import api from '../api/axios';

export const reporteService = {

    // REPORTES EXISTENTES
    vehiculos: (filtros = {}) => api.get('/reportes/vehiculos', { params: filtros }),
    
    mantenimientos: (filtros = {}) => api.get('/reportes/mantenimientos', { params: filtros }),
    
    repuestosStockBajo: () => api.get('/reportes/repuestos-stock-bajo'),
    
    exportarCSV: async (tipo, filtros = {}) => {
        try {
            const params = new URLSearchParams();
            params.append('tipo', tipo);
            
            Object.keys(filtros).forEach(key => {
                if (filtros[key] && filtros[key] !== '') {
                    params.append(key, filtros[key]);
                }
            });
            
            const response = await api.get(`/reportes/exportar-csv?${params.toString()}`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_${tipo}_${new Date().toISOString().slice(0, 19)}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error exportando CSV:', error);
            alert('Error al exportar el reporte. Verifique su conexión.');
        }
    },
    
    /**
     * Exportar un formulario oficial (FORM. 01 al 11)
     * 
     * @param {string} tipo - Código del formulario (01, 02, 03, 05, 07, 08, 09, 11)
     * @param {number} vehiculoId - ID del vehículo
     * @returns {Promise<void>}
     */
    exportarFormulario: async (tipo, vehiculoId) => {
        try {
            console.log(`📄 Exportando FORM. ${tipo} para vehículo ID: ${vehiculoId}`);
            
            const response = await api.get(`/vehiculos/${vehiculoId}/formulario/${tipo}`, {
                responseType: 'blob',
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
            
            console.log(`✅ FORM. ${tipo} descargado correctamente`);
            
        } catch (error) {
            console.error('❌ Error exportando formulario:', error);
            const message = error.response?.data?.message || 'Error al descargar el formulario.';
            alert(`Error: ${message}`);
            throw error;
        }
    },
    
    /**
     * Exportar Kárdex (FORM. 12) con fotos
     * @param {number} vehiculoId - ID del vehículo
     * @returns {Promise<void>}
     */
    exportarKardex: async (vehiculoId) => {
        try {
            console.log(`📷 Exportando Kárdex para vehículo ID: ${vehiculoId}`);
            
            const response = await api.get(`/vehiculos/${vehiculoId}/kardex`, {
                responseType: 'blob',
            });
            
            // Crear URL para descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `KARDEX_${new Date().toISOString().slice(0, 10)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            console.log('✅ Kárdex descargado correctamente');
            
        } catch (error) {
            console.error('❌ Error exportando Kárdex:', error);
            const message = error.response?.data?.message || 'Error al descargar el Kárdex.';
            alert(`Error: ${message}`);
            throw error;
        }
    },
    
    /**
     * Subir foto al Kárdex del vehículo
     * @param {number} vehiculoId - ID del vehículo
     * @param {File} foto - Archivo de imagen
     * @param {string} descripcion - Descripción opcional
     * @returns {Promise<Object>}
     */
    subirFotoKardex: async (vehiculoId, foto, descripcion = '') => {
        try {
            console.log(`📤 Subiendo foto para vehículo ID: ${vehiculoId}`);
            
            const formData = new FormData();
            formData.append('foto', foto);
            if (descripcion) formData.append('descripcion', descripcion);
            
            const response = await api.post(`/vehiculos/${vehiculoId}/kardex/foto`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('✅ Foto subida correctamente:', response.data);
            return response.data;
            
        } catch (error) {
            console.error('❌ Error subiendo foto:', error);
            const message = error.response?.data?.message || 'Error al subir la foto.';
            alert(`Error: ${message}`);
            throw error;
        }
    },
    
    /**
     * Eliminar foto del Kárdex
     * @param {number} documentoId - ID del documento
     * @returns {Promise<void>}
     */
    eliminarFotoKardex: async (documentoId) => {
        try {
            console.log(`🗑️ Eliminando foto ID: ${documentoId}`);
            
            await api.delete(`/documentos/${documentoId}/kardex`);
            
            console.log('✅ Foto eliminada correctamente');
            
        } catch (error) {
            console.error('❌ Error eliminando foto:', error);
            const message = error.response?.data?.message || 'Error al eliminar la foto.';
            alert(`Error: ${message}`);
            throw error;
        }
    },
};

export default reporteService;