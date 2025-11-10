-- ============================================
-- SEED: Configuración de prendas por hotel
-- ============================================
-- Este script asigna prendas a los hoteles con sus precios

USE db_lavanderia;

-- Limpiar datos existentes (opcional)
-- DELETE FROM lv_hotel_prenda;

-- Obtener IDs de hoteles y prendas
-- Asumiendo que ya tienes hoteles y prendas creados

-- Hotel 1: Asignar prendas de ropa de cama y toallas
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario, estado) VALUES
-- Ropa de cama (asumiendo categoria_id = 3 para Mantelería, ajustar según tu BD)
(1, 1, 5.50, 1),  -- Mantel Mesa 2
(1, 2, 6.50, 1),  -- Mantel Mesa 4
(1, 3, 8.00, 1),  -- Mantel Mesa 6
(1, 4, 2.00, 1),  -- Servilleta de Tela
-- Toallas (asumiendo categoria_id = 2)
(1, 5, 4.50, 1),  -- Toalla de Baño
(1, 6, 3.00, 1),  -- Toalla de Mano
(1, 7, 3.50, 1),  -- Toalla de Piso
(1, 8, 2.50, 1);  -- Toalla de Pies

-- Hotel 2: Asignar prendas similares con precios diferentes
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario, estado) VALUES
(2, 1, 5.00, 1),
(2, 2, 6.00, 1),
(2, 3, 7.50, 1),
(2, 4, 1.80, 1),
(2, 5, 4.00, 1),
(2, 6, 2.80, 1),
(2, 7, 3.20, 1),
(2, 8, 2.30, 1);

-- Hotel 3: Asignar prendas
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario, estado) VALUES
(3, 1, 5.80, 1),
(3, 2, 6.80, 1),
(3, 3, 8.50, 1),
(3, 4, 2.20, 1),
(3, 5, 4.80, 1),
(3, 6, 3.20, 1),
(3, 7, 3.80, 1),
(3, 8, 2.80, 1);

-- Verificar datos insertados
SELECT 
    hp.id_hotel_prenda,
    h.nombre_comercial as hotel,
    p.nombre_prenda,
    hp.precio_unitario,
    hp.estado
FROM lv_hotel_prenda hp
INNER JOIN lv_hotel h ON hp.hotel_id = h.id_hotel
INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
ORDER BY h.nombre_comercial, p.nombre_prenda;

-- ============================================
-- NOTA: Ajusta los IDs de hotel_id y prenda_id
-- según los datos reales en tu base de datos
-- ============================================
