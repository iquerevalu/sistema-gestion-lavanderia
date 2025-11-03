# Documento de Requerimientos - Sistema de Gestión de Guías de Lavandería

## Introducción

El Sistema de Gestión de Guías de Lavandería es una aplicación web serverless que digitaliza los procesos manuales de registro, seguimiento y entrega de ropa entre hoteles y lavanderías. El sistema permite a diferentes tipos de usuarios (recepcionistas, operadores, encargados) gestionar el flujo completo de las guías de lavandería desde el registro inicial hasta la entrega final.

## Glosario

- **Sistema_Guias**: El sistema de gestión de guías de lavandería
- **Usuario_Recepcionista**: Usuario del hotel encargado de registrar guías
- **Usuario_Operador**: Usuario de la lavandería encargado de empaquetar y procesar ropa
- **Usuario_Encargado**: Usuario del hotel que supervisa el estado de las guías
- **Usuario_Administrador**: Usuario con permisos completos del sistema
- **Guia_Lavanderia**: Documento que registra el envío de ropa del hotel a la lavandería
- **Hotel_Entidad**: Establecimiento hotelero cliente del servicio de lavandería
- **Prenda_Item**: Artículo de ropa específico con cantidad asociada
- **Estado_Guia**: Situación actual de procesamiento de una guía
- **Numero_Guia**: Identificador único secuencial por hotel

## Requerimientos

### Requerimiento 1

**Historia de Usuario:** Como recepcionista del hotel, quiero registrar una nueva guía de lavandería, para que pueda digitalizar el proceso de envío de ropa a la lavandería.

#### Criterios de Aceptación

1. WHEN el Usuario_Recepcionista accede al formulario de registro, THE Sistema_Guias SHALL mostrar los campos requeridos para crear una Guia_Lavanderia
2. WHEN el Usuario_Recepcionista selecciona un Hotel_Entidad, THE Sistema_Guias SHALL generar automáticamente el próximo Numero_Guia secuencial para ese hotel
3. WHEN el Usuario_Recepcionista completa el registro, THE Sistema_Guias SHALL asignar el estado "Registrado" a la Guia_Lavanderia
4. THE Sistema_Guias SHALL permitir registrar prendas con estado "Devueltas" sin generar cobro
5. THE Sistema_Guias SHALL validar que todos los campos obligatorios estén completos antes de guardar

### Requerimiento 2

**Historia de Usuario:** Como operador de la lavandería, quiero visualizar y procesar las guías pendientes, para que pueda registrar las cantidades de ropa limpia que se van a entregar.

#### Criterios de Aceptación

1. WHEN el Usuario_Operador accede al módulo de procesamiento, THE Sistema_Guias SHALL mostrar únicamente guías con estado "Registrado" y "Pendiente"
2. THE Sistema_Guias SHALL permitir filtrar guías por Numero_Guia y Hotel_Entidad
3. WHEN el Usuario_Operador selecciona una Guia_Lavanderia, THE Sistema_Guias SHALL mostrar las cantidades registradas bloqueadas para edición
4. WHEN el Usuario_Operador ingresa cantidades de ropa limpia, THE Sistema_Guias SHALL calcular automáticamente las prendas pendientes
5. IF todas las prendas están completas, THEN THE Sistema_Guias SHALL cambiar el estado a "Lista para Entregar"

### Requerimiento 3

**Historia de Usuario:** Como encargado del hotel, quiero visualizar el estado de mis guías, para que pueda hacer seguimiento del progreso de la ropa enviada a lavandería.

#### Criterios de Aceptación

1. WHEN el Usuario_Encargado accede al módulo de seguimiento, THE Sistema_Guias SHALL mostrar únicamente las guías de su Hotel_Entidad asignado
2. THE Sistema_Guias SHALL mostrar los estados: "Procesándose", "Lista para Entregar", "En Ruta", "Entregado"
3. THE Sistema_Guias SHALL permitir al Usuario_Operador cambiar estados de las guías sin modificar cantidades
4. THE Sistema_Guias SHALL mostrar el progreso visual del estado actual de cada Guia_Lavanderia
5. THE Sistema_Guias SHALL actualizar automáticamente la información de estado en tiempo real

### Requerimiento 4

**Historia de Usuario:** Como administrador del sistema, quiero gestionar los datos maestros (hoteles, usuarios, prendas), para que pueda mantener la información base del sistema actualizada.

#### Criterios de Aceptación

1. THE Sistema_Guias SHALL permitir crear, editar y eliminar registros de Hotel_Entidad con RUC, nombre, razón social, teléfono, correo y dirección
2. THE Sistema_Guias SHALL permitir gestionar usuarios con DNI, nombres, tipo de usuario y rol específico
3. THE Sistema_Guias SHALL validar que usuarios tipo "Encargado Hotel" estén asociados a un Hotel_Entidad específico
4. THE Sistema_Guias SHALL permitir gestionar catálogo de Prenda_Item disponibles
5. THE Sistema_Guias SHALL restringir el acceso a mantenimientos según el tipo de usuario

### Requerimiento 5

**Historia de Usuario:** Como usuario del sistema, quiero autenticarme de forma segura, para que pueda acceder únicamente a las funcionalidades correspondientes a mi rol.

#### Criterios de Aceptación

1. THE Sistema_Guias SHALL validar credenciales de usuario antes de permitir acceso
2. WHEN un usuario se autentica exitosamente, THE Sistema_Guias SHALL redirigir a la vista correspondiente según su tipo de usuario
3. THE Sistema_Guias SHALL mantener la sesión activa durante el uso normal
4. THE Sistema_Guias SHALL cerrar sesión automáticamente después de un período de inactividad
5. THE Sistema_Guias SHALL registrar intentos de acceso para auditoría

### Requerimiento 6

**Historia de Usuario:** Como usuario del sistema, quiero acceder únicamente a las funcionalidades de mi rol, para que el sistema mantenga la seguridad y separación de responsabilidades.

#### Criterios de Aceptación

1. WHEN un Usuario_Recepcionista se autentica, THE Sistema_Guias SHALL mostrar únicamente el módulo de registro de guías
2. WHEN un Usuario_Operador se autentica, THE Sistema_Guias SHALL mostrar únicamente el módulo de procesamiento de cantidades
3. WHEN un Usuario_Encargado se autentica, THE Sistema_Guias SHALL mostrar únicamente el seguimiento de guías de su Hotel_Entidad
4. WHEN un Usuario_Administrador se autentica, THE Sistema_Guias SHALL proporcionar acceso completo a todos los módulos
5. THE Sistema_Guias SHALL bloquear el acceso a funcionalidades no autorizadas según el tipo de usuario