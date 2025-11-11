import { api } from './api';
import { Hotel } from '../types';

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
  try {
    const response = await api.get(`/hoteles?page=${page}&limit=${limit}`);
    
    // El backend devuelve { success: true, data: { hotels, total, page, totalPages } }
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Formato de respuesta inválido');
    }
  } catch (error) {
    console.error('❌ Error conectando a BD, usando datos simulados:', error);
    // Datos simulados con paginación para desarrollo
    const hotelesSimulados: Hotel[] = [
      {
        id_hotel: 1,
        ruc: '20123456789',
        nombre_comercial: 'Hotel Plaza Mayor',
        razon_social: 'Hotel Plaza Mayor S.A.C.',
        telefono: '01-234-5678',
        correo: 'info@hotelplazamayor.com',
        direccion: 'Av. Principal 123, Lima',
        estado: 1,
        fecha_creacion: '2024-01-01T10:00:00Z',
        fecha_actualizacion: '2024-01-01T10:00:00Z'
      },
      {
        id_hotel: 2,
        ruc: '20987654321',
        nombre_comercial: 'Hotel Costa Verde',
        razon_social: 'Inversiones Costa Verde S.R.L.',
        telefono: '01-987-6543',
        correo: 'contacto@hotelcostaverde.com',
        direccion: 'Malecón Costa Verde 456, Miraflores',
        estado: 1,
        fecha_creacion: '2024-01-02T10:00:00Z',
        fecha_actualizacion: '2024-01-02T10:00:00Z'
      },
      {
        id_hotel: 3,
        ruc: '20555666777',
        nombre_comercial: 'Hotel Ejecutivo',
        razon_social: 'Hotel Ejecutivo Lima S.A.',
        telefono: '01-555-6677',
        correo: 'reservas@hotelecutivo.com',
        direccion: 'Jr. Ejecutivo 789, San Isidro',
        estado: 1,
        fecha_creacion: '2024-01-03T10:00:00Z',
        fecha_actualizacion: '2024-01-03T10:00:00Z'
      },
      {
        id_hotel: 4,
        ruc: '20444333222',
        nombre_comercial: 'Hotel Boutique',
        razon_social: 'Boutique Hotels Peru S.A.C.',
        telefono: '01-444-3322',
        correo: 'info@hotelboutique.com',
        direccion: 'Av. Boutique 321, Barranco',
        estado: 1,
        fecha_creacion: '2024-01-04T10:00:00Z',
        fecha_actualizacion: '2024-01-04T10:00:00Z'
      },
      {
        id_hotel: 5,
        ruc: '20111222333',
        nombre_comercial: 'Hotel Business',
        razon_social: 'Business Hotels Group S.R.L.',
        telefono: '01-111-2233',
        correo: 'contacto@hotelbusiness.com',
        direccion: 'Av. Business 654, La Molina',
        estado: 1,
        fecha_creacion: '2024-01-05T10:00:00Z',
        fecha_actualizacion: '2024-01-05T10:00:00Z'
      },
      {
        id_hotel: 6,
        ruc: '20666777888',
        nombre_comercial: 'Hotel Luxury',
        razon_social: 'Luxury Hotels International S.A.',
        telefono: '01-666-7788',
        correo: 'info@hotelluxury.com',
        direccion: 'Av. Luxury 987, San Borja',
        estado: 1,
        fecha_creacion: '2024-01-06T10:00:00Z',
        fecha_actualizacion: '2024-01-06T10:00:00Z'
      },
      {
        id_hotel: 7,
        ruc: '20777888999',
        nombre_comercial: 'Hotel Metropolitan',
        razon_social: 'Metropolitan Hotels Group S.A.C.',
        telefono: '01-777-8899',
        correo: 'reservas@hotelmetropolitan.com',
        direccion: 'Jr. Metropolitan 147, Surco',
        estado: 1,
        fecha_creacion: '2024-01-07T10:00:00Z',
        fecha_actualizacion: '2024-01-07T10:00:00Z'
      },
      {
        id_hotel: 8,
        ruc: '20888999000',
        nombre_comercial: 'Hotel Garden',
        razon_social: 'Garden Hotels Peru S.R.L.',
        telefono: '01-888-9900',
        correo: 'contacto@hotelgarden.com',
        direccion: 'Av. Garden 258, Pueblo Libre',
        estado: 1,
        fecha_creacion: '2024-01-08T10:00:00Z',
        fecha_actualizacion: '2024-01-08T10:00:00Z'
      },
      {
        id_hotel: 9,
        ruc: '20999000111',
        nombre_comercial: 'Hotel Panorama',
        razon_social: 'Panorama Hotels S.A.',
        telefono: '01-999-0011',
        correo: 'info@hotelpanorama.com',
        direccion: 'Av. Panorama 369, Chorrillos',
        estado: 1,
        fecha_creacion: '2024-01-09T10:00:00Z',
        fecha_actualizacion: '2024-01-09T10:00:00Z'
      },
      {
        id_hotel: 10,
        ruc: '20000111222',
        nombre_comercial: 'Hotel Sunrise',
        razon_social: 'Sunrise Hospitality S.A.C.',
        telefono: '01-000-1122',
        correo: 'reservas@hotelsunrise.com',
        direccion: 'Jr. Sunrise 741, Jesús María',
        estado: 1,
        fecha_creacion: '2024-01-10T10:00:00Z',
        fecha_actualizacion: '2024-01-10T10:00:00Z'
      },
      {
        id_hotel: 11,
        ruc: '20111222444',
        nombre_comercial: 'Hotel Oceanic',
        razon_social: 'Oceanic Hotels International S.R.L.',
        telefono: '01-111-2244',
        correo: 'info@hoteloceanic.com',
        direccion: 'Malecón Oceanic 852, Callao',
        estado: 1,
        fecha_creacion: '2024-01-11T10:00:00Z',
        fecha_actualizacion: '2024-01-11T10:00:00Z'
      },
      {
        id_hotel: 12,
        ruc: '20222333555',
        nombre_comercial: 'Hotel Royal',
        razon_social: 'Royal Hotels Group S.A.',
        telefono: '01-222-3355',
        correo: 'contacto@hotelroyal.com',
        direccion: 'Av. Royal 963, Lince',
        estado: 1,
        fecha_creacion: '2024-01-12T10:00:00Z',
        fecha_actualizacion: '2024-01-12T10:00:00Z'
      }
    ];

    // Simular paginación
    const totalItems = hotelesSimulados.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const hotelesPaginados = hotelesSimulados.slice(startIndex, endIndex);

    const resultado = {
      hotels: hotelesPaginados,
      total: totalItems,
      page: page,
      totalPages: totalPages
    };
    
    return resultado;
  }
};

// Obtener hotel por ID
export const getHotelById = async (id: number): Promise<Hotel> => {
  const response = await api.get(`/hoteles/${id}`);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error('Hotel no encontrado');
};

// Crear nuevo hotel
export const createHotel = async (hotelData: CreateHotelRequest): Promise<Hotel> => {
  const response = await api.post('/hoteles', hotelData);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error('Error al crear hotel');
};

// Actualizar hotel
export const updateHotel = async (hotelData: UpdateHotelRequest): Promise<Hotel> => {
  const response = await api.put(`/hoteles/${hotelData.id_hotel}`, hotelData);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error('Error al actualizar hotel');
};

// Eliminar hotel (soft delete)
export const deleteHotel = async (id: number): Promise<void> => {
  const response = await api.delete(`/hoteles/${id}`);
  if (!response.data.success) {
    throw new Error('Error al eliminar hotel');
  }
};