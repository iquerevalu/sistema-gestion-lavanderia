-- Insertar categorías y prendas de ejemplo para pruebas
USE db_lavanderia;

-- Insertar categorías de prendas
INSERT INTO lv_categoria (nombre_categoria, descripcion) VALUES
('Ropa de Cama', 'Sábanas, fundas, cobertores y edredones'),
('Toallas', 'Toallas de baño, mano y piso'),
('Cortinas', 'Cortinas decorativas y blackout'),
('Mantelería', 'Manteles y servilletas'),
('Uniformes', 'Uniformes del personal del hotel');

-- Insertar prendas por categoría
-- Ropa de Cama
INSERT INTO lv_prenda (categoria_id, nombre_prenda, descripcion) VALUES
(1, 'Sábana Individual', 'Sábana para cama individual 90x190cm'),
(1, 'Sábana Matrimonial', 'Sábana para cama matrimonial 135x190cm'),
(1, 'Sábana King Size', 'Sábana para cama king size 180x200cm'),
(1, 'Funda de Almohada', 'Funda de almohada estándar 50x70cm'),
(1, 'Funda de Almohada King', 'Funda de almohada king size 50x90cm'),
(1, 'Cobertor Individual', 'Cobertor para cama individual'),
(1, 'Cobertor Matrimonial', 'Cobertor para cama matrimonial'),
(1, 'Cobertor King Size', 'Cobertor para cama king size'),
(1, 'Protector de Colchón Individual', 'Protector impermeable individual'),
(1, 'Protector de Colchón Matrimonial', 'Protector impermeable matrimonial'),
(1, 'Protector de Colchón King', 'Protector impermeable king size'),
(1, 'Edredón Individual', 'Edredón relleno individual'),
(1, 'Edredón Matrimonial', 'Edredón relleno matrimonial'),
(1, 'Edredón King Size', 'Edredón relleno king size'),
(1, 'Cubrecama Individual', 'Cubrecama decorativo individual'),
(1, 'Cubrecama Matrimonial', 'Cubrecama decorativo matrimonial');

-- Toallas
INSERT INTO lv_prenda (categoria_id, nombre_prenda, descripcion) VALUES
(2, 'Toalla de Baño', 'Toalla de baño 70x140cm'),
(2, 'Toalla de Mano', 'Toalla de mano 50x90cm'),
(2, 'Toalla de Piso', 'Toalla de piso antideslizante'),
(2, 'Toalla de Playa', 'Toalla grande para playa/piscina'),
(2, 'Toallón', 'Toalla extra grande 90x180cm');

-- Cortinas
INSERT INTO lv_prenda (categoria_id, nombre_prenda, descripcion) VALUES
(3, 'Cortina de Baño', 'Cortina impermeable para ducha'),
(3, 'Cortina Blackout', 'Cortina opaca para habitaciones'),
(3, 'Cortina Decorativa', 'Cortina ligera decorativa');

-- Mantelería
INSERT INTO lv_prenda (categoria_id, nombre_prenda, descripcion) VALUES
(4, 'Mantel Individual', 'Mantel para mesa individual'),
(4, 'Mantel para 4 personas', 'Mantel para mesa de 4 personas'),
(4, 'Mantel para 6 personas', 'Mantel para mesa de 6 personas'),
(4, 'Servilleta de Tela', 'Servilleta de tela reutilizable');

-- Uniformes
INSERT INTO lv_prenda (categoria_id, nombre_prenda, descripcion) VALUES
(5, 'Uniforme de Recepción', 'Uniforme completo de recepcionista'),
(5, 'Uniforme de Limpieza', 'Uniforme de personal de limpieza'),
(5, 'Uniforme de Cocina', 'Uniforme de chef/cocinero'),
(5, 'Delantal', 'Delantal de cocina o servicio');

