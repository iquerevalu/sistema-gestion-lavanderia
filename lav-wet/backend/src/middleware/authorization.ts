import { Request, Response, NextFunction } from 'express';

// Tipos de perfiles disponibles
export enum Perfiles {
  ADMINISTRADOR = 'Administrador',
  RECEPCIONISTA = 'Recepcionista Hotel',
  CHOFER = 'Chofer',
  OPERARIO = 'Operario Lavandería',
  ENCARGADO = 'Encargado Hotel'
}

// Middleware para verificar roles específicos
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

      const userRole = req.user.perfil;
      
      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          success: false,
          error: {
            message: 'No tienes permisos para acceder a este recurso',
            code: 'INSUFFICIENT_PERMISSIONS'
          }
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Error interno del servidor',
          code: 'INTERNAL_ERROR'
        }
      });
    }
  };
};

// Middleware para verificar que el usuario pertenece al hotel especificado
export const requireHotelAccess = (req: Request, res: Response, next: NextFunction): void => {
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

    // Los administradores tienen acceso a todos los hoteles
    if (req.user.perfil === Perfiles.ADMINISTRADOR) {
      next();
      return;
    }

    // Verificar si el usuario tiene hotel asignado
    if (!req.user.hotelId) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Usuario no tiene hotel asignado',
          code: 'NO_HOTEL_ASSIGNED'
        }
      });
      return;
    }

    // Obtener hotel_id del parámetro o body de la request
    const hotelId = req.params.hotelId || req.body.hotel_id || req.query.hotel_id;
    
    if (hotelId && parseInt(hotelId) !== req.user.hotelId) {
      res.status(403).json({
        success: false,
        error: {
          message: 'No tienes acceso a este hotel',
          code: 'HOTEL_ACCESS_DENIED'
        }
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Middleware para verificar que el usuario puede acceder solo a sus propias guías
export const requireOwnHotelGuias = (req: Request, res: Response, next: NextFunction): void => {
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

    // Los administradores y operarios pueden ver todas las guías
    if (req.user.perfil === Perfiles.ADMINISTRADOR || req.user.perfil === Perfiles.OPERARIO) {
      next();
      return;
    }

    // Los usuarios de hotel solo pueden ver guías de su hotel
    if (!req.user.hotelId) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Usuario no tiene hotel asignado',
          code: 'NO_HOTEL_ASSIGNED'
        }
      });
      return;
    }

    // Agregar filtro de hotel a la request para que los controladores lo usen
    req.hotelFilter = req.user.hotelId;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Middleware específicos por funcionalidad

// Solo administradores pueden gestionar usuarios y hoteles
export const requireAdmin = requireRole([Perfiles.ADMINISTRADOR]);

// Solo recepcionistas y administradores pueden crear guías
export const requireRecepcionista = requireRole([Perfiles.RECEPCIONISTA, Perfiles.ADMINISTRADOR]);

// Solo operarios y administradores pueden procesar cantidades
export const requireOperario = requireRole([Perfiles.OPERARIO, Perfiles.ADMINISTRADOR]);

// Solo encargados pueden ver tracking (además de admin)
export const requireEncargadoOrAdmin = requireRole([Perfiles.ENCARGADO, Perfiles.ADMINISTRADOR]);

// Operarios y administradores pueden cambiar estados
export const requireOperarioOrAdmin = requireRole([Perfiles.OPERARIO, Perfiles.ADMINISTRADOR]);

// Solo choferes y administradores pueden entregar guías
export const requireChoferOrAdmin = requireRole([Perfiles.CHOFER, Perfiles.ADMINISTRADOR]);

// Extender la interfaz Request para incluir hotelFilter
declare global {
  namespace Express {
    interface Request {
      hotelFilter?: number;
    }
  }
}