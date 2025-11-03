import { executeQuery, executeTransaction } from '../database/connection.js';
import { Hotel } from '../types';

export interface CreateHotelRequest {
  ruc?: string;
  razon_social: string;
  nombre_comercial?: string;
  direccion?: string;
  correo_contacto?: string;
  telefono?: string;
}

export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {
  id_hotel: number;
}

// Obtener todos los hoteles con paginación
export const getAllHotels = async (page: number = 1, limit: number = 10): Promise<{ hotels: Hotel[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;
    
    // Consulta para obtener hoteles
    const hotelsQuery = `
      SELECT 
        id_hotel,
        ruc,
        razon_social,
        nombre_comercial,
        direccion,
        correo_contacto,
        telefono,
        estado,
        fecha_creacion,
        fecha_actualizacion
      FROM lv_hotel 
      WHERE estado = 1
      ORDER BY nombre_comercial ASC, razon_social ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Consulta para contar total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM lv_hotel 
      WHERE estado = 1
    `;
    
    const [hotels, countResult] = await Promise.all([
      executeQuery<Hotel>(hotelsQuery),
      executeQuery<{ total: number }>(countQuery)
    ]);
    
    return {
      hotels,
      total: countResult[0]?.total || 0
    };
  } catch (error) {
    console.error('Error obteniendo hoteles:', error);
    throw new Error('Error interno del servidor');
  }
};

// Obtener hotel por ID
export const getHotelById = async (id: number): Promise<Hotel | null> => {
  try {
    const query = `
      SELECT 
        id_hotel,
        ruc,
        razon_social,
        nombre_comercial,
        direccion,
        correo_contacto,
        telefono,
        estado,
        fecha_creacion,
        fecha_actualizacion
      FROM lv_hotel 
      WHERE id_hotel = ? AND estado = 1
    `;
    
    const hotels = await executeQuery<Hotel>(query, [id]);
    return hotels.length > 0 ? hotels[0] : null;
  } catch (error) {
    console.error('Error obteniendo hotel:', error);
    throw new Error('Error interno del servidor');
  }
};

