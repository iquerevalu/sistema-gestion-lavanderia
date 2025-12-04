import serverless from 'serverless-http';
import app from './index';

// Exportar el handler para Lambda
export const handler = serverless(app);
