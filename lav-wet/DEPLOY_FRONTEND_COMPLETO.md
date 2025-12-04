# 🎉 Deploy del Frontend - Documentación Completa

## 📦 Archivos Creados

### Scripts de Deploy
- ✅ `frontend/deploy-s3.sh` - Script principal de deploy (Bash)
- ✅ `frontend/deploy-s3.ps1` - Script principal de deploy (PowerShell)
- ✅ `frontend/setup-aws-frontend.sh` - Setup inicial de AWS
- ✅ `frontend/test-deployment.sh` - Tests automáticos
- ✅ `frontend/rollback.sh` - Script de rollback

### Configuración
- ✅ `frontend/.env.production` - Variables de producción (configurado)
- ✅ `frontend/cloudfront-config.json` - Configuración de CloudFront

### Documentación
- ✅ `frontend/DEPLOY.md` - Guía completa de deployment
- ✅ `frontend/README.md` - Documentación del frontend
- ✅ `frontend/COMANDOS_RAPIDOS.md` - Referencia rápida
- ✅ `frontend/DEPLOY_WINDOWS.md` - Guía específica para Windows

### Documentación General
- ✅ `RESUMEN_DEPLOY.md` - Resumen ejecutivo (actualizado)
- ✅ `CHECKLIST_DEPLOY.md` - Checklist completo
- ✅ `README.md` - README principal (actualizado)
- ✅ `DEPLOY_FRONTEND_COMPLETO.md` - Este archivo

## 🚀 Guía de Inicio Rápido

### Para Linux/Mac

```bash
cd frontend

# 1. Dar permisos
chmod +x setup-aws-frontend.sh deploy-s3.sh test-deployment.sh rollback.sh

# 2. Setup inicial (solo primera vez)
./setup-aws-frontend.sh

# 3. Deploy
./deploy-s3.sh

# 4. Verificar
./test-deployment.sh
```

### Para Windows (PowerShell)

```powershell
cd frontend

# 1. Setup inicial (solo primera vez)
# Usar Git Bash o seguir guía manual en DEPLOY_WINDOWS.md

# 2. Deploy
.\deploy-s3.ps1

# 3. Verificar
# Abrir en navegador o usar curl
```

## 📋 Checklist de Deploy

### Pre-requisitos
- [x] AWS CLI instalado y configurado
- [x] Node.js 18+ instalado
- [x] Backend desplegado
- [x] Variables de entorno configuradas

### Setup Inicial (Solo Primera Vez)
- [ ] Ejecutar `setup-aws-frontend.sh`
- [ ] Verificar creación del bucket S3
- [ ] Verificar configuración de sitio web
- [ ] Verificar políticas de acceso
- [ ] (Opcional) Crear distribución de CloudFront

### Deploy Regular
- [ ] Ejecutar `deploy-s3.sh`
- [ ] Verificar build exitoso
- [ ] Verificar subida a S3
- [ ] Verificar invalidación de cache (si aplica)
- [ ] Probar en navegador

### Verificación
- [ ] Ejecutar `test-deployment.sh`
- [ ] Verificar login funciona
- [ ] Verificar navegación funciona
- [ ] Verificar llamadas al API funcionan

## 🎯 URLs Importantes

### Backend (Ya Desplegado)
```
https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
```

### Frontend (Después del Deploy)
```
S3: http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
CloudFront: https://tu-distribution.cloudfront.net (si aplica)
```

## 📚 Documentación por Caso de Uso

### "Quiero hacer el deploy por primera vez"
1. Lee: `frontend/DEPLOY.md`
2. Ejecuta: `setup-aws-frontend.sh`
3. Ejecuta: `deploy-s3.sh`
4. Verifica: `test-deployment.sh`

### "Quiero hacer un deploy rápido"
```bash
cd frontend
./deploy-s3.sh --skip-build  # Si ya tienes el build
```