// Crear nuevo hotel
export const createHotel = async (hotelData: CreateHotelRequest): Promise<Hotel> => {
  try {
    // Verificar si ya existe un hotel con el mismo RUC (si se proporciona)
    if (hotelData.razon_social) {
      const existingQuery = `
        SELECT id_hotel 
        FROM lv_hotel 
        WHERE razon_social = ? AND estado = 1
      `;
      const existing = await executeQuery(existingQuery, [hotelData.razon_social]);
      if (existing.length > 0) {
        throw new Error('Ya existe un hotel con esa razón social');
      }
    }
    
    const insertQuery = `
      INSERT INTO lv_hotel (
        ruc,
        razon_social,
        nombre_comercial,
        direccion,
        correo_contacto,
        telefono
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const insertCounterQuery = `
      INSERT INTO lv_hotel_contador (hotel_id, ultimo_numero_guia)
      VALUES (?, 0)
    `;
    
    // Ejecutar en transacción
    const results = await executeTransaction([
      {
        query: insertQuery,
        params: [
          hotelData.ruc || null,
          hotelData.razon_social,
          hotelData.nombre_comercial || null,
          hotelData.direccion || null,
          hotelData.correo_contacto || null,
          hotelData.telefono || null
        ]
      }
    ]);
    
    const insertResult = results[0] as any;
    const hotelId = insertResult.insertId;
    
    // Inicializar contador de guías
    await executeQuery(insertCounterQuery, [hotelId]);
    
    // Obtener el hotel creado
    const createdHotel = await getHotelById(hotelId);
    if (!createdHotel) {
      throw new Error('Error al crear el hotel');
    }
    
    return createdHotel;
  } catch (error: any) {
    console.error('Error creando hotel:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Actualizar hotel
export const updateHotel = async (hotelData: UpdateHotelRequest): Promise<Hotel> => {
  try {
    // Verificar que el hotel existe
    const existingHotel = await getHotelById(hotelData.id_hotel);
    if (!existingHotel) {
      throw new Error('Hotel no encontrado');
    }
    
    // Verificar razón social única (si se está actualizando)
    if (hotelData.razon_social && hotelData.razon_social !== existingHotel.razon_social) {
      const duplicateQuery = `
        SELECT id_hotel 
        FROM lv_hotel 
        WHERE razon_social = ? AND id_hotel != ? AND estado = 1
      `;
      const duplicate = await executeQuery(duplicateQuery, [hotelData.razon_social, hotelData.id_hotel]);
      if (duplicate.length > 0) {
        throw new Error('Ya existe un hotel con esa razón social');
      }
    }
    
    const updateQuery = `
      UPDATE lv_hotel 
      SET 
        ruc = COALESCE(?, ruc),
        razon_social = COALESCE(?, razon_social),
        nombre_comercial = COALESCE(?, nombre_comercial),
        direccion = COALESCE(?, direccion),
        correo_contacto = COALESCE(?, correo_contacto),
        telefono = COALESCE(?, telefono),
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_hotel = ? AND estado = 1
    `;
    
    await executeQuery(updateQuery, [
      hotelData.ruc || null,
      hotelData.razon_social || null,
      hotelData.nombre_comercial || null,
      hotelData.direccion || null,
      hotelData.correo_contacto || null,
      hotelData.telefono || null,
      hotelData.id_hotel
    ]);
    
    // Obtener el hotel actualizado
    const updatedHotel = await getHotelById(hotelData.id_hotel);
    if (!updatedHotel) {
      throw new Error('Error al actualizar el hotel');
    }
    
    return updatedHotel;
  } catch (error: any) {
    console.error('Error actualizando hotel:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Eliminar hotel (soft delete)
export const deleteHotel = async (id: number): Promise<void> => {
  try {
    // Verificar que el hotel existe
    const existingHotel = await getHotelById(id);
    if (!existingHotel) {
      throw new Error('Hotel no encontrado');
    }
    
    // Verificar que no tenga usuarios asociados
    const usersQuery = `
      SELECT COUNT(*) as count 
      FROM lv_usuario 
      WHERE hotel_id = ? AND estado = 1
    `;
    const usersResult = await executeQuery<{ count: number }>(usersQuery, [id]);
    if (usersResult[0]?.count > 0) {
      throw new Error('No se puede eliminar el hotel porque tiene usuarios asociados');
    }
    
    // Verificar que no tenga guías
    const guiasQuery = `
      SELECT COUNT(*) as count 
      FROM lv_guia 
      WHERE hotel_id = ?
    `;
    const guiasResult = await executeQuery<{ count: number }>(guiasQuery, [id]);
    if (guiasResult[0]?.count > 0) {
      throw new Error('No se puede eliminar el hotel porque tiene guías registradas');
    }
    
    // Soft delete
    const deleteQuery = `
      UPDATE lv_hotel 
      SET estado = 0, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_hotel = ?
    `;
    
    await executeQuery(deleteQuery, [id]);
  } catch (error: any) {
    console.error('Error eliminando hotel:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Buscar hoteles por nombre o razón social
export const searchHotels = async (searchTerm: string): Promise<Hotel[]> => {
  try {
    const query = `
      SELECT 
        id_hotel,
        razon_social,
        nombre_comercial,
        direccion,
        correo_contacto,
        telefono,
        estado,
        fecha_creacion,
        fecha_actualizacion
      FROM lv_hotel 
      WHERE estado = 1 
        AND (
          razon_social LIKE ? 
          OR nombre_comercial LIKE ?
        )
      ORDER BY nombre_comercial ASC, razon_social ASC
      LIMIT 20
    `;
    
    const searchPattern = `%${searchTerm}%`;
    return await executeQuery<Hotel>(query, [searchPattern, searchPattern]);
  } catch (error) {
    console.error('Error buscando hoteles:', error);
    throw new Error('Error interno del servidor');
  }
};