import { Router } from 'express';
import {
    getGuias,
    getGuia,
    createNewGuia,
    updateCantidades,
    updateEstado,
    getHotelPrendasDisponibles,
    getGuiasParaProcesar,
    getGuiasTracking
} from '../controllers/guiaController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
    requireRecepcionista,
    requireOperario,
    requireEncargadoOrAdmin,
    requireOperarioOrAdmin,
    requireOwnHotelGuias
} from '../middleware/authorization.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/guias/procesar - Obtener guías para procesar (solo operarios)
router.get('/procesar', requireOperario, getGuiasParaProcesar);

// GET /api/guias/tracking - Obtener guías para tracking (encargados y admin)
router.get('/tracking', requireEncargadoOrAdmin, requireOwnHotelGuias, getGuiasTracking);

// GET /api/guias/hotel/:hotelId/prendas - Obtener prendas disponibles para un hotel
router.get('/hotel/:hotelId/prendas', getHotelPrendasDisponibles);

// GET /api/guias - Obtener todas las guías (con filtros)
router.get('/', requireOwnHotelGuias, getGuias);

// GET /api/guias/:id - Obtener guía por ID
router.get('/:id', getGuia);

// POST /api/guias - Crear nueva guía (solo recepcionistas)
router.post('/', requireRecepcionista, createNewGuia);

// PUT /api/guias/:id/cantidades - Actualizar cantidades procesadas (solo operarios)
router.put('/:id/cantidades', requireOperario, updateCantidades);

// PUT /api/guias/:id/estado - Cambiar estado de guía (operarios y admin)
router.put('/:id/estado', requireOperarioOrAdmin, updateEstado);

export default router;