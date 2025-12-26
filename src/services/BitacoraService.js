// src/services/BitacoraService.js
import api from '../api/axios';

/**
 * Servicio para gestionar bitácora/auditoría
 * Proporciona métodos para consultar registros de auditoría
 */
export const bitacoraService = {
  /**
   * Obtener todos los registros de bitácora
   * @param {Object} params - Parámetros de filtro (opcional)
   * @returns {Promise} Promesa con la lista de registros
   */
  getAll: (params = {}) => api.get('/bitacoras', { params }),
  
  /**
   * Obtener un registro de bitácora por ID
   * @param {number} id - ID del registro
   * @returns {Promise} Promesa con los datos del registro
   */
  getById: (id) => api.get(`/bitacoras/${id}`),
  
  /**
   * Obtener filtros disponibles para bitácora
   * @returns {Promise} Promesa con opciones de filtro
   */
  getFiltros: () => api.get('/bitacoras/filtros'),
  
  /**
   * Exportar bitácora a CSV
   * @param {Object} filtros - Filtros de exportación
   * @returns {Promise} Promesa con el archivo CSV
   */
  exportarCSV: (filtros) => api.get('/bitacoras/exportar/csv', { 
    params: filtros,
    responseType: 'blob' 
  }),
  
  /**
   * Exportar bitácora a PDF
   * @param {Object} filtros - Filtros de exportación
   * @returns {Promise} Promesa con el archivo PDF
   */
  exportarPDF: (filtros) => api.get('/bitacoras/exportar/pdf', { 
    params: filtros,
    responseType: 'blob' 
  }),
};