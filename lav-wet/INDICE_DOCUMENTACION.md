# 📚 Índice de Documentación - Sistema de Lavandería

Guía completa de toda la documentación disponible en el proyecto.

## 🎯 Inicio Rápido

**¿Primera vez desplegando?** → Empieza aquí:
1. [RESUMEN_DEPLOY.md](./RESUMEN_DEPLOY.md) - Visión general
2. [CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md) - Paso a paso
3. [frontend/DEPLOY.md](./frontend/DEPLOY.md) - Deploy del frontend

**¿Ya desplegaste antes?** → Referencia rápida:
- [frontend/COMANDOS_RAPIDOS.md](./frontend/COMANDOS_RAPIDOS.md)

**¿Estás en Windows?** → Guía específica:
- [frontend/DEPLOY_WINDOWS.md](./frontend/DEPLOY_WINDOWS.md)

## 📖 Documentación por Categoría

### 🚀 Deployment

#### General
- **[RESUMEN_DEPLOY.md](./RESUMEN_DEPLOY.md)**
  - Resumen ejecutivo del deployment
  - Arquitectura AWS
  - Costos estimados
  - URLs de producción
  - Comandos útiles

- **[CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)**
  - Checklist completo paso a paso
  - Pre-requisitos
  - Verificaciones
  - Troubleshooting
  - Plan de rollback

- **[DEPLOY_FRONTEND_COMPLETO.md](./DEPLOY_FRONTEND_COMPLETO.md)**
  - Documentación completa del frontend
  - Todos los archivos creados
  - Guías de inicio rápido
  - Tips y mejores prácticas

#### Backend
- **[backend/deploy.md](./backend/deploy.md)**
  - Guía completa de deploy del backend
  - Configuración de Serverless Framework
  - Lambda y API Gateway
  - Aurora Serverless
  - Variables de entorno
  - Troubleshooting

- **[backend/README_CONFIGURACION.md](./backend/README_CONFIGURACION.md)**
  - Configuración del backend
  - Variables de entorno
  - Base de datos
  - Autenticación

#### Frontend
- **[frontend/DEPLOY.md](./frontend/DEPLOY.md)**
  - Guía completa de deploy del frontend
  - S3 y CloudFront
  - Configuración paso a paso
  - Dominio personalizado
  - Costos

- **[frontend/DEPLOY_WINDOWS.md](./frontend/DEPLOY_WINDOWS.md)**
  - Guía específica para Windows
  - PowerShell y Git Bash
  - Setup manual
  - Troubleshooting Windows

- **[frontend/COMANDOS_RAPIDOS.md](./frontend/COMANDOS_RAPIDOS.md)**
  - Referencia rápida de comandos
  - Deploy, testing, rollback
  - Diagnóstico
  - CloudFront
  - Monitoreo

- **[frontend/FLUJO_DEPLOY.md](./frontend/FLUJO_DEPLOY.md)**
  - Diagramas de flujo
  - Proceso de deploy visual
  - Estados del sistema
  - Manejo de errores

- **[frontend/README.md](./frontend/README.md)**
  - Documentación general del frontend
  - Stack tecnológico
  - Desarrollo local
  - Estructura del proyecto

### 🛠️ Scripts

#### Frontend - Bash
- **[frontend/deploy-s3.sh](./frontend/deploy-s3.sh)**
  - Script principal de deploy (Linux/Mac)
  - Build, backup, upload, invalidación
  - Flags: --skip-build, --no-cache-invalidation

- **[frontend/setup-aws-frontend.sh](./frontend/setup-aws-frontend.sh)**
  - Setup inicial de AWS
  - Crear bucket, políticas, CORS
  - Opción de CloudFront

- **[frontend/test-deployment.sh](./frontend/test-deployment.sh)**
  - Tests automáticos del deployment
  - Verificación completa
  - Reportes

- **[frontend/rollback.sh](./frontend/rollback.sh)**
  - Rollback interactivo
  - Restauración de backups
  - Verificación post-rollback

#### Frontend - PowerShell
- **[frontend/deploy-s3.ps1](./frontend/deploy-s3.ps1)**
  - Script principal de deploy (Windows)
  - Mismas funcionalidades que .sh
  - Sintaxis PowerShell

#### Backend
- **[aws-setup.sh](./aws-setup.sh)**
  - Setup completo de AWS
  - Aurora, Cognito, IAM
  - Configuración automática

### ⚙️ Configuración

#### Variables de Entorno
- **[backend/.env](./backend/.env)** - Backend local
- **[backend/.env.production](./backend/.env.production)** - Backend producción
- **[frontend/.env](./frontend/.env)** - Frontend local
- **[frontend/.env.production](./frontend/.env.production)** - Frontend producción ✅

#### Serverless
- **[backend/serverless.yml](./backend/serverless.yml)**
  - Configuración de Serverless Framework
  - Lambda functions
  - API Gateway
  - Permisos IAM

