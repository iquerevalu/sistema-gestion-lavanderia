# 👤 Guía de Usuario - Sistema de Gestión de Guías de Lavandería

## 🚀 Introducción

Bienvenido al Sistema de Gestión de Guías de Lavandería, una plataforma moderna diseñada para digitalizar y optimizar los procesos entre hoteles y lavanderías.

### ¿Qué es una Guía de Lavandería?

Una guía de lavandería es un documento que registra:
- Las prendas que se envían a lavar
- Las cantidades de cada tipo de prenda
- El estado del proceso de lavado
- Los responsables del proceso (choferes, recepcionistas)

## 🔐 Acceso al Sistema

### Iniciar Sesión

1. **Abrir el navegador** y dirigirse a la URL del sistema
2. **Ingresar credenciales**:
   - Email: Tu correo electrónico registrado
   - Contraseña: Tu contraseña personal
3. **Hacer clic en "Iniciar Sesión"**

> **💡 Tip**: Si olvidas tu contraseña, contacta al administrador del sistema.

### Tipos de Usuario

El sistema maneja 4 tipos de usuario con diferentes permisos:

| Tipo | Descripción | Permisos |
|------|-------------|----------|
| **👨‍💼 Administrador** | Control total del sistema | • Gestión de usuarios<br>• Gestión de hoteles<br>• Gestión de prendas<br>• Todas las funciones |
| **🏨 Recepcionista** | Personal del hotel | • Registrar guías<br>• Ver guías de su hotel |
| **🧽 Operario** | Personal de lavandería | • Procesar guías<br>• Actualizar estados |
| **👔 Encargado** | Supervisor del hotel | • Seguimiento de guías<br>• Reportes de su hotel |

## 📋 Funcionalidades por Tipo de Usuario

### 👨‍💼 Administrador

#### Gestión de Usuarios
1. **Acceder**: Menú lateral → "Mantenimientos" → "Usuarios"
2. **Crear usuario**:
   - Clic en "Nuevo Usuario"
   - Completar formulario:
     - Nombre completo
     - Correo electrónico
     - Teléfono
     - Perfil (rol)
     - Hotel (si aplica)
     - Contraseña
   - Clic en "Guardar"

3. **Editar usuario**:
   - Buscar usuario en la lista
   - Clic en el icono de edición
   - Modificar datos necesarios
   - Clic en "Actualizar"

#### Gestión de Hoteles
1. **Acceder**: Menú lateral → "Mantenimientos" → "Hoteles"
2. **Crear hotel**:
   - Clic en "Nuevo Hotel"
   - Completar información:
     - RUC
     - Razón social
     - Nombre comercial
     - Dirección
     - Correo de contacto
     - Teléfono
   - Clic en "Guardar"

#### Gestión de Prendas
1. **Acceder**: Menú lateral → "Mantenimientos" → "Prendas"
2. **Crear prenda**:
   - Clic en "Nueva Prenda"
   - Ingresar:
     - Nombre de la prenda
     - Descripción
     - Categoría
   - Clic en "Guardar"

### 🏨 Recepcionista

#### Registrar Nueva Guía

1. **Acceder**: Menú lateral → "Gestión de Guías" → "Registrar Guía"

2. **Completar información general**:
   - **Hotel**: Se selecciona automáticamente tu hotel
   - **Fecha de recolección**: Seleccionar fecha
   - **Chofer de recojo**: Elegir de la lista
   - **Observaciones**: Notas adicionales (opcional)

3. **Agregar prendas**:
   - Clic en "Agregar Prenda"
   - **Buscar prenda**: Escribir nombre para autocompletar
   - **Seleccionar** de la lista de sugerencias
   - **Cantidad**: Ingresar número de prendas sucias
   - **Devolución**: Marcar si la prenda se devuelve sin lavar

4. **Revisar información**:
   - Verificar todas las prendas agregadas
   - Revisar cantidades y totales
   - Confirmar datos del chofer y fecha

5. **Registrar guía**:
   - Clic en "Registrar Guía"
   - Aparecerá mensaje de confirmación
   - Se asignará número de guía automáticamente

