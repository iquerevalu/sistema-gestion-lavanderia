# 📦 Resumen: Despliegue AWS Serverless

## ✅ Archivos Creados

### Backend
- `backend/serverless.yml` - Configuración de Serverless Framework
- `backend/src/lambda.ts` - Handler para AWS Lambda
- `backend/.env.example` - Template de variables de entorno
- `backend/deploy.md` - Guía detallada de despliegue
- `backend/package.json` - Scripts de deploy agregados

### Frontend
- `frontend/deploy-s3.sh` - Script de deploy a S3 (mejorado)
- `frontend/setup-aws-frontend.sh` - Setup inicial de S3 y CloudFront
- `frontend/test-deployment.sh` - Tests de deployment
- `frontend/rollback.sh` - Script de rollback
- `frontend/cloudfront-config.json` - Configuración de CloudFront
- `frontend/DEPLOY.md` - Guía completa de deploy frontend
- `frontend/README.md` - Documentación del frontend
- `frontend/COMANDOS_RAPIDOS.md` - Referencia rápida de comandos
- `frontend/.env.production` - Variables de producción (configurado)

### Raíz
- `aws-setup.sh` - Script automático de setup de AWS
- `DEPLOY_AWS.md` - Guía completa de despliegue
- `RESUMEN_DEPLOY.md` - Este archivo

## 🚀 Despliegue Rápido

### Backend (Ya desplegado ✅)
```bash
cd backend
npm run deploy
# URL: https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
```

### Frontend (Nuevo)
```bash
cd frontend

# Primera vez: Setup de S3 y CloudFront
chmod +x setup-aws-frontend.sh
./setup-aws-frontend.sh

# Deploy regular
chmod +x deploy-s3.sh
./deploy-s3.sh

# Verificar
chmod +x test-deployment.sh
./test-deployment.sh
```

## 📋 Checklist Pre-Deploy

- [ ] AWS CLI instalado y configurado
- [ ] Node.js 18+ instalado
- [ ] Serverless Framework instalado globalmente
- [ ] MySQL client instalado (para migraciones)
- [ ] Permisos IAM configurados

## 🏗️ Arquitectura Desplegada

```
Frontend (React)
    ↓
S3 + CloudFront
    ↓
API Gateway
    ↓
Lambda (Express)
    ↓
Aurora Serverless MySQL
```

## 💰 Costos Estimados

**Uso Moderado**: $45-85/mes
- Lambda: $5-10
- Aurora: $30-50
- API Gateway: $3-5
- S3: $1-5
- CloudFront: $5-15

## 🔑 Variables de Entorno Necesarias

### Backend (.env)
```
DB_HOST=tu-aurora-endpoint
DB_PORT=3306
DB_NAME=lavanderia_db
DB_USER=admin
DB_PASSWORD=tu-password
JWT_SECRET=tu-jwt-secret
NODE_ENV=production
```

### Frontend (.env.production)
```
VITE_API_URL=https://tu-api-gateway-url/prod/api
```

## 📊 Endpoints Desplegados

Todos tus endpoints actuales funcionarán automáticamente:

- `POST /api/auth/login` - Autenticación
- `GET /api/guias` - Listar guías
- `POST /api/guias` - Crear guía
- `PUT /api/guias/:id` - Actualizar guía
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/hoteles` - Listar hoteles
- `GET /api/prendas` - Listar prendas
- `GET /api/estados` - Listar estados

## 🔧 Comandos Útiles

### Backend
```bash
cd backend

# Ver logs en tiempo real
npm run logs

# Deploy
npm run deploy

# Deploy ambiente dev
npm run deploy:dev

# Probar localmente
npm run offline

# Eliminar todo
npm run remove
```

### Frontend
```bash
cd frontend

# Deploy completo
./deploy-s3.sh

# Deploy rápido (sin rebuild)
./deploy-s3.sh --skip-build

# Test deployment
./test-deployment.sh

# Rollback
./rollback.sh

