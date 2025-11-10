-- Verificación final antes de crear guías
USE db_lavanderia;

SELECT '✓ REQUISITOS PARA CREAR GUÍAS' as titulo;

-- 1. Hoteles activos
SELECT 
    '1. Hoteles activos' as requisito,
    COUNT(*) as cantidad,
    CASE WHEN COUNT(*) > 0 THEN '✓ OK' ELSE '✗ FALTA' END as estado
FROM lv_hotel WHERE estado = 1;

-- 2. Choferes activos
SELECT 
    '2. Choferes activos' as requisito,
    COUNT(*) as cantidad,
    CASE WHEN COUNT(*) > 0 THEN '✓ OK' ELSE '✗ FALTA' END as estado
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil = 'Chofer' AND u.estado = 1;

-- 3. Recepcionistas activos
SELECT 
    '3. Recepcionistas activos' as requisito,
    COUNT(*) as cantidad,
    CASE WHEN COUNT(*) > 0 THEN '✓ OK' ELSE '✗ FALTA' END as estado
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil = 'Recepcionista' AND u.estado = 1;

-- 4. Prendas configuradas en hoteles
SELECT 
    '4. Prendas configuradas' as requisito,
    COUNT(*) as cantidad,
    CASE WHEN COUNT(*) > 0 THEN '✓ OK' ELSE '✗ FALTA' END as estado
FROM lv_hotel_prenda WHERE estado = 1;

-- Detalle por hotel
SELECT '=== DETALLE POR HOTEL ===' as info;

SELECT 
    h.id_hotel,
    h.nombre_comercial,
    COUNT(hp.id_hotel_prenda) as prendas_configuradas,
    (SELECT COUNT(*) FROM lv_usuario u 
     INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil 
     WHERE u.hotel_id = h.id_hotel 
     AND p.nombre_perfil = 'Recepcionista' 
     AND u.estado = 1) as recepcionistas
FROM lv_hotel h
LEFT JOIN lv_hotel_prenda hp ON h.id_hotel = hp.hotel_id AND hp.estado = 1
WHERE h.estado = 1
GROUP BY h.id_hotel, h.nombre_comercial;

-- Choferes disponibles
SELECT '=== CHOFERES DISPONIBLES ===' as info;

SELECT 
    u.id_usuario,
    u.nombre_completo,
    u.correo,
    u.telefono
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil = 'Chofer' AND u.estado = 1;

-- Resumen final
SELECT '=== RESUMEN ===' as info;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM lv_hotel WHERE estado = 1) > 0
         AND (SELECT COUNT(*) FROM lv_usuario u INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil WHERE p.nombre_perfil = 'Chofer' AND u.estado = 1) > 0
         AND (SELECT COUNT(*) FROM lv_usuario u INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil WHERE p.nombre_perfil = 'Recepcionista' AND u.estado = 1) > 0
         AND (SELECT COUNT(*) FROM lv_hotel_prenda WHERE estado = 1) > 0
        THEN '✓✓✓ TODO LISTO PARA CREAR GUÍAS ✓✓✓'
        ELSE '✗ FALTAN REQUISITOS'
    END as estado_final;
