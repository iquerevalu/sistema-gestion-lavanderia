-- Verificar configuración de prendas en hoteles
USE db_lavanderia;

-- 1. Ver si hay prendas configuradas
SELECT COUNT(*) as total_configuraciones FROM lv_hotel_prenda WHERE estado = 1;

-- 2. Ver prendas por hotel
SELECT 
    h.id_hotel,
    h.nombre_comercial,
    COUNT(hp.id_hotel_prenda) as prendas_configuradas
FROM lv_hotel h
LEFT JOIN lv_hotel_prenda hp ON h.id_hotel = hp.hotel_id AND hp.estado = 1
WHERE h.estado = 1
GROUP BY h.id_hotel, h.nombre_comercial
ORDER BY h.nombre_comercial;

-- 3. Ver detalle de prendas configuradas
SELECT 
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

-- 4. Ver hoteles sin prendas configuradas
SELECT 
    h.id_hotel,
    h.nombre_comercial,
    'SIN PRENDAS CONFIGURADAS' as estado
FROM lv_hotel h
WHERE h.estado = 1
  AND NOT EXISTS (
    SELECT 1 FROM lv_hotel_prenda hp 
    WHERE hp.hotel_id = h.id_hotel AND hp.estado = 1
  );
