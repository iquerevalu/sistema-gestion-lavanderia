# 🔄 Flujo de Deploy del Frontend

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIO DEL DEPLOY                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ¿Es la primera vez?                                        │
└─────────────────────────────────────────────────────────────┘
         ↓ SÍ                                    ↓ NO
         ↓                                       ↓
┌──────────────────────┐              ┌──────────────────────┐
│ setup-aws-frontend.sh│              │   deploy-s3.sh       │
│                      │              │                      │
│ • Crear bucket S3    │              │ • Verificar .env     │
│ • Configurar website │              │ • Build proyecto     │
│ • Aplicar políticas  │              │ • Crear backup       │
│ • Configurar CORS    │              │ • Subir a S3         │
│ • Crear CloudFront?  │              │ • Invalidar cache    │
└──────────────────────┘              └──────────────────────┘
         ↓                                       ↓
         └───────────────┬───────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  VERIFICACIÓN                               │
│                                                             │
│  test-deployment.sh                                         │
│  • Verificar bucket existe                                  │
│  • Verificar archivos subidos                               │
│  • Test HTTP del sitio                                      │
│  • Verificar contenido HTML                                 │
│  • Test de rutas                                            │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  ¿Todo funciona correctamente?                             │
└─────────────────────────────────────────────────────────────┘
         ↓ SÍ                                    ↓ NO
         ↓                                       ↓
┌──────────────────────┐              ┌──────────────────────┐
│   ✅ DEPLOY EXITOSO  │              │   ❌ ROLLBACK        │
│                      │              │                      │
│ • Sitio en línea     │              │  rollback.sh         │
│ • URL disponible     │              │  • Listar backups    │
│ • Métricas OK        │              │  • Seleccionar       │
└──────────────────────┘              │  • Restaurar         │
                                      │  • Invalidar cache   │
                                      └──────────────────────┘
```

## 🎯 Flujo Detallado por Script

### 1️⃣ setup-aws-frontend.sh (Primera Vez)

```
START
  ↓
Verificar AWS CLI instalado
  ↓
Verificar credenciales AWS
  ↓
Crear bucket S3
  ↓ (si no existe)
Configurar como sitio web estático
  ↓
Deshabilitar bloqueo de acceso público
  ↓
Aplicar política del bucket
  ↓
Configurar CORS
  ↓
¿Crear CloudFront? ──→ SÍ ──→ Crear distribución
  ↓ NO                         ↓
  └──────────────────────────→ Mostrar resumen
                                ↓
                               END
```

### 2️⃣ deploy-s3.sh (Deploy Regular)

```
START
  ↓
Verificar package.json existe
  ↓
Verificar .env.production existe
  ↓
Verificar AWS CLI y credenciales
  ↓
¿Skip build? ──→ NO ──→ npm run build
  ↓ SÍ                   ↓
  └────────────────────→ Verificar dist/ existe
                         ↓
Verificar bucket S3 existe
  ↓ (crear si no existe)
  ↓
¿Hay archivos actuales? ──→ SÍ ──→ Crear backup
  ↓ NO                              ↓
  └──────────────────────────────→ Sync a S3
                                    ↓
                         Subir index.html sin cache
                                    ↓
                         ¿CloudFront configurado?
                                    ↓ SÍ
                         Invalidar cache CloudFront
                                    ↓
                         Mostrar resumen y URLs
                                    ↓
                                   END
```

### 3️⃣ test-deployment.sh (Verificación)

```
START
  ↓
Verificar bucket existe
  ↓ ✅
Verificar archivos en S3
  ↓ ✅
Verificar index.html existe
  ↓ ✅
Test HTTP del sitio (200 OK)
  ↓ ✅
Verificar contenido HTML válido
  ↓ ✅
Verificar assets
  ↓ ✅
Verificar CORS configurado
  ↓ ✅
Verificar política del bucket
  ↓ ✅
Verificar configuración de website
  ↓ ✅
Test de rutas React Router
  ↓ ✅
Mostrar resumen
  ↓
END (✅ Todo OK)
```

### 4️⃣ rollback.sh (Restauración)

```
START
  ↓
Verificar AWS CLI y credenciales
  ↓
Verificar bucket de backups existe
  ↓
Listar backups disponibles
  ↓
Mostrar lista numerada
  ↓
Usuario selecciona backup
  ↓
Confirmar rollback
  ↓ SÍ
Crear backup del estado actual
  ↓
Limpiar bucket actual
  ↓
Restaurar backup seleccionado
  ↓
¿CloudFront configurado? ──→ SÍ ──→ Invalidar cache
  ↓ NO                              ↓
  └──────────────────────────────→ Verificar restauración
                                    ↓
                         Mostrar resumen
                                    ↓
                                   END
```

## 🔀 Flujo de Decisiones

### ¿Cuándo usar cada script?

```
┌─────────────────────────────────────────┐
│  ¿Qué necesitas hacer?                  │
└─────────────────────────────────────────┘
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Primera vez        Deploy regular
    ↓                   ↓
setup-aws-      deploy-s3.sh
frontend.sh             ↓
    ↓              ¿Problemas?
    ↓                   ↓
    ↓         ┌─────────┴─────────┐
    ↓         ↓                   ↓
    ↓    Verificar           Restaurar
    ↓         ↓                   ↓
    ↓    test-          rollback.sh
    ↓    deployment.sh
    ↓         ↓
    └─────────┴───────────────────┘
              ↓
         ✅ Listo
