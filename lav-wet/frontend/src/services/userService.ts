import { api } from './api';
import { Usuario } from '../types';

export interface CreateUserRequest {
  nombre_completo: string;
  correo: string;
  telefono?: string;
  perfil_id: number;
  hotel_id?: number;
  password: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id_usuario: number;
}

export interface UsersResponse {
  users: Usuario[];
  total: number;
  page: number;
  totalPages: number;
}

// Obtener todos los usuarios
export const getAllUsers = async (page: number = 1, limit: number = 10): Promise<UsersResponse> => {
  console.log('👥 Cargando usuarios de la BD - página:', page);
  
  try {
    const response = await api.get(`/usuarios?page=${page}&limit=${limit}`);
    console.log('📦 Respuesta usuarios BD:', response.data);
    
    // El backend devuelve { success: true, data: { users, total, page, totalPages } }
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Formato de respuesta inválido');
    }
  } catch (error) {
    console.error('❌ Error conectando a BD, usando datos simulados:', error);
    // Datos simulados con paginación para desarrollo
    const usuariosSimulados: Usuario[] = [
      {
        id_usuario: 1,
        nombre_completo: 'Juan Carlos Admin',
        correo: 'admin@lavanderia.com',
        telefono: '999-888-777',
        perfil_id: 1,
        hotel_id: null,
        estado: 1,
        fecha_creacion: '2024-01-01T10:00:00Z',
        fecha_actualizacion: '2024-01-01T10:00:00Z',
        nombre_perfil: 'Administrador'
      },
      {
        id_usuario: 2,
        nombre_completo: 'María García Operador',
        correo: 'maria@hotelplaza.com',
        telefono: '999-777-666',
        perfil_id: 2,
        hotel_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-02T10:00:00Z',
        fecha_actualizacion: '2024-01-02T10:00:00Z',
        nombre_perfil: 'Operador',
        nombre_comercial: 'Hotel Plaza Mayor'
      },
      {
        id_usuario: 3,
        nombre_completo: 'Carlos López Supervisor',
        correo: 'carlos@hotelcosta.com',
        telefono: '999-666-555',
        perfil_id: 3,
        hotel_id: 2,
        estado: 1,
        fecha_creacion: '2024-01-03T10:00:00Z',
        fecha_actualizacion: '2024-01-03T10:00:00Z',
        nombre_perfil: 'Supervisor',
        nombre_comercial: 'Hotel Costa Verde'
      },
      {
        id_usuario: 4,
        nombre_completo: 'Ana Martínez Recepcionista',
        correo: 'ana@hotelecutivo.com',
        telefono: '999-555-444',
        perfil_id: 2,
        hotel_id: 3,
        estado: 1,
        fecha_creacion: '2024-01-04T10:00:00Z',
        fecha_actualizacion: '2024-01-04T10:00:00Z',
        nombre_perfil: 'Operador',
        nombre_comercial: 'Hotel Ejecutivo'
      },
      {
        id_usuario: 5,
        nombre_completo: 'Pedro Sánchez Gerente',
        correo: 'pedro@hotelboutique.com',
        telefono: '999-444-333',
        perfil_id: 3,
        hotel_id: 4,
        estado: 1,
        fecha_creacion: '2024-01-05T10:00:00Z',
        fecha_actualizacion: '2024-01-05T10:00:00Z',
        nombre_perfil: 'Supervisor',
        nombre_comercial: 'Hotel Boutique'
      },
      {
        id_usuario: 6,
        nombre_completo: 'Laura Fernández Coordinadora',
        correo: 'laura@hotelbusiness.com',
        telefono: '999-333-222',
        perfil_id: 2,
        hotel_id: 5,
        estado: 1,
        fecha_creacion: '2024-01-06T10:00:00Z',
        fecha_actualizacion: '2024-01-06T10:00:00Z',
        nombre_perfil: 'Operador',
        nombre_comercial: 'Hotel Business'
      },
      {
        id_usuario: 7,
        nombre_completo: 'Roberto Silva Chofer',
        correo: 'roberto@lavanderia.com',
        telefono: '999-222-111',
        perfil_id: 4,
        hotel_id: null,
        estado: 1,
        fecha_creacion: '2024-01-07T10:00:00Z',
        fecha_actualizacion: '2024-01-07T10:00:00Z',
        nombre_perfil: 'Chofer'
      },
      {
        id_usuario: 8,
        nombre_completo: 'Carmen Vega Recepcionista',
        correo: 'carmen@hotelluxury.com',
        telefono: '999-111-000',
        perfil_id: 2,
        hotel_id: 6,
        estado: 1,
        fecha_creacion: '2024-01-08T10:00:00Z',
        fecha_actualizacion: '2024-01-08T10:00:00Z',
        nombre_perfil: 'Operador',
        nombre_comercial: 'Hotel Luxury'
      },
      {
        id_usuario: 9,
        nombre_completo: 'Diego Torres Supervisor',
        correo: 'diego@hotelmetropolitan.com',
        telefono: '999-000-999',
        perfil_id: 3,
        hotel_id: 7,
        estado: 1,
        fecha_creacion: '2024-01-09T10:00:00Z',
        fecha_actualizacion: '2024-01-09T10:00:00Z',
        nombre_perfil: 'Supervisor',
        nombre_comercial: 'Hotel Metropolitan'
      },
      {
        id_usuario: 10,
        nombre_completo: 'Sofía Ramírez Coordinadora',
        correo: 'sofia@hotelgarden.com',
        telefono: '999-888-000',
        perfil_id: 2,
        hotel_id: 8,
        estado: 1,
        fecha_creacion: '2024-01-10T10:00:00Z',
        fecha_actualizacion: '2024-01-10T10:00:00Z',
        nombre_perfil: 'Operador',
        nombre_comercial: 'Hotel Garden'
      },
      {
        id_usuario: 11,
        nombre_completo: 'Miguel Herrera Chofer',
        correo: 'miguel@lavanderia.com',
        telefono: '999-777-000',
        perfil_id: 4,
        hotel_id: null,
        estado: 1,
        fecha_creacion: '2024-01-11T10:00:00Z',
        fecha_actualizacion: '2024-01-11T10:00:00Z',
        nombre_perfil: 'Chofer'
      },
      {
        id_usuario: 12,
        nombre_completo: 'Valeria Castro Gerente',
        correo: 'valeria@hotelpanorama.com',
        telefono: '999-666-000',
        perfil_id: 3,
        hotel_id: 9,
        estado: 1,
        fecha_creacion: '2024-01-12T10:00:00Z',
        fecha_actualizacion: '2024-01-12T10:00:00Z',
        nombre_perfil: 'Supervisor',
        nombre_comercial: 'Hotel Panorama'
      }
    ];

    // Simular paginación
    const totalItems = usuariosSimulados.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const usuariosPaginados = usuariosSimulados.slice(startIndex, endIndex);

    return {
      users: usuariosPaginados,
      total: totalItems,
      page: page,
      totalPages: totalPages
    };
  }
};

