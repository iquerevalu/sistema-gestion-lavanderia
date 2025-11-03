import { Request, Response } from 'express';
import { 
  getAllPrendas, 
  getPrendasByCategoria,
  getPrendaById, 
  createPrenda, 
  updatePrenda, 
  deletePrenda, 
  getAllCategorias,
  searchPrendas 
} from '../services/prendaService.js';

// Obtener todas las prendas
export const getPrendas = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;
    const categoriaId = req.query.categoria_id ? parseInt(req.query.categoria_id as string) : null;
    
    let prendas;
    
    if (search) {
      prendas = await searchPrendas(search);
    } else if (categoriaId) {
      prendas = await getPrendasByCategoria(categoriaId);
    } else {
      prendas = await getAllPrendas();
    }
    
    res.json({
      success: true,
      data: prendas
    });
  } catch (error: any) {
    console.error('Error obteniendo prendas:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener prenda por ID
export const getPrenda = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de prenda inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    const prenda = await getPrendaById(id);
    
    if (!prenda) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Prenda no encontrada',
          code: 'PRENDA_NOT_FOUND'
        }
      });
      return;
    }
    
    res.json({
      success: true,
      data: prenda
    });
  } catch (error: any) {
    console.error('Error obteniendo prenda:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Crear nueva prenda
export const createNewPrenda = async (req: Request, res: Response): Promise<void> => {
  try {
    const prenda = await createPrenda(req.body);
    
    res.status(201).json({
      success: true,
      data: prenda
    });
  } catch (error: any) {
    console.error('Error creando prenda:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('Ya existe')) {
      statusCode = 409;
      errorCode = 'DUPLICATE_PRENDA';
    } else if (error.message.includes('no existe')) {
      statusCode = 400;
      errorCode = 'INVALID_CATEGORY';
    }
    
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: errorCode
      }
    });
  }
};

// Actualizar prenda
export const updateExistingPrenda = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de prenda inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    const prendaData = { ...req.body, id_prenda: id };
    const prenda = await updatePrenda(prendaData);
    
    res.json({
      success: true,
      data: prenda
    });
  } catch (error: any) {
    console.error('Error actualizando prenda:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('no encontrada')) {
      statusCode = 404;
      errorCode = 'PRENDA_NOT_FOUND';
    } else if (error.message.includes('Ya existe')) {
      statusCode = 409;
      errorCode = 'DUPLICATE_PRENDA';
    } else if (error.message.includes('no existe')) {
      statusCode = 400;
      errorCode = 'INVALID_CATEGORY';
    }
    
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: errorCode
      }
    });
  }
};

// Eliminar prenda
export const removePrenda = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de prenda inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    await deletePrenda(id);
    
    res.json({
      success: true,
      data: {
        message: 'Prenda eliminada exitosamente'
      }
    });
  } catch (error: any) {
    console.error('Error eliminando prenda:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('no encontrada')) {
      statusCode = 404;
      errorCode = 'PRENDA_NOT_FOUND';
    } else if (error.message.includes('siendo usada')) {
      statusCode = 409;
      errorCode = 'PRENDA_IN_USE';
    }
    
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: errorCode
      }
    });
  }
};

// Obtener categorías
export const getCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await getAllCategorias();
    
    res.json({
      success: true,
      data: categorias
    });
  } catch (error: any) {
    console.error('Error obteniendo categorías:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};