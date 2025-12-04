# Deploy del Frontend a AWS S3 + CloudFront

Esta guía explica cómo desplegar el frontend de React en AWS S3 con CloudFront como CDN.

## 📋 Requisitos Previos

- AWS CLI configurado con credenciales
- Node.js y npm instalados
- Backend desplegado (para obtener la URL del API)

## 🏗️ Arquitectura

```
Usuario → CloudFront (CDN) → S3 (Static Website) → API Gateway → Lambda
```

## 🚀 Pasos de Deploy

### 1. Configurar Variables de Entorno

Edita el archivo `.env.production` con la URL de tu API:

```bash
VITE_API_URL=https://tu-api-id.execute-api.us-east-1.amazonaws.com/prod/api
```

### 2. Crear el Bucket S3

```bash
# Crear bucket (nombre debe ser único globalmente)
aws s3 mb s3://lavanderia-frontend-prod --region us-east-1

# Configurar como sitio web estático
aws s3 website s3://lavanderia-frontend-prod \
  --index-document index.html \
  --error-document index.html
```

### 3. Configurar Política del Bucket

Crea un archivo `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lavanderia-frontend-prod/*"
    }
  ]
}
```

Aplica la política:

```bash
aws s3api put-bucket-policy \
  --bucket lavanderia-frontend-prod \
  --policy file://bucket-policy.json
```

### 4. Configurar CORS del Bucket

Crea un archivo `cors-config.json`:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Aplica la configuración:

```bash
aws s3api put-bucket-cors \
  --bucket lavanderia-frontend-prod \
  --cors-configuration file://cors-config.json
```

### 5. Crear Distribución de CloudFront (Opcional pero Recomendado)

CloudFront proporciona:
- HTTPS automático
- CDN global (mejor rendimiento)
- Compresión automática
- Protección DDoS

```bash
# Crear distribución
aws cloudfront create-distribution \
  --origin-domain-name lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

O usa la consola de AWS:
1. Ve a CloudFront → Create Distribution
2. Origin Domain: Selecciona tu bucket S3
3. Origin Path: (vacío)
4. Viewer Protocol Policy: Redirect HTTP to HTTPS
5. Allowed HTTP Methods: GET, HEAD, OPTIONS
6. Compress Objects Automatically: Yes
7. Default Root Object: index.html
8. Custom Error Response:
   - HTTP Error Code: 403
   - Response Page Path: /index.html
   - HTTP Response Code: 200
9. Create Distribution

Guarda el Distribution ID para el script de deploy.

### 6. Ejecutar Deploy

```bash
# Dar permisos de ejecución al script
chmod +x deploy-s3.sh

# Ejecutar deploy
./deploy-s3.sh
```

## 🔧 Script de Deploy

El script `deploy-s3.sh` realiza:

1. ✅ Build del proyecto con Vite
2. ✅ Sync de archivos a S3
3. ✅ Invalidación de cache de CloudFront (si está configurado)
4. ✅ Muestra las URLs de acceso

### Configuración del Script

Edita las variables en `deploy-s3.sh`:

```bash
BUCKET_NAME="lavanderia-frontend-prod"
REGION="us-east-1"
DISTRIBUTION_ID="E1234567890ABC"  # Tu CloudFront Distribution ID
```

## 📝 URLs de Acceso

### Solo S3 (sin CloudFront)
```
http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

### Con CloudFront
```
https://d1234567890abc.cloudfront.net
```

### Con Dominio Personalizado (Opcional)
```
https://app.tudominio.com
```

## 🔐 Configuración de Dominio Personalizado

Si quieres usar tu propio dominio:

1. **Obtener Certificado SSL en ACM**:
   ```bash
   aws acm request-certificate \
     --domain-name app.tudominio.com \
     --validation-method DNS \
     --region us-east-1
   ```

2. **Validar el certificado** siguiendo las instrucciones de AWS

3. **Configurar CloudFront** con el certificado y dominio personalizado

4. **Crear registro CNAME** en tu DNS apuntando a CloudFront

## 🧪 Verificar Deploy

```bash
# Verificar que los archivos están en S3
aws s3 ls s3://lavanderia-frontend-prod/

# Probar la aplicación
curl -I http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com

# Si usas CloudFront
curl -I https://tu-cloudfront-url.cloudfront.net
```

## 🔄 Deploy Continuo

Para automatizar el deploy, puedes:

1. **GitHub Actions**: Crear workflow que ejecute el script en cada push a main
2. **AWS CodePipeline**: Configurar pipeline automático
3. **Script local**: Usar el script `deploy-s3.sh` manualmente

## 💰 Costos Estimados

- **S3**: ~$0.023 por GB almacenado + $0.09 por GB transferido
- **CloudFront**: Primeros 1TB gratis por mes, luego ~$0.085 por GB
- **Estimado mensual**: $5-20 USD para tráfico bajo/medio

## 🐛 Troubleshooting

### Error: Access Denied
- Verifica la política del bucket
- Asegúrate de que el bucket sea público

### Error: 404 en rutas
- Configura error document como `index.html` en S3
- Agrega custom error response en CloudFront

### API no responde
- Verifica la URL en `.env.production`
- Revisa CORS en el backend
- Verifica que el API Gateway esté desplegado

### Cache no se actualiza
- Invalida el cache de CloudFront
- Espera 5-10 minutos para propagación

## 📚 Recursos

- [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
