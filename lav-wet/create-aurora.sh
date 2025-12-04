#!/bin/bash

# Script para crear Aurora Serverless MySQL

# Configuración
DB_CLUSTER_NAME="lavanderia-db-cluster"
DB_INSTANCE_NAME="lavanderia-db-instance"
DB_NAME="lavanderia_db"
DB_USER="admin"
REGION="us-east-1"

echo "🗄️  Creando Aurora Serverless MySQL..."
echo ""
echo "Ingresa la contraseña para la base de datos (mínimo 8 caracteres):"
read -s DB_PASSWORD
echo ""

# Crear cluster Aurora Serverless v2
echo "Creando cluster Aurora..."
aws rds create-db-cluster \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --engine aurora-mysql \
  --engine-version 8.0.mysql_aurora.3.02.0 \
  --master-username $DB_USER \
  --master-user-password "$DB_PASSWORD" \
  --database-name $DB_NAME \
  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=1 \
  --region $REGION \
  --publicly-accessible

if [ $? -eq 0 ]; then
    echo "✅ Cluster creado"
else
    echo "⚠️  El cluster puede ya existir o hubo un error"
fi

# Crear instancia del cluster
echo ""
echo "Creando instancia del cluster..."
aws rds create-db-instance \
  --db-instance-identifier $DB_INSTANCE_NAME \
  --db-instance-class db.serverless \
  --engine aurora-mysql \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --publicly-accessible \
  --region $REGION

echo ""
echo "⏳ Esperando que el cluster esté disponible (5-10 minutos)..."
aws rds wait db-cluster-available \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --region $REGION

# Obtener endpoint
DB_ENDPOINT=$(aws rds describe-db-clusters \
  --db-cluster-identifier $DB_CLUSTER_NAME \
  --query 'DBClusters[0].Endpoint' \
  --output text \
  --region $REGION)

echo ""
echo "✅ Aurora Serverless listo!"
echo ""
echo "📊 Información:"
echo "  Endpoint: $DB_ENDPOINT"
echo "  Database: $DB_NAME"
echo "  Usuario: $DB_USER"
echo "  Puerto: 3306"
echo ""
echo "📝 Actualiza tu archivo backend/.env con estos datos"
