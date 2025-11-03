import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import app from './app';

// Crear el handler serverless
const serverlessHandler = serverlessExpress({ app });

// Handler principal para Lambda
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Configurar context para no esperar el event loop
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Log del evento en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('Lambda Event:', JSON.stringify(event, null, 2));
    }

    // Procesar la request a través de serverless-express
    const result = await serverlessHandler(event, context);

    return result;
  } catch (error) {
    console.error('Lambda Handler Error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      }),
    };
  }
};

// Handlers especializados (opcionales)
export const authHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Handler especializado para autenticación
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Aquí podrías tener lógica específica para auth
  return handler(event, context);
};

export const reportsHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Handler especializado para reportes
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Configurar timeout más largo para reportes
  const originalTimeout = context.getRemainingTimeInMillis();
  console.log(`Reports handler - Remaining time: ${originalTimeout}ms`);
  
  return handler(event, context);
};

export const schedulerHandler = async (
  event: any,
  context: Context
): Promise<void> => {
  // Handler para tareas programadas
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    console.log('Scheduler event:', JSON.stringify(event, null, 2));
    
    // Aquí puedes agregar tareas programadas como:
    // - Limpieza de logs antiguos
    // - Backup de base de datos
    // - Envío de reportes automáticos
    // - Notificaciones programadas
    
    console.log('Scheduled task completed successfully');
  } catch (error) {
    console.error('Scheduler error:', error);
    throw error;
  }
};