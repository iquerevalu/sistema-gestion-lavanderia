# Guía de Despliegue AWS Serverless

## Prerrequisitos

1. **AWS CLI** instalado y configurado
   ```bash
   aws configure
   ```

2. **Serverless Framework** instalado globalmente
   ```bash
   npm install -g serverless
   ```

3. **Node.js 18+** instalado

## Paso 1: Configurar Aurora Serverless

### Crear Aurora Serverless MySQL

```bash
# Crear cluster Aurora Serverless v2
aws rds create-db-cluster \
  --db-cluster-identifier lavanderia-db-cluster \
  --engine aurora-mysql \
  --engine-version 8.0.mysql_aurora.3.02.0 \
  --master-username admin \
  --master-user-password YourSecurePassword123! \
  --database-name lavanderia_db \
  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=1 \
  --enable-http-endpoint

# Crear instancia del cluster
aws rds create-db-instance \
  --db-instance-identifier lavanderia-db-instance \
  --db-instance-class db.serverless \
  --engine aurora-mysql \
  --db-cluster-identifier lavanderia-db-cluster
```

### Obtener el endpoint del cluster

```bash
aws rds describe-db-clusters \
  --db-cluster-identifier lavanderia-db-cluster \
  --query 'DBClusters[0].Endpoint' \
  --output text
```

## Paso 2: Configurar Secrets Manager

```bash
# Crear secret para credenciales de BD
aws secretsmanager create-secret \
  --name lavanderia/db/credentials \
  --description "Credenciales de base de datos" \
  --secret-string '{
    "username":"admin",
    "password":"YourSecurePassword123!",
    "host":"lavanderia-db-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com",
    "port":3306,
    "database":"lavanderia_db"
  }'

# Crear secret para JWT
aws secretsmanager create-secret \
  --name lavanderia/jwt/secret \
  --description "JWT Secret Key" \
  --secret-string '{"secret":"your-super-secret-jwt-key-change-this"}'
```

## Paso 3: Migrar Base de Datos

### Opción A: Desde local (recomendado para primera vez)

```bash
# Conectarse a Aurora desde local
mysql -h lavanderia-db-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com \
  -u admin -p lavanderia_db

# Ejecutar scripts de migración
mysql -h lavanderia-db-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com \
  -u admin -p lavanderia_db < database/schema.sql

mysql -h lavanderia-db-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com \
  -u admin -p lavanderia_db < database/seed.sql
```

### Opción B: Usando Lambda (para actualizaciones)

Crear una función Lambda separada para migraciones.

## Paso 4: Configurar Variables de Entorno

Crear archivo `.env` en la carpeta backend:

```bash
DB_HOST=lavanderia-db-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=lavanderia_db
DB_USER=admin
DB_PASSWORD=YourSecurePassword123!
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

## Paso 5: Build y Deploy del Backend

```bash
# Compilar TypeScript
npm run build

# Deploy a AWS
serverless deploy --stage prod

# Ver logs
serverless logs -f api --stage prod --tail
```

## Paso 6: Deploy del Frontend a S3 + CloudFront

### Crear bucket S3

```bash
# Crear bucket
aws s3 mb s3://lavanderia-frontend-prod

# Configurar como sitio web estático
aws s3 website s3://lavanderia-frontend-prod \
  --index-document index.html \
  --error-document index.html

# Configurar política pública
aws s3api put-bucket-policy \
  --bucket lavanderia-frontend-prod \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lavanderia-frontend-prod/*"
    }]
  }'
```

### Build y Deploy Frontend

```bash
cd frontend

# Configurar API URL
echo "VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api" > .env.production

# Build
npm run build

# Deploy a S3
aws s3 sync dist/ s3://lavanderia-frontend-prod --delete

# Invalidar cache de CloudFront (si existe)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Crear distribución CloudFront

```bash
aws cloudfront create-distribution \
  --origin-domain-name lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

## Paso 7: Configurar Dominio Personalizado (Opcional)

### En API Gateway

```bash
# Crear certificado SSL en ACM
aws acm request-certificate \
  --domain-name api.tudominio.com \
  --validation-method DNS

# Configurar dominio personalizado en API Gateway
aws apigatewayv2 create-domain-name \
  --domain-name api.tudominio.com \
  --domain-name-configurations CertificateArn=arn:aws:acm:...
```

### En CloudFront

```bash
# Asociar certificado SSL a CloudFront
# Configurar Route53 para apuntar a CloudFront
```

## Comandos Útiles

```bash
# Ver información del deploy
serverless info --stage prod

# Ver logs en tiempo real
serverless logs -f api --stage prod --tail

# Eliminar stack (cuidado!)
serverless remove --stage prod

# Deploy solo de una función
serverless deploy function -f api --stage prod

# Invocar función localmente
serverless invoke local -f api

# Ejecutar offline
serverless offline
```

## Monitoreo

### CloudWatch Logs

```bash
# Ver logs
aws logs tail /aws/lambda/lavanderia-backend-prod-api --follow

# Crear alarma para errores
aws cloudwatch put-metric-alarm \
  --alarm-name lavanderia-api-errors \
  --alarm-description "Alerta de errores en API" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

## Costos Estimados (uso moderado)

- **Lambda**: ~$5-10/mes (1M requests)
- **Aurora Serverless v2**: ~$30-50/mes (0.5-1 ACU)
- **API Gateway**: ~$3.50/mes (1M requests)
- **S3**: ~$1/mes (5GB storage)
- **CloudFront**: ~$1/mes (10GB transfer)

**Total estimado**: $40-65/mes

## Troubleshooting

### Error de conexión a BD

```bash
# Verificar security group
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verificar que Lambda tenga acceso a VPC
# Agregar VPC config en serverless.yml
```

### Error de timeout

```bash
# Aumentar timeout en serverless.yml
timeout: 30  # segundos
```

### Error de memoria

```bash
# Aumentar memoria en serverless.yml
memorySize: 1024  # MB
```
