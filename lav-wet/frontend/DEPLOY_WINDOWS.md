# 🪟 Deploy Frontend en Windows

Guía específica para desplegar el frontend en Windows usando PowerShell.

## 📋 Requisitos

- Windows 10/11
- PowerShell 5.1 o superior
- AWS CLI instalado
- Node.js 18+ instalado
- Git Bash (opcional, para scripts .sh)

## 🚀 Opción 1: PowerShell (Recomendado para Windows)

### Setup Inicial

```powershell
# Abrir PowerShell como Administrador
cd frontend

# Verificar AWS CLI
aws --version

# Configurar AWS (si no está configurado)
aws configure

# Verificar credenciales
aws sts get-caller-identity
```

### Deploy

```powershell
# Deploy completo
.\deploy-s3.ps1

# Deploy sin rebuild
.\deploy-s3.ps1 -SkipBuild

# Deploy sin invalidar cache
.\deploy-s3.ps1 -NoCacheInvalidation

# Ver ayuda
.\deploy-s3.ps1 -Help
```

### Troubleshooting PowerShell

Si obtienes error de "ejecución de scripts deshabilitada":

```powershell
# Opción 1: Cambiar política de ejecución (temporal)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Opción 2: Ejecutar con bypass
powershell -ExecutionPolicy Bypass -File .\deploy-s3.ps1

# Opción 3: Cambiar política permanentemente (requiere admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🐚 Opción 2: Git Bash

Si tienes Git Bash instalado, puedes usar los scripts .sh:

```bash
# Abrir Git Bash
cd frontend

# Dar permisos
chmod +x deploy-s3.sh setup-aws-frontend.sh test-deployment.sh rollback.sh

# Setup inicial
./setup-aws-frontend.sh

# Deploy
./deploy-s3.sh

# Test
./test-deployment.sh
```

## 🔧 Setup Manual (Si los scripts no funcionan)

### 1. Crear Bucket S3

```powershell
# Crear bucket
aws s3 mb s3://lavanderia-frontend-prod --region us-east-1

# Configurar como sitio web
aws s3 website s3://lavanderia-frontend-prod `
  --index-document index.html `
  --error-document index.html `
  --region us-east-1
```

### 2. Configurar Política del Bucket

Crea `bucket-policy.json`:

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

```powershell
aws s3api put-bucket-policy `
  --bucket lavanderia-frontend-prod `
  --policy file://bucket-policy.json `
  --region us-east-1
```

### 3. Configurar Acceso Público

```powershell
aws s3api put-public-access-block `
  --bucket lavanderia-frontend-prod `
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" `
  --region us-east-1
```

### 4. Build y Deploy

```powershell
# Build
npm run build

# Subir archivos
aws s3 sync dist/ s3://lavanderia-frontend-prod `
  --delete `
  --region us-east-1 `
  --cache-control "public, max-age=31536000" `
  --exclude "index.html"

# Subir index.html sin cache
aws s3 cp dist/index.html s3://lavanderia-frontend-prod/index.html `
  --region us-east-1 `
  --cache-control "no-cache, no-store, must-revalidate" `
  --content-type "text/html"
```

## 🧪 Verificar Deploy

```powershell
# Ver archivos en S3
aws s3 ls s3://lavanderia-frontend-prod --recursive

# Test HTTP
curl http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com

# O abrir en navegador
start http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
```

## ☁️ CloudFront (Opcional)

### Crear Distribución

```powershell
# Crear distribución básica
aws cloudfront create-distribution `
  --origin-domain-name lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com `
  --default-root-object index.html

# O usar archivo de configuración
aws cloudfront create-distribution-with-tags `
  --distribution-config-with-tags file://cloudfront-config.json
```

### Invalidar Cache

```powershell
# Invalidar todo
aws cloudfront create-invalidation `
  --distribution-id E1234567890ABC `
  --paths "/*"

# Ver estado
aws cloudfront get-invalidation `
  --distribution-id E1234567890ABC `
  --id I1234567890ABC
```

## 🔄 Rollback

### Opción 1: PowerShell Script

