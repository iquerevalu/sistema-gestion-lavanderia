#!/bin/bash

# Script de deploy del frontend a S3 + CloudFront
# Uso: ./deploy-s3.sh [--skip-build] [--no-cache-invalidation]

set -e  # Exit on error

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración
BUCKET_NAME="lavanderia-frontend-prod"
REGION="us-east-1"
DISTRIBUTION_ID="" # Agregar después de crear CloudFront (ej: E1234567890ABC)
BACKUP_BUCKET="lavanderia-frontend-backups"
CREATE_BACKUP=true

# Flags
SKIP_BUILD=false
NO_CACHE_INVALIDATION=false

# Parsear argumentos
for arg in "$@"; do
    case $arg in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --no-cache-invalidation)
            NO_CACHE_INVALIDATION=true
            shift
            ;;
        --help)
            echo "Uso: ./deploy-s3.sh [opciones]"
            echo ""
            echo "Opciones:"
            echo "  --skip-build              Omitir el build (usar dist/ existente)"
            echo "  --no-cache-invalidation   No invalidar cache de CloudFront"
            echo "  --help                    Mostrar esta ayuda"
            exit 0
            ;;
    esac
done

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Deploy Frontend a AWS S3         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encuentra package.json${NC}"
    echo -e "${YELLOW}Ejecuta este script desde el directorio frontend/${NC}"
    exit 1
fi

# Verificar que existe .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: No se encuentra .env.production${NC}"
    echo -e "${YELLOW}Crea el archivo .env.production con VITE_API_URL${NC}"
    exit 1
fi

# Mostrar configuración
echo -e "${BLUE}📋 Configuración:${NC}"
echo -e "   Bucket: ${GREEN}$BUCKET_NAME${NC}"
echo -e "   Region: ${GREEN}$REGION${NC}"
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "   CloudFront: ${GREEN}$DISTRIBUTION_ID${NC}"
else
    echo -e "   CloudFront: ${YELLOW}No configurado${NC}"
fi
echo ""

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Error: AWS CLI no está instalado${NC}"
    exit 1
fi

# Verificar credenciales AWS
echo -e "${BLUE}🔐 Verificando credenciales AWS...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ Error: Credenciales AWS no configuradas${NC}"
    echo -e "${YELLOW}Ejecuta: aws configure${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Credenciales verificadas${NC}"
echo ""

# 1. Build del proyecto
if [ "$SKIP_BUILD" = false ]; then
    echo -e "${BLUE}📦 Building proyecto...${NC}"
    
    # Verificar que existe node_modules
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠️  node_modules no encontrado, instalando dependencias...${NC}"
        npm install
    fi
    
    # Limpiar build anterior
    if [ -d "dist" ]; then
        rm -rf dist
    fi
    
    # Build
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error en el build${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Build completado${NC}"
    echo ""
else
    echo -e "${YELLOW}⏭️  Omitiendo build (usando dist/ existente)${NC}"
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Error: No existe el directorio dist/${NC}"
        exit 1
    fi
    echo ""
fi

# Verificar que el bucket existe
echo -e "${BLUE}🪣 Verificando bucket S3...${NC}"
if ! aws s3 ls "s3://$BUCKET_NAME" --region $REGION &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bucket no existe, creándolo...${NC}"
    
    aws s3 mb s3://$BUCKET_NAME --region $REGION
    
    # Configurar como sitio web
    aws s3 website s3://$BUCKET_NAME \
        --index-document index.html \
        --error-document index.html \
        --region $REGION
    
    echo -e "${GREEN}✅ Bucket creado y configurado${NC}"
else
    echo -e "${GREEN}✅ Bucket existe${NC}"
fi
echo ""

# Crear backup antes de deploy
if [ "$CREATE_BACKUP" = true ]; then
    # Verificar si hay contenido para hacer backup
    CURRENT_FILES=$(aws s3 ls s3://$BUCKET_NAME --recursive --region $REGION 2>/dev/null | wc -l)
    
    if [ $CURRENT_FILES -gt 0 ]; then
        echo -e "${BLUE}💾 Creando backup del deployment actual...${NC}"
        
        # Crear bucket de backups si no existe
        if ! aws s3 ls "s3://$BACKUP_BUCKET" --region $REGION &> /dev/null; then
            aws s3 mb s3://$BACKUP_BUCKET --region $REGION
            echo -e "${GREEN}✅ Bucket de backups creado${NC}"
        fi
        
        # Crear backup con timestamp
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        aws s3 sync s3://$BUCKET_NAME/ s3://$BACKUP_BUCKET/$BACKUP_NAME/ \
            --region $REGION \
            --quiet
        
        echo -e "${GREEN}✅ Backup creado: $BACKUP_NAME${NC}"
        
        # Mantener solo los últimos 5 backups
        BACKUP_COUNT=$(aws s3 ls s3://$BACKUP_BUCKET/ --region $REGION | grep "PRE" | wc -l)
        if [ $BACKUP_COUNT -gt 5 ]; then
            echo -e "${YELLOW}   Limpiando backups antiguos...${NC}"
            # Aquí podrías agregar lógica para eliminar backups viejos
        fi
        echo ""
    fi
fi

# 2. Sync a S3
echo -e "${BLUE}☁️  Subiendo archivos a S3...${NC}"
echo -e "${YELLOW}   Esto puede tomar unos minutos...${NC}"

aws s3 sync dist/ s3://$BUCKET_NAME \
    --delete \
    --region $REGION \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.map"

# Subir index.html sin cache
aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
    --region $REGION \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error subiendo a S3${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivos subidos a S3${NC}"
echo ""

# 3. Invalidar cache de CloudFront (si existe)
if [ ! -z "$DISTRIBUTION_ID" ] && [ "$NO_CACHE_INVALIDATION" = false ]; then
    echo -e "${BLUE}🔄 Invalidando cache de CloudFront...${NC}"
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error invalidando cache${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Cache invalidado (ID: $INVALIDATION_ID)${NC}"
    echo -e "${YELLOW}   La propagación puede tomar 5-10 minutos${NC}"
    echo ""
fi

# 4. Mostrar resumen
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🎉 Deploy Completado Exitosamente   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 URLs de Acceso:${NC}"
echo -e "   S3 Website: ${GREEN}http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com${NC}"

if [ ! -z "$DISTRIBUTION_ID" ]; then
    CLOUDFRONT_URL=$(aws cloudfront get-distribution \
        --id $DISTRIBUTION_ID \
        --query 'Distribution.DomainName' \
        --output text 2>/dev/null)
    
    if [ ! -z "$CLOUDFRONT_URL" ]; then
        echo -e "   CloudFront: ${GREEN}https://$CLOUDFRONT_URL${NC}"
    fi
fi

echo ""
echo -e "${BLUE}📊 Estadísticas:${NC}"
TOTAL_SIZE=$(du -sh dist/ | cut -f1)
FILE_COUNT=$(find dist/ -type f | wc -l)
echo -e "   Tamaño total: ${GREEN}$TOTAL_SIZE${NC}"
echo -e "   Archivos: ${GREEN}$FILE_COUNT${NC}"
echo ""

# Mostrar API URL configurada
API_URL=$(grep VITE_API_URL .env.production | cut -d '=' -f2)
echo -e "${BLUE}🔗 API configurada:${NC}"
echo -e "   ${GREEN}$API_URL${NC}"
echo ""

echo -e "${YELLOW}💡 Tip: Prueba la aplicación en tu navegador${NC}"
echo ""
