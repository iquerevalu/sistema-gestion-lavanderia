import { executeQuery } from '../database/connection.js';
import { Prenda, Categoria } from '../types';

export interface CreatePrendaRequest {
  categoria_id: number;
  nombre_prenda: string;
  descripcion?: string;
}

export interface UpdatePrendaRequest extends Partial<CreatePrendaRequest> {
  id_prenda: number;
}

// Obtener todas las prendas con información de categoría
export const getAllPrendas = async (): Promise<Prenda[]> => {
  try {
    const query = `
      SELECT 
        p.id_prenda,
        p.categoria_id,
        p.nombre_prenda,
        p.descripcion,
        c.nombre_categoria
      FROM lv_prenda p
      INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
      ORDER BY c.nombre_categoria ASC, p.nombre_prenda ASC
    `;
    
    return await executeQuery<Prenda>(query);
  } catch (error) {
    console.error('Error obteniendo prendas:', error);
    throw new Error('Error interno del servidor');
  }
};

// Obtener prendas por categoría
export const getPrendasByCategoria = async (categoriaId: number): Promise<Prenda[]> => {
  try {
    const query = `
      SELECT 
        p.id_prenda,
        p.categoria_id,
        p.nombre_prenda,
        p.descripcion,
        c.nombre_categoria
      FROM lv_prenda p
      INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
      WHERE p.categoria_id = ?
      ORDER BY p.nombre_prenda ASC
    `;
    
    return await executeQuery<Prenda>(query, [categoriaId]);
  } catch (error) {
    console.error('Error obteniendo prendas por categoría:', error);
    throw new Error('Error interno del servidor');
  }
};

// Obtener prenda por ID
export const getPrendaById = async (id: number): Promise<Prenda | null> => {
  try {
    const query = `
      SELECT 
        p.id_prenda,
        p.categoria_id,
        p.nombre_prenda,
        p.descripcion,
        c.nombre_categoria
      FROM lv_prenda p
      INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
      WHERE p.id_prenda = ?
    `;
    
    const prendas = await executeQuery<Prenda>(query, [id]);
    return prendas.length > 0 ? prendas[0] : null;
  } catch (error) {
    console.error('Error obteniendo prenda:', error);
    throw new Error('Error interno del servidor');
  }
};

