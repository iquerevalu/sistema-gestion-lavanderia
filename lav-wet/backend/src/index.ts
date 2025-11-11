import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './database/connection.js';
import authRoutes from './routes/auth.js';
import hotelRoutes from './routes/hotels.js';
import userRoutes from './routes/users.js';
import prendaRoutes from './routes/prendas.js';
import guiaRoutes from './routes/guias.js';
import estadoRoutes from './routes/estados.js';

// Cargar variables de entorno
dotenv.config();

// Debug: verificar variables de entorno
console.log('🔍 Variables de entorno:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NO DEFINIDA');
console.log('DB_NAME:', process.env.DB_NAME);

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({ 
      success: true, 
      message: 'API funcionando correctamente',
      database: dbConnected ? 'Conectada' : 'Desconectada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      database: 'Error de conexión',
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de hoteles
app.use('/api/hoteles', hotelRoutes);

// Rutas de usuarios
app.use('/api/usuarios', userRoutes);

// Rutas de prendas
app.use('/api/prendas', prendaRoutes);

// Rutas de guías
app.use('/api/guias', guiaRoutes);

// Rutas de estados
app.use('/api/estados', estadoRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Ruta no encontrada',
      code: 'NOT_FOUND'
    }
  });
});

// Manejo de errores global
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message || 'Error interno del servidor',
      code: error.code || 'INTERNAL_ERROR'
    }
  });
});

// Iniciar servidor solo si no estamos en serverless
if (process.env.NODE_ENV !== 'production' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;