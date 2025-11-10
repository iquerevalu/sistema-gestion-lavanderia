import express from 'express';
import cors from 'cors';

const app = express();

// Configuración básica
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Gestión de Guías de Lavandería API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de autenticación simulada
app.post('/api/auth/login', (req, res) => {
  const { email, correo, password } = req.body;
  const userEmail = email || correo; // Aceptar ambos formatos
  
  if (userEmail === 'admin@lavanderia.com' && password === '123456') {
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

// Ruta de hoteles simulada
app.get('/api/hoteles', (req, res) => {
  const hoteles = [
    {
      id_hotel: 1,
      ruc: '20123456789',
      nombre_comercial: 'Hotel Plaza Mayor',
      razon_social: 'Hotel Plaza Mayor S.A.C.',
      telefono: '01-234-5678',
      correo: 'info@hotelplazamayor.com',
      direccion: 'Av. Principal 123, Lima',
      estado: 1,
      fecha_creacion: '2024-01-01T10:00:00Z',
      fecha_actualizacion: '2024-01-01T10:00:00Z'
    },
    {
      id_hotel: 2,
      ruc: '20987654321',
      nombre_comercial: 'Hotel Costa Verde',
      razon_social: 'Inversiones Costa Verde S.R.L.',
      telefono: '01-987-6543',
      correo: 'contacto@hotelcostaverde.com',
      direccion: 'Malecón Costa Verde 456, Miraflores',
      estado: 1,
      fecha_creacion: '2024-01-02T10:00:00Z',
      fecha_actualizacion: '2024-01-02T10:00:00Z'
    }
  ];

  res.json({
    success: true,
    data: hoteles
  });
});

// Ruta de usuarios simulada
app.get('/api/usuarios', (req, res) => {
  const usuarios = [
    {
      id_usuario: 1,
      nombre_completo: 'Juan Carlos Admin',
      correo: 'admin@lavanderia.com',
      telefono: '999-888-777',
      perfil_id: 1,
      hotel_id: null,
      estado: 1,
      fecha_creacion: '2024-01-01T10:00:00Z',
      fecha_actualizacion: '2024-01-01T10:00:00Z',
      nombre_perfil: 'Administrador'
    },
    {
      id_usuario: 2,
      nombre_completo: 'María García Operador',
      correo: 'maria@hotelplaza.com',
      telefono: '999-777-666',
      perfil_id: 2,
      hotel_id: 1,
      estado: 1,
      fecha_creacion: '2024-01-02T10:00:00Z',
      fecha_actualizacion: '2024-01-02T10:00:00Z',
      nombre_perfil: 'Operador'
    }
  ];

  res.json({
    success: true,
    data: usuarios
  });
});

// Ruta de prendas simulada
app.get('/api/prendas', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
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
      nombre_prenda: 'Sábana Matrimonial',
      descripcion: 'Sábana de algodón para cama matrimonial',
      categoria_id: 1,
      estado: 1,
      fecha_creacion: '2024-01-15T10:05:00Z',
      fecha_actualizacion: '2024-01-15T10:05:00Z',
      nombre_categoria: 'Ropa de Cama'
    },
    {
      id_prenda: 3,
      nombre_prenda: 'Toalla de Baño',
      descripcion: 'Toalla de algodón absorbente para baño',
      categoria_id: 2,
      estado: 1,
      fecha_creacion: '2024-01-15T11:25:00Z',
      fecha_actualizacion: '2024-01-15T11:25:00Z',
      nombre_categoria: 'Toallas'
    }
  ];

  const totalItems = prendas.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const prendasPaginadas = prendas.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      prendas: prendasPaginadas,
      total: totalItems,
      page: page,
      totalPages: totalPages
    }
  });
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Error interno del servidor',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint no encontrado',
      code: 'NOT_FOUND'
    }
  });
});

export default app;