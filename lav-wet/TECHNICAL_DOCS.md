# 📚 Documentación Técnica

## Arquitectura del Sistema

### Patrón de Arquitectura

El sistema sigue una arquitectura **Cliente-Servidor** con separación clara de responsabilidades:

- **Frontend (Cliente)**: SPA React con gestión de estado local
- **Backend (Servidor)**: API REST con Express.js
- **Base de Datos**: MySQL con diseño relacional normalizado

### Principios de Diseño

1. **Separation of Concerns**: Cada capa tiene responsabilidades específicas
2. **DRY (Don't Repeat Yourself)**: Reutilización de componentes y servicios
3. **SOLID Principles**: Especialmente Single Responsibility y Dependency Inversion
4. **RESTful API**: Endpoints semánticamente correctos
5. **Type Safety**: TypeScript en todo el stack

## Base de Datos

### Modelo de Datos

```sql
-- Tabla de Perfiles (Roles)
CREATE TABLE perfiles (
    id_perfil INT PRIMARY KEY AUTO_INCREMENT,
    nombre_perfil VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Hoteles
CREATE TABLE hoteles (
    id_hotel INT PRIMARY KEY AUTO_INCREMENT,
    ruc VARCHAR(11) UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    correo_contacto VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    perfil_id INT NOT NULL,
    hotel_id INT,
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (perfil_id) REFERENCES perfiles(id_perfil),
    FOREIGN KEY (hotel_id) REFERENCES hoteles(id_hotel)
);

-- Tabla de Categorías de Prendas
CREATE TABLE categorias_prendas (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Prendas
CREATE TABLE prendas (
    id_prenda INT PRIMARY KEY AUTO_INCREMENT,
    nombre_prenda VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria_id INT NOT NULL,
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_prendas(id_categoria)
);

-- Tabla de Prendas por Hotel (Precios específicos)
CREATE TABLE hotel_prendas (
    id_hotel_prenda INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    prenda_id INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hoteles(id_hotel),
    FOREIGN KEY (prenda_id) REFERENCES prendas(id_prenda),
    UNIQUE KEY unique_hotel_prenda (hotel_id, prenda_id)
);

-- Tabla de Guías de Lavandería
CREATE TABLE guias_lavanderia (
    id_guia INT PRIMARY KEY AUTO_INCREMENT,
    numero_guia INT NOT NULL,
    hotel_id INT NOT NULL,
    chofer_recojo_id INT NOT NULL,
    chofer_entrega_id INT,
    recepcionista_recojo_id INT NOT NULL,
    recepcionista_entrega_id INT,
    estado ENUM('Registrado', 'Pendiente', 'Procesandose', 'Lista para Entregar', 'En Ruta', 'Entregado') DEFAULT 'Registrado',
    fecha_recoleccion DATE NOT NULL,
    fecha_entrega DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hoteles(id_hotel),
    FOREIGN KEY (chofer_recojo_id) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (chofer_entrega_id) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (recepcionista_recojo_id) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (recepcionista_entrega_id) REFERENCES usuarios(id_usuario),
    UNIQUE KEY unique_numero_guia (numero_guia, hotel_id)
);

-- Tabla de Detalle de Guías
CREATE TABLE detalle_guias (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    guia_id INT NOT NULL,
    hotel_prenda_id INT NOT NULL,
    cantidad_sucia INT NOT NULL,
    cantidad_limpia INT DEFAULT 0,
    es_devuelta BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guia_id) REFERENCES guias_lavanderia(id_guia) ON DELETE CASCADE,
    FOREIGN KEY (hotel_prenda_id) REFERENCES hotel_prendas(id_hotel_prenda)
);

-- Tabla de Historial de Estados
CREATE TABLE historial_estados (
    id_historial INT PRIMARY KEY AUTO_INCREMENT,
    guia_id INT NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    usuario_id INT NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (guia_id) REFERENCES guias_lavanderia(id_guia) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario)
);
```

### Índices Recomendados

```sql
-- Índices para optimización de consultas
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil_id);
CREATE INDEX idx_usuarios_hotel ON usuarios(hotel_id);
CREATE INDEX idx_guias_hotel ON guias_lavanderia(hotel_id);
CREATE INDEX idx_guias_estado ON guias_lavanderia(estado);
CREATE INDEX idx_guias_fecha ON guias_lavanderia(fecha_recoleccion);
CREATE INDEX idx_detalle_guia ON detalle_guias(guia_id);
CREATE INDEX idx_historial_guia ON historial_estados(guia_id);
```

## Autenticación y Autorización

### JWT (JSON Web Tokens)

```typescript
// Estructura del token JWT
interface JWTPayload {
  id_usuario: number;
  correo: string;
  perfil_id: number;
  hotel_id?: number;
  nombre_completo: string;
  iat: number;  // Issued at
  exp: number;  // Expiration
}
```

### Middleware de Autenticación

```typescript
// backend/src/middleware/auth.ts
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};
```

### Control de Acceso por Roles

```typescript
// Middleware de autorización
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.perfil_nombre;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso' 
      });
    }
    
    next();
  };
};

// Uso en rutas
router.get('/admin-only', 
  authenticateToken, 
  requireRole(['Administrador']), 
  adminController
);
```

## Gestión de Estado (Frontend)

### Context API

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar validez del token
      verifyToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = async (correo: string, password: string) => {
    const response = await authService.login(correo, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Custom Hooks

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// hooks/usePagination.ts
export const usePagination = (initialPage = 1, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setTotalPages,
    setTotalItems,
    handlePageChange
  };
};
```

## Servicios API (Frontend)

### Cliente HTTP Base

```typescript
// services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Servicios Específicos

```typescript
// services/guiaService.ts
export const guiaService = {
  async getAllGuias(page: number, limit: number, filters: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await apiClient.get(`/guias?${params}`);
    return response.data;
  },

  async createGuia(guiaData: CreateGuiaRequest) {
    const response = await apiClient.post('/guias', guiaData);
    return response.data;
  },

  async updateGuia(id: number, updateData: any) {
    const response = await apiClient.put(`/guias/${id}`, updateData);
    return response.data;
  },

  async getGuiaById(id: number) {
    const response = await apiClient.get(`/guias/${id}`);
    return response.data;
  }
};
```

## Validación de Datos

### Backend (Express Validator)

```typescript
// middleware/validation.ts
import { body, validationResult } from 'express-validator';

export const validateGuiaCreation = [
  body('hotel_id').isInt({ min: 1 }).withMessage('Hotel ID debe ser un número válido'),
  body('chofer_recojo_id').isInt({ min: 1 }).withMessage('Chofer ID debe ser un número válido'),
  body('fecha_recoleccion').isISO8601().withMessage('Fecha debe ser válida'),
  body('prendas').isArray({ min: 1 }).withMessage('Debe incluir al menos una prenda'),
  body('prendas.*.hotel_prenda_id').isInt({ min: 1 }),
  body('prendas.*.cantidad_sucia').isInt({ min: 1 }),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### Frontend (Validación en Tiempo Real)

```typescript
// hooks/useFormValidation.ts
export const useFormValidation = (initialValues: any, validationRules: any) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fieldName: string, value: any) => {
    const rule = validationRules[fieldName];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} es requerido`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${fieldName} debe tener al menos ${rule.minLength} caracteres`;
    }

    if (rule.email && !/\S+@\S+\.\S+/.test(value)) {
      return 'Email no es válido';
    }

    return '';
  };

  const handleChange = (fieldName: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    if (touched[fieldName]) {
      const error = validate(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validate(fieldName, values[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  return { values, errors, touched, handleChange, handleBlur };
};
```

## Manejo de Errores

### Backend

```typescript
// middleware/errorHandler.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }

  // Error de base de datos
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'El recurso ya existe',
      details: 'Violación de restricción única'
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
};
```

### Frontend

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Datos inválidos';
      case 401:
        return 'No autorizado. Por favor inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 409:
        return 'El recurso ya existe';
      case 500:
        return 'Error interno del servidor';
      default:
        return 'Error desconocido';
    }
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    // Error de configuración
    return 'Error en la configuración de la solicitud';
  }
};
```

## Optimización y Performance

### Lazy Loading de Componentes

```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const GuiasPage = lazy(() => import('./components/guias/GuiasPage'));
const UsuariosPage = lazy(() => import('./components/usuarios/UsuariosPage'));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route path="/guias" element={<GuiasPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoización de Componentes

```typescript
// components/GuiaCard.tsx
import { memo } from 'react';

interface Props {
  guia: GuiaLavanderia;
  onSelect: (guia: GuiaLavanderia) => void;
}

const GuiaCard = memo<Props>(({ guia, onSelect }) => {
  return (
    <div onClick={() => onSelect(guia)}>
      {/* Contenido del componente */}
    </div>
  );
});

export default GuiaCard;
```

### Debouncing para Búsquedas

```typescript
// hooks/useDebounce.ts
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Uso en componente de búsqueda
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Realizar búsqueda
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  );
};
```

## Seguridad

### Sanitización de Datos

```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

export const sanitizeObject = (obj: any): any => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
```

### Rate Limiting

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const createRateLimit = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Demasiadas solicitudes, intenta nuevamente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Aplicar en rutas específicas
app.use('/api/auth/login', createRateLimit(15 * 60 * 1000, 5)); // 5 intentos por 15 minutos
app.use('/api/', createRateLimit(15 * 60 * 1000, 100)); // 100 requests por 15 minutos
```

### Validación de Entrada

```typescript
// middleware/inputValidation.ts
import { body, param, query } from 'express-validator';

export const validateId = param('id').isInt({ min: 1 }).withMessage('ID debe ser un número válido');

export const validateEmail = body('correo')
  .isEmail()
  .normalizeEmail()
  .withMessage('Email no es válido');

export const validatePassword = body('password')
  .isLength({ min: 6 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número');
```

## Testing

### Tests Unitarios (Frontend)

```typescript
// __tests__/components/GuiaCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import GuiaCard from '../components/GuiaCard';

const mockGuia = {
  id_guia: 1,
  numero_guia: 1001,
  estado: 'Registrado',
  nombre_comercial: 'Hotel Test'
};

describe('GuiaCard', () => {
  test('renders guia information correctly', () => {
    render(<GuiaCard guia={mockGuia} onSelect={jest.fn()} />);
    
    expect(screen.getByText('Guía #1001')).toBeInTheDocument();
    expect(screen.getByText('Hotel Test')).toBeInTheDocument();
    expect(screen.getByText('Registrado')).toBeInTheDocument();
  });

  test('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<GuiaCard guia={mockGuia} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockGuia);
  });
});
```

### Tests de Integración (Backend)

```typescript
// __tests__/routes/guias.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Guias API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Obtener token de autenticación
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'test@example.com',
        password: 'password123'
      });
    
    authToken = response.body.token;
  });

  test('GET /api/guias should return paginated guias', async () => {
    const response = await request(app)
      .get('/api/guias?page=1&limit=10')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('guias');
    expect(response.body).toHaveProperty('totalPages');
    expect(response.body).toHaveProperty('total');
  });

  test('POST /api/guias should create new guia', async () => {
    const newGuia = {
      hotel_id: 1,
      chofer_recojo_id: 1,
      fecha_recoleccion: '2024-11-01',
      prendas: [
        {
          hotel_prenda_id: 1,
          cantidad_sucia: 10,
          es_devuelta: false
        }
      ]
    };

    const response = await request(app)
      .post('/api/guias')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newGuia)
      .expect(201);

    expect(response.body).toHaveProperty('id_guia');
    expect(response.body.hotel_id).toBe(newGuia.hotel_id);
  });
});
```

## Monitoreo y Logging

### Logging Estructurado

```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'lavanderia-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Middleware de Logging

```typescript
// middleware/requestLogger.ts
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};
```

## Consideraciones de Escalabilidad

### Paginación Eficiente

```sql
-- Usar LIMIT y OFFSET para paginación
SELECT * FROM guias_lavanderia 
WHERE hotel_id = ? 
ORDER BY fecha_creacion DESC 
LIMIT ? OFFSET ?;