# Ver archivos en S3
aws s3 ls s3://lavanderia-frontend-prod --recursive
```

## 🐛 Troubleshooting Rápido

### Error de conexión a BD
```bash
# Verificar endpoint
aws rds describe-db-clusters --db-cluster-identifier lavanderia-db-cluster
```

### Error de CORS
Actualizar `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: ['https://tu-cloudfront-url.cloudfront.net'],
  credentials: true
}));
```

### Error de timeout
Aumentar en `serverless.yml`:
```yaml
provider:
  timeout: 30
  memorySize: 1024
```

## 📞 Próximos Pasos

1. **Ejecutar aws-setup.sh** para crear recursos
2. **Migrar base de datos** con los scripts SQL
3. **Deploy backend** con `npm run deploy`
4. **Configurar frontend** con la URL del API Gateway
5. **Deploy frontend** con `./deploy-s3.sh`
6. **Configurar CloudFront** (opcional)
7. **Configurar dominio personalizado** (opcional)
8. **Configurar alarmas** de CloudWatch
9. **Configurar backups** de Aurora

## ✨ Características Serverless

- ✅ **Auto-scaling**: Se ajusta automáticamente a la demanda
- ✅ **Pay-per-use**: Solo pagas por lo que usas
- ✅ **Alta disponibilidad**: Multi-AZ por defecto
- ✅ **Sin servidores**: No hay que mantener servidores
- ✅ **Backups automáticos**: Aurora hace backups diarios
- ✅ **Monitoreo**: CloudWatch integrado

## 🌐 Deploy del Frontend - Guía Rápida

### 1️⃣ Setup Inicial (Solo Primera Vez)

```bash
cd frontend

# Dar permisos a los scripts
chmod +x setup-aws-frontend.sh deploy-s3.sh test-deployment.sh rollback.sh

# Ejecutar setup automático
./setup-aws-frontend.sh
```

Este script:
- ✅ Crea el bucket S3
- ✅ Configura como sitio web estático
- ✅ Aplica políticas de acceso público
- ✅ Configura CORS
- ✅ Opcionalmente crea CloudFront

### 2️⃣ Configurar Variables de Entorno

El archivo `.env.production` ya está configurado con tu API:
```bash
VITE_API_URL=https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
```

### 3️⃣ Deploy

```bash
# Deploy completo
./deploy-s3.sh
```

El script:
- 📦 Hace build del proyecto
- 💾 Crea backup automático
- ☁️ Sube archivos a S3
- 🔄 Invalida cache de CloudFront
- ✅ Muestra URLs de acceso

### 4️⃣ Verificar

```bash
# Test automático
./test-deployment.sh

# O manualmente
curl -I http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

### 5️⃣ Rollback (Si es necesario)

```bash
# Rollback interactivo
./rollback.sh
```

## 📚 Documentación del Frontend

- **[frontend/DEPLOY.md](frontend/DEPLOY.md)** - Guía completa de deployment
- **[frontend/README.md](frontend/README.md)** - Documentación general
- **[frontend/COMANDOS_RAPIDOS.md](frontend/COMANDOS_RAPIDOS.md)** - Referencia rápida

## 🎯 Estado Actual

### Backend ✅
- **Desplegado**: https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
- **Base de datos**: Aurora Serverless configurada
- **Autenticación**: Cognito funcionando

### Frontend 🚀
- **Scripts listos**: Todos los scripts de deploy creados
- **Configuración**: Variables de entorno configuradas
- **Listo para deploy**: Solo ejecuta `./setup-aws-frontend.sh` y `./deploy-s3.sh`

## 🎉 Próximos Pasos

1. **Deploy del Frontend**:
   ```bash
   cd frontend
   ./setup-aws-frontend.sh
   ./deploy-s3.sh
   ```

2. **Configurar Dominio Personalizado** (Opcional):
   - Obtener certificado SSL en ACM
   - Configurar CloudFront con dominio
   - Crear registro DNS

3. **Configurar CI/CD** (Opcional):
   - GitHub Actions para deploy automático
   - AWS CodePipeline

4. **Monitoreo**:
   - Configurar alarmas en CloudWatch
   - Revisar logs de Lambda
   - Monitorear costos

---

**¿Listo para desplegar el frontend?** 

```bash
cd frontend && ./setup-aws-frontend.sh
```

🚀 ¡Tu aplicación completa estará en la nube en minutos!
