# Frontend - Sistema de Lavandería

Frontend desarrollado con React + TypeScript + Vite, desplegado en AWS S3 + CloudFront.

## 🚀 Quick Start

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará en http://localhost:3000
```

### Build de Producción

```bash
# Build
npm run build

# Preview del build
npm run preview
```

## 📦 Deploy a AWS

### Primera vez (Setup)

1. **Configurar AWS CLI**:
   ```bash
   aws configure
   ```

2. **Ejecutar setup inicial**:
   ```bash
   chmod +x setup-aws-frontend.sh
   ./setup-aws-frontend.sh
   ```

3. **Configurar variables de entorno**:
   Edita `.env.production` con la URL de tu API:
   ```
   VITE_API_URL=https://tu-api-id.execute-api.us-east-1.amazonaws.com/prod/api
   ```

### Deploy Regular

```bash
# Deploy completo
./deploy-s3.sh

# Deploy sin rebuild (más rápido)
./deploy-s3.sh --skip-build

# Deploy sin invalidar cache
./deploy-s3.sh --no-cache-invalidation
```

### Verificar Deploy

```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── contexts/        # Context API (Auth, etc)
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entry point
├── public/             # Assets estáticos
├── dist/               # Build output (generado)
├── .env                # Variables locales
├── .env.production     # Variables de producción
├── deploy-s3.sh        # Script de deploy
├── setup-aws-frontend.sh  # Setup inicial AWS
└── test-deployment.sh  # Tests de deployment
```

## 🔧 Configuración

### Variables de Entorno

#### Desarrollo (`.env`)
```bash
VITE_API_URL=http://localhost:3001/api
```

#### Producción (`.env.production`)
```bash
VITE_API_URL=https://bissbx5tza.execute-api.us-east-1.amazonaws.com/prod/api
```

### Vite Config

El archivo `vite.config.ts` configura:
- Puerto de desarrollo: 3000
- Proxy para API local
- Build optimizations

## 📚 Stack Tecnológico

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **React Hook Form** - Forms
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🌐 URLs

### Desarrollo
```
http://localhost:3000
```

### Producción
```
S3: http://lavanderia-frontend-prod.s3-website-us-east-1.amazonaws.com
CloudFront: https://tu-distribution.cloudfront.net
```

## 🔐 Autenticación

El frontend usa AWS Cognito para autenticación:
- Login con email/password
- Tokens JWT almacenados en localStorage
- Refresh automático de tokens
- Protected routes

## 📱 Características

- ✅ Dashboard con métricas
- ✅ Gestión de clientes
- ✅ Gestión de órdenes
- ✅ Gestión de servicios
- ✅ Gestión de empleados
- ✅ Reportes y estadísticas
- ✅ Responsive design
- ✅ Dark mode ready

## 🧪 Testing

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Test deployment
./test-deployment.sh
```

## 🐛 Troubleshooting

### Error: Cannot connect to API
- Verifica que el backend esté desplegado
- Revisa la URL en `.env.production`
- Verifica CORS en el backend

### Error: Build fails
- Limpia node_modules: `rm -rf node_modules && npm install`
- Verifica versión de Node: `node --version` (requiere 18+)

### Error: Deploy fails
- Verifica credenciales AWS: `aws sts get-caller-identity`
- Verifica que el bucket existe
- Revisa permisos IAM

### Rutas no funcionan en S3
- Verifica que error document esté configurado como `index.html`
- En CloudFront, agrega custom error responses

## 📖 Documentación Adicional

- [DEPLOY.md](./DEPLOY.md) - Guía completa de deployment
- [Vite Docs](https://vitejs.dev/)
- [React Router Docs](https://reactrouter.com/)
- [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

## 💰 Costos AWS

Estimado mensual para tráfico bajo/medio:
- S3: $1-5 USD
- CloudFront: $5-15 USD
- Total: $6-20 USD/mes

## 🤝 Contribuir

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Commit: `git commit -am 'Agrega nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

## 📄 Licencia

MIT
