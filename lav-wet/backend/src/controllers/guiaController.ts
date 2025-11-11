import { Request, Response } from 'express';
import { 
  getAllGuias,
  getGuiaById,
  createGuia,
  updateCantidadesProcesadas,
  changeGuiaEstado,
  getHotelPrendas,
  marcarGuiaComoEntregada
} from '../services/guiaService.js';

// Obtener todas las guías con filtros
export const getGuias = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Filtros
    const filters: any = {};
    
    if (req.query.hotel_id) {
      filters.hotel_id = parseInt(req.query.hotel_id as string);
    }
    
    if (req.query.estado) {
      filters.estado = req.query.estado as string;
    }
    
    if (req.query.numero_guia) {
      filters.numero_guia = parseInt(req.query.numero_guia as string);
    }
    
    if (req.query.fecha_desde) {
      filters.fecha_desde = req.query.fecha_desde as string;
    }
    
    if (req.query.fecha_hasta) {
      filters.fecha_hasta = req.query.fecha_hasta as string;
    }
    
    // Aplicar filtro de hotel para usuarios restringidos
    if (req.hotelFilter) {
      filters.hotel_id = req.hotelFilter;
    }
    
    const { guias, total } = await getAllGuias(page, limit, filters);
    
    res.json({
      success: true,
      data: {
        guias,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo guías:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener guía por ID
export const getGuia = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de guía inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    const guia = await getGuiaById(id);
    
    if (!guia) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Guía no encontrada',
          code: 'GUIA_NOT_FOUND'
        }
      });
      return;
    }
    
    // Verificar acceso por hotel para usuarios restringidos
    if (req.hotelFilter && guia.hotel_id !== req.hotelFilter) {
      res.status(403).json({
        success: false,
        error: {
          message: 'No tienes acceso a esta guía',
          code: 'ACCESS_DENIED'
        }
      });
      return;
    }
    
    res.json({
      success: true,
      data: guia
    });
  } catch (error: any) {
    console.error('Error obteniendo guía:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Crear nueva guía
export const createNewGuia = async (req: Request, res: Response): Promise<void> => {
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
    
    // Verificar que el usuario puede crear guías para este hotel
    if (req.user.hotelId && req.body.hotel_id !== req.user.hotelId) {
      res.status(403).json({
        success: false,
        error: {
          message: 'No puedes crear guías para este hotel',
          code: 'HOTEL_ACCESS_DENIED'
        }
      });
      return;
    }
    
    const guia = await createGuia(req.body, req.user.userId);
    
    res.status(201).json({
      success: true,
      data: guia
    });
  } catch (error: any) {
    console.error('Error creando guía:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('no existe') || error.message.includes('no están configuradas')) {
      statusCode = 400;
      errorCode = 'INVALID_DATA';
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

// Actualizar cantidades procesadas
export const updateCantidades = async (req: Request, res: Response): Promise<void> => {
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
    
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de guía inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    const updateData = {
      id_guia: id,
      prendas: req.body.prendas,
      observaciones: req.body.observaciones,
      estado: req.body.estado,
      estado_id: req.body.estado_id
    };
    
    const guia = await updateCantidadesProcesadas(updateData, req.user.userId);
    
    res.json({
      success: true,
      data: guia
    });
  } catch (error: any) {
    console.error('Error actualizando cantidades:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('no encontrada')) {
      statusCode = 404;
      errorCode = 'GUIA_NOT_FOUND';
    } else if (error.message.includes('No se pueden actualizar')) {
      statusCode = 409;
      errorCode = 'INVALID_STATE';
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

// Cambiar estado de guía
export const updateEstado = async (req: Request, res: Response): Promise<void> => {
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
    
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de guía inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }
    
    const { estado, observaciones } = req.body;
    
    if (!estado) {
      res.status(400).json({
        success: false,
        error: {
          message: 'El estado es requerido',
          code: 'MISSING_STATE'
        }
      });
      return;
    }
    
    const guia = await changeGuiaEstado(id, estado, req.user.userId, observaciones);
    
    res.json({
      success: true,
      data: guia
    });
  } catch (error: any) {
    console.error('Error cambiando estado:', error);
    
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (error.message.includes('no encontrada')) {
      statusCode = 404;
      errorCode = 'GUIA_NOT_FOUND';
    } else if (error.message.includes('No se puede cambiar')) {
      statusCode = 409;
      errorCode = 'INVALID_TRANSITION';
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

// Obtener prendas disponibles para un hotel
export const getHotelPrendasDisponibles = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    
    if (isNaN(hotelId)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de hotel inválido',
          code: 'INVALID_HOTEL_ID'
        }
      });
      return;
    }
    
    // Verificar acceso por hotel para usuarios restringidos
    if (req.hotelFilter && hotelId !== req.hotelFilter) {
      res.status(403).json({
        success: false,
        error: {
          message: 'No tienes acceso a las prendas de este hotel',
          code: 'HOTEL_ACCESS_DENIED'
        }
      });
      return;
    }
    
    const prendas = await getHotelPrendas(hotelId);
    
    res.json({
      success: true,
      data: prendas
    });
  } catch (error: any) {
    console.error('Error obteniendo prendas del hotel:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener siguiente número de guía para un hotel
export const getNextGuiaNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    
    if (isNaN(hotelId)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de hotel inválido',
          code: 'INVALID_HOTEL_ID'
        }
      });
      return;
    }
    
    // Importar la función del servicio
    const { getNextNumeroGuia } = await import('../services/guiaService.js');
    const nextNumber = await getNextNumeroGuia(hotelId);
    
    res.json({
      success: true,
      data: {
        nextNumber
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo siguiente número de guía:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener guías para operadores (solo Registrado y Pendiente)
export const getGuiasParaProcesar = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Filtros específicos para operadores
    const filters: any = {
      estado: req.query.estado || undefined,
      numero_guia: req.query.numero_guia ? parseInt(req.query.numero_guia as string) : undefined,
      hotel_id: req.query.hotel_id ? parseInt(req.query.hotel_id as string) : undefined
    };
    
    // Si no se especifica estado, mostrar Registrado, Pendiente, Procesándose y Entregado Parcial
    if (!filters.estado) {
      // Para operadores, necesitamos hacer cuatro consultas separadas
      const filtrosRegistrado = { ...filters, estado: 'Registrado' };
      const filtrosPendiente = { ...filters, estado: 'Pendiente' };
      const filtrosProcesandose = { ...filters, estado: 'Procesándose' };
      const filtrosEntregadoParcial = { ...filters, estado: 'Entregado Parcial' };
      
      const [registradas, pendientes, procesandose, entregadosParciales] = await Promise.all([
        getAllGuias(1, 50, filtrosRegistrado),
        getAllGuias(1, 50, filtrosPendiente),
        getAllGuias(1, 50, filtrosProcesandose),
        getAllGuias(1, 50, filtrosEntregadoParcial)
      ]);
      
      const todasGuias = [...registradas.guias, ...pendientes.guias, ...procesandose.guias, ...entregadosParciales.guias];
      const total = todasGuias.length;
      
      // Aplicar paginación manual
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const guiasPaginadas = todasGuias.slice(startIndex, endIndex);
      
      res.json({
        success: true,
        data: {
          guias: guiasPaginadas,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
      return;
    }
    
    // Si se especifica un estado, usar la consulta normal
    const { guias, total } = await getAllGuias(page, limit, filters);
    
    res.json({
      success: true,
      data: {
        guias,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo guías para procesar:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener guías para tracking (encargados de hotel)
export const getGuiasTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Para encargados, solo mostrar guías de su hotel
    const filters: any = {};
    
    if (req.hotelFilter) {
      filters.hotel_id = req.hotelFilter;
    }
    
    // Permitir filtros adicionales
    if (req.query.estado) {
      filters.estado = req.query.estado as string;
    }
    
    if (req.query.numero_guia) {
      filters.numero_guia = parseInt(req.query.numero_guia as string);
    }
    
    const { guias, total } = await getAllGuias(page, limit, filters);
    
    res.json({
      success: true,
      data: {
        guias,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo guías para tracking:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// Obtener guias para entregar (solo Lista para Entregar y Pendiente)
export const getGuiasParaEntregar = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Filtros específicos para choferes
    const filters: any = {
      numero_guia: req.query.numero_guia ? parseInt(req.query.numero_guia as string) : undefined,
      hotel_id: req.query.hotel_id ? parseInt(req.query.hotel_id as string) : undefined
    };
    
    // Obtener guías en estado Lista para Entregar y Pendiente
    // Entregado Parcial NO aparece aquí (debe volver a procesamiento)
    const filtrosListaParaEntregar = { ...filters, estado: 'Lista para Entregar' };
    const filtrosPendiente = { ...filters, estado: 'Pendiente' };
    
    const [listasParaEntregar, pendientes] = await Promise.all([
      getAllGuias(1, 50, filtrosListaParaEntregar),
      getAllGuias(1, 50, filtrosPendiente)
    ]);
    
    const todasGuias = [...listasParaEntregar.guias, ...pendientes.guias];
    const total = todasGuias.length;
    
    // Aplicar paginación manual
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const guiasPaginadas = todasGuias.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        guias: guiasPaginadas,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo guías para entregar:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};


// Marcar guía como entregada
export const marcarComoEntregada = async (req: Request, res: Response): Promise<void> => {
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

    const id = parseInt(req.params.id);
    const { recepcionista_entrega_id, entregado, observaciones } = req.body;

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'ID de guía inválido',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    if (!recepcionista_entrega_id) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Debe seleccionar una recepcionista',
          code: 'MISSING_RECEPCIONISTA'
        }
      });
      return;
    }

    // El chofer es el usuario logueado
    const choferEntregaId = req.user.userId;

    const guia = await marcarGuiaComoEntregada(
      id,
      choferEntregaId,
      recepcionista_entrega_id,
      entregado,
      observaciones
    );

    res.json({
      success: true,
      data: guia
    });
  } catch (error: any) {
    console.error('Error marcando guía como entregada:', error);

    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';

    if (error.message.includes('no encontrada')) {
      statusCode = 404;
      errorCode = 'GUIA_NOT_FOUND';
    } else if (error.message.includes('no está en estado válido')) {
      statusCode = 400;
      errorCode = 'INVALID_STATE';
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
