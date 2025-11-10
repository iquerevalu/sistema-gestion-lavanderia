import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Configuración básica
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Rutas básicas para empezar
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Gestión de Guías de Lavandería API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba para prendas (datos simulados)
app.get('/api/prendas', (req, res) => {
  const prendas = [
    {
      id_prenda: 1,
      nombre_prenda: 'Sábana Individual',
      descripcion: 'Sábana de algodón para cama individual',
      categoria_id: 1,
      estado: 1,
      fecha_creacion: '2024-01-15T10:00:00Z',
      fecha_actualizacion: '2024-01-15T10:00:00Z',
      nombre_categoria: 'Ropa de Cama'
    },
    {
      id_prenda: 2,
      nombre_prenda: 'Toalla de Baño',
      descripcion: 'Toalla de algodón absorbente',
      categoria_id: 2,
      estado: 1,
      fecha_creacion: '2024-01-15T11:00:00Z',
      fecha_actualizacion: '2024-01-15T11:00:00Z',
      nombre_categoria: 'Toallas'
    }
  ];

  res.json({
    success: true,
    data: {
      prendas: prendas,
      total: prendas.length,
      page: 1,
      totalPages: 1
    }
  });
});

// Ruta de autenticación simulada
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Credenciales de prueba
  if (email === 'admin@lavanderia.com' && password === '123456') {
    res.json({
      success: true,
      data: {
        token: 'fake-jwt-token-for-demo',
        user: {
          id_usuario: 1,
          nombre_completo: 'Administrador',
          correo: 'admin@lavanderia.com',
          perfil_id: 1,
          nombre_perfil: 'Administrador'
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: {
        message: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      }
    });
  }
});

export default app;