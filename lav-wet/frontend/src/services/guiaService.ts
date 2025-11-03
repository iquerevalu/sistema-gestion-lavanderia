import { api } from './api';
import { GuiaLavanderia } from '../types';

export interface GuiasResponse {
  guias: GuiaLavanderia[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateGuiaData {
  hotel_id: number;
  fecha_recoleccion: string;
  chofer_recojo_id: number;
  observaciones?: string;
  prendas: {
    prenda_id: number;
    cantidad_sucia: number;
    es_devuelta: boolean;
  }[];
}

// Obtener todas las guías
export const getAllGuias = async (page: number = 1, limit: number = 10, filters?: any): Promise<GuiasResponse> => {
  let url = `/guias?page=${page}&limit=${limit}`;
  
  if (filters) {
    if (filters.numero_guia) url += `&numero_guia=${filters.numero_guia}`;
    if (filters.hotel_id) url += `&hotel_id=${filters.hotel_id}`;
    if (filters.estado) url += `&estado=${filters.estado}`;
  }
  
  const response = await api.get(url);
  return response.data.data || response.data;
};

// Obtener guía por ID
export const getGuiaById = async (id: number): Promise<GuiaLavanderia> => {
  const response = await api.get(`/guias/${id}`);
  return response.data.data || response.data;
};

// Crear nueva guía
export const createGuia = async (guiaData: CreateGuiaData): Promise<GuiaLavanderia> => {
  const response = await api.post('/guias', guiaData);
  return response.data.data || response.data;
};

// Actualizar guía
export const updateGuia = async (id: number, guiaData: any): Promise<GuiaLavanderia> => {
  const response = await api.put(`/guias/${id}`, guiaData);
  return response.data.data || response.data;
};

// Obtener siguiente número de guía para un hotel
export const getNextGuiaNumber = async (hotelId: number): Promise<number> => {
  const response = await api.get(`/guias/next-number/${hotelId}`);
  return response.data.data?.nextNumber || response.data.nextNumber || 1;
};

// Obtener choferes disponibles
export const getChoferes = async (): Promise<any[]> => {
  const response = await api.get('/usuarios/choferes');
  return response.data.data || response.data;
};

// Obtener prendas disponibles para un hotel
export const getPrendasByHotel = async (hotelId: number): Promise<any[]> => {
  const response = await api.get(`/hoteles/${hotelId}/prendas`);
  return response.data.data || response.data;
};