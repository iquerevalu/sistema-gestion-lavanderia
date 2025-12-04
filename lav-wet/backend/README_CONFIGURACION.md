# 🔧 Configuración Local vs Producción

## Archivos de Configuración

- **`.env`** - Archivo activo (se copia automáticamente)
- **`.env.local`** - Configuración para desarrollo local
- **`.env.production`** - Configuración para AWS (RDS)

## 🏠 Trabajar en LOCAL

```bash
# Opción 1: Usar script automático
npm run use:local
npm run dev

# Opción 2: Copiar manualmente
cp .env.local .env
npm run dev
```

Tu backend se conectará a:
- Base de datos: `localhost` (MySQL local)
- Usuario: `root`
- Database: `db_lavanderia`

## ☁️ Deploy a AWS

```bash
# Deploy automático (copia .env.production y hace deploy)
npm run deploy

# O manualmente:
npm run use:prod
npm run build
serverless deploy --stage prod
```

El backend en AWS se conectará a:
- Base de datos: RDS MySQL en AWS
- Usuario: `admin`
- Database: `lavanderia_db`

## 📋 Comandos Útiles

```bash
# Desarrollo local
npm run dev                 # Inicia backend local

# Cambiar configuración
npm run use:local          # Activa configuración local
npm run use:prod           # Activa configuración producción

# Deploy
npm run deploy             # Deploy a AWS (automático)
npm run logs               # Ver logs de AWS

# Build
npm run build              # Build normal
npm run build:prod         # Build con config de producción
```

## ⚠️ Importante

- **NUNCA** subas `.env` a Git (ya está en .gitignore)
- Antes de hacer deploy, verifica que `.env.production` tenga las credenciales correctas
- Para trabajar local, siempre usa `npm run use:local` primero

## 🔄 Flujo de Trabajo

### Desarrollo Local:
```bash
npm run use:local
npm run dev
# Trabaja normalmente con tu MySQL local
```

### Deploy a Producción:
```bash
npm run deploy
# Automáticamente usa .env.production y hace deploy
```

### Volver a Local:
```bash
npm run use:local
npm run dev
```
