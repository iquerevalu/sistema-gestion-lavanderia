import { ApiResponse, Hotel } from '../types';

const API_BASE_URL = 'http://localhost:3002/api';

// Obtener token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface CreateHotelRequest {
  ruc: string;
  razon_social: string;
  nombre_comercial: string;
  direccion: string;
  correo_contacto: string;
  telefono: string;
}

export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {
  id_hotel: number;
}

export interface HotelesResponse {
  hotels: Hotel[];
  total: number;
  page: number;
  totalPages: number;
}

// Obtener todos los hoteles
export const getAllHoteles = async (
  page: number = 1,
  limit: number = 10
): Promise<HotelesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/hoteles?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener hoteles');
  }

  const data: ApiResponse<HotelesResponse> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Error al obtener hoteles');
  }

  return data.data!;
};

// Obtener hotel por ID
export const getHotelById = async (id: number): Promise<Hotel> => {
  const response = await fetch(`${API_BASE_URL}/hoteles/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener hotel');
  }

  const data: ApiResponse<Hotel> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Error al obtener hotel');
  }

  return data.data!;
};

// Crear nuevo hotel
export const createHotel = async (hotelData: CreateHotelRequest): Promise<Hotel> => {
  const response = await fetch(`${API_BASE_URL}/hoteles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(hotelData),
  });

  if (!response.ok) {
    throw new Error('Error al crear hotel');
  }

  const data: ApiResponse<Hotel> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Error al crear hotel');
  }

  return data.data!;
};

// Actualizar hotel
export const updateHotel = async (hotelData: UpdateHotelRequest): Promise<Hotel> => {
  const { id_hotel, ...updateData } = hotelData;
  
  const response = await fetch(`${API_BASE_URL}/hoteles/${id_hotel}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar hotel');
  }

  const data: ApiResponse<Hotel> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Error al actualizar hotel');
  }

  return data.data!;
};

// Eliminar hotel (soft delete)
export const deleteHotel = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/hoteles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al eliminar hotel');
  }

  const data: ApiResponse<void> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Error al eliminar hotel');
  }
};