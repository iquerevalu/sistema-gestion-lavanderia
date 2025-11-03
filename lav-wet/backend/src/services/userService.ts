import bcrypt from 'bcryptjs';
import { executeQuery } from '../database/connection.js';
import { Usuario } from '../types';

export interface CreateUserRequest {
  nombre_completo: string;
  correo: string;
  password: string;
  telefono?: string;
  perfil_id: number;
  hotel_id?: number;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  id_usuario: number;
  password?: string;
}

// Obtener todos los usuarios con paginación
export const getAllUsers = async (page: number = 1, limit: number = 10): Promise<{ users: Omit<Usuario, 'password'>[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;
    
    // Consulta para obtener usuarios (simplificada para debug)
    const usersQuery = `
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
      WHERE u.estado = 1
      ORDER BY u.nombre_completo ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Consulta para contar total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM lv_usuario 
      WHERE estado = 1
    `;
    
    const [users, countResult] = await Promise.all([
      executeQuery<Usuario>(usersQuery, []),
      executeQuery<{ total: number }>(countQuery, [])
    ]);
    
    // Remover password de los resultados
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    
    return {
      users: usersWithoutPassword,
      total: countResult[0]?.total || 0
    };
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw new Error('Error interno del servidor');
  }
};

// Obtener usuario por ID
export const getUserById = async (id: number): Promise<Omit<Usuario, 'password'> | null> => {
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
    
    const users = await executeQuery<Usuario>(query, [id]);
    if (users.length === 0) return null;
    
    const { password, ...userWithoutPassword } = users[0];
    return userWithoutPassword;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw new Error('Error interno del servidor');
  }
};