```powershell
# Crear script de rollback
# (Similar al deploy-s3.ps1 pero restaurando desde backup)
```

### Opción 2: Manual

```powershell
# Listar backups
aws s3 ls s3://lavanderia-frontend-backups/

# Restaurar backup específico
aws s3 sync s3://lavanderia-frontend-backups/backup-20241119-120000/ `
  s3://lavanderia-frontend-prod/ `
  --delete `
  --region us-east-1
```

## 📝 Variables de Entorno

Edita `.env.production`:

```bash
VITE_API_URL=https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
```

## 🐛 Troubleshooting Windows

### Error: aws no reconocido

```powershell
# Verificar instalación
where.exe aws

# Agregar al PATH si es necesario
$env:Path += ";C:\Program Files\Amazon\AWSCLIV2"

# O reinstalar AWS CLI
# Descargar de: https://aws.amazon.com/cli/
```

### Error: npm no reconocido

```powershell
# Verificar instalación
where.exe npm

# Reinstalar Node.js si es necesario
# Descargar de: https://nodejs.org/
```

### Error: Permisos de PowerShell

```powershell
# Ver política actual
Get-ExecutionPolicy

# Cambiar política (como admin)
Set-ExecutionPolicy RemoteSigned

# O ejecutar con bypass
powershell -ExecutionPolicy Bypass -File .\deploy-s3.ps1
```

### Error: Caracteres especiales en rutas

```powershell
# Usar comillas
aws s3 cp "dist/index.html" "s3://lavanderia-frontend-prod/index.html"

# O usar rutas relativas
cd dist
aws s3 sync . s3://lavanderia-frontend-prod
cd ..
```

### Error: CORS

```powershell
# Crear cors-config.json
@"
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
"@ | Out-File -Encoding utf8 cors-config.json

# Aplicar
aws s3api put-bucket-cors `
  --bucket lavanderia-frontend-prod `
  --cors-configuration file://cors-config.json
```

## 📊 Comandos Útiles Windows

```powershell
# Ver tamaño del bucket
aws s3 ls s3://lavanderia-frontend-prod --recursive --human-readable --summarize

# Contar archivos
(aws s3 ls s3://lavanderia-frontend-prod --recursive | Measure-Object).Count

# Limpiar build local
Remove-Item -Recurse -Force dist, node_modules

# Reinstalar dependencias
npm ci

# Ver logs de CloudWatch (Lambda)
aws logs tail /aws/lambda/lavanderia-api-prod-api --follow
```

## 🎯 Checklist Windows

- [ ] AWS CLI instalado y en PATH
- [ ] Node.js instalado y en PATH
- [ ] PowerShell 5.1+
- [ ] Credenciales AWS configuradas
- [ ] `.env.production` configurado
- [ ] Scripts tienen permisos de ejecución
- [ ] Bucket S3 creado
- [ ] Política del bucket aplicada
- [ ] Build exitoso
- [ ] Deploy exitoso
- [ ] Sitio accesible en navegador

## 💡 Tips para Windows

1. **Usa PowerShell ISE** para editar y ejecutar scripts
2. **Usa Windows Terminal** para mejor experiencia
3. **Instala Git Bash** como alternativa
4. **Usa WSL2** para experiencia Linux completa
5. **Configura alias** en PowerShell:

```powershell
# Agregar a $PROFILE
Set-Alias deploy ".\deploy-s3.ps1"
Set-Alias test ".\test-deployment.sh"

# Usar
deploy
test
```

## 🔗 Enlaces Útiles

- [AWS CLI para Windows](https://aws.amazon.com/cli/)
- [Node.js para Windows](https://nodejs.org/)
- [Git para Windows](https://git-scm.com/download/win)
- [Windows Terminal](https://aka.ms/terminal)
- [PowerShell 7](https://github.com/PowerShell/PowerShell)

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de PowerShell
2. Verifica credenciales AWS
3. Revisa la documentación en `DEPLOY.md`
4. Consulta `COMANDOS_RAPIDOS.md`
5. Revisa el checklist en `CHECKLIST_DEPLOY.md`
