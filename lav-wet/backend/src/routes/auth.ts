import { Router } from 'express';
import { login, refresh, logout, me } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateLogin, validateRefreshToken } from '../middleware/validation.js';

const router = Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', validateLogin, login);

// POST /api/auth/refresh - Renovar token
router.post('/refresh', validateRefreshToken, refresh);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', logout);

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authenticateToken, me);

// POST /api/auth/reset-admin - Resetear contraseña admin (temporal)
router.post('/reset-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const { executeQuery } = await import('../database/connection.js');
    await executeQuery(
      'UPDATE lv_usuario SET password = ? WHERE correo = ?',
      [hashedPassword, 'admin@lavanderia.com']
    );
    
    res.json({ success: true, message: 'Contraseña actualizada a admin123' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Error interno' });
  }
});

export default router;