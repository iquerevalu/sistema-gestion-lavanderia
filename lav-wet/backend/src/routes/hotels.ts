import { Router } from 'express';
import { 
  getHotels, 
  getHotel, 
  createNewHotel, 
  updateExistingHotel, 
  removeHotel 
} from '../controllers/hotelController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/authorization.js';
import { validateCreateHotel } from '../middleware/validation.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/hoteles - Obtener todos los hoteles (con paginación y búsqueda)
router.get('/', getHotels);

// GET /api/hoteles/:id - Obtener hotel por ID
router.get('/:id', getHotel);

// POST /api/hoteles - Crear nuevo hotel (solo administradores)
router.post('/', requireAdmin, validateCreateHotel, createNewHotel);

// PUT /api/hoteles/:id - Actualizar hotel (solo administradores)
router.put('/:id', requireAdmin, validateCreateHotel, updateExistingHotel);

// DELETE /api/hoteles/:id - Eliminar hotel (solo administradores)
router.delete('/:id', requireAdmin, removeHotel);

export default router;