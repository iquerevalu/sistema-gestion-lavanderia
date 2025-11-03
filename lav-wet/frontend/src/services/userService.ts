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
  const response = await api.get(`/usuarios?page=${page}&limit=${limit}`);
  return response.data.data || response.data;
};

// Obtener usuario por ID
export const getUserById = async (id: number): Promise<Usuario> => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data.data || response.data;
};

// Crear nuevo usuario
export const createUser = async (userData: CreateUserRequest): Promise<Usuario> => {
  const response = await api.post('/usuarios', userData);
  return response.data.data || response.data;
};

// Actualizar usuario
export const updateUser = async (userData: UpdateUserRequest): Promise<Usuario> => {
  const response = await api.put(`/usuarios/${userData.id_usuario}`, userData);
  return response.data.data || response.data;
};

// Eliminar usuario
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`);
};

// Obtener perfiles disponibles
export const getPerfiles = async (): Promise<any[]> => {
  const response = await api.get('/perfiles');
  return response.data.data || response.data;
};

// Obtener hoteles para asignar
export const getHotelesForUsers = async (): Promise<any[]> => {
  const response = await api.get('/hoteles');
  return response.data.data?.hotels || response.data.hotels || response.data;
};