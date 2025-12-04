# Script de deploy del frontend a S3 + CloudFront (PowerShell)
# Uso: .\deploy-s3.ps1 [-SkipBuild] [-NoCacheInvalidation]

param(
    [switch]$SkipBuild,
    [switch]$NoCacheInvalidation,
    [switch]$Help
)

# Configuración
$BUCKET_NAME = "lavanderia-frontend-prod"
$REGION = "us-east-1"
$DISTRIBUTION_ID = "" # Agregar después de crear CloudFront
$BACKUP_BUCKET = "lavanderia-frontend-backups"

# Colores
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Info($message) {
    Write-ColorOutput Cyan $message
}

function Write-Success($message) {
    Write-ColorOutput Green $message
}

function Write-Warning($message) {
    Write-ColorOutput Yellow $message
}

function Write-Error($message) {
    Write-ColorOutput Red $message
}

# Mostrar ayuda
if ($Help) {
    Write-Info "Uso: .\deploy-s3.ps1 [opciones]"
    Write-Info ""
    Write-Info "Opciones:"
    Write-Info "  -SkipBuild              Omitir el build (usar dist/ existente)"
    Write-Info "  -NoCacheInvalidation    No invalidar cache de CloudFront"
    Write-Info "  -Help                   Mostrar esta ayuda"
    exit 0
}

Write-Info "╔════════════════════════════════════════╗"
Write-Info "║   🚀 Deploy Frontend a AWS S3         ║"
Write-Info "╚════════════════════════════════════════╝"
Write-Info ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Error "❌ Error: No se encuentra package.json"
    Write-Warning "Ejecuta este script desde el directorio frontend/"
    exit 1
}

# Verificar que existe .env.production
if (-not (Test-Path ".env.production")) {
    Write-Error "❌ Error: No se encuentra .env.production"
    Write-Warning "Crea el archivo .env.production con VITE_API_URL"
    exit 1
}

# Mostrar configuración
Write-Info "📋 Configuración:"
Write-Success "   Bucket: $BUCKET_NAME"
Write-Success "   Region: $REGION"
if ($DISTRIBUTION_ID) {
    Write-Success "   CloudFront: $DISTRIBUTION_ID"
} else {
    Write-Warning "   CloudFront: No configurado"
}
Write-Info ""

# Verificar AWS CLI
try {
    $null = aws --version
} catch {
    Write-Error "❌ Error: AWS CLI no está instalado"
    exit 1
}

# Verificar credenciales AWS
Write-Info "🔐 Verificando credenciales AWS..."
try {
    $null = aws sts get-caller-identity 2>&1
    Write-Success "✅ Credenciales verificadas"
} catch {
    Write-Error "❌ Error: Credenciales AWS no configuradas"
    Write-Warning "Ejecuta: aws configure"
    exit 1
}
Write-Info ""

# Build del proyecto
if (-not $SkipBuild) {
    Write-Info "📦 Building proyecto..."
    
    # Verificar node_modules
    if (-not (Test-Path "node_modules")) {
        Write-Warning "⚠️  node_modules no encontrado, instalando dependencias..."
        npm install
    }
    
    # Limpiar build anterior
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force dist
    }
    
    # Build
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error en el build"
        exit 1
    }
    
    Write-Success "✅ Build completado"
    Write-Info ""
} else {
    Write-Warning "⏭️  Omitiendo build (usando dist/ existente)"
    
    if (-not (Test-Path "dist")) {
        Write-Error "❌ Error: No existe el directorio dist/"
        exit 1
    }
    Write-Info ""
}

# Verificar que el bucket existe
Write-Info "🪣 Verificando bucket S3..."
try {
    $null = aws s3 ls "s3://$BUCKET_NAME" --region $REGION 2>&1
    Write-Success "✅ Bucket existe"
} catch {
    Write-Warning "⚠️  Bucket no existe, creándolo..."
    
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION
    
    # Configurar como sitio web
    aws s3 website "s3://$BUCKET_NAME" `
        --index-document index.html `
        --error-document index.html `
        --region $REGION
    
    Write-Success "✅ Bucket creado y configurado"
}
Write-Info ""

# Crear backup antes de deploy
$currentFiles = (aws s3 ls "s3://$BUCKET_NAME" --recursive --region $REGION 2>$null | Measure-Object).Count

if ($currentFiles -gt 0) {
    Write-Info "💾 Creando backup del deployment actual..."
    
    # Crear bucket de backups si no existe
    try {
        $null = aws s3 ls "s3://$BACKUP_BUCKET" --region $REGION 2>&1
    } catch {
        aws s3 mb "s3://$BACKUP_BUCKET" --region $REGION
        Write-Success "✅ Bucket de backups creado"
    }
    
    # Crear backup con timestamp
    $backupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    aws s3 sync "s3://$BUCKET_NAME/" "s3://$BACKUP_BUCKET/$backupName/" `
        --region $REGION `
        --quiet
    
    Write-Success "✅ Backup creado: $backupName"
    Write-Info ""
}

# Sync a S3
Write-Info "☁️  Subiendo archivos a S3..."
Write-Warning "   Esto puede tomar unos minutos..."

# Subir todos los archivos excepto index.html
aws s3 sync dist/ "s3://$BUCKET_NAME" `
    --delete `
    --region $REGION `
    --cache-control "public, max-age=31536000" `
    --exclude "index.html" `
    --exclude "*.map"

# Subir index.html sin cache
aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" `
    --region $REGION `
    --cache-control "no-cache, no-store, must-revalidate" `
    --content-type "text/html"

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Error subiendo a S3"
    exit 1
}

Write-Success "✅ Archivos subidos a S3"
Write-Info ""

# Invalidar cache de CloudFront
if ($DISTRIBUTION_ID -and -not $NoCacheInvalidation) {
    Write-Info "🔄 Invalidando cache de CloudFront..."
    
    $invalidationId = aws cloudfront create-invalidation `
        --distribution-id $DISTRIBUTION_ID `
        --paths "/*" `
        --query 'Invalidation.Id' `
        --output text
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error invalidando cache"
        exit 1
    }
    
    Write-Success "✅ Cache invalidado (ID: $invalidationId)"
    Write-Warning "   La propagación puede tomar 5-10 minutos"
    Write-Info ""
}

# Mostrar resumen
Write-Success "╔════════════════════════════════════════╗"
Write-Success "║   🎉 Deploy Completado Exitosamente   ║"
Write-Success "╚════════════════════════════════════════╝"
Write-Info ""
Write-Info "📍 URLs de Acceso:"
Write-Success "   S3 Website: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

if ($DISTRIBUTION_ID) {
    $cloudfrontUrl = aws cloudfront get-distribution `
        --id $DISTRIBUTION_ID `
        --query 'Distribution.DomainName' `
        --output text 2>$null
    
    if ($cloudfrontUrl) {
        Write-Success "   CloudFront: https://$cloudfrontUrl"
    }
}

Write-Info ""
Write-Info "📊 Estadísticas:"
$totalSize = (Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$fileCount = (Get-ChildItem -Path dist -Recurse -File | Measure-Object).Count
Write-Success "   Tamaño total: $([math]::Round($totalSize, 2)) MB"
Write-Success "   Archivos: $fileCount"
Write-Info ""

# Mostrar API URL configurada
$apiUrl = (Get-Content .env.production | Select-String "VITE_API_URL").ToString().Split("=")[1]
Write-Info "🔗 API configurada:"
Write-Success "   $apiUrl"
Write-Info ""

Write-Warning "💡 Tip: Prueba la aplicación en tu navegador"
Write-Info ""
