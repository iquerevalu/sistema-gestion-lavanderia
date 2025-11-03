# 🚀 Guía de Deployment - Sistema de Gestión de Guías de Lavandería

## 📋 Tabla de Contenidos

- [Prerrequisitos](#-prerrequisitos)
- [Configuración Local](#-configuración-local)
- [Deployment en Producción](#-deployment-en-producción)
- [Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [Variables de Entorno](#-variables-de-entorno)
- [Monitoreo y Mantenimiento](#-monitoreo-y-mantenimiento)
- [Troubleshooting](#-troubleshooting)

## 🔧 Prerrequisitos

### Software Requerido

| Software | Versión Mínima | Propósito |
|----------|----------------|-----------|
| **Node.js** | 18.0+ | Runtime de JavaScript |
| **npm** | 8.0+ | Gestor de paquetes |
| **MySQL** | 8.0+ | Base de datos |
| **Git** | 2.30+ | Control de versiones |

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version
# Debe mostrar v18.0.0 o superior

# Verificar npm
npm --version
# Debe mostrar 8.0.0 o superior

# Verificar MySQL
mysql --version
# Debe mostrar 8.0.0 o superior

# Verificar Git
git --version
# Debe mostrar 2.30.0 o superior
```

## 💻 Configuración Local

### 1. Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/sistema-gestion-guias-lavanderia.git
cd sistema-gestion-guias-lavanderia

# Verificar estructura
ls -la
# Debe mostrar carpetas: frontend/, backend/, .kiro/
```

### 2. Configurar Backend

```bash
# Navegar al backend
cd backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env

# Editar variables de entorno
nano .env
```

#### Configuración .env (Backend)

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lavanderia_db
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql

# Autenticación
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_aqui
JWT_EXPIRES_IN=24h

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### 3. Configurar Frontend

```bash
# Navegar al frontend (desde la raíz del proyecto)
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env

# Editar variables de entorno
nano .env
```

#### Configuración .env (Frontend)

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Sistema de Gestión de Guías de Lavandería
VITE_APP_VERSION=1.0.0

# Development
VITE_DEV_MODE=true
```

### 4. Configurar Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE lavanderia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Crear usuario específico (opcional pero recomendado)
CREATE USER 'lavanderia_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON lavanderia_db.* TO 'lavanderia_user'@'localhost';
FLUSH PRIVILEGES;

# Salir de MySQL
EXIT;
```

#### Ejecutar Migraciones

```bash
# Desde la carpeta backend
cd backend

# Ejecutar script de migración
npm run migrate

# O ejecutar manualmente
mysql -u lavanderia_user -p lavanderia_db < database/schema.sql
mysql -u lavanderia_user -p lavanderia_db < database/seed.sql
```

### 5. Ejecutar en Desarrollo

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Debe mostrar: "Servidor corriendo en puerto 3001"

# Terminal 2: Frontend
cd frontend
npm run dev
# Debe mostrar: "Local: http://localhost:5173"
```

### 6. Verificar Instalación

1. **Abrir navegador**: http://localhost:5173
2. **Iniciar sesión** con credenciales de prueba:
   - Email: `admin@lavanderia.com`
   - Password: `123456`
3. **Verificar funcionalidades**:
   - Navegación entre páginas
   - Creación de guías
   - Procesamiento de guías
   - Seguimiento de estados

## 🌐 Deployment en Producción

### Opción 1: Vercel (Recomendado)

#### Preparación

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login
```

#### Deploy Frontend

```bash
# Desde la carpeta frontend
cd frontend

# Configurar build para producción
npm run build

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
# VITE_API_URL=https://tu-backend.vercel.app/api
```

#### Deploy Backend

```bash
# Desde la carpeta backend
cd backend

# Crear vercel.json
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
EOF

# Deploy
vercel --prod
```

### Opción 2: Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Deploy
railway up
```

### Opción 3: DigitalOcean App Platform

1. **Conectar repositorio** en DigitalOcean Dashboard
2. **Configurar build settings**:
   - Frontend: `npm run build`
   - Backend: `npm start`
3. **Configurar variables de entorno**
4. **Deploy automático**

### Opción 4: Docker

#### Dockerfile Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "start"]
```

#### Dockerfile Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build para producción
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=database
      - DB_NAME=lavanderia_db
      - DB_USER=lavanderia_user
      - DB_PASSWORD=secure_password
      - JWT_SECRET=very_secure_jwt_secret
    depends_on:
      - database

  database:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=lavanderia_db
      - MYSQL_USER=lavanderia_user
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./backend/database/seed.sql:/docker-entrypoint-initdb.d/2-seed.sql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

#### Ejecutar con Docker

```bash
# Build y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

## 🗄️ Configuración de Base de Datos

### MySQL en Producción

#### PlanetScale (Recomendado)

```bash
# Instalar CLI
npm install -g @planetscale/cli

# Login
pscale auth login

# Crear base de datos
pscale database create lavanderia-prod

# Crear branch
pscale branch create lavanderia-prod main

# Obtener connection string
pscale connect lavanderia-prod main --port 3309
```

#### AWS RDS

1. **Crear instancia RDS MySQL 8.0**
2. **Configurar security groups**
3. **Obtener endpoint de conexión**
4. **Configurar variables de entorno**:

```bash
DB_HOST=tu-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_NAME=lavanderia_db
DB_USER=admin
DB_PASSWORD=tu_password_seguro
```

#### Railway MySQL

```bash
# Agregar MySQL addon
railway add mysql

# Obtener variables de conexión
railway variables
```

### Migraciones en Producción

```bash
# Script de migración segura
#!/bin/bash

echo "🔄 Iniciando migración de base de datos..."

# Backup de seguridad
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Ejecutar migraciones
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < migrations/001_initial_schema.sql
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < migrations/002_seed_data.sql

echo "✅ Migración completada"
```

## 🔐 Variables de Entorno

### Producción - Backend

```bash
# Base de datos
DB_HOST=tu-host-produccion.com
DB_PORT=3306
DB_NAME=lavanderia_prod
DB_USER=usuario_prod
DB_PASSWORD=password_muy_seguro

# Autenticación
JWT_SECRET=jwt_secret_extremadamente_seguro_para_produccion_con_al_menos_64_caracteres
JWT_EXPIRES_IN=24h

# Servidor
PORT=3001
NODE_ENV=production

# CORS
CORS_ORIGIN=https://tu-frontend-domain.com

# Logging
LOG_LEVEL=warn

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (si se implementa)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

### Producción - Frontend

```bash
# API Configuration
VITE_API_URL=https://tu-backend-domain.com/api

# App Configuration
VITE_APP_NAME=Sistema de Gestión de Guías de Lavandería
VITE_APP_VERSION=1.0.0

# Analytics (opcional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Error tracking (opcional)
VITE_SENTRY_DSN=https://tu-sentry-dsn.ingest.sentry.io/
```

### Seguridad de Variables

```bash
# Generar JWT secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generar password hash
node -e "console.log(require('bcrypt').hashSync('tu_password', 10))"
```

## 📊 Monitoreo y Mantenimiento

### Health Checks

#### Backend Health Check

```typescript
// backend/src/routes/health.ts
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await db.query('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

#### Monitoreo con UptimeRobot

1. **Crear cuenta** en UptimeRobot
2. **Agregar monitor HTTP**:
   - URL: `https://tu-backend.com/health`
   - Intervalo: 5 minutos
3. **Configurar alertas** por email/SMS

### Logging en Producción

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Archivo de logs
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    
    // Servicio externo (opcional)
    new winston.transports.Http({
      host: 'logs.papertrailapp.com',
      port: 12345
    })
  ]
});
```

### Backup Automatizado

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="lavanderia_prod"

# Crear backup
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Comprimir
gzip $BACKUP_DIR/backup_$DATE.sql

# Subir a S3 (opcional)
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://tu-bucket/backups/

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completado: backup_$DATE.sql.gz"
```

#### Cron Job para Backup

```bash
# Editar crontab
crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

## 🔧 Troubleshooting

### Problemas Comunes

#### Error de Conexión a Base de Datos

```bash
# Verificar conectividad
telnet tu-db-host.com 3306

# Verificar credenciales
mysql -h tu-db-host.com -u tu-usuario -p

# Verificar variables de entorno
echo $DB_HOST
echo $DB_USER
```

#### Error de CORS

```typescript
// backend/src/app.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

#### Error de Build Frontend

```bash
# Limpiar cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Verificar variables de entorno
cat .env

# Build con logs detallados
npm run build -- --verbose
```

#### Error de Memoria en Producción

```bash
# Aumentar límite de memoria Node.js
node --max-old-space-size=4096 src/server.js

# O en package.json
"scripts": {
  "start": "node --max-old-space-size=4096 src/server.js"
}
```

### Logs de Debugging

```bash
# Ver logs en tiempo real
tail -f logs/combined.log

# Filtrar errores
grep "ERROR" logs/combined.log

# Ver logs de aplicación (PM2)
pm2 logs lavanderia-backend

# Ver logs de sistema
journalctl -u lavanderia-backend -f
```

### Performance Monitoring

#### New Relic (Opcional)

```bash
# Instalar agente
npm install newrelic

# Configurar
cp node_modules/newrelic/newrelic.js ./
```

```javascript
// newrelic.js
exports.config = {
  app_name: ['Sistema Lavandería'],
  license_key: 'tu-license-key',
  logging: {
    level: 'info'
  }
};
```

#### Métricas Básicas

```typescript
// backend/src/middleware/metrics.ts
let requestCount = 0;
let responseTime = [];

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  requestCount++;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    responseTime.push(duration);
    
    // Mantener solo últimas 1000 mediciones
    if (responseTime.length > 1000) {
      responseTime = responseTime.slice(-1000);
    }
  });
  
  next();
};

// Endpoint de métricas
app.get('/metrics', (req, res) => {
  const avgResponseTime = responseTime.reduce((a, b) => a + b, 0) / responseTime.length;
  
  res.json({
    requests_total: requestCount,
    avg_response_time_ms: avgResponseTime,
    uptime_seconds: process.uptime(),
    memory_usage: process.memoryUsage()
  });
});
```

## 📋 Checklist de Deployment

### Pre-Deployment

- [ ] **Código revisado** y testeado
- [ ] **Variables de entorno** configuradas
- [ ] **Base de datos** migrada
- [ ] **Backup** de datos existentes
- [ ] **SSL/TLS** configurado
- [ ] **Dominio** configurado
- [ ] **Monitoreo** configurado

### Post-Deployment

- [ ] **Health checks** funcionando
- [ ] **Logs** generándose correctamente
- [ ] **Funcionalidades críticas** testeadas
- [ ] **Performance** verificada
- [ ] **Backup automatizado** funcionando
- [ ] **Alertas** configuradas
- [ ] **Documentación** actualizada

### Rollback Plan

```bash
# Preparar rollback
git tag v1.0.0-stable

# En caso de problemas
git checkout v1.0.0-stable
npm run build
npm run deploy

# Restaurar base de datos si es necesario
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup_YYYYMMDD_HHMMSS.sql
```

---

**¡Deployment exitoso! 🎉**

*Para soporte adicional, contacta al equipo de desarrollo.*