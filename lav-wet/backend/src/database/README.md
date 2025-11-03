# Base de Datos - Sistema de Lavandería

## Esquema de Base de Datos

El sistema utiliza MySQL con las siguientes tablas principales:

### Tablas Principales

1. **lv_perfil** - Roles/perfiles de usuario
2. **lv_hotel** - Información de hoteles clientes
3. **lv_usuario** - Usuarios del sistema
4. **lv_categoria** - Categorías de prendas
5. **lv_prenda** - Catálogo de prendas
6. **lv_hotel_prenda** - Precios por hotel y prenda
7. **lv_guia** - Guías de lavandería
8. **lv_detalle_guia** - Detalle de prendas por guía
9. **lv_historial_estado** - Historial de cambios de estado
10. **lv_hotel_contador** - Numeración secuencial por hotel

## Configuración

### Variables de Entorno

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=db_lavanderia
```

### Instalación

1. **Crear base de datos MySQL**
   ```sql
   CREATE DATABASE db_lavanderia;
   ```

2. **Ejecutar migraciones**
   ```bash
   npm run migrate
   ```

## Datos de Prueba

El sistema incluye datos semilla con:

- **Perfiles**: Administrador, Recepcionista, Chofer, Operario, Encargado
- **Hoteles**: 3 hoteles de ejemplo
- **Usuarios**: 8 usuarios con diferentes roles
- **Prendas**: 11 tipos de prendas en 3 categorías
- **Precios**: Configurados para 2 hoteles

### Usuarios de Prueba

| Email | Contraseña | Perfil | Hotel |
|-------|------------|--------|-------|
| admin@lavanderia.com | 123456 | Administrador | - |
| maria.gonzalez@hotelparadise.com | 123456 | Recepcionista | Hotel Paradise |
| roberto.silva@lavanderia.com | 123456 | Operario | - |

## Características del Esquema

### Numeración Secuencial
- Cada hotel mantiene su propio contador de guías
- Se usa la tabla `lv_hotel_contador` para manejar la secuencia
- Constraint único en `(numero_guia, hotel_id)`

### Precios por Hotel
- Cada hotel puede tener precios diferentes para las mismas prendas
- Tabla `lv_hotel_prenda` maneja esta relación

### Historial de Estados
- Todos los cambios de estado se registran en `lv_historial_estado`
- Incluye usuario que hizo el cambio y timestamp

### Integridad Referencial
- Foreign keys en todas las relaciones
- Cascadas en eliminaciones donde corresponde
- Índices para optimización de consultas

## Scripts Disponibles

- `npm run migrate` - Ejecutar migraciones completas
- Schema en: `src/database/schema.sql`
- Datos semilla en: `src/database/seed.sql`