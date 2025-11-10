-- Verificar prendas configuradas para Hotel Miraflores
USE db_lavanderia;

-- 1. Buscar el ID del hotel Miraflores
SELECT id_hotel, nombre_comercial, razon_social 
FROM lv_hotel 
WHERE nombre_comercial LIKE '%Miraflores%' OR razon_social LIKE '%Miraflores%';

-- 2. Ver cuántas prendas tiene configuradas (ajusta el id_hotel según el resultado anterior)
SELECT 
    h.id_hotel,
    h.nombre_comercial,
    COUNT(hp.id_hotel_prenda) as total_prendas_configuradas,
    COUNT(CASE WHEN hp.estado = 1 THEN 1 END) as prendas_activas
FROM lv_hotel h
LEFT JOIN lv_hotel_prenda hp ON h.id_hotel = hp.hotel_id
WHERE h.nombre_comercial LIKE '%Miraflores%'
GROUP BY h.id_hotel, h.nombre_comercial;

-- 3. Ver el detalle de las prendas configuradas
SELECT 
    hp.id_hotel_prenda,
    p.id_prenda,
    p.nombre_prenda,
    c.nombre_categoria,
    hp.precio_unitario,
    hp.estado
FROM lv_hotel_prenda hp
INNER JOIN lv_hotel h ON hp.hotel_id = h.id_hotel
INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
WHERE h.nombre_comercial LIKE '%Miraflores%'
ORDER BY c.nombre_categoria, p.nombre_prenda;

-- 4. Ver qué prendas NO están configuradas para este hotel
SELECT 
    p.id_prenda,
    p.nombre_prenda,
    c.nombre_categoria,
    'NO CONFIGURADA' as estado
FROM lv_prenda p
INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
WHERE NOT EXISTS (
    SELECT 1 
    FROM lv_hotel_prenda hp
    INNER JOIN lv_hotel h ON hp.hotel_id = h.id_hotel
    WHERE hp.prenda_id = p.id_prenda 
      AND h.nombre_comercial LIKE '%Miraflores%'
)
ORDER BY c.nombre_categoria, p.nombre_prenda;

-- 5. Comparar con el total de prendas disponibles
SELECT 
    'Total prendas en catálogo' as descripcion,
    COUNT(*) as cantidad
FROM lv_prenda
UNION ALL
SELECT 
    'Prendas configuradas en Miraflores',
    COUNT(*)
FROM lv_hotel_prenda hp
INNER JOIN lv_hotel h ON hp.hotel_id = h.id_hotel
WHERE h.nombre_comercial LIKE '%Miraflores%' AND hp.estado = 1;
