#!/bin/bash

# Script de configuración inicial de AWS para el frontend
# Este script configura S3, políticas y opcionalmente CloudFront

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuración
BUCKET_NAME="lavanderia-frontend-prod"
REGION="us-east-1"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ⚙️  Setup AWS Frontend              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Error: AWS CLI no está instalado${NC}"
    exit 1
fi

# Verificar credenciales
echo -e "${BLUE}🔐 Verificando credenciales AWS...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ Error: Credenciales AWS no configuradas${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Credenciales verificadas${NC}"
echo ""

# 1. Crear bucket S3
echo -e "${BLUE}🪣 Creando bucket S3...${NC}"
if aws s3 ls "s3://$BUCKET_NAME" --region $REGION &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bucket ya existe${NC}"
else
    aws s3 mb s3://$BUCKET_NAME --region $REGION
    echo -e "${GREEN}✅ Bucket creado${NC}"
fi
echo ""

# 2. Configurar como sitio web estático
echo -e "${BLUE}🌐 Configurando sitio web estático...${NC}"
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html \
    --region $REGION
echo -e "${GREEN}✅ Sitio web configurado${NC}"
echo ""

# 3. Deshabilitar bloqueo de acceso público
echo -e "${BLUE}🔓 Configurando acceso público...${NC}"
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --region $REGION
echo -e "${GREEN}✅ Acceso público configurado${NC}"
echo ""

# 4. Crear y aplicar política del bucket
echo -e "${BLUE}📜 Aplicando política del bucket...${NC}"

cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file:///tmp/bucket-policy.json \
    --region $REGION

rm /tmp/bucket-policy.json
echo -e "${GREEN}✅ Política aplicada${NC}"
echo ""

# 5. Configurar CORS
echo -e "${BLUE}🔀 Configurando CORS...${NC}"

cat > /tmp/cors-config.json <<EOF
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
EOF

aws s3api put-bucket-cors \
    --bucket $BUCKET_NAME \
    --cors-configuration file:///tmp/cors-config.json \
    --region $REGION

rm /tmp/cors-config.json
echo -e "${GREEN}✅ CORS configurado${NC}"
echo ""

# 6. Preguntar si quiere crear CloudFront
echo -e "${BLUE}☁️  CloudFront Distribution${NC}"
echo -e "${YELLOW}¿Deseas crear una distribución de CloudFront? (recomendado para producción)${NC}"
echo -e "${YELLOW}CloudFront proporciona HTTPS, CDN global y mejor rendimiento${NC}"
read -p "Crear CloudFront? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}📦 Creando distribución de CloudFront...${NC}"
    echo -e "${YELLOW}   Esto puede tomar 15-20 minutos...${NC}"
    
    # Crear distribución
    DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution \
        --origin-domain-name $BUCKET_NAME.s3-website-$REGION.amazonaws.com \
        --default-root-object index.html \
        --query '{Id:Distribution.Id,DomainName:Distribution.DomainName}' \
        --output json)
    
    DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Id')
    CLOUDFRONT_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.DomainName')
    
    echo -e "${GREEN}✅ CloudFront creado${NC}"
    echo -e "${BLUE}   Distribution ID: ${GREEN}$DISTRIBUTION_ID${NC}"
    echo -e "${BLUE}   Domain: ${GREEN}https://$CLOUDFRONT_DOMAIN${NC}"
    echo ""
    
    echo -e "${YELLOW}📝 Actualiza el archivo deploy-s3.sh con:${NC}"
    echo -e "${GREEN}   DISTRIBUTION_ID=\"$DISTRIBUTION_ID\"${NC}"
    echo ""
fi

# Resumen
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Setup Completado                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de Configuración:${NC}"
echo -e "   Bucket: ${GREEN}$BUCKET_NAME${NC}"
echo -e "   Region: ${GREEN}$REGION${NC}"
echo -e "   S3 URL: ${GREEN}http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com${NC}"
echo ""
echo -e "${BLUE}📝 Próximos pasos:${NC}"
echo -e "   1. Configura .env.production con la URL de tu API"
echo -e "   2. Ejecuta: ${GREEN}./deploy-s3.sh${NC}"
echo -e "   3. Prueba la aplicación en el navegador"
echo ""
