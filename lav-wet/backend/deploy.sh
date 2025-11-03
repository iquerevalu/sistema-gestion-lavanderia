#!/bin/bash

# Script de deployment para AWS Lambda usando Serverless Framework

set -e  # Salir si hay algún error

echo "🚀 Iniciando deployment del backend serverless..."

# Verificar que estamos en el directorio correcto
if [ ! -f "serverless.yml" ]; then
    echo "❌ Error: No se encontró serverless.yml. Ejecuta este script desde la carpeta backend."
    exit 1
fi

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado."
    exit 1
fi

# Verificar que Serverless Framework está instalado
if ! command -v serverless &> /dev/null; then
    echo "📦 Instalando Serverless Framework..."
    npm install -g serverless
fi

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./deploy.sh [STAGE] [OPCIONES]"
    echo ""
    echo "STAGES:"
    echo "  dev     - Deployment a desarrollo (default)"
    echo "  staging - Deployment a staging"
    echo "  prod    - Deployment a producción"
    echo ""
    echo "OPCIONES:"
    echo "  --remove    - Remover el stack completo"
    echo "  --logs      - Ver logs en tiempo real"
    echo "  --info      - Mostrar información del stack"
    echo "  --help      - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./deploy.sh dev"
    echo "  ./deploy.sh prod"
    echo "  ./deploy.sh dev --remove"
    echo "  ./deploy.sh prod --logs"
}

# Parsear argumentos
STAGE=${1:-dev}
OPTION=${2}

case $OPTION in
    --help)
        show_help
        exit 0
        ;;
    --remove)
        echo "🗑️  Removiendo stack de $STAGE..."
        serverless remove --stage $STAGE
        echo "✅ Stack removido exitosamente"
        exit 0
        ;;
    --logs)
        echo "📋 Mostrando logs de $STAGE..."
        serverless logs -f api -t --stage $STAGE
        exit 0
        ;;
    --info)
        echo "ℹ️  Información del stack $STAGE:"
        serverless info --stage $STAGE
        exit 0
        ;;
esac

# Validar stage
case $STAGE in
    dev|staging|prod)
        echo "🎯 Deploying to: $STAGE"
        ;;
    *)
        echo "❌ Error: Stage '$STAGE' no válido. Usa: dev, staging, o prod"
        exit 1
        ;;
esac

# Verificar archivo de variables de entorno
ENV_FILE=".env.$STAGE"
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  Advertencia: No se encontró $ENV_FILE"
    echo "   Asegúrate de configurar las variables de entorno correctamente"
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Build del proyecto
echo "🔨 Building proyecto..."
npm run build:serverless

# Verificar que el build fue exitoso
if [ ! -f "dist/server.js" ]; then
    echo "❌ Error: Build falló. No se encontró dist/server.js"
    exit 1
fi

# Configurar credenciales AWS si no están configuradas
if [ -z "$AWS_ACCESS_KEY_ID" ] && [ -z "$AWS_PROFILE" ]; then
    echo "⚠️  Advertencia: No se detectaron credenciales AWS"
    echo "   Configura AWS CLI o variables de entorno antes del deployment"
    echo ""
    echo "   Opciones:"
    echo "   1. aws configure"
    echo "   2. export AWS_ACCESS_KEY_ID=tu_key"
    echo "   3. export AWS_SECRET_ACCESS_KEY=tu_secret"
    echo ""
    read -p "¿Continuar de todas formas? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deployment
echo "🚀 Deploying a AWS Lambda..."
echo "   Stage: $STAGE"
echo "   Region: us-east-1"
echo ""

if [ "$STAGE" = "prod" ]; then
    echo "⚠️  DEPLOYMENT A PRODUCCIÓN"
    echo "   Esto afectará el ambiente de producción"
    echo ""
    read -p "¿Estás seguro? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelado"
        exit 1
    fi
fi

# Ejecutar deployment
serverless deploy --stage $STAGE --verbose

# Verificar que el deployment fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment exitoso!"
    echo ""
    echo "📋 Información del deployment:"
    serverless info --stage $STAGE
    echo ""
    echo "🔗 Comandos útiles:"
    echo "   Ver logs:     serverless logs -f api -t --stage $STAGE"
    echo "   Ver info:     serverless info --stage $STAGE"
    echo "   Remover:      serverless remove --stage $STAGE"
    echo ""
    
    if [ "$STAGE" = "prod" ]; then
        echo "🎉 ¡Sistema en producción!"
        echo "   Recuerda actualizar las variables de entorno del frontend"
    fi
else
    echo ""
    echo "❌ Deployment falló"
    echo "   Revisa los logs arriba para más detalles"
    exit 1
fi