#### CloudFront
- **[frontend/cloudfront-config.json](./frontend/cloudfront-config.json)**
  - Configuración de CloudFront
  - Distribución
  - Cache policies
  - Error responses

### 📋 Documentación General

- **[README.md](./README.md)**
  - Documentación principal del proyecto
  - Características
  - Stack tecnológico
  - Instalación local
  - Deployment
  - Contribución

- **[DEPLOY_AWS.md](./DEPLOY_AWS.md)**
  - Guía completa de AWS
  - Arquitectura
  - Servicios utilizados
  - Configuración detallada

### 📊 Ejemplos y Referencias

- **[EJEMPLOS_API.md](./EJEMPLOS_API.md)**
  - Ejemplos de uso del API
  - Endpoints
  - Request/Response
  - Autenticación

## 🗺️ Mapa de Navegación

### Por Rol

#### Desarrollador Frontend
```
1. README.md (general)
2. frontend/README.md (específico)
3. frontend/DEPLOY.md (deployment)
4. frontend/COMANDOS_RAPIDOS.md (referencia)
```

#### Desarrollador Backend
```
1. README.md (general)
2. backend/README_CONFIGURACION.md (configuración)
3. backend/deploy.md (deployment)
4. EJEMPLOS_API.md (API)
```

#### DevOps / Deployment
```
1. RESUMEN_DEPLOY.md (overview)
2. CHECKLIST_DEPLOY.md (checklist)
3. backend/deploy.md (backend)
4. frontend/DEPLOY.md (frontend)
5. DEPLOY_AWS.md (AWS completo)
```

#### Usuario Windows
```
1. RESUMEN_DEPLOY.md (overview)
2. frontend/DEPLOY_WINDOWS.md (Windows específico)
3. frontend/deploy-s3.ps1 (script)
```

### Por Tarea

#### "Quiero hacer el primer deploy"
```
1. RESUMEN_DEPLOY.md
2. CHECKLIST_DEPLOY.md
3. frontend/setup-aws-frontend.sh
4. frontend/deploy-s3.sh
```

#### "Quiero hacer un deploy rápido"
```
1. frontend/COMANDOS_RAPIDOS.md
2. frontend/deploy-s3.sh --skip-build
```

#### "Tengo un problema"
```
1. CHECKLIST_DEPLOY.md (troubleshooting)
2. frontend/DEPLOY.md (troubleshooting)
3. backend/deploy.md (troubleshooting)
```

#### "Necesito hacer rollback"
```
1. frontend/rollback.sh
2. frontend/COMANDOS_RAPIDOS.md (rollback section)
```

#### "Quiero entender el flujo"
```
1. frontend/FLUJO_DEPLOY.md
2. DEPLOY_FRONTEND_COMPLETO.md
```

## 📁 Estructura de Archivos

```
proyecto/
│
├── 📄 README.md                          # Documentación principal
├── 📄 RESUMEN_DEPLOY.md                  # Resumen de deployment
├── 📄 CHECKLIST_DEPLOY.md                # Checklist completo
├── 📄 DEPLOY_AWS.md                      # Guía AWS completa
├── 📄 DEPLOY_FRONTEND_COMPLETO.md        # Doc completa frontend
├── 📄 EJEMPLOS_API.md                    # Ejemplos de API
├── 📄 INDICE_DOCUMENTACION.md            # Este archivo
│
├── 🔧 aws-setup.sh                       # Setup AWS automático
│
├── backend/
│   ├── 📄 deploy.md                      # Deploy backend
│   ├── 📄 README_CONFIGURACION.md        # Configuración backend
│   ├── ⚙️ serverless.yml                 # Config Serverless
│   ├── 🔐 .env                           # Variables locales
│   └── 🔐 .env.production                # Variables producción
│
└── frontend/
    ├── 📄 DEPLOY.md                      # Deploy frontend
    ├── 📄 DEPLOY_WINDOWS.md              # Deploy Windows
    ├── 📄 COMANDOS_RAPIDOS.md            # Comandos rápidos
    ├── 📄 FLUJO_DEPLOY.md                # Flujos visuales
    ├── 📄 README.md                      # Doc frontend
    │
    ├── 🔧 deploy-s3.sh                   # Deploy (Bash)
    ├── 🔧 deploy-s3.ps1                  # Deploy (PowerShell)
    ├── 🔧 setup-aws-frontend.sh          # Setup AWS
    ├── 🔧 test-deployment.sh             # Tests
    ├── 🔧 rollback.sh                    # Rollback
    │
    ├── ⚙️ cloudfront-config.json         # Config CloudFront
    ├── 🔐 .env                           # Variables locales
    └── 🔐 .env.production                # Variables producción ✅
```

## 🎯 Guías Recomendadas por Escenario

### Escenario 1: Primera vez con el proyecto
```
1. README.md
   → Entender el proyecto completo
   
2. RESUMEN_DEPLOY.md
   → Visión general del deployment
   
3. CHECKLIST_DEPLOY.md
   → Seguir paso a paso
```

