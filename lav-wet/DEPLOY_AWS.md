# 🚀 Guía Completa de Despliegue AWS Serverless

## Arquitectura Final

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIOS                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront (CDN)                          │
│              https://d123abc.cloudfront.net                  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────────┐
│   S3 Bucket  │          │   API Gateway    │
│   (Frontend) │          │  /prod/api/*     │
│   React App  │          └────────┬─────────┘
└──────────────┘                   │
                                   ▼
                          ┌─────────────────┐
                          │  Lambda Function │
                          │  Express + Node  │
                          └────────┬─────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌──────────────────┐         ┌──────────────────┐
          │ Aurora Serverless │         │ Secrets Manager  │
          │     MySQL 8.0     │         │  (Credentials)   │
          └──────────────────┘         └──────────────────┘
```

## 📋 Prerrequisitos

### 1. Herramientas Necesarias

```bash
# AWS CLI
aws --version  # Debe ser 2.x

# Node.js
node --version  # Debe ser 18.x o superior

# Serverless Framework
npm install -g serverless
serverless --version

# MySQL Client (para migraciones)
mysql --version
```

### 2. Configurar AWS CLI

```bash
aws configure
# AWS Access Key ID: tu-access-key
# AWS Secret Access Key: tu-secret-key
# Default region: us-east-1
# Default output format: json
```

### 3. Verificar Permisos IAM

Tu usuario IAM necesita permisos para:
- Lambda
- API Gateway
- RDS
- S3
- CloudFront
- Secrets Manager
- CloudWatch Logs

## 🎯 Despliegue Paso a Paso

### Paso 1: Setup Automático de AWS

```bash
# Dar permisos de ejecución
chmod +x aws-setup.sh

# Ejecutar script de setup
./aws-setup.sh
```

Este script creará:
- ✅ Aurora Serverless MySQL cluster
- ✅ Secrets Manager con credenciales
- ✅ S3 Bucket para frontend
- ✅ Archivo .env configurado

**Tiempo estimado**: 10-15 minutos

### Paso 2: Migrar Base de Datos

```bash
# Obtener endpoint de Aurora
DB_ENDPOINT=$(aws rds describe-db-clusters \
  --db-cluster-identifier lavanderia-db-cluster \
  --query 'DBClusters[0].Endpoint' \
  --output text)

# Ejecutar schema
mysql -h $DB_ENDPOINT -u admin -p lavanderia_db < backend/database/schema.sql

# Ejecutar seeds (datos iniciales)
mysql -h $DB_ENDPOINT -u admin -p lavanderia_db < backend/database/seed.sql
```

### Paso 3: Deploy del Backend

```bash
cd backend

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Deploy a AWS
serverless deploy --stage prod

# Guardar la URL del API Gateway que aparece en el output
# Ejemplo: https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

**Output esperado:**
```
✔ Service deployed to stack lavanderia-backend-prod

endpoint: ANY - https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/{proxy+}
functions:
  api: lavanderia-backend-prod-api
```

### Paso 4: Configurar Frontend

```bash
cd frontend

# Crear archivo .env.production
echo "VITE_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/api" > .env.production

# Reemplazar abc123xyz con tu API Gateway ID real
```

### Paso 5: Deploy del Frontend

```bash
# Dar permisos de ejecución
chmod +x deploy-s3.sh

# Build y deploy
./deploy-s3.sh
```

**URL del frontend:**
```
http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

### Paso 6: Configurar CloudFront (Opcional pero Recomendado)

```bash
# Crear distribución CloudFront
aws cloudfront create-distribution \
  --origin-domain-name lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html \
  --query 'Distribution.DomainName' \
  --output text
```

Actualizar `deploy-s3.sh` con el Distribution ID obtenido.

## 🔧 Configuración Avanzada

### Variables de Entorno en Lambda

Editar `backend/serverless.yml`:

```yaml
provider:
  environment:
    NODE_ENV: production
    DB_HOST: ${env:DB_HOST}
    DB_PORT: ${env:DB_PORT}
    DB_NAME: ${env:DB_NAME}
    DB_USER: ${env:DB_USER}
    DB_PASSWORD: ${env:DB_PASSWORD}
    JWT_SECRET: ${env:JWT_SECRET}
```

### Configurar VPC (para mayor seguridad)

```yaml
provider:
  vpc:
    securityGroupIds:
      - sg-xxxxxxxxx
    subnetIds:
      - subnet-xxxxxxxxx
      - subnet-yyyyyyyyy
```

### Configurar Custom Domain

```bash
# Crear certificado SSL
aws acm request-certificate \
  --domain-name api.tudominio.com \
  --validation-method DNS

# Configurar en API Gateway
serverless create_domain --stage prod
```

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Logs de Lambda
serverless logs -f api --stage prod --tail

# Logs de CloudWatch
aws logs tail /aws/lambda/lavanderia-backend-prod-api --follow
```

### Métricas en CloudWatch

```bash
# Ver métricas de Lambda
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=lavanderia-backend-prod-api \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### Crear Alarmas

```bash
# Alarma para errores
aws cloudwatch put-metric-alarm \
  --alarm-name lavanderia-api-errors \
  --alarm-description "Alerta cuando hay más de 10 errores" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=lavanderia-backend-prod-api
```

## 🔄 Actualizaciones

### Actualizar Backend

```bash
cd backend
npm run build
serverless deploy --stage prod
```

### Actualizar Frontend

```bash
cd frontend
npm run build
./deploy-s3.sh
```

### Rollback

```bash
# Ver deployments anteriores
serverless deploy list --stage prod

# Rollback a versión anterior
serverless rollback --timestamp TIMESTAMP --stage prod
```

## 💰 Costos Estimados

### Uso Bajo (< 10,000 requests/mes)
- Lambda: $0-1
- Aurora Serverless: $25-30
- API Gateway: $0-1
- S3: $0-1
- CloudFront: $0-1
**Total: ~$27-34/mes**

### Uso Medio (100,000 requests/mes)
- Lambda: $5-8
- Aurora Serverless: $40-50
- API Gateway: $3-5
- S3: $1-2
- CloudFront: $1-3
**Total: ~$50-68/mes**

### Uso Alto (1M requests/mes)
- Lambda: $15-20
- Aurora Serverless: $80-100
- API Gateway: $35-40
- S3: $2-5
- CloudFront: $5-10
**Total: ~$137-175/mes**

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar security group
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verificar que Lambda tenga acceso
# Agregar Lambda a la misma VPC que Aurora
```

### Error: "Timeout"

```yaml
# Aumentar timeout en serverless.yml
provider:
  timeout: 30  # segundos
```

### Error: "Memory exceeded"

```yaml
# Aumentar memoria
provider:
  memorySize: 1024  # MB
```

### Error: "CORS"

Verificar configuración en `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: ['https://tu-cloudfront-url.cloudfront.net'],
  credentials: true
}));
```

## 🔐 Seguridad

### Mejores Prácticas

1. **Usar Secrets Manager** para credenciales
2. **Habilitar WAF** en API Gateway
3. **Configurar VPC** para Lambda y Aurora
4. **Habilitar CloudTrail** para auditoría
5. **Usar HTTPS** siempre (CloudFront)
6. **Implementar rate limiting** en API Gateway
7. **Rotar credenciales** regularmente

### Configurar WAF

```bash
aws wafv2 create-web-acl \
  --name lavanderia-waf \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

## 📚 Recursos Adicionales

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Aurora Serverless Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs de CloudWatch
2. Verifica las variables de entorno
3. Confirma que los security groups permitan el tráfico
4. Revisa la documentación de AWS

## 📝 Checklist de Despliegue

- [ ] AWS CLI configurado
- [ ] Serverless Framework instalado
- [ ] Script aws-setup.sh ejecutado
- [ ] Base de datos migrada
- [ ] Backend desplegado
- [ ] API Gateway URL obtenida
- [ ] Frontend configurado con API URL
- [ ] Frontend desplegado a S3
- [ ] CloudFront configurado (opcional)
- [ ] Dominio personalizado configurado (opcional)
- [ ] Alarmas de CloudWatch configuradas
- [ ] Backup de base de datos configurado
- [ ] Documentación actualizada

¡Listo para producción! 🎉
