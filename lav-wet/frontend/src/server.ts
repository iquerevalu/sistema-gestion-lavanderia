import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';

// Función para determinar el tipo de contenido
const getContentType = (filePath: string): string => {
  const ext = filePath.split('.').pop()?.toLowerCase();
  
  const contentTypes: { [key: string]: string } = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject'
  };
  
  return contentTypes[ext || ''] || 'text/plain';
};

// Función para servir archivos estáticos
const serveStaticFile = (filePath: string): APIGatewayProxyResult => {
  try {
    // Los archivos están en /var/task/assets/ en Lambda
    const fullPath = path.join(process.cwd(), 'assets', filePath);
    
    console.log('Serving static file:', fullPath);
    console.log('File exists:', fs.existsSync(fullPath));
    
    const content = fs.readFileSync(fullPath);
    const contentType = getContentType(filePath);
    
    // Para archivos binarios (imágenes, fuentes)
    const binaryTypes = ['image/', 'font/', 'application/vnd.ms-fontobject'];
    const isBinary = binaryTypes.some(type => contentType.startsWith(type));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 1 año de cache para assets
        'Access-Control-Allow-Origin': '*'
      },
      body: isBinary ? content.toString('base64') : content.toString(),
      isBase64Encoded: isBinary
    };
  } catch (error) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'File not found' })
    };
  }
};

// Función para servir el HTML principal
const serveIndexHtml = (): APIGatewayProxyResult => {
  try {
    const indexPath = path.join(process.cwd(), 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      },
      body: content
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Could not load application'
      })
    };
  }
};

// Handler principal
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const path = event.path || '/';
  
  console.log('Frontend Lambda - Path:', path);
  console.log('Frontend Lambda - Method:', event.httpMethod);
  
  // Manejar CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      },
      body: ''
    };
  }
  
  // Servir archivos estáticos (CSS, JS, imágenes)
  if (path.startsWith('/assets/')) {
    const assetPath = path.replace('/assets/', '');
    return serveStaticFile(assetPath);
  }
  
  // También manejar archivos estáticos sin /assets/
  if (path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    const fileName = path.substring(1); // Remover el / inicial
    return serveStaticFile(fileName);
  }
  
  // Para todas las demás rutas, servir index.html (SPA routing)
  return serveIndexHtml();
};