### Escenario 2: Solo deploy del frontend
```
1. frontend/DEPLOY.md
   → Guía completa
   
2. frontend/setup-aws-frontend.sh
   → Setup inicial
   
3. frontend/deploy-s3.sh
   → Deploy
   
4. frontend/test-deployment.sh
   → Verificar
```

### Escenario 3: Solo deploy del backend
```
1. backend/deploy.md
   → Guía completa
   
2. backend/serverless.yml
   → Revisar configuración
   
3. npm run deploy
   → Ejecutar deploy
```

### Escenario 4: Deploy completo (Backend + Frontend)
```
1. RESUMEN_DEPLOY.md
   → Overview
   
2. backend/deploy.md
   → Deploy backend
   
3. frontend/DEPLOY.md
   → Deploy frontend
   
4. CHECKLIST_DEPLOY.md
   → Verificar todo
```

### Escenario 5: Troubleshooting
```
1. CHECKLIST_DEPLOY.md
   → Sección troubleshooting
   
2. frontend/DEPLOY.md
   → Troubleshooting frontend
   
3. backend/deploy.md
   → Troubleshooting backend
   
4. frontend/COMANDOS_RAPIDOS.md
   → Comandos de diagnóstico
```

### Escenario 6: Desarrollo local
```
1. README.md
   → Instalación y configuración
   
2. backend/README_CONFIGURACION.md
   → Configurar backend
   
3. frontend/README.md
   → Configurar frontend
```

## 🔍 Búsqueda Rápida

### Por Palabra Clave

**AWS**
- RESUMEN_DEPLOY.md
- DEPLOY_AWS.md
- aws-setup.sh
- frontend/setup-aws-frontend.sh

**S3**
- frontend/DEPLOY.md
- frontend/deploy-s3.sh
- frontend/COMANDOS_RAPIDOS.md

**CloudFront**
- frontend/DEPLOY.md
- frontend/cloudfront-config.json
- frontend/COMANDOS_RAPIDOS.md

**Lambda**
- backend/deploy.md
- backend/serverless.yml
- RESUMEN_DEPLOY.md

**Serverless**
- backend/deploy.md
- backend/serverless.yml
- RESUMEN_DEPLOY.md

**Windows**
- frontend/DEPLOY_WINDOWS.md
- frontend/deploy-s3.ps1

**Rollback**
- frontend/rollback.sh
- frontend/COMANDOS_RAPIDOS.md
- CHECKLIST_DEPLOY.md

**Testing**
- frontend/test-deployment.sh
- CHECKLIST_DEPLOY.md

**Variables de Entorno**
- backend/.env.production
- frontend/.env.production
- backend/README_CONFIGURACION.md

**Costos**
- RESUMEN_DEPLOY.md
- frontend/DEPLOY.md
- backend/deploy.md

## 📞 Soporte y Recursos

### Documentación Oficial
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Serverless Framework](https://www.serverless.com/framework/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

### Herramientas
- [AWS Console](https://console.aws.amazon.com/)
- [CloudWatch](https://console.aws.amazon.com/cloudwatch/)
- [S3 Console](https://console.aws.amazon.com/s3/)
- [Lambda Console](https://console.aws.amazon.com/lambda/)

### Comunidad
- GitHub Issues
- Stack Overflow
- AWS Forums

## ✅ Checklist de Documentación

### Para Desarrolladores
- [ ] Leí README.md
- [ ] Entiendo la arquitectura
- [ ] Configuré el entorno local
- [ ] Revisé los ejemplos de API

### Para Deployment
- [ ] Leí RESUMEN_DEPLOY.md
- [ ] Revisé CHECKLIST_DEPLOY.md
- [ ] Entiendo el flujo de deploy
- [ ] Tengo las credenciales AWS

### Para Troubleshooting
- [ ] Revisé la sección de troubleshooting
- [ ] Probé los comandos de diagnóstico
- [ ] Verifiqué los logs
- [ ] Consulté la documentación específica

## 🎓 Nivel de Experiencia

### Principiante
```
Empieza aquí:
1. README.md
2. RESUMEN_DEPLOY.md
3. CHECKLIST_DEPLOY.md (seguir paso a paso)
```

### Intermedio
```
Consulta:
1. frontend/DEPLOY.md
2. backend/deploy.md
3. frontend/COMANDOS_RAPIDOS.md
```

### Avanzado
```
Referencia:
1. frontend/COMANDOS_RAPIDOS.md
2. backend/serverless.yml
3. Scripts directamente
```

---

## 📊 Estadísticas de Documentación

- **Total de archivos**: 20+
- **Guías completas**: 8
- **Scripts ejecutables**: 6
- **Archivos de configuración**: 6
- **Cobertura**: 100% del proyecto

---

**Última actualización**: 19 de Noviembre, 2024
**Versión**: 1.0.0
**Estado**: ✅ Completo

---

¿No encuentras lo que buscas? Revisa el [README.md](./README.md) principal o consulta los scripts directamente.
