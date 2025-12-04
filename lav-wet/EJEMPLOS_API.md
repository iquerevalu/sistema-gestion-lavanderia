# 🔌 Ejemplos de API - Endpoints Desplegados

## Base URL

```
Desarrollo: http://localhost:3001/api
Producción: https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api
```

## 🔐 Autenticación

### Login

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@lavanderia.com",
    "password": "123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_usuario": 1,
      "nombre_completo": "Administrador",
      "correo": "admin@lavanderia.com",
      "perfil": "Administrador"
    }
  }
}
```

## 📋 Guías

### Listar Guías

```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/guias?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear Guía

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/guias \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": 1,
    "chofer_recojo_id": 10,
    "fecha_recoleccion": "2024-11-20",
    "observaciones": "Recolección matutina",
    "prendas": [
      {
        "hotel_prenda_id": 1,
        "cantidad_sucia": 15,
        "es_devuelta": false
      },
      {
        "hotel_prenda_id": 2,
        "cantidad_sucia": 8,
        "es_devuelta": false
      }
    ]
  }'
```

### Procesar Guía

```bash
curl -X PUT https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/guias/1/cantidades \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prendas": [
      {
        "id_detalle": 1,
        "cantidad_limpia": 15
      },
      {
        "id_detalle": 2,
        "cantidad_limpia": 8
      }
    ],
    "estado_id": 4,
    "observaciones": "Procesamiento completado"
  }'
```

### Obtener Guía por ID

```bash
curl -X GET https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/guias/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 👥 Usuarios

### Listar Usuarios

```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/usuarios?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear Usuario

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/usuarios \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Juan Pérez",
    "correo": "juan@email.com",
    "telefono": "123456789",
    "perfil_id": 2,
    "hotel_id": 1,
    "password": "password123"
  }'
```

## 🏨 Hoteles

### Listar Hoteles

```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/hoteles?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear Hotel

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/hoteles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ruc": "20123456789",
    "nombre_comercial": "Hotel Plaza",
    "razon_social": "Hotel Plaza SAC",
    "telefono": "987654321",
    "correo": "contacto@hotelplaza.com",
    "direccion": "Av. Principal 123"
  }'
```

## 👕 Prendas

### Listar Prendas

```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/prendas?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear Prenda

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/prendas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_prenda": "Sábana Individual",
    "descripcion": "Sábana de algodón individual",
    "categoria_id": 1
  }'
```

## 📊 Estados

### Listar Estados

```bash
curl -X GET https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/estados \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Estados para Procesamiento

```bash
curl -X GET https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/estados/procesamiento \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔍 Filtros Avanzados

### Guías por Estado

```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/guias?estado=PENDIENTE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Guías por Hotel

```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/guias?hotel_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Guías por Rango de Fechas

```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/guias?fecha_desde=2024-11-01&fecha_hasta=2024-11-30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Testing con Postman

### Importar Colección

1. Crear nueva colección en Postman
2. Agregar variable `{{baseUrl}}` = `https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api`
3. Agregar variable `{{token}}` = Tu token JWT
4. Importar los endpoints de arriba

### Variables de Entorno

```json
{
  "baseUrl": "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🐛 Debugging

### Ver Logs

```bash
# Logs en tiempo real
serverless logs -f api --stage prod --tail

# Logs de CloudWatch
aws logs tail /aws/lambda/lavanderia-backend-prod-api --follow
```

### Health Check

```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "database": "Conectada",
  "timestamp": "2024-11-19T10:30:00.000Z"
}
```

## 📱 Integración con Frontend

### Configurar Axios

```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
```

### Ejemplo de Uso

```typescript
// Login
const response = await api.post('/auth/login', {
  correo: 'admin@lavanderia.com',
  password: '123456'
});

// Guardar token
localStorage.setItem('token', response.data.data.token);

// Obtener guías
const guias = await api.get('/guias?page=1&limit=10');
```

## 🔒 Seguridad

### Headers Requeridos

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### CORS

El API acepta requests desde:
- `http://localhost:5173` (desarrollo)
- Tu dominio de CloudFront (producción)

### Rate Limiting

- **Límite**: 100 requests por minuto por IP
- **Response**: 429 Too Many Requests

## 📈 Monitoreo

### Métricas Disponibles

- Invocaciones totales
- Errores
- Duración promedio
- Throttles
- Concurrent executions

### CloudWatch Dashboard

```bash
aws cloudwatch get-dashboard \
  --dashboard-name lavanderia-api-dashboard
```

---

**Nota**: Reemplaza `your-api-id` con tu API Gateway ID real después del deploy.
