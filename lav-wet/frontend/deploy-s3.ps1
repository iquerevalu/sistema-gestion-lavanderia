# Script para deployar frontend a AWS S3
Write-Host "🚀 Deploying frontend to AWS S3..." -ForegroundColor Green

# Variables
$BUCKET_NAME = "lavanderia-frontend-demo-2024"
$REGION = "us-east-1"

# Paso 1: Crear bucket si no existe
Write-Host "📦 Creating S3 bucket..." -ForegroundColor Yellow
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Paso 2: Subir archivos
Write-Host "📤 Uploading files to S3..." -ForegroundColor Yellow
aws s3 sync dist/ s3://$BUCKET_NAME --delete --region $REGION

# Paso 3: Configurar como sitio web estático
Write-Host "🌐 Configuring S3 website..." -ForegroundColor Yellow
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html --region $REGION

# Paso 4: Configurar política pública
Write-Host "🔓 Setting public read policy..." -ForegroundColor Yellow
$policyJson = '{"Version":"2012-10-17","Statement":[{"Sid":"PublicReadGetObject","Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::' + $BUCKET_NAME + '/*"}]}'
$policyJson | Out-File -FilePath "policy.json" -Encoding UTF8
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://policy.json --region $REGION
Remove-Item "policy.json"

# Paso 5: Mostrar URL
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "🔗 Your website is available at:" -ForegroundColor Cyan
Write-Host "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor White

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
Write-Host "Frontend: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor White
Write-Host "Backend: https://9vhwuthgu5.execute-api.us-east-1.amazonaws.com/dev/" -ForegroundColor White