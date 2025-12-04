#!/bin/bash

# Script de rollback para el frontend
# Permite volver a una versión anterior del deployment

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
BACKUP_BUCKET="lavanderia-frontend-backups"
DISTRIBUTION_ID="" # Tu CloudFront Distribution ID

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ⏮️  Rollback Frontend               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Error: AWS CLI no está instalado${NC}"
    exit 1
fi

# Verificar credenciales
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ Error: Credenciales AWS no configuradas${NC}"
    exit 1
fi

# Verificar que existe el bucket de backups
echo -e "${BLUE}🔍 Verificando backups disponibles...${NC}"
if ! aws s3 ls "s3://$BACKUP_BUCKET" --region $REGION &> /dev/null; then
    echo -e "${RED}❌ No existe bucket de backups${NC}"
    echo -e "${YELLOW}Crea backups antes de hacer rollback${NC}"
    exit 1
fi

# Listar backups disponibles
echo -e "${BLUE}📦 Backups disponibles:${NC}"
echo ""

BACKUPS=$(aws s3 ls s3://$BACKUP_BUCKET/ --region $REGION | grep "PRE" | awk '{print $2}' | sed 's/\///')

if [ -z "$BACKUPS" ]; then
    echo -e "${RED}❌ No hay backups disponibles${NC}"
    exit 1
fi

# Mostrar lista numerada
i=1
declare -a backup_array
while IFS= read -r backup; do
    backup_array+=("$backup")
    echo -e "   ${GREEN}$i)${NC} $backup"
    ((i++))
done <<< "$BACKUPS"

echo ""
echo -e "${YELLOW}Selecciona el número del backup a restaurar (0 para cancelar):${NC}"
read -p "> " selection

# Validar selección
if [ "$selection" -eq 0 ]; then
    echo -e "${YELLOW}Rollback cancelado${NC}"
    exit 0
fi

if [ "$selection" -lt 1 ] || [ "$selection" -gt "${#backup_array[@]}" ]; then
    echo -e "${RED}❌ Selección inválida${NC}"
    exit 1
fi

# Obtener backup seleccionado
SELECTED_BACKUP="${backup_array[$((selection-1))]}"
echo ""
echo -e "${BLUE}📦 Backup seleccionado: ${GREEN}$SELECTED_BACKUP${NC}"
echo ""

# Confirmar
echo -e "${YELLOW}⚠️  ADVERTENCIA: Esto reemplazará el contenido actual del sitio${NC}"
read -p "¿Continuar con el rollback? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Rollback cancelado${NC}"
    exit 0
fi

# Crear backup del estado actual antes de hacer rollback
echo -e "${BLUE}💾 Creando backup del estado actual...${NC}"
CURRENT_BACKUP="backup-before-rollback-$(date +%Y%m%d-%H%M%S)"
aws s3 sync s3://$BUCKET_NAME/ s3://$BACKUP_BUCKET/$CURRENT_BACKUP/ \
    --region $REGION \
    --quiet

echo -e "${GREEN}✅ Backup actual guardado: $CURRENT_BACKUP${NC}"
echo ""

# Limpiar bucket actual
echo -e "${BLUE}🗑️  Limpiando bucket actual...${NC}"
aws s3 rm s3://$BUCKET_NAME/ --recursive --region $REGION --quiet
echo -e "${GREEN}✅ Bucket limpiado${NC}"
echo ""

# Restaurar backup
echo -e "${BLUE}📥 Restaurando backup...${NC}"
aws s3 sync s3://$BACKUP_BUCKET/$SELECTED_BACKUP/ s3://$BUCKET_NAME/ \
    --region $REGION \
    --quiet

echo -e "${GREEN}✅ Backup restaurado${NC}"
echo ""

# Invalidar cache de CloudFront
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "${BLUE}🔄 Invalidando cache de CloudFront...${NC}"
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    echo -e "${GREEN}✅ Cache invalidado (ID: $INVALIDATION_ID)${NC}"
    echo ""
fi

# Verificar restauración
echo -e "${BLUE}🧪 Verificando restauración...${NC}"
FILE_COUNT=$(aws s3 ls s3://$BUCKET_NAME --recursive --region $REGION | wc -l)
echo -e "${GREEN}✅ Archivos restaurados: $FILE_COUNT${NC}"
echo ""

# Resumen
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Rollback Completado               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "   Backup restaurado: ${GREEN}$SELECTED_BACKUP${NC}"
echo -e "   Backup del estado anterior: ${GREEN}$CURRENT_BACKUP${NC}"
echo -e "   Archivos: ${GREEN}$FILE_COUNT${NC}"
echo ""
echo -e "${BLUE}🌐 URL:${NC}"
echo -e "   ${GREEN}http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com${NC}"
echo ""
echo -e "${YELLOW}💡 Verifica que la aplicación funcione correctamente${NC}"
echo ""