// Obtener usuario por ID
export const getUserById = async (id: number): Promise<Usuario> => {
  const response = await api.get(`/usuarios/${id}`);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error('Usuario no encontrado');
};

// Crear nuevo usuario
export const createUser = async (userData: CreateUserRequest): Promise<Usuario> => {
  const response = await api.post('/usuarios', userData);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error('Error al crear usuario');
};

// Actualizar usuario
export const updateUser = async (userData: UpdateUserRequest): Promise<Usuario> => {
  const response = await api.put(`/usuarios/${userData.id_usuario}`, userData);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error('Error al actualizar usuario');
};

// Eliminar usuario
export const deleteUser = async (id: number): Promise<void> => {
  const response = await api.delete(`/usuarios/${id}`);
  if (!response.data.success) {
    throw new Error('Error al eliminar usuario');
  }
};

// Obtener perfiles disponibles
export const getPerfiles = async (): Promise<any[]> => {
  try {
    const response = await api.get('/usuarios/perfiles');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error cargando perfiles:', error);
    return [];
  }
};

// Obtener hoteles para asignar
export const getHotelesForUsers = async (): Promise<any[]> => {
  try {
    const response = await api.get('/hoteles?limit=100');
    console.log('🏨 Respuesta de hoteles:', response.data);
    
    if (response.data.success && response.data.data) {
      // La respuesta tiene estructura: { success, data: { hoteles, total, page, totalPages } }
      const hoteles = response.data.data.hoteles || response.data.data.hotels || [];
      console.log('🏨 Hoteles extraídos:', hoteles);
      return hoteles;
    }
    return [];
  } catch (error) {
    console.error('❌ Error cargando hoteles:', error);
    return [];
  }
};