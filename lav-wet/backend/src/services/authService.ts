import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../database/connection.js';
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

// Función para hashear contraseña
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Función para verificar contraseña
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Función para buscar usuario por email
export const findUserByEmail = async (correo: string): Promise<Usuario | null> => {
  try {
    const query = `
      SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.correo,
        u.password,
        u.telefono,
        u.perfil_id,
        u.hotel_id,
        u.estado,
        u.fecha_creacion,
        u.fecha_actualizacion,
        p.nombre_perfil,
        h.nombre_comercial
      FROM lv_usuario u
      INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
      LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
      WHERE u.correo = ? AND u.estado = 1
    `;
    
    const users = await executeQuery<Usuario>(query, [correo]);
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error buscando usuario:', error);
    throw new Error('Error interno del servidor');
  }
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
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;
    
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
  try {
    const query = `
      SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.correo,
        u.telefono,
        u.perfil_id,
        u.hotel_id,
        u.estado,
        u.fecha_creacion,
        u.fecha_actualizacion,
        p.nombre_perfil,
        h.nombre_comercial
      FROM lv_usuario u
      INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
      LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
      WHERE u.id_usuario = ? AND u.estado = 1
    `;
    
    const users = await executeQuery<Usuario>(query, [userId]);
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    throw new Error('Error interno del servidor');
  }
};