import axios from 'axios';

// Creamos una instancia personalizada de Axios
const api = axios.create({
  // Usamos la variable de entorno o el localhost por defecto
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor de solicitudes: se ejecuta ANTES de que la petición salga al servidor
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token guardado en el navegador
    const token = localStorage.getItem('token');
    
    // Si el token existe, lo añadimos a las cabeceras de autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // IMPORTANTE: Siempre debemos retornar config para que Axios continúe la petición
    // Si falta este return, aparece el error 'Cannot read properties of undefined (cancelToken)'
    return config; 
  }, 
  (error) => {
    // Si hay un error en la configuración de la petición, lo rechazamos
    return Promise.reject(error);
  }
);

export default api;