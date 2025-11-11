import { api } from './api';

export interface Estado {
  id_estado: number;
  nombre_estado: string;
}

// Obtener todos los estados
export const getAllEstados = async (): Promise<Estado[]> => {
  try {
    const response = await api.get('/estados');
    return response.data.data || [];
  } catch (error) {
    console.error('Error obteniendo estados:', error);
    return [];
  }
};

// Obtener estados permitidos para procesamiento
export const getEstadosProcesamiento = async (): Promise<Estado[]> => {
  try {
    const response = await api.get('/estados/procesamiento');
    return response.data.data || [];
  } catch (error) {
    console.error('Error obteniendo estados de procesamiento:', error);
    return [];
  }
};
