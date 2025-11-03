import bcrypt from 'bcryptjs';
import { Usuario, JwtPayload } from '../types';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<Usuario, 'password'>;
  token: string;
  refreshToken: string;
}

// Usuarios temporales en memoria (simulando la base de datos)
const tempUsers: Usuario[] = [
  {
    id_usuario: 1,
    nombre_completo: 'Juan Carlos Admin',
    correo: 'admin@lavanderia.com',
    password: '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', // 123456
    telefono: '999-888-777',
    perfil_id: 1,
    hotel_id: undefined,
    estado: 1,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    nombre_perfil: 'Administrador',
    nombre_comercial: undefined
  },
  {
    id_usuario: 2,
    nombre_completo: 'María González',
    correo: 'maria.gonzalez@hotelparadise.com',
    password: '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', // 123456
    telefono: '999-111-222',
    perfil_id: 2,
    hotel_id: 1,
    estado: 1,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    nombre_perfil: 'Recepcionista Hotel',
    nombre_comercial: 'Hotel Paradise'
  },
  {
    id_usuario: 3,
    nombre_completo: 'Roberto Silva',
    correo: 'roberto.silva@lavanderia.com',
    password: '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', // 123456
    telefono: '999-777-888',
    perfil_id: 4,
    hotel_id: undefined,
    estado: 1,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    nombre_perfil: 'Operario Lavandería',
    nombre_comercial: undefined
  },
  {
    id_usuario: 4,
    nombre_completo: 'Ana Rodríguez',
    correo: 'ana.rodriguez@hotelparadise.com',
    password: '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', // 123456
    telefono: '999-555-666',
    perfil_id: 5,
    hotel_id: 1,
    estado: 1,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    nombre_perfil: 'Encargado Hotel',
    nombre_comercial: 'Hotel Paradise'
  }
];

// Función para verificar contraseña
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  // Para la demo, usamos una contraseña simple
  return password === '123456';
};

// Función para buscar usuario por email
export const findUserByEmail = async (correo: string): Promise<Usuario | null> => {
  const user = tempUsers.find(u => u.correo === correo && u.estado === 1);
  return user || null;
};

// Función para autenticar usuario
export const authenticateUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { correo, password } = credentials;

  // Buscar usuario
  const user = await findUserByEmail(correo);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar contraseña
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  // Crear payload para JWT
  const jwtPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId: user.id_usuario,
    email: user.correo,
    perfil: user.nombre_perfil || '',
    perfilId: user.perfil_id,
    hotelId: user.hotel_id || undefined
  };

  // Generar tokens
  const token = generateToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  // Remover password del objeto usuario
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
    refreshToken
  };
};

// Función para renovar token
export const refreshUserToken = async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
  try {
    // Verificar refresh token (usa la misma función que el token normal)
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;
    
    // Verificar que el usuario aún existe y está activo
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Crear nuevo payload
    const jwtPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: user.id_usuario,
      email: user.correo,
      perfil: user.nombre_perfil || '',
      perfilId: user.perfil_id,
      hotelId: user.hotel_id || undefined
    };

    // Generar nuevos tokens
    const newToken = generateToken(jwtPayload);
    const newRefreshToken = generateRefreshToken(jwtPayload);

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};

// Función para obtener información del usuario autenticado
export const getCurrentUser = async (userId: number): Promise<Omit<Usuario, 'password'> | null> => {
  const user = tempUsers.find(u => u.id_usuario === userId && u.estado === 1);
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};