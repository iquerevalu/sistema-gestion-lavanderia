import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeQuery, testConnection } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para ejecutar un archivo SQL
const executeSQLFile = async (filePath: string): Promise<void> => {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Dividir el contenido en statements individuales
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Ejecutando ${statements.length} statements desde ${path.basename(filePath)}...`);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await executeQuery(statement);
        } catch (error: any) {
          // Ignorar errores de "database already exists" y "table already exists"
          if (!error.message.includes('already exists')) {
            console.error(`Error ejecutando statement: ${statement.substring(0, 100)}...`);
            throw error;
          }
        }
      }
    }

    console.log(`✅ ${path.basename(filePath)} ejecutado exitosamente`);
  } catch (error) {
    console.error(`❌ Error ejecutando ${filePath}:`, error);
    throw error;
  }
};

// Función principal de migración
export const runMigrations = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando migraciones de base de datos...');

    // Verificar conexión
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Ejecutar schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    await executeSQLFile(schemaPath);

    // Ejecutar datos semilla
    const seedPath = path.join(__dirname, 'seed.sql');
    await executeSQLFile(seedPath);

    console.log('🎉 Migraciones completadas exitosamente');
  } catch (error) {
    console.error('💥 Error en migraciones:', error);
    throw error;
  }
};

// Ejecutar migraciones si este archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('Migraciones finalizadas');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en migraciones:', error);
      process.exit(1);
    });
}