-- Agregar campo RUC a la tabla lv_hotel
ALTER TABLE lv_hotel 
ADD COLUMN ruc VARCHAR(11) AFTER id_hotel;

-- Agregar algunos RUCs de ejemplo a los hoteles existentes
UPDATE lv_hotel SET ruc = '20123456789' WHERE id_hotel = 1;
UPDATE lv_hotel SET ruc = '20987654321' WHERE id_hotel = 2;
UPDATE lv_hotel SET ruc = '20555666777' WHERE id_hotel = 3;
UPDATE lv_hotel SET ruc = '20123456789' WHERE id_hotel = 4;