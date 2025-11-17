import { Request, Response } from 'express';
import { executeQuery } from '../database/connection.js';

// Obtener todos los estados disponibles
export const getEstados = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT 
        id_estado,
        nombre_estado
      FROM lv_estado_guia
      WHERE estado = 1
      ORDER BY id_estado ASC
    `;
    
    const estados = await executeQuery(query);
    
    res.json({
      success: true,
      data: estados
    });
  } catch (error: any) {
    console.error('Error obteniendo estados:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener estados permitidos para procesamiento
export const getEstadosProcesamiento = async (req: Request, res: Response): Promise<void> => {
  try {
    // Usar IDs en lugar de nombres para evitar problemas de mayúsculas/minúsculas
    // 2 = PENDIENTE, 3 = EN PROCESO, 4 = LISTO PARA ENTREGA
    const query = `
      SELECT 
        id_estado,
        nombre_estado
      FROM lv_estado_guia
      WHERE id_estado IN (2, 3, 4)
        AND estado = 1
      ORDER BY id_estado ASC
    `;
    
    const estados = await executeQuery(query);
    
    res.json({
      success: true,
      data: estados
    });
  } catch (error: any) {
    console.error('Error obteniendo estados de procesamiento:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};