> **💡 Tips para Recepcionistas**:
> - Usa el autocompletado escribiendo parte del nombre de la prenda
> - Verifica las cantidades antes de registrar
> - Agrega observaciones para casos especiales
> - El sistema calcula automáticamente los totales

#### Ver Guías del Hotel

1. **Acceder**: Menú lateral → "Gestión de Guías" → "Seguimiento"
2. **Filtrar guías**:
   - Por número de guía
   - Por estado
   - Clic en "Buscar"
3. **Ver detalle**: Clic en "Ver Detalle" en cualquier guía

### 🧽 Operario de Lavandería

#### Procesar Guías Pendientes

1. **Acceder**: Menú lateral → "Gestión de Guías" → "Procesar Guías"

2. **Ver guías disponibles**:
   - Se muestran guías en estado "Registrado" o "Pendiente"
   - Usar filtros para buscar guías específicas

3. **Procesar una guía**:
   - Clic en el icono de procesamiento (lápiz)
   - Se abre ventana de procesamiento

4. **Registrar cantidades limpias**:
   - Para cada prenda, ingresar **cantidad limpia**
   - El sistema calcula automáticamente las **cantidades pendientes**
   - Cantidad pendiente = Cantidad sucia - Cantidad limpia

5. **Estados resultantes**:
   - Si todas las prendas están completas → "Lista para Entregar"
   - Si hay prendas pendientes → "Pendiente"

6. **Confirmar procesamiento**:
   - Revisar todas las cantidades
   - Clic en "Procesar Guía"
   - Aparecerá notificación de éxito

> **💡 Tips para Operarios**:
> - Revisa cada prenda cuidadosamente
> - Si una prenda se perdió o dañó, ingresa la cantidad disponible
> - Las prendas marcadas como "DEVUELTA" no se procesan
> - Puedes procesar parcialmente y completar después

#### Casos Especiales

**Prenda Perdida o Dañada**:
- Ingresar cantidad limpia menor a la sucia
- La diferencia quedará como "pendiente"
- Agregar observaciones explicando el motivo

**Procesamiento Parcial**:
- Procesar las prendas que estén listas
- Dejar en 0 las que aún no se procesan
- El estado quedará como "Pendiente"
- Procesar nuevamente cuando estén listas

### 👔 Encargado de Hotel

#### Seguimiento de Guías

1. **Acceder**: Menú lateral → "Gestión de Guías" → "Seguimiento"

2. **Vista de tarjetas**:
   - Cada guía se muestra como una tarjeta
   - **Barra de progreso** visual del estado
   - **Información clave**: número, fecha, estado, chofer

3. **Filtrar información**:
   - **Por número de guía**: Buscar guía específica
   - **Por estado**: Ver guías en estado particular
   - Clic en "Buscar" para aplicar filtros

4. **Ver detalle completo**:
   - Clic en "Ver Detalle" en cualquier tarjeta
   - Se abre ventana con información completa:
     - Datos generales
     - Personal involucrado
     - Detalle de prendas
     - Historial de cambios
     - Observaciones

#### Interpretar Estados

| Estado | Significado | Progreso | Acción Requerida |
|--------|-------------|----------|------------------|
| 📝 **Registrado** | Guía creada, esperando procesamiento | 16% | Esperar procesamiento |
| ⏳ **Pendiente** | Procesamiento parcial | 33% | Seguimiento especial |
| 🔄 **Procesándose** | En lavandería | 50% | Esperar finalización |
| ✅ **Lista para Entregar** | Listo para recojo | 66% | Coordinar recojo |
| 🚚 **En Ruta** | Chofer en camino | 83% | Esperar llegada |
| 📦 **Entregado** | Proceso completado | 100% | Proceso finalizado |

## 🔍 Navegación del Sistema

### Menú Principal

El sistema está organizado en dos grupos principales:

#### 📊 Mantenimientos (Solo Administradores)
- **Usuarios**: Gestión de personal
- **Hoteles**: Gestión de clientes
- **Prendas**: Catálogo de productos