-- Asignar precios por hotel para las prendas (ejemplo para los primeros 3 hoteles)
-- Hotel 1 - Precios estándar
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario) 
SELECT 1, id_prenda, 
  CASE 
    WHEN categoria_id = 1 THEN -- Ropa de Cama
      CASE 
        WHEN nombre_prenda LIKE '%Individual%' THEN 5.00
        WHEN nombre_prenda LIKE '%Matrimonial%' THEN 8.00
        WHEN nombre_prenda LIKE '%King%' THEN 12.00
        WHEN nombre_prenda LIKE '%Funda%' AND nombre_prenda NOT LIKE '%King%' THEN 2.50
        WHEN nombre_prenda LIKE '%Funda%King%' THEN 3.00
        WHEN nombre_prenda LIKE '%Cobertor Individual%' THEN 12.00
        WHEN nombre_prenda LIKE '%Cobertor Matrimonial%' THEN 15.00
        WHEN nombre_prenda LIKE '%Cobertor King%' THEN 18.00
        WHEN nombre_prenda LIKE '%Protector%Individual%' THEN 10.00
        WHEN nombre_prenda LIKE '%Protector%Matrimonial%' THEN 12.00
        WHEN nombre_prenda LIKE '%Protector%King%' THEN 15.00
        WHEN nombre_prenda LIKE '%Edredón Individual%' THEN 18.00
        WHEN nombre_prenda LIKE '%Edredón Matrimonial%' THEN 25.00
        WHEN nombre_prenda LIKE '%Edredón King%' THEN 30.00
        WHEN nombre_prenda LIKE '%Cubrecama Individual%' THEN 15.00
        WHEN nombre_prenda LIKE '%Cubrecama Matrimonial%' THEN 20.00
        ELSE 10.00
      END
    WHEN categoria_id = 2 THEN -- Toallas
      CASE 
        WHEN nombre_prenda LIKE '%Baño%' THEN 6.00
        WHEN nombre_prenda LIKE '%Mano%' THEN 3.50
        WHEN nombre_prenda LIKE '%Piso%' THEN 4.00
        WHEN nombre_prenda LIKE '%Playa%' THEN 8.00
        WHEN nombre_prenda LIKE '%Toallón%' THEN 10.00
        ELSE 5.00
      END
    WHEN categoria_id = 3 THEN -- Cortinas
      CASE 
        WHEN nombre_prenda LIKE '%Baño%' THEN 12.00
        WHEN nombre_prenda LIKE '%Blackout%' THEN 20.00
        WHEN nombre_prenda LIKE '%Decorativa%' THEN 15.00
        ELSE 12.00
      END
    WHEN categoria_id = 4 THEN -- Mantelería
      CASE 
        WHEN nombre_prenda LIKE '%Individual%' THEN 4.00
        WHEN nombre_prenda LIKE '%4 personas%' THEN 8.00
        WHEN nombre_prenda LIKE '%6 personas%' THEN 12.00
        WHEN nombre_prenda LIKE '%Servilleta%' THEN 1.50
        ELSE 5.00
      END
    WHEN categoria_id = 5 THEN -- Uniformes
      CASE 
        WHEN nombre_prenda LIKE '%Recepción%' THEN 15.00
        WHEN nombre_prenda LIKE '%Limpieza%' THEN 12.00
        WHEN nombre_prenda LIKE '%Cocina%' THEN 18.00
        WHEN nombre_prenda LIKE '%Delantal%' THEN 8.00
        ELSE 12.00
      END
    ELSE 5.00
  END
FROM lv_prenda;

-- Copiar precios para los otros hoteles (con pequeñas variaciones)
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario)
SELECT 2, prenda_id, precio_unitario * 1.1 FROM lv_hotel_prenda WHERE hotel_id = 1;

INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario)
SELECT 3, prenda_id, precio_unitario * 0.95 FROM lv_hotel_prenda WHERE hotel_id = 1;

-- Verificar las prendas insertadas
SELECT 
    c.nombre_categoria,
    p.nombre_prenda,
    p.descripcion,
    COUNT(hp.hotel_id) as hoteles_asignados
FROM lv_prenda p
INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
LEFT JOIN lv_hotel_prenda hp ON p.id_prenda = hp.prenda_id
GROUP BY p.id_prenda, c.nombre_categoria, p.nombre_prenda, p.descripcion
ORDER BY c.nombre_categoria, p.nombre_prenda;