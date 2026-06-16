import api from '../api/axios';

export const reporteService = {
    /**
     * Reporte de vehículos
     */
    vehiculos: (filtros = {}) => api.get('/reportes/vehiculos', { params: filtros }),

    /**
     * Reporte de mantenimientos
     */
    mantenimientos: (filtros = {}) => api.get('/reportes/mantenimientos', { params: filtros }),

    /**
     * Reporte de repuestos con stock bajo
     */
    repuestosStockBajo: () => api.get('/reportes/repuestos-stock-bajo'),

    /**
     * Exportar a CSV usando axios con token
     */
    exportarCSV: async (tipo, filtros = {}) => {
        try {
            // Construir parámetros
            const params = new URLSearchParams();
            params.append('tipo', tipo);
            
            Object.keys(filtros).forEach(key => {
                if (filtros[key] && filtros[key] !== '') {
                    params.append(key, filtros[key]);
                }
            });
            
            // Usar axios (el token se añade automáticamente por el interceptor)
            const response = await api.get(`/reportes/exportar-csv?${params.toString()}`, {
                responseType: 'blob'
            });
            
            // Crear archivo para descargar
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
};

export default reporteService;