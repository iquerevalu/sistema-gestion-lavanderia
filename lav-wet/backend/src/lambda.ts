import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import app from './simple-app';

// Crear el handler serverless
const serverlessHandler = serverlessExpress({ app });

// Handler principal para Lambda
export const handler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: any
) => {
  // Configurar context para no esperar el event loop
  context.callbackWaitsForEmptyEventLoop = false;

  // Log básico
  console.log('Lambda Event Path:', event.path);
  console.log('Lambda Event Method:', event.httpMethod);

  // Procesar la request a través de serverless-express
  return serverlessHandler(event, context, callback);
};