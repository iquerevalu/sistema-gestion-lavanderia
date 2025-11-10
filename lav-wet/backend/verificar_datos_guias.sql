-- ============================================
-- VERIFICAR DATOS PARA CREACIÓN DE GUÍAS
-- ============================================

-- 1. Verificar hoteles activos
SELECT 
    id_hotel,
    nombre_comercial,
    razon_social,
    estado
FROM lv_hotel
WHERE estado = 1
ORDER BY nombre_comercial;

-- 2. Verificar usuarios por perfil (necesitamos choferes y recepcionistas)
SELECT 
    u.id_usuario,
    u.nombre_completo,
    u.correo,
    p.nombre_perfil,
    h.nombre_comercial as hotel,
    u.estado
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
WHERE u.estado = 1
ORDER BY p.nombre_perfil, u.nombre_completo;

-- 3. Verificar choferes específicamente
SELECT 
    u.id_usuario,
    u.nombre_completo,
    u.correo,
    u.telefono
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil = 'Chofer' AND u.estado = 1
ORDER BY u.nombre_completo;

-- 4. Verificar recepcionistas/operadores por hotel
SELECT 
    u.id_usuario,
    u.nombre_completo,
    u.correo,
    p.nombre_perfil,
    h.nombre_comercial as hotel
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
WHERE p.nombre_perfil IN ('Operador', 'Supervisor') 
  AND u.estado = 1
ORDER BY h.nombre_comercial, u.nombre_completo;

-- 5. Verificar prendas configuradas por hotel (lv_hotel_prenda)
SELECT 
    hp.id_hotel_prenda,
    h.nombre_comercial as hotel,
    p.nombre_prenda,
    c.nombre_categoria,
    hp.precio_unitario,
    hp.estado
FROM lv_hotel_prenda hp
INNER JOIN lv_hotel h ON hp.hotel_id = h.id_hotel
INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
WHERE hp.estado = 1
ORDER BY h.nombre_comercial, c.nombre_categoria, p.nombre_prenda;

-- 6. Contar prendas por hotel
SELECT 
    h.id_hotel,
    h.nombre_comercial,
    COUNT(hp.id_hotel_prenda) as total_prendas_configuradas
FROM lv_hotel h
LEFT JOIN lv_hotel_prenda hp ON h.id_hotel = hp.hotel_id AND hp.estado = 1
WHERE h.estado = 1
GROUP BY h.id_hotel, h.nombre_comercial
ORDER BY h.nombre_comercial;

-- 7. Verificar si existen guías registradas
SELECT 
    g.id_guia,
    g.numero_guia,
    h.nombre_comercial as hotel,
    g.estado,
    g.fecha_recoleccion,
    g.fecha_entrega,
    g.fecha_creacion
FROM lv_guia_lavanderia g
INNER JOIN lv_hotel h ON g.hotel_id = h.id_hotel
ORDER BY g.fecha_creacion DESC
LIMIT 10;

-- 8. Verificar último número de guía
SELECT MAX(numero_guia) as ultimo_numero_guia
FROM lv_guia_lavanderia;

-- ============================================
-- RESUMEN DE REQUISITOS PARA CREAR UNA GUÍA
-- ============================================
-- Para crear una guía necesitas:
-- 1. Un hotel activo (estado = 1)
-- 2. Un chofer activo para recoger
-- 3. Un recepcionista/operador del hotel para recibir
-- 4. Prendas configuradas para ese hotel en lv_hotel_prenda
-- ============================================