### "Algo salió mal, necesito volver atrás"
```bash
cd frontend
./rollback.sh
```

### "Estoy en Windows"
1. Lee: `frontend/DEPLOY_WINDOWS.md`
2. Usa: `deploy-s3.ps1`

### "Necesito comandos específicos"
1. Lee: `frontend/COMANDOS_RAPIDOS.md`

### "Quiero entender toda la arquitectura"
1. Lee: `RESUMEN_DEPLOY.md`
2. Lee: `backend/deploy.md`
3. Lee: `frontend/DEPLOY.md`

## 🔧 Comandos Más Usados

### Deploy
```bash
# Deploy completo
./deploy-s3.sh

# Deploy rápido (sin rebuild)
./deploy-s3.sh --skip-build

# Deploy sin invalidar cache
./deploy-s3.sh --no-cache-invalidation
```

### Verificación
```bash
# Test automático
./test-deployment.sh

# Ver archivos en S3
aws s3 ls s3://lavanderia-frontend-prod --recursive

# Test manual
curl -I http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

### Rollback
```bash
# Rollback interactivo
./rollback.sh

# Ver backups disponibles
aws s3 ls s3://lavanderia-frontend-backups/
```

### CloudFront
```bash
# Invalidar cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

# Ver distribuciones
aws cloudfront list-distributions
```

## 🎨 Características de los Scripts

### deploy-s3.sh
- ✅ Build automático del proyecto
- ✅ Backup automático antes de deploy
- ✅ Verificación de credenciales AWS
- ✅ Creación automática del bucket si no existe
- ✅ Configuración de cache optimizada
- ✅ Invalidación de CloudFront
- ✅ Estadísticas del deploy
- ✅ Manejo de errores robusto

### setup-aws-frontend.sh
- ✅ Creación del bucket S3
- ✅ Configuración de sitio web estático
- ✅ Configuración de acceso público
- ✅ Aplicación de políticas
- ✅ Configuración de CORS
- ✅ Opción de crear CloudFront

### test-deployment.sh
- ✅ Verificación del bucket
- ✅ Verificación de archivos
- ✅ Test HTTP del sitio
- ✅ Verificación de contenido HTML
- ✅ Verificación de assets
- ✅ Test de rutas de React Router
- ✅ Verificación de configuraciones

### rollback.sh
- ✅ Lista de backups disponibles
- ✅ Selección interactiva
- ✅ Backup del estado actual antes de rollback
- ✅ Restauración completa
- ✅ Invalidación de cache
- ✅ Verificación post-rollback

## 💡 Tips y Mejores Prácticas

### Deploy
1. **Siempre verifica** el build localmente antes de deploy
2. **Usa --skip-build** para deploys rápidos si el build ya está listo
3. **Revisa los logs** si algo falla
4. **Prueba en el navegador** después de cada deploy

### CloudFront
1. **Configura CloudFront** para mejor rendimiento
2. **Usa HTTPS** en producción
3. **Configura custom error responses** para React Router
4. **Invalida el cache** después de cada deploy

### Backups
1. Los backups se crean **automáticamente** antes de cada deploy
2. Se mantienen los **últimos 5 backups**
3. Usa `rollback.sh` para restaurar fácilmente

### Seguridad
1. **Nunca** commitees `.env.production` con datos reales
2. **Usa** variables de entorno para secretos
3. **Configura** CORS correctamente
4. **Revisa** las políticas de S3 regularmente

## 🐛 Troubleshooting

### Error: AWS CLI no encontrado
```bash
# Instalar AWS CLI
# Linux/Mac: https://aws.amazon.com/cli/
# Windows: https://aws.amazon.com/cli/

# Verificar instalación
aws --version
```

### Error: Credenciales no configuradas
```bash
# Configurar AWS
aws configure

# Verificar
aws sts get-caller-identity
```

### Error: Bucket ya existe
```bash
# El bucket ya fue creado, solo ejecuta deploy
./deploy-s3.sh
```

### Error: Build falla
```bash
# Limpiar y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### Error: CORS
```bash
# Verificar CORS en S3
aws s3api get-bucket-cors --bucket lavanderia-frontend-prod

# Verificar CORS en backend
# Revisar backend/src/index.ts
```

### Frontend no carga
```bash
# Verificar archivos en S3
aws s3 ls s3://lavanderia-frontend-prod --recursive

# Verificar configuración de website
aws s3api get-bucket-website --bucket lavanderia-frontend-prod

# Test HTTP
curl -I http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

### Cache no se actualiza
```bash
# Invalidar CloudFront
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

# Esperar 5-10 minutos para propagación
```

## 📊 Estructura de Archivos

```
frontend/
├── src/                          # Código fuente
├── dist/                         # Build output (generado)
├── public/                       # Assets estáticos
│
├── deploy-s3.sh                  # Script principal (Bash)
├── deploy-s3.ps1                 # Script principal (PowerShell)
├── setup-aws-frontend.sh         # Setup inicial
├── test-deployment.sh            # Tests
├── rollback.sh                   # Rollback
│
├── .env                          # Variables locales
├── .env.production               # Variables de producción ✅
├── .env.production.example       # Template
│
├── cloudfront-config.json        # Config CloudFront
├── package.json                  # Dependencias
├── vite.config.ts                # Config Vite
│
├── DEPLOY.md                     # Guía completa
├── README.md                     # Documentación
├── COMANDOS_RAPIDOS.md           # Referencia rápida
└── DEPLOY_WINDOWS.md             # Guía Windows
```

## 🎉 Estado Actual

### ✅ Completado
- [x] Scripts de deploy creados
- [x] Scripts de setup creados
- [x] Scripts de testing creados
- [x] Scripts de rollback creados
- [x] Documentación completa
- [x] Guías específicas por plataforma
- [x] Variables de entorno configuradas
- [x] Backend desplegado y funcionando

### 🚀 Listo para Deploy
- [ ] Ejecutar setup inicial
- [ ] Ejecutar primer deploy
- [ ] Verificar funcionamiento
- [ ] (Opcional) Configurar CloudFront
- [ ] (Opcional) Configurar dominio personalizado

## 📞 Recursos Adicionales

### Documentación AWS
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/)

### Documentación del Proyecto
- [Backend Deploy](./backend/deploy.md)
- [Resumen General](./RESUMEN_DEPLOY.md)
- [Checklist Completo](./CHECKLIST_DEPLOY.md)
- [README Principal](./README.md)

### Herramientas
- [AWS Console](https://console.aws.amazon.com/)
- [CloudWatch Logs](https://console.aws.amazon.com/cloudwatch/)
- [S3 Console](https://console.aws.amazon.com/s3/)

## 🎯 Próximos Pasos

1. **Ejecutar Setup Inicial**
   ```bash
   cd frontend
   ./setup-aws-frontend.sh
   ```

2. **Hacer Primer Deploy**
   ```bash
   ./deploy-s3.sh
   ```

3. **Verificar Funcionamiento**
   ```bash
   ./test-deployment.sh
   ```

4. **Configurar CloudFront** (Opcional)
   - Mejor rendimiento
   - HTTPS automático
   - CDN global

5. **Configurar Dominio** (Opcional)
   - Certificado SSL en ACM
   - Configurar Route 53
   - Actualizar CloudFront

---

## 🎊 ¡Todo Listo!

Tu proyecto está **100% preparado** para el deploy del frontend.

Solo necesitas ejecutar:

```bash
cd frontend
./setup-aws-frontend.sh
./deploy-s3.sh
```

¡Y tu aplicación estará en la nube! 🚀

---

**Fecha de creación**: 19 de Noviembre, 2024
**Versión**: 1.0.0
**Estado**: ✅ Completo y listo para usar
