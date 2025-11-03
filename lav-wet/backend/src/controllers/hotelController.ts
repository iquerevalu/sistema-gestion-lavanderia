import { Request, Response } from 'express';
import {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    searchHotels
} from '../services/hotelService.js';

// Obtener todos los hoteles
export const getHotels = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        let result;

        if (search) {
            const hotels = await searchHotels(search);
            result = {
                hotels,
                total: hotels.length,
                page: 1,
                totalPages: 1
            };
        } else {
            const { hotels, total } = await getAllHotels(page, limit);
            result = {
                hotels,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        }

        res.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Error obteniendo hoteles:', error);

        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Error interno del servidor',
                code: 'INTERNAL_ERROR'
            }
        });
    }
};

// Obtener hotel por ID
export const getHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'ID de hotel inválido',
                    code: 'INVALID_ID'
                }
            });
            return;
        }

        const hotel = await getHotelById(id);

        if (!hotel) {
            res.status(404).json({
                success: false,
                error: {
                    message: 'Hotel no encontrado',
                    code: 'HOTEL_NOT_FOUND'
                }
            });
            return;
        }

        res.json({
            success: true,
            data: hotel
        });
    } catch (error: any) {
        console.error('Error obteniendo hotel:', error);

        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Error interno del servidor',
                code: 'INTERNAL_ERROR'
            }
        });
    }
};

// Crear nuevo hotel
export const createNewHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await createHotel(req.body);

        res.status(201).json({
            success: true,
            data: hotel
        });
    } catch (error: any) {
        console.error('Error creando hotel:', error);

        const statusCode = error.message.includes('Ya existe') ? 409 : 500;

        res.status(statusCode).json({
            success: false,
            error: {
                message: error.message || 'Error interno del servidor',
                code: statusCode === 409 ? 'DUPLICATE_HOTEL' : 'INTERNAL_ERROR'
            }
        });
    }
};

// Actualizar hotel
export const updateExistingHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'ID de hotel inválido',
                    code: 'INVALID_ID'
                }
            });
            return;
        }

        const hotelData = { ...req.body, id_hotel: id };
        const hotel = await updateHotel(hotelData);

        res.json({
            success: true,
            data: hotel
        });
    } catch (error: any) {
        console.error('Error actualizando hotel:', error);

        let statusCode = 500;
        let errorCode = 'INTERNAL_ERROR';

        if (error.message.includes('no encontrado')) {
            statusCode = 404;
            errorCode = 'HOTEL_NOT_FOUND';
        } else if (error.message.includes('Ya existe')) {
            statusCode = 409;
            errorCode = 'DUPLICATE_HOTEL';
        }

        res.status(statusCode).json({
            success: false,
            error: {
                message: error.message || 'Error interno del servidor',
                code: errorCode
            }
        });
    }
};

// Eliminar hotel
export const removeHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'ID de hotel inválido',
                    code: 'INVALID_ID'
                }
            });
            return;
        }

        await deleteHotel(id);

        res.json({
            success: true,
            data: {
                message: 'Hotel eliminado exitosamente'
            }
        });
    } catch (error: any) {
        console.error('Error eliminando hotel:', error);

        let statusCode = 500;
        let errorCode = 'INTERNAL_ERROR';

        if (error.message.includes('no encontrado')) {
            statusCode = 404;
            errorCode = 'HOTEL_NOT_FOUND';
        } else if (error.message.includes('usuarios asociados') || error.message.includes('guías registradas')) {
            statusCode = 409;
            errorCode = 'HOTEL_HAS_DEPENDENCIES';
        }

        res.status(statusCode).json({
            success: false,
            error: {
                message: error.message || 'Error interno del servidor',
                code: errorCode
            }
        });
    }
};