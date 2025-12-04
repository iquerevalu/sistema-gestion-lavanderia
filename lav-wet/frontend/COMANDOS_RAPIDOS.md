# 🚀 Comandos Rápidos - Frontend

Guía de referencia rápida para el deployment del frontend.

## 📦 Setup Inicial (Solo Primera Vez)

```bash
# 1. Configurar AWS CLI
aws configure

# 2. Setup automático de AWS
chmod +x setup-aws-frontend.sh
./setup-aws-frontend.sh

# 3. Configurar variables de entorno
cp .env.production.example .env.production
# Editar .env.production con tu API URL
```

## 🚀 Deploy

```bash
# Deploy completo (recomendado)
./deploy-s3.sh

# Deploy rápido (sin rebuild)
./deploy-s3.sh --skip-build

# Deploy sin invalidar cache
./deploy-s3.sh --no-cache-invalidation
```

## 🧪 Testing

```bash
# Test completo del deployment
./test-deployment.sh

# Verificar archivos en S3
aws s3 ls s3://lavanderia-frontend-prod --recursive

# Test HTTP
curl -I http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

## ⏮️ Rollback

```bash
# Rollback interactivo
./rollback.sh

# Ver backups disponibles
aws s3 ls s3://lavanderia-frontend-backups/
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar dev server
npm run dev

# Build local
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 🌐 URLs Importantes

```bash
# S3 Website
http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com

# CloudFront (si está configurado)
https://tu-distribution.cloudfront.net

# API Backend
https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
```

## 🔍 Diagnóstico

```bash
# Verificar credenciales AWS
aws sts get-caller-identity

# Ver configuración del bucket
aws s3api get-bucket-website --bucket lavanderia-frontend-prod

# Ver política del bucket
aws s3api get-bucket-policy --bucket lavanderia-frontend-prod

# Ver CORS
aws s3api get-bucket-cors --bucket lavanderia-frontend-prod

# Listar distribuciones CloudFront
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName]' --output table
```

## 🗑️ Limpieza

```bash
# Limpiar bucket (¡CUIDADO!)
aws s3 rm s3://lavanderia-frontend-prod --recursive

# Eliminar bucket
aws s3 rb s3://lavanderia-frontend-prod --force

# Limpiar build local
rm -rf dist node_modules
```

## ☁️ CloudFront

```bash
# Crear distribución
aws cloudfront create-distribution \
  --origin-domain-name lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html

# Invalidar cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

# Ver estado de invalidación
aws cloudfront get-invalidation \
  --distribution-id E1234567890ABC \
  --id I1234567890ABC

# Listar distribuciones
aws cloudfront list-distributions
```

## 📊 Monitoreo

```bash
# Ver tamaño del bucket
aws s3 ls s3://lavanderia-frontend-prod --recursive --human-readable --summarize

# Contar archivos
aws s3 ls s3://lavanderia-frontend-prod --recursive | wc -l

# Ver últimos archivos modificados
aws s3 ls s3://lavanderia-frontend-prod --recursive | sort -k1,2 | tail -10
```

## 🔐 Seguridad

```bash
# Ver configuración de acceso público
aws s3api get-public-access-block --bucket lavanderia-frontend-prod

# Actualizar política del bucket
aws s3api put-bucket-policy \
  --bucket lavanderia-frontend-prod \
  --policy file://bucket-policy.json

# Ver ACL del bucket
aws s3api get-bucket-acl --bucket lavanderia-frontend-prod
```

## 💰 Costos

```bash
# Ver uso de S3 (requiere CloudWatch)
aws cloudwatch get-metric-statistics \
  --namespace AWS/S3 \
  --metric-name BucketSizeBytes \
  --dimensions Name=BucketName,Value=lavanderia-frontend-prod \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-12-31T23:59:59Z \
  --period 86400 \
  --statistics Average
```

## 🐛 Troubleshooting

```bash
# Error: Access Denied
aws s3api put-bucket-policy --bucket lavanderia-frontend-prod --policy file://bucket-policy.json

# Error: 404 en rutas
aws s3 website s3://lavanderia-frontend-prod \
  --index-document index.html \
  --error-document index.html

# Verificar logs de CloudFront
aws cloudfront get-distribution-config --id E1234567890ABC

# Test de conectividad
curl -v http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

## 📝 Variables de Entorno

### Desarrollo (.env)
```bash
VITE_API_URL=http://localhost:3001/api
```

### Producción (.env.production)
```bash
VITE_API_URL=https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
```

## 🔄 CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: ./deploy-s3.sh --skip-build
```

## 📚 Recursos

- [Documentación completa](./DEPLOY.md)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [CloudFront Docs](https://docs.aws.amazon.com/cloudfront/)
- [Vite Docs](https://vitejs.dev/)