// Crear nueva prenda
export const createPrenda = async (prendaData: CreatePrendaRequest): Promise<Prenda> => {
  try {
    // Verificar que la categoría existe
    const categoriaQuery = `
      SELECT id_categoria 
      FROM lv_categoria 
      WHERE id_categoria = ?
    `;
    const categoria = await executeQuery(categoriaQuery, [prendaData.categoria_id]);
    if (categoria.length === 0) {
      throw new Error('La categoría especificada no existe');
    }
    
    // Verificar que no existe una prenda con el mismo nombre en la misma categoría
    const existingQuery = `
      SELECT id_prenda 
      FROM lv_prenda 
      WHERE categoria_id = ? AND nombre_prenda = ?
    `;
    const existing = await executeQuery(existingQuery, [prendaData.categoria_id, prendaData.nombre_prenda]);
    if (existing.length > 0) {
      throw new Error('Ya existe una prenda con ese nombre en la categoría seleccionada');
    }
    
    const insertQuery = `
      INSERT INTO lv_prenda (
        categoria_id,
        nombre_prenda,
        descripcion
      ) VALUES (?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      prendaData.categoria_id,
      prendaData.nombre_prenda,
      prendaData.descripcion || null
    ]);
    
    const insertResult = result as any;
    const prendaId = insertResult.insertId;
    
    // Obtener la prenda creada
    const createdPrenda = await getPrendaById(prendaId);
    if (!createdPrenda) {
      throw new Error('Error al crear la prenda');
    }
    
    return createdPrenda;
  } catch (error: any) {
    console.error('Error creando prenda:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Actualizar prenda
export const updatePrenda = async (prendaData: UpdatePrendaRequest): Promise<Prenda> => {
  try {
    // Verificar que la prenda existe
    const existingPrenda = await getPrendaById(prendaData.id_prenda);
    if (!existingPrenda) {
      throw new Error('Prenda no encontrada');
    }
    
    // Verificar categoría (si se está actualizando)
    if (prendaData.categoria_id) {
      const categoriaQuery = `
        SELECT id_categoria 
        FROM lv_categoria 
        WHERE id_categoria = ?
      `;
      const categoria = await executeQuery(categoriaQuery, [prendaData.categoria_id]);
      if (categoria.length === 0) {
        throw new Error('La categoría especificada no existe');
      }
    }
    
    // Verificar nombre único en categoría (si se está actualizando)
    if (prendaData.nombre_prenda || prendaData.categoria_id) {
      const nombrePrenda = prendaData.nombre_prenda || existingPrenda.nombre_prenda;
      const categoriaId = prendaData.categoria_id || existingPrenda.categoria_id;
      
      const duplicateQuery = `
        SELECT id_prenda 
        FROM lv_prenda 
        WHERE categoria_id = ? AND nombre_prenda = ? AND id_prenda != ?
      `;
      const duplicate = await executeQuery(duplicateQuery, [categoriaId, nombrePrenda, prendaData.id_prenda]);
      if (duplicate.length > 0) {
        throw new Error('Ya existe una prenda con ese nombre en la categoría seleccionada');
      }
    }
    
    const updateQuery = `
      UPDATE lv_prenda 
      SET 
        categoria_id = COALESCE(?, categoria_id),
        nombre_prenda = COALESCE(?, nombre_prenda),
        descripcion = COALESCE(?, descripcion)
      WHERE id_prenda = ?
    `;
    
    await executeQuery(updateQuery, [
      prendaData.categoria_id || null,
      prendaData.nombre_prenda || null,
      prendaData.descripcion || null,
      prendaData.id_prenda
    ]);
    
    // Obtener la prenda actualizada
    const updatedPrenda = await getPrendaById(prendaData.id_prenda);
    if (!updatedPrenda) {
      throw new Error('Error al actualizar la prenda');
    }
    
    return updatedPrenda;
  } catch (error: any) {
    console.error('Error actualizando prenda:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Eliminar prenda
export const deletePrenda = async (id: number): Promise<void> => {
  try {
    // Verificar que la prenda existe
    const existingPrenda = await getPrendaById(id);
    if (!existingPrenda) {
      throw new Error('Prenda no encontrada');
    }
    
    // Verificar que no esté siendo usada en hotel_prenda
    const hotelPrendaQuery = `
      SELECT COUNT(*) as count 
      FROM lv_hotel_prenda 
      WHERE prenda_id = ? AND estado = 1
    `;
    const hotelPrendaResult = await executeQuery<{ count: number }>(hotelPrendaQuery, [id]);
    if (hotelPrendaResult[0]?.count > 0) {
      throw new Error('No se puede eliminar la prenda porque está siendo usada en configuraciones de hoteles');
    }
    
    // Verificar que no esté siendo usada en guías
    const guiaDetalleQuery = `
      SELECT COUNT(*) as count 
      FROM lv_detalle_guia dg
      INNER JOIN lv_hotel_prenda hp ON dg.hotel_prenda_id = hp.id_hotel_prenda
      WHERE hp.prenda_id = ?
    `;
    const guiaDetalleResult = await executeQuery<{ count: number }>(guiaDetalleQuery, [id]);
    if (guiaDetalleResult[0]?.count > 0) {
      throw new Error('No se puede eliminar la prenda porque está siendo usada en guías registradas');
    }
    
    // Eliminar prenda
    const deleteQuery = `
      DELETE FROM lv_prenda 
      WHERE id_prenda = ?
    `;
    
    await executeQuery(deleteQuery, [id]);
  } catch (error: any) {
    console.error('Error eliminando prenda:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Obtener todas las categorías
export const getAllCategorias = async (): Promise<Categoria[]> => {
  try {
    const query = `
      SELECT 
        id_categoria,
        nombre_categoria,
        descripcion
      FROM lv_categoria
      ORDER BY nombre_categoria ASC
    `;
    
    return await executeQuery<Categoria>(query);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    throw new Error('Error interno del servidor');
  }
};

// Buscar prendas por nombre
export const searchPrendas = async (searchTerm: string): Promise<Prenda[]> => {
  try {
    const query = `
      SELECT 
        p.id_prenda,
        p.categoria_id,
        p.nombre_prenda,
        p.descripcion,
        c.nombre_categoria
      FROM lv_prenda p
      INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
      WHERE p.nombre_prenda LIKE ? OR p.descripcion LIKE ?
      ORDER BY c.nombre_categoria ASC, p.nombre_prenda ASC
      LIMIT 20
    `;
    
    const searchPattern = `%${searchTerm}%`;
    return await executeQuery<Prenda>(query, [searchPattern, searchPattern]);
  } catch (error) {
    console.error('Error buscando prendas:', error);
    throw new Error('Error interno del servidor');
  }
};