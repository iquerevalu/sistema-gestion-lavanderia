import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DatabaseConfig } from '../types';

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos
const dbConfig: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'db_lavanderia'
};

// Debug: verificar configuración de DB
console.log('🔧 Configuración de DB:');
console.log('Host:', dbConfig.host);
console.log('Port:', dbConfig.port);
console.log('User:', dbConfig.user);
console.log('Password:', dbConfig.password ? '***' : 'VACÍA');
console.log('Database:', dbConfig.database);

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para obtener una conexión del pool
export const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
};

// Función para ejecutar queries
export const executeQuery = async <T = any>(
    query: string,
    params: any[] = []
): Promise<T[]> => {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(query, params);
        return rows as T[];
    } catch (error) {
        console.error('Error ejecutando query:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Función para ejecutar queries con transacciones
export const executeTransaction = async (
    queries: { query: string; params: any[] }[]
): Promise<any[]> => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const results = [];
        for (const { query, params } of queries) {
            const [result] = await connection.execute(query, params);
            results.push(result);
        }

        await connection.commit();
        return results;
    } catch (error) {
        await connection.rollback();
        console.error('Error en transacción:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Función para verificar la conexión
export const testConnection = async (): Promise<boolean> => {
    try {
        const connection = await getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Conexión a la base de datos exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a la base de datos:', error);
        return false;
    }
};

// Función para cerrar el pool de conexiones
export const closePool = async (): Promise<void> => {
    try {
        await pool.end();
        console.log('Pool de conexiones cerrado');
    } catch (error) {
        console.error('Error cerrando pool de conexiones:', error);
    }
};

export default pool;