```

## 📋 Checklist Visual

### Setup Inicial
```
□ AWS CLI instalado
□ Credenciales configuradas
□ Variables de entorno configuradas
    ↓
□ Ejecutar setup-aws-frontend.sh
    ↓
□ Bucket S3 creado
□ Políticas aplicadas
□ CORS configurado
□ CloudFront creado (opcional)
    ↓
✅ Setup completo
```

### Deploy Regular
```
□ Código actualizado
□ Tests locales pasados
    ↓
□ Ejecutar deploy-s3.sh
    ↓
□ Build exitoso
□ Backup creado
□ Archivos subidos a S3
□ Cache invalidado
    ↓
□ Ejecutar test-deployment.sh
    ↓
□ Todos los tests pasan
□ Sitio accesible
□ Funcionalidades OK
    ↓
✅ Deploy exitoso
```

### Rollback
```
❌ Problema detectado
    ↓
□ Ejecutar rollback.sh
    ↓
□ Seleccionar backup
□ Confirmar rollback
    ↓
□ Backup del estado actual creado
□ Backup anterior restaurado
□ Cache invalidado
    ↓
□ Verificar funcionamiento
    ↓
✅ Rollback exitoso
```

## 🎨 Estados del Sistema

```
┌──────────────────────────────────────────────────────────┐
│                    ESTADOS POSIBLES                      │
└──────────────────────────────────────────────────────────┘

🔵 INICIAL
   • Sin bucket S3
   • Sin configuración
   • Requiere setup

🟡 CONFIGURADO
   • Bucket S3 creado
   • Políticas aplicadas
   • Listo para deploy

🟢 DESPLEGADO
   • Código en S3
   • Sitio accesible
   • Funcionando OK

🟠 ACTUALIZANDO
   • Deploy en progreso
   • Build ejecutándose
   • Subiendo archivos

🔴 ERROR
   • Deploy falló
   • Requiere rollback
   • Revisar logs

🟣 ROLLBACK
   • Restaurando backup
   • Volviendo a estado anterior
   • Invalidando cache
```

## 🔄 Ciclo de Vida del Deploy

```
┌─────────────────────────────────────────────────────────┐
│                   CICLO COMPLETO                        │
└─────────────────────────────────────────────────────────┘

1. DESARROLLO LOCAL
   • Escribir código
   • Probar localmente
   • Commit a Git
        ↓
2. BUILD
   • npm run build
   • Generar dist/
   • Optimizar assets
        ↓
3. BACKUP
   • Guardar estado actual
   • Crear snapshot
   • Mantener historial
        ↓
4. DEPLOY
   • Subir a S3
   • Configurar cache
   • Actualizar CloudFront
        ↓
5. VERIFICACIÓN
   • Tests automáticos
   • Pruebas manuales
   • Monitoreo
        ↓
6. PRODUCCIÓN
   • Sitio en línea
   • Usuarios accediendo
   • Métricas OK
        ↓
   (Repetir desde 1)
```

## 🎯 Puntos de Control

```
┌─────────────────────────────────────────────────────────┐
│              PUNTOS DE VERIFICACIÓN                     │
└─────────────────────────────────────────────────────────┘

✓ Pre-Deploy
  • Código compilado sin errores
  • Tests locales pasados
  • Variables de entorno configuradas
  • Credenciales AWS válidas

✓ Durante Deploy
  • Build exitoso
  • Backup creado
  • Archivos subidos correctamente
  • Sin errores en logs

✓ Post-Deploy
  • Sitio accesible (HTTP 200)
  • HTML válido
  • Assets cargando
  • Rutas funcionando
  • API respondiendo
  • Login funciona

✓ Monitoreo Continuo
  • Uptime > 99%
  • Tiempo de carga < 3s
  • Sin errores en consola
  • Métricas normales
```

## 🚨 Manejo de Errores

```
┌─────────────────────────────────────────────────────────┐
│              FLUJO DE ERRORES                           │
└─────────────────────────────────────────────────────────┘

Error detectado
      ↓
Identificar tipo
      ↓
┌─────┴─────┬─────────┬─────────┐
↓           ↓         ↓         ↓
Build     Deploy   Runtime   Config
Error     Error    Error     Error
↓           ↓         ↓         ↓
Fix       Rollback  Hotfix   Update
code      backup    deploy   config
↓           ↓         ↓         ↓
└───────────┴─────────┴─────────┘
            ↓
      Verificar fix
            ↓
      Deploy again
            ↓
         ✅ OK
```

## 📊 Métricas de Deploy

```
┌─────────────────────────────────────────────────────────┐
│                 MÉTRICAS CLAVE                          │
└─────────────────────────────────────────────────────────┘

⏱️ Tiempo de Deploy
   • Build: 1-2 minutos
   • Upload: 30-60 segundos
   • CloudFront: 5-10 minutos
   • Total: ~7-13 minutos

📦 Tamaño
   • Código: ~500KB - 2MB
   • Assets: ~1-5MB
   • Total: ~1.5-7MB

🔄 Frecuencia
   • Desarrollo: Múltiples veces al día
   • Staging: 1-2 veces al día
   • Producción: 1-2 veces por semana

✅ Tasa de Éxito
   • Target: > 95%
   • Con tests: > 98%
   • Con rollback: 100% recovery
```

---

**Este flujo garantiza un deploy seguro y confiable del frontend** 🚀
