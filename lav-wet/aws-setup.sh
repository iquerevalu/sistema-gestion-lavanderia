#!/bin/bash

# Script completo de setup de AWS para el proyecto Lavandería

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuración
PROJECT_NAME="lavanderia"
REGION="us-east-1"
DB_CLUSTER_NAME="${PROJECT_NAME}-db-cluster"
DB_INSTANCE_NAME="${PROJECT_NAME}-db-instance"
DB_NAME="${PROJECT_NAME}_db"
DB_USER="admin"
BUCKET_NAME="${PROJECT_NAME}-frontend-prod"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  AWS Serverless Setup - Lavandería    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI encontrado${NC}"

# Solicitar contraseña de BD
echo -e "${YELLOW}📝 Ingresa una contraseña segura para la base de datos:${NC}"
read -s DB_PASSWORD
echo ""

# 1. Crear Aurora Serverless
echo -e "${BLUE}🗄️  Creando Aurora Serverless MySQL...${NC}"

aws rds create-db-cluster \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --engine aurora-mysql \
  --engine-version 8.0.mysql_aurora.3.02.0 \
  --master-username $DB_USER \
  --master-user-password $DB_PASSWORD \
  --database-name $DB_NAME \
  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=1 \
  --enable-http-endpoint \
  --region $REGION

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cluster Aurora creado${NC}"
else
    echo -e "${YELLOW}⚠️  El cluster puede ya existir${NC}"
fi

# Crear instancia
aws rds create-db-instance \
  --db-instance-identifier $DB_INSTANCE_NAME \
  --db-instance-class db.serverless \
  --engine aurora-mysql \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --region $REGION

echo -e "${BLUE}⏳ Esperando que el cluster esté disponible (esto puede tomar 5-10 minutos)...${NC}"

aws rds wait db-cluster-available \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --region $REGION

# Obtener endpoint
DB_ENDPOINT=$(aws rds describe-db-clusters \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --query 'DBClusters[0].Endpoint' \
  --output text \
  --region $REGION)

echo -e "${GREEN}✅ Aurora Serverless listo${NC}"
echo -e "${BLUE}   Endpoint: $DB_ENDPOINT${NC}"

# 2. Crear Secrets Manager
echo -e "${BLUE}🔐 Creando secrets en AWS Secrets Manager...${NC}"

aws secretsmanager create-secret \
  --name ${PROJECT_NAME}/db/credentials \
  --description "Credenciales de base de datos" \
  --secret-string "{
    \"username\":\"$DB_USER\",
    \"password\":\"$DB_PASSWORD\",
    \"host\":\"$DB_ENDPOINT\",
    \"port\":3306,
    \"database\":\"$DB_NAME\"
  }" \
  --region $REGION

# Generar JWT secret aleatorio
JWT_SECRET=$(openssl rand -base64 32)

aws secretsmanager create-secret \
  --name ${PROJECT_NAME}/jwt/secret \
  --description "JWT Secret Key" \
  --secret-string "{\"secret\":\"$JWT_SECRET\"}" \
  --region $REGION

echo -e "${GREEN}✅ Secrets creados${NC}"

# 3. Crear bucket S3 para frontend
echo -e "${BLUE}☁️  Creando bucket S3 para frontend...${NC}"

aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configurar como sitio web
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html

# Política pública
aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [{
      \"Sid\": \"PublicReadGetObject\",
      \"Effect\": \"Allow\",
      \"Principal\": \"*\",
      \"Action\": \"s3:GetObject\",
      \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
    }]
  }"

echo -e "${GREEN}✅ Bucket S3 creado${NC}"

# 4. Crear archivo .env para backend
echo -e "${BLUE}📝 Creando archivo .env para backend...${NC}"

cat > backend/.env << EOF
DB_HOST=$DB_ENDPOINT
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
AWS_REGION=$REGION
EOF

echo -e "${GREEN}✅ Archivo .env creado${NC}"

# 5. Resumen
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Setup Completado Exitosamente     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Información de recursos creados:${NC}"
echo ""
echo -e "${YELLOW}Aurora Serverless:${NC}"
echo -e "  Cluster: $DB_CLUSTER_NAME"
echo -e "  Endpoint: $DB_ENDPOINT"
echo -e "  Database: $DB_NAME"
echo -e "  Usuario: $DB_USER"
echo ""
echo -e "${YELLOW}S3 Bucket:${NC}"
echo -e "  Nombre: $BUCKET_NAME"
echo -e "  URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo -e "${YELLOW}Secrets Manager:${NC}"
echo -e "  DB Credentials: ${PROJECT_NAME}/db/credentials"
echo -e "  JWT Secret: ${PROJECT_NAME}/jwt/secret"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo -e "  1. Migrar base de datos:"
echo -e "     ${GREEN}mysql -h $DB_ENDPOINT -u $DB_USER -p $DB_NAME < backend/database/schema.sql${NC}"
echo ""
echo -e "  2. Deploy del backend:"
echo -e "     ${GREEN}cd backend && serverless deploy --stage prod${NC}"
echo ""
echo -e "  3. Configurar frontend con API URL y hacer deploy:"
echo -e "     ${GREEN}cd frontend && ./deploy-s3.sh${NC}"
echo ""