#### 📋 Gestión de Guías (Todos los usuarios)
- **Registrar Guía**: Crear nuevas guías (Recepcionistas)
- **Procesar Guías**: Procesar prendas (Operarios)
- **Seguimiento**: Monitorear estados (Encargados/Recepcionistas)

### Elementos Comunes

#### Paginación
- **Navegación**: Botones "Anterior" y "Siguiente"
- **Salto directo**: Clic en número de página
- **Información**: "Mostrando X de Y elementos"

#### Filtros
- **Campos de búsqueda**: Texto libre o selección
- **Botón "Buscar"**: Aplicar filtros
- **Limpiar**: Restablecer filtros

#### Notificaciones
- **Éxito**: Fondo verde, mensaje positivo
- **Error**: Fondo rojo, descripción del problema
- **Advertencia**: Fondo amarillo, información importante

## ❓ Preguntas Frecuentes

### Para Recepcionistas

**P: ¿Puedo modificar una guía después de registrarla?**
R: No, una vez registrada la guía no se puede modificar. Si hay errores, contacta al administrador.

**P: ¿Qué hago si no encuentro una prenda en el autocompletado?**
R: Contacta al administrador para que agregue la prenda al catálogo.

**P: ¿Puedo registrar una guía para otro hotel?**
R: No, solo puedes registrar guías para tu hotel asignado.

### Para Operarios

**P: ¿Qué hago si se perdió una prenda?**
R: Ingresa la cantidad disponible como "cantidad limpia". La diferencia quedará como pendiente.

**P: ¿Puedo procesar una guía en varias sesiones?**
R: Sí, puedes procesar parcialmente y completar después. El estado quedará como "Pendiente".

**P: ¿Qué significa "prenda devuelta"?**
R: Son prendas que el hotel devolvió sin procesar, generalmente por daños previos.

### Para Encargados

**P: ¿Con qué frecuencia se actualiza la información?**
R: La información se actualiza en tiempo real cuando los operarios procesan las guías.

**P: ¿Puedo ver guías de otros hoteles?**
R: No, solo puedes ver las guías de tu hotel asignado.

**P: ¿Cómo interpreto la barra de progreso?**
R: Representa el avance en el proceso: 0% (Registrado) hasta 100% (Entregado).

## 🆘 Solución de Problemas

### Problemas de Acceso

**No puedo iniciar sesión**:
1. Verificar email y contraseña
2. Verificar conexión a internet
3. Contactar al administrador

**La página no carga**:
1. Refrescar el navegador (F5)
2. Limpiar caché del navegador
3. Verificar conexión a internet

### Problemas de Funcionalidad

**No aparecen las prendas en el autocompletado**:
1. Verificar que el hotel esté seleccionado
2. Escribir al menos 2 caracteres
3. Contactar al administrador si persiste

**No puedo procesar una guía**:
1. Verificar que la guía esté en estado "Registrado" o "Pendiente"
2. Verificar permisos de usuario
3. Refrescar la página

**Los filtros no funcionan**:
1. Verificar formato de datos ingresados
2. Hacer clic en "Buscar" después de cambiar filtros
3. Limpiar filtros y volver a intentar

## 📞 Soporte Técnico

### Contacto
- **Email**: soporte@lavanderia-system.com
- **Teléfono**: +51 XXX-XXX-XXX
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

### Información para Reportar Problemas

Cuando contactes soporte, proporciona:
1. **Tipo de usuario** (Administrador, Recepcionista, etc.)
2. **Navegador utilizado** (Chrome, Firefox, etc.)
3. **Descripción detallada** del problema
4. **Pasos para reproducir** el error
5. **Capturas de pantalla** si es posible

### Actualizaciones del Sistema

- Las actualizaciones se realizan automáticamente
- Se notificará por email sobre nuevas funcionalidades
- No se requiere acción del usuario para actualizaciones

---

**¡Gracias por usar el Sistema de Gestión de Guías de Lavandería!**

*Esta guía se actualiza regularmente. Versión: 1.0 - Noviembre 2024*