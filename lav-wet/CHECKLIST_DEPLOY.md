# ✅ Checklist de Deploy - Sistema de Lavandería

## 📋 Pre-requisitos

- [ ] AWS CLI instalado y configurado (`aws --version`)
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Git instalado
- [ ] Cuenta AWS con permisos de administrador
- [ ] Credenciales AWS configuradas (`aws sts get-caller-identity`)

## 🔧 Backend (Ya Completado ✅)

- [x] Serverless Framework configurado
- [x] Base de datos Aurora Serverless creada
- [x] Cognito User Pool configurado
- [x] Lambda functions desplegadas
- [x] API Gateway configurado
- [x] Variables de entorno configuradas
- [x] **URL del API**: `https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api`

## 🌐 Frontend (Por Hacer)

### Setup Inicial
- [ ] Navegar a carpeta frontend: `cd frontend`
- [ ] Dar permisos a scripts:
  ```bash
  chmod +x setup-aws-frontend.sh
  chmod +x deploy-s3.sh
  chmod +x test-deployment.sh
  chmod +x rollback.sh
  ```
- [ ] Ejecutar setup: `./setup-aws-frontend.sh`
- [ ] Verificar que `.env.production` tiene la URL correcta del API

### Deploy
- [ ] Ejecutar deploy: `./deploy-s3.sh`
- [ ] Esperar a que termine el build
- [ ] Verificar que los archivos se subieron a S3
- [ ] Copiar la URL del sitio S3

### Verificación
- [ ] Ejecutar tests: `./test-deployment.sh`
- [ ] Abrir URL en navegador
- [ ] Probar login
- [ ] Verificar que carga el dashboard
- [ ] Probar navegación entre páginas
- [ ] Verificar que las llamadas al API funcionan

### CloudFront (Opcional pero Recomendado)
- [ ] Crear distribución de CloudFront
- [ ] Configurar certificado SSL (si usas dominio personalizado)
- [ ] Actualizar `DISTRIBUTION_ID` en `deploy-s3.sh`
- [ ] Hacer deploy nuevamente para probar invalidación de cache
- [ ] Verificar acceso por HTTPS

## 🔐 Seguridad

- [ ] Verificar que CORS está configurado correctamente
- [ ] Revisar políticas de S3
- [ ] Verificar que solo index.html no tiene cache
- [ ] Revisar permisos IAM
- [ ] Configurar WAF (opcional)

## 📊 Monitoreo

- [ ] Configurar alarmas de CloudWatch para Lambda
- [ ] Configurar alarmas para Aurora
- [ ] Configurar alarmas de costos
- [ ] Revisar logs de Lambda
- [ ] Configurar dashboard de CloudWatch

## 💰 Costos

- [ ] Revisar estimación de costos
- [ ] Configurar presupuesto en AWS Budgets
- [ ] Configurar alertas de costos
- [ ] Revisar uso de recursos

## 🧪 Testing Post-Deploy

### Backend
- [ ] Test de login: `POST /api/auth/login`
- [ ] Test de guías: `GET /api/guias`
- [ ] Test de usuarios: `GET /api/usuarios`
- [ ] Test de hoteles: `GET /api/hoteles`
- [ ] Verificar logs en CloudWatch

### Frontend
- [ ] Página de login carga correctamente
- [ ] Login funciona
- [ ] Dashboard muestra datos
- [ ] CRUD de clientes funciona
- [ ] CRUD de órdenes funciona
- [ ] Navegación funciona
- [ ] Responsive design funciona

## 📝 Documentación

- [ ] Actualizar README con URLs de producción
- [ ] Documentar proceso de deploy
- [ ] Documentar variables de entorno
- [ ] Crear guía para nuevos desarrolladores
- [ ] Documentar troubleshooting común

## 🔄 CI/CD (Opcional)

- [ ] Configurar GitHub Actions
- [ ] Configurar deploy automático en push a main
- [ ] Configurar tests automáticos
- [ ] Configurar notificaciones de deploy

## 🌍 Dominio Personalizado (Opcional)

- [ ] Comprar dominio
- [ ] Configurar Route 53
- [ ] Obtener certificado SSL en ACM
- [ ] Configurar CloudFront con dominio
- [ ] Actualizar DNS
- [ ] Verificar acceso por dominio

## 📱 Extras

- [ ] Configurar favicon
- [ ] Configurar meta tags para SEO
- [ ] Configurar PWA (opcional)
- [ ] Configurar Google Analytics (opcional)
- [ ] Configurar Sentry para error tracking (opcional)

## 🎯 Checklist de Verificación Final

### URLs Funcionando
- [ ] Backend API: `https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api`
- [ ] Frontend S3: `http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com`
- [ ] Frontend CloudFront: `https://tu-distribution.cloudfront.net` (si aplica)
- [ ] Dominio personalizado: `https://tudominio.com` (si aplica)

### Funcionalidades
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Crear cliente funciona
- [ ] Listar clientes funciona
- [ ] Crear orden funciona
- [ ] Listar órdenes funciona
- [ ] Actualizar estado de orden funciona
- [ ] Reportes funcionan

### Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] API responde < 1 segundo
- [ ] Imágenes optimizadas
- [ ] Cache configurado correctamente

### Seguridad
- [ ] HTTPS habilitado
- [ ] Tokens JWT funcionan
- [ ] Refresh tokens funcionan
- [ ] CORS configurado
- [ ] Variables sensibles no expuestas

## 📞 Contactos de Emergencia

- **AWS Support**: https://console.aws.amazon.com/support/
- **Documentación Backend**: `backend/deploy.md`
- **Documentación Frontend**: `frontend/DEPLOY.md`
- **Comandos Rápidos**: `frontend/COMANDOS_RAPIDOS.md`

## 🚨 Rollback Plan

Si algo sale mal:

### Backend
```bash
cd backend
npm run remove
# Volver a desplegar versión anterior
git checkout <commit-anterior>
npm run deploy
```

### Frontend
```bash
cd frontend
./rollback.sh
# Seleccionar backup anterior
```

## 📊 Métricas de Éxito

- [ ] Uptime > 99.9%
- [ ] Tiempo de respuesta API < 500ms
- [ ] Tiempo de carga frontend < 2s
- [ ] 0 errores críticos
- [ ] Costos dentro del presupuesto

## 🎉 Deploy Completado

Una vez que todos los checkboxes estén marcados:

1. ✅ Notificar al equipo
2. ✅ Actualizar documentación
3. ✅ Celebrar 🎊

---

**Fecha de Deploy**: _______________
**Desplegado por**: _______________
**Versión**: _______________
**Notas**: _______________

---

## 📚 Recursos Útiles

- [AWS Console](https://console.aws.amazon.com/)
- [CloudWatch Logs](https://console.aws.amazon.com/cloudwatch/)
- [S3 Console](https://console.aws.amazon.com/s3/)
- [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
- [Lambda Console](https://console.aws.amazon.com/lambda/)
- [API Gateway Console](https://console.aws.amazon.com/apigateway/)

## 🆘 Troubleshooting Rápido

### Frontend no carga
```bash
cd frontend
./test-deployment.sh
aws s3 ls s3://lavanderia-frontend-prod --recursive
```

### API no responde
```bash
cd backend
npm run logs
aws lambda get-function --function-name lavanderia-api-prod-api
```

### Error de CORS
- Verificar configuración en `backend/src/index.ts`
- Verificar CORS en S3: `aws s3api get-bucket-cors --bucket lavanderia-frontend-prod`

### Cache no se actualiza
```bash
# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```
