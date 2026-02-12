import axios from "../api/axios";

const ENDPOINT = "/catalogos/clasificaciones-vehiculos";

const ClasificacionService = {

  // Obtener todas las clasificaciones activas
  async getAll() {
    const response = await axios.get(ENDPOINT);

    console.log("Clasificaciones API:", response.data);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  }
};

export default ClasificacionService;
