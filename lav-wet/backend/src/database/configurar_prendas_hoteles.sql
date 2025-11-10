-- ============================================
-- CONFIGURAR PRENDAS EN HOTELES
-- ============================================
-- Este script asigna todas las prendas disponibles a todos los hoteles activos
-- con precios de ejemplo

USE db_lavanderia;

-- Ver hoteles disponibles
SELECT '=== HOTELES DISPONIBLES ===' as info;
SELECT id_hotel, nombre_comercial FROM lv_hotel WHERE estado = 1;

-- Ver prendas disponibles
SELECT '=== PRENDAS DISPONIBLES ===' as info;
SELECT 
    p.id_prenda,
    p.nombre_prenda,
    c.nombre_categoria
FROM lv_prenda p
INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
ORDER BY c.nombre_categoria, p.nombre_prenda;

-- ============================================
-- OPCIÓN 1: Configurar prendas para UN hotel específico
-- ============================================
-- Reemplaza @hotel_id con el ID del hotel que quieres configurar

SET @hotel_id = 1; -- CAMBIA ESTE NÚMERO AL ID DE TU HOTEL

-- Insertar todas las prendas para ese hotel con precio base de 5.00
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario, estado)
SELECT 
    @hotel_id,
    p.id_prenda,
    5.00 as precio_unitario,  -- Precio base, puedes ajustarlo después
    1 as estado
FROM lv_prenda p
WHERE NOT EXISTS (
    SELECT 1 FROM lv_hotel_prenda hp 
    WHERE hp.hotel_id = @hotel_id AND hp.prenda_id = p.id_prenda
);

-- ============================================
-- OPCIÓN 2: Configurar prendas para TODOS los hoteles
-- ============================================
-- Descomenta esto si quieres configurar todas las prendas en todos los hoteles

/*
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario, estado)
SELECT 
    h.id_hotel,
    p.id_prenda,
    5.00 as precio_unitario,
    1 as estado
FROM lv_hotel h
CROSS JOIN lv_prenda p
WHERE h.estado = 1
  AND NOT EXISTS (
    SELECT 1 FROM lv_hotel_prenda hp 
    WHERE hp.hotel_id = h.id_hotel AND hp.prenda_id = p.id_prenda
);
*/

-- ============================================
-- VERIFICAR RESULTADO
-- ============================================
SELECT '=== PRENDAS CONFIGURADAS POR HOTEL ===' as info;

SELECT 
    h.nombre_comercial as hotel,
    COUNT(hp.id_hotel_prenda) as total_prendas,
    MIN(hp.precio_unitario) as precio_min,
    MAX(hp.precio_unitario) as precio_max,
    AVG(hp.precio_unitario) as precio_promedio
FROM lv_hotel h
LEFT JOIN lv_hotel_prenda hp ON h.id_hotel = hp.hotel_id AND hp.estado = 1
WHERE h.estado = 1
GROUP BY h.id_hotel, h.nombre_comercial
ORDER BY h.nombre_comercial;

-- Ver detalle de las primeras 20 configuraciones
SELECT '=== DETALLE DE CONFIGURACIONES (primeras 20) ===' as info;

SELECT 
    h.nombre_comercial as hotel,
    p.nombre_prenda,
    c.nombre_categoria,
    hp.precio_unitario
FROM lv_hotel_prenda hp
INNER JOIN lv_hotel h ON hp.hotel_id = h.id_hotel
INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
WHERE hp.estado = 1
ORDER BY h.nombre_comercial, c.nombre_categoria, p.nombre_prenda
LIMIT 20;

-- ============================================
-- NOTAS:
-- 1. Ejecuta primero la OPCIÓN 1 para un hotel específico
-- 2. Si funciona bien, puedes ejecutar la OPCIÓN 2 para todos
-- 3. Los precios están en 5.00 por defecto, ajústalos según necesites
-- 4. Puedes actualizar precios después con:
--    UPDATE lv_hotel_prenda SET precio_unitario = X WHERE id_hotel_prenda = Y;
-- ============================================
