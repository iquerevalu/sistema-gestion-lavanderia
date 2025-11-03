import { Router } from 'express';
import { 
  getUsers, 
  getUser, 
  createNewUser, 
  updateExistingUser, 
  removeUser,
  getUserProfiles 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/authorization.js';
import { validateCreateUser } from '../middleware/validation.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/usuarios/perfiles - Obtener perfiles disponibles
router.get('/perfiles', getUserProfiles);

// GET /api/usuarios - Obtener todos los usuarios (con paginación y búsqueda)
router.get('/', requireAdmin, getUsers);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', requireAdmin, getUser);

// POST /api/usuarios - Crear nuevo usuario (solo administradores)
router.post('/', requireAdmin, validateCreateUser, createNewUser);

// PUT /api/usuarios/:id - Actualizar usuario (solo administradores)
router.put('/:id', requireAdmin, validateCreateUser, updateExistingUser);

// DELETE /api/usuarios/:id - Eliminar usuario (solo administradores)
router.delete('/:id', requireAdmin, removeUser);

export default router;