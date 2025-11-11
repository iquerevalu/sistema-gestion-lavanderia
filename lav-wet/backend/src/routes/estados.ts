import express from 'express';
import { getEstados, getEstadosProcesamiento } from '../controllers/estadoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/estados - Obtener todos los estados
router.get('/', getEstados);

// GET /api/estados/procesamiento - Obtener estados para procesamiento
router.get('/procesamiento', getEstadosProcesamiento);

export default router;
