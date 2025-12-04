#!/bin/bash

# Script para probar el deployment del frontend

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
S3_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🧪 Test de Deployment               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# 1. Verificar que el bucket existe
echo -e "${BLUE}🪣 Verificando bucket S3...${NC}"
if aws s3 ls "s3://$BUCKET_NAME" --region $REGION &> /dev/null; then
    echo -e "${GREEN}✅ Bucket existe${NC}"
else
    echo -e "${RED}❌ Bucket no existe${NC}"
    exit 1
fi
echo ""

# 2. Verificar archivos en S3
echo -e "${BLUE}📁 Verificando archivos en S3...${NC}"
FILE_COUNT=$(aws s3 ls s3://$BUCKET_NAME --recursive --region $REGION | wc -l)
if [ $FILE_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Archivos encontrados: $FILE_COUNT${NC}"
else
    echo -e "${RED}❌ No hay archivos en el bucket${NC}"
    exit 1
fi
echo ""

# 3. Verificar index.html
echo -e "${BLUE}📄 Verificando index.html...${NC}"
if aws s3 ls s3://$BUCKET_NAME/index.html --region $REGION &> /dev/null; then
    echo -e "${GREEN}✅ index.html existe${NC}"
else
    echo -e "${RED}❌ index.html no encontrado${NC}"
    exit 1
fi
echo ""

# 4. Test HTTP del sitio
echo -e "${BLUE}🌐 Probando acceso HTTP...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $S3_URL)
if [ $HTTP_CODE -eq 200 ]; then
    echo -e "${GREEN}✅ Sitio accesible (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Error de acceso (HTTP $HTTP_CODE)${NC}"
    exit 1
fi
echo ""

# 5. Verificar contenido HTML
echo -e "${BLUE}📝 Verificando contenido...${NC}"
CONTENT=$(curl -s $S3_URL)
if echo "$CONTENT" | grep -q "<!DOCTYPE html>"; then
    echo -e "${GREEN}✅ HTML válido${NC}"
else
    echo -e "${RED}❌ HTML inválido${NC}"
    exit 1
fi
echo ""

# 6. Verificar assets
echo -e "${BLUE}🎨 Verificando assets...${NC}"
ASSETS_COUNT=$(aws s3 ls s3://$BUCKET_NAME/assets/ --recursive --region $REGION 2>/dev/null | wc -l)
if [ $ASSETS_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Assets encontrados: $ASSETS_COUNT${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontraron assets (puede ser normal)${NC}"
fi
echo ""

# 7. Verificar configuración de CORS
echo -e "${BLUE}🔀 Verificando CORS...${NC}"
if aws s3api get-bucket-cors --bucket $BUCKET_NAME --region $REGION &> /dev/null; then
    echo -e "${GREEN}✅ CORS configurado${NC}"
else
    echo -e "${YELLOW}⚠️  CORS no configurado${NC}"
fi
echo ""

# 8. Verificar política del bucket
echo -e "${BLUE}📜 Verificando política del bucket...${NC}"
if aws s3api get-bucket-policy --bucket $BUCKET_NAME --region $REGION &> /dev/null; then
    echo -e "${GREEN}✅ Política configurada${NC}"
else
    echo -e "${RED}❌ Política no configurada${NC}"
fi
echo ""

# 9. Verificar configuración de website
echo -e "${BLUE}🌐 Verificando configuración de website...${NC}"
WEBSITE_CONFIG=$(aws s3api get-bucket-website --bucket $BUCKET_NAME --region $REGION 2>/dev/null)
if [ ! -z "$WEBSITE_CONFIG" ]; then
    echo -e "${GREEN}✅ Website configurado${NC}"
else
    echo -e "${RED}❌ Website no configurado${NC}"
fi
echo ""

# 10. Test de rutas (React Router)
echo -e "${BLUE}🛣️  Probando rutas de React Router...${NC}"
TEST_ROUTES=("/login" "/dashboard" "/clientes")
for route in "${TEST_ROUTES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$S3_URL$route")
    if [ $HTTP_CODE -eq 200 ]; then
        echo -e "   ${GREEN}✅ $route (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "   ${YELLOW}⚠️  $route (HTTP $HTTP_CODE)${NC}"
    fi
done
echo ""

# Resumen
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Tests Completados                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "   URL: ${GREEN}$S3_URL${NC}"
echo -e "   Archivos: ${GREEN}$FILE_COUNT${NC}"
echo -e "   Estado: ${GREEN}Funcionando correctamente${NC}"
echo ""
echo -e "${YELLOW}💡 Abre la URL en tu navegador para probar la aplicación${NC}"
echo ""