-- Para mejor performance en tablas grandes, usar cursor-based pagination
SELECT * FROM guias_lavanderia 
WHERE hotel_id = ? AND id_guia > ? 
ORDER BY id_guia ASC 
LIMIT ?;
```

### Caché de Consultas

```typescript
// utils/cache.ts
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutos

export const getCachedData = (key: string) => {
  return cache.get(key);
};

export const setCachedData = (key: string, data: any, ttl?: number) => {
  return cache.set(key, data, ttl);
};

// Uso en servicios
export const getHoteles = async () => {
  const cacheKey = 'hoteles_list';
  let hoteles = getCachedData(cacheKey);
  
  if (!hoteles) {
    hoteles = await hotelRepository.findAll();
    setCachedData(cacheKey, hoteles, 300); // 5 minutos
  }
  
  return hoteles;
};
```

### Optimización de Consultas

```typescript
// Usar joins para evitar N+1 queries
const getGuiasWithDetails = async (filters: any) => {
  return await db.query(`
    SELECT 
      g.*,
      h.nombre_comercial,
      cr.nombre_completo as chofer_recojo_nombre,
      rr.nombre_completo as recepcionista_recojo_nombre
    FROM guias_lavanderia g
    JOIN hoteles h ON g.hotel_id = h.id_hotel
    JOIN usuarios cr ON g.chofer_recojo_id = cr.id_usuario
    JOIN usuarios rr ON g.recepcionista_recojo_id = rr.id_usuario
    WHERE g.estado IN (?)
    ORDER BY g.fecha_creacion DESC
    LIMIT ? OFFSET ?
  `, [filters.estados, filters.limit, filters.offset]);
};
```

Esta documentación técnica proporciona una base sólida para entender, mantener y escalar el sistema de gestión de guías de lavandería.