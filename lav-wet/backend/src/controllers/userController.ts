import { Request, Response } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  searchUsers,
  getProfiles,
  getChoferesAvailable
} from '../services/userService.js';

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    
    let result;
    
    if (search) {
      const users = await searchUsers(search);
      result = {
        users,
        total: users.length,
        page: 1,
        totalPages: 1
      };
    } else {
      const { users, total } = await getAllUsers(page, limit);
      result = {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error obteniendo usuarios:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener usuario por ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de usuario inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    const user = await getUserById(id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
      return;
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Error obteniendo usuario:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Crear nuevo usuario
export const createNewUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await createUser(req.body);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Error creando usuario:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('Ya existe')) {
      statusCode = 409;
      errorCode = 'DUPLICATE_USER';
    } else if (error.message.includes('no existe')) {
      statusCode = 400;
      errorCode = 'INVALID_REFERENCE';
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

// Actualizar usuario
export const updateExistingUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de usuario inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    const userData = { ...req.body, id_usuario: id };
    const user = await updateUser(userData);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Error actualizando usuario:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('no encontrado')) {
      statusCode = 404;
      errorCode = 'USER_NOT_FOUND';
    } else if (error.message.includes('Ya existe')) {
      statusCode = 409;
      errorCode = 'DUPLICATE_USER';
    } else if (error.message.includes('no existe')) {
      statusCode = 400;
      errorCode = 'INVALID_REFERENCE';
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

// Eliminar usuario
export const removeUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de usuario inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    // Verificar que no se esté eliminando a sí mismo
    if (req.user && req.user.userId === id) {
      res.status(409).json({
        success: false,
        error: {
          message: 'No puedes eliminar tu propia cuenta',
          code: 'CANNOT_DELETE_SELF'
        }
      });
      return;
    }
    
    await deleteUser(id);
    
    res.json({
      success: true,
      data: {
        message: 'Usuario eliminado exitosamente'
      }
    });
  } catch (error: any) {
    console.error('Error eliminando usuario:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('no encontrado')) {
      statusCode = 404;
      errorCode = 'USER_NOT_FOUND';
    } else if (error.message.includes('último administrador')) {
      statusCode = 409;
      errorCode = 'CANNOT_DELETE_LAST_ADMIN';
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

// Obtener perfiles disponibles
export const getUserProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const profiles = await getProfiles();
    
    res.json({
      success: true,
      data: profiles
    });
  } catch (error: any) {
    console.error('Error obteniendo perfiles:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener choferes disponibles
export const getChoferes = async (req: Request, res: Response): Promise<void> => {
  try {
    const choferes = await getChoferesAvailable();
    
    res.json({
      success: true,
      data: choferes
    });
  } catch (error: any) {
    console.error('Error obteniendo choferes:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};