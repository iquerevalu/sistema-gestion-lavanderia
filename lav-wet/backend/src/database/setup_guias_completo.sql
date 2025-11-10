-- ============================================
-- SETUP COMPLETO PARA CREACIÓN DE GUÍAS
-- ============================================

USE db_lavanderia;

-- ============================================
-- 1. VERIFICAR DATOS EXISTENTES
-- ============================================

SELECT '=== VERIFICACIÓN DE DATOS ===' as info;

SELECT 'Hoteles activos:' as tipo, COUNT(*) as cantidad
FROM lv_hotel WHERE estado = 1;

SELECT 'Choferes activos:' as tipo, COUNT(*) as cantidad
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil = 'Chofer' AND u.estado = 1;

SELECT 'Operadores activos:' as tipo, COUNT(*) as cantidad
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil IN ('Operador', 'Supervisor') AND u.estado = 1;

SELECT 'Prendas disponibles:' as tipo, COUNT(*) as cantidad
FROM lv_prenda;

SELECT 'Prendas configuradas en hoteles:' as tipo, COUNT(*) as cantidad
FROM lv_hotel_prenda WHERE estado = 1;

-- ============================================
-- 2. LISTAR DATOS DISPONIBLES
-- ============================================

SELECT '=== HOTELES DISPONIBLES ===' as info;
SELECT id_hotel, nombre_comercial, estado
FROM lv_hotel
ORDER BY nombre_comercial;

SELECT '=== CHOFERES DISPONIBLES ===' as info;
SELECT u.id_usuario, u.nombre_completo, u.correo
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil = 'Chofer' AND u.estado = 1;

SELECT '=== OPERADORES/RECEPCIONISTAS POR HOTEL ===' as info;
SELECT 
    u.id_usuario, 
    u.nombre_completo, 
    p.nombre_perfil,
    h.nombre_comercial as hotel
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
WHERE p.nombre_perfil IN ('Operador', 'Supervisor') AND u.estado = 1
ORDER BY h.nombre_comercial;

SELECT '=== PRENDAS DISPONIBLES ===' as info;
SELECT 
    p.id_prenda,
    p.nombre_prenda,
    c.nombre_categoria
FROM lv_prenda p
INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
ORDER BY c.nombre_categoria, p.nombre_prenda;

SELECT '=== PRENDAS CONFIGURADAS POR HOTEL ===' as info;
SELECT 
    h.nombre_comercial as hotel,
    COUNT(hp.id_hotel_prenda) as total_prendas
FROM lv_hotel h
LEFT JOIN lv_hotel_prenda hp ON h.id_hotel = hp.hotel_id AND hp.estado = 1
WHERE h.estado = 1
GROUP BY h.id_hotel, h.nombre_comercial;

-- ============================================
-- 3. SCRIPT PARA CONFIGURAR PRENDAS EN HOTELES
-- ============================================
-- Ejecuta esto solo si no tienes prendas configuradas

/*
-- Ejemplo: Configurar prendas para el primer hotel
-- Ajusta los IDs según tu base de datos

INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario, estado)
SELECT 
    1 as hotel_id,  -- ID del hotel
    id_prenda,
    CASE 
        WHEN nombre_prenda LIKE '%Mesa 2%' THEN 5.00
        WHEN nombre_prenda LIKE '%Mesa 4%' THEN 6.00
        WHEN nombre_prenda LIKE '%Mesa 6%' THEN 8.00
        WHEN nombre_prenda LIKE '%Servilleta%' THEN 2.00
        WHEN nombre_prenda LIKE '%Toalla de Baño%' THEN 4.50
        WHEN nombre_prenda LIKE '%Toalla de Mano%' THEN 3.00
        WHEN nombre_prenda LIKE '%Toalla de Piso%' THEN 3.50
        WHEN nombre_prenda LIKE '%Toalla de Pies%' THEN 2.50
        ELSE 5.00
    END as precio_unitario,
    1 as estado
FROM lv_prenda
WHERE id_prenda IN (1, 2, 3, 4, 5, 6, 7, 8);
*/

-- ============================================
-- 4. VERIFICACIÓN FINAL
-- ============================================

SELECT '=== RESUMEN FINAL ===' as info;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM lv_hotel WHERE estado = 1) > 0 THEN '✓'
        ELSE '✗'
    END as check_hoteles,
    CASE 
        WHEN (SELECT COUNT(*) FROM lv_usuario u INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil WHERE p.nombre_perfil = 'Chofer' AND u.estado = 1) > 0 THEN '✓'
        ELSE '✗'
    END as check_choferes,
    CASE 
        WHEN (SELECT COUNT(*) FROM lv_usuario u INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil WHERE p.nombre_perfil IN ('Operador', 'Supervisor') AND u.estado = 1) > 0 THEN '✓'
        ELSE '✗'
    END as check_operadores,
    CASE 
        WHEN (SELECT COUNT(*) FROM lv_hotel_prenda WHERE estado = 1) > 0 THEN '✓'
        ELSE '✗'
    END as check_prendas_hotel;

SELECT 
    'Si todos los checks son ✓, puedes crear guías' as mensaje,
    'Si alguno es ✗, necesitas crear esos datos primero' as nota;