// Crear nuevo usuario
export const createUser = async (userData: CreateUserRequest): Promise<Omit<Usuario, 'password'>> => {
  try {
    // Verificar si ya existe un usuario con el mismo correo
    const existingQuery = `
      SELECT id_usuario 
      FROM lv_usuario 
      WHERE correo = ? AND estado = 1
    `;
    const existing = await executeQuery(existingQuery, [userData.correo]);
    if (existing.length > 0) {
      throw new Error('Ya existe un usuario con ese correo electrónico');
    }
    
    // Verificar que el perfil existe
    const perfilQuery = `
      SELECT id_perfil 
      FROM lv_perfil 
      WHERE id_perfil = ?
    `;
    const perfil = await executeQuery(perfilQuery, [userData.perfil_id]);
    if (perfil.length === 0) {
      throw new Error('El perfil especificado no existe');
    }
    
    // Verificar que el hotel existe (si se especifica)
    if (userData.hotel_id) {
      const hotelQuery = `
        SELECT id_hotel 
        FROM lv_hotel 
        WHERE id_hotel = ? AND estado = 1
      `;
      const hotel = await executeQuery(hotelQuery, [userData.hotel_id]);
      if (hotel.length === 0) {
        throw new Error('El hotel especificado no existe');
      }
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const insertQuery = `
      INSERT INTO lv_usuario (
        nombre_completo,
        correo,
        password,
        telefono,
        perfil_id,
        hotel_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      userData.nombre_completo,
      userData.correo,
      hashedPassword,
      userData.telefono || null,
      userData.perfil_id,
      userData.hotel_id || null
    ]);
    
    const insertResult = result as any;
    const userId = insertResult.insertId;
    
    // Obtener el usuario creado
    const createdUser = await getUserById(userId);
    if (!createdUser) {
      throw new Error('Error al crear el usuario');
    }
    
    return createdUser;
  } catch (error: any) {
    console.error('Error creando usuario:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Actualizar usuario
export const updateUser = async (userData: UpdateUserRequest): Promise<Omit<Usuario, 'password'>> => {
  try {
    // Verificar que el usuario existe
    const existingUser = await getUserById(userData.id_usuario);
    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }
    
    // Verificar correo único (si se está actualizando)
    if (userData.correo && userData.correo !== existingUser.correo) {
      const duplicateQuery = `
        SELECT id_usuario 
        FROM lv_usuario 
        WHERE correo = ? AND id_usuario != ? AND estado = 1
      `;
      const duplicate = await executeQuery(duplicateQuery, [userData.correo, userData.id_usuario]);
      if (duplicate.length > 0) {
        throw new Error('Ya existe un usuario con ese correo electrónico');
      }
    }
    
    // Verificar perfil (si se está actualizando)
    if (userData.perfil_id) {
      const perfilQuery = `
        SELECT id_perfil 
        FROM lv_perfil 
        WHERE id_perfil = ?
      `;
      const perfil = await executeQuery(perfilQuery, [userData.perfil_id]);
      if (perfil.length === 0) {
        throw new Error('El perfil especificado no existe');
      }
    }
    
    // Verificar hotel (si se está actualizando)
    if (userData.hotel_id) {
      const hotelQuery = `
        SELECT id_hotel 
        FROM lv_hotel 
        WHERE id_hotel = ? AND estado = 1
      `;
      const hotel = await executeQuery(hotelQuery, [userData.hotel_id]);
      if (hotel.length === 0) {
        throw new Error('El hotel especificado no existe');
      }
    }
    
    let hashedPassword = null;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }
    
    const updateQuery = `
      UPDATE lv_usuario 
      SET 
        nombre_completo = COALESCE(?, nombre_completo),
        correo = COALESCE(?, correo),
        password = COALESCE(?, password),
        telefono = COALESCE(?, telefono),
        perfil_id = COALESCE(?, perfil_id),
        hotel_id = ?,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_usuario = ? AND estado = 1
    `;
    
    await executeQuery(updateQuery, [
      userData.nombre_completo || null,
      userData.correo || null,
      hashedPassword,
      userData.telefono || null,
      userData.perfil_id || null,
      userData.hotel_id || null,
      userData.id_usuario
    ]);
    
    // Obtener el usuario actualizado
    const updatedUser = await getUserById(userData.id_usuario);
    if (!updatedUser) {
      throw new Error('Error al actualizar el usuario');
    }
    
    return updatedUser;
  } catch (error: any) {
    console.error('Error actualizando usuario:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Eliminar usuario (soft delete)
export const deleteUser = async (id: number): Promise<void> => {
  try {
    // Verificar que el usuario existe
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }
    
    // Verificar que no sea el último administrador
    if (existingUser.nombre_perfil === 'Administrador') {
      const adminCountQuery = `
        SELECT COUNT(*) as count 
        FROM lv_usuario u
        INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
        WHERE p.nombre_perfil = 'Administrador' AND u.estado = 1
      `;
      const adminCount = await executeQuery<{ count: number }>(adminCountQuery);
      if (adminCount[0]?.count <= 1) {
        throw new Error('No se puede eliminar el último administrador del sistema');
      }
    }
    
    // Soft delete
    const deleteQuery = `
      UPDATE lv_usuario 
      SET estado = 0, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_usuario = ?
    `;
    
    await executeQuery(deleteQuery, [id]);
  } catch (error: any) {
    console.error('Error eliminando usuario:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Buscar usuarios por nombre o correo
export const searchUsers = async (searchTerm: string): Promise<Omit<Usuario, 'password'>[]> => {
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
      WHERE u.estado = 1 
        AND (
          u.nombre_completo LIKE ? 
          OR u.correo LIKE ?
        )
      ORDER BY u.nombre_completo ASC
      LIMIT 20
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const users = await executeQuery<Usuario>(query, [searchPattern, searchPattern]);
    
    // Remover password de los resultados
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    console.error('Error buscando usuarios:', error);
    throw new Error('Error interno del servidor');
  }
};

// Obtener perfiles disponibles
export const getProfiles = async (): Promise<{ id_perfil: number; nombre_perfil: string; descripcion?: string }[]> => {
  try {
    const query = `
      SELECT id_perfil, nombre_perfil, descripcion
      FROM lv_perfil
      ORDER BY nombre_perfil ASC
    `;
    
    return await executeQuery(query);
  } catch (error) {
    console.error('Error obteniendo perfiles:', error);
    throw new Error('Error interno del servidor');
  }
};