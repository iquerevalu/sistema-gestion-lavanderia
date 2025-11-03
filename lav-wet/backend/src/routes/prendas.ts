import { Router } from 'express';
import { 
  getPrendas, 
  getPrenda, 
  createNewPrenda, 
  updateExistingPrenda, 
  removePrenda,
  getCategorias 
} from '../controllers/prendaController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/authorization.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/prendas/categorias - Obtener categorías disponibles
router.get('/categorias', getCategorias);

// GET /api/prendas - Obtener todas las prendas (con filtros y búsqueda)
router.get('/', getPrendas);

// GET /api/prendas/:id - Obtener prenda por ID
router.get('/:id', getPrenda);

// POST /api/prendas - Crear nueva prenda (solo administradores)
router.post('/', requireAdmin, createNewPrenda);

// PUT /api/prendas/:id - Actualizar prenda (solo administradores)
router.put('/:id', requireAdmin, updateExistingPrenda);

// DELETE /api/prendas/:id - Eliminar prenda (solo administradores)
router.delete('/:id', requireAdmin, removePrenda);

export default router;