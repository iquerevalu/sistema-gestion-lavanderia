import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Esquema de validación para login
export const loginSchema = Joi.object({
  correo: Joi.string().email().required().messages({
    'string.email': 'Debe ser un correo electrónico válido',
    'any.required': 'El correo es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida'
  })
});

// Esquema de validación para refresh token
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'El refresh token es requerido'
  })
});

// Esquema de validación para crear usuario
export const createUserSchema = Joi.object({
  nombre_completo: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre completo es requerido'
  }),
  correo: Joi.string().email().required().messages({
    'string.email': 'Debe ser un correo electrónico válido',
    'any.required': 'El correo es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida'
  }),
  telefono: Joi.string().optional().allow(''),
  perfil_id: Joi.number().integer().positive().required().messages({
    'number.base': 'El perfil debe ser un número',
    'number.positive': 'El perfil debe ser un número positivo',
    'any.required': 'El perfil es requerido'
  }),
  hotel_id: Joi.number().integer().positive().optional().allow(null)
});

// Esquema de validación para actualizar usuario
export const updateUserSchema = Joi.object({
  nombre_completo: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre completo es requerido'
  }),
  correo: Joi.string().email().required().messages({
    'string.email': 'Debe ser un correo electrónico válido',
    'any.required': 'El correo es requerido'
  }),
  password: Joi.string().min(6).optional().allow('').messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres'
  }),
  telefono: Joi.string().optional().allow(''),
  perfil_id: Joi.number().integer().positive().required().messages({
    'number.base': 'El perfil debe ser un número',
    'number.positive': 'El perfil debe ser un número positivo',
    'any.required': 'El perfil es requerido'
  }),
  hotel_id: Joi.number().integer().positive().optional().allow(null)
});

// Esquema de validación para crear hotel
export const createHotelSchema = Joi.object({
  ruc: Joi.string().length(11).optional().allow('').messages({
    'string.length': 'El RUC debe tener exactamente 11 dígitos'
  }),
  razon_social: Joi.string().min(2).max(100).required().messages({
    'string.min': 'La razón social debe tener al menos 2 caracteres',
    'string.max': 'La razón social no puede exceder 100 caracteres',
    'any.required': 'La razón social es requerida'
  }),
  nombre_comercial: Joi.string().max(100).optional().allow(''),
  direccion: Joi.string().max(200).optional().allow(''),
  correo_contacto: Joi.string().email().optional().allow('').messages({
    'string.email': 'Debe ser un correo electrónico válido'
  }),
  telefono: Joi.string().max(20).optional().allow(''),
  estado: Joi.number().integer().valid(0, 1).optional().messages({
    'number.base': 'El estado debe ser un número',
    'any.only': 'El estado debe ser 0 (inactivo) o 1 (activo)'
  })
});

// Middleware genérico de validación
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Mostrar todos los errores
      stripUnknown: true // Remover campos no definidos en el schema
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        success: false,
        error: {
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          details: errorMessages
        }
      });
      return;
    }

    // Reemplazar req.body con los datos validados y limpiados
    req.body = value;
    next();
  };
};

// Middleware específicos para cada endpoint
export const validateLogin = validate(loginSchema);
export const validateRefreshToken = validate(refreshTokenSchema);
export const validateCreateUser = validate(createUserSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateCreateHotel = validate(createHotelSchema);