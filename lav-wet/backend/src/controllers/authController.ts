import { Request, Response } from 'express';
import { authenticateUser, refreshUserToken, getCurrentUser } from '../services/authService.js';
import { ApiResponse } from '../types';

// Login de usuario
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, password } = req.body;

    // Validar campos requeridos
    if (!correo || !password) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Correo y contraseña son requeridos',
          code: 'MISSING_FIELDS'
        }
      });
      return;
    }

    // Autenticar usuario
    const result = await authenticateUser({ correo, password });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    
    res.status(401).json({
      success: false,
      error: {
        message: error.message || 'Error de autenticación',
        code: 'AUTH_ERROR'
      }
    });
  }
};

// Renovar token
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Refresh token requerido',
          code: 'MISSING_REFRESH_TOKEN'
        }
      });
      return;
    }

    const tokens = await refreshUserToken(refreshToken);

    res.json({
      success: true,
      data: tokens
    });
  } catch (error: any) {
    console.error('Error renovando token:', error);
    
    res.status(401).json({
      success: false,
      error: {
        message: error.message || 'Error renovando token',
        code: 'REFRESH_ERROR'
      }
    });
  }
};

// Logout (invalidar token - por ahora solo respuesta exitosa)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // En una implementación completa, aquí se podría agregar el token a una blacklist
    // Por ahora, el logout se maneja en el frontend eliminando el token
    
    res.json({
      success: true,
      data: {
        message: 'Logout exitoso'
      }
    });
  } catch (error: any) {
    console.error('Error en logout:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'LOGOUT_ERROR'
      }
    });
  }
};

// Obtener información del usuario actual
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Usuario no autenticado',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }

    const user = await getCurrentUser(req.user.userId);
    
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
    console.error('Error obteniendo usuario actual:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};