import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import { pinoHttp } from 'pino-http';

import { db } from '../db/client.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import router from './routes.js';

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : '*',
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

app.set('query parser', 'extended');

app.get('/health', async (_req, res) => {
  const timeoutMs = 5000; // 5 second timeout for health check

  try {
    const dbCheck = db.execute('SELECT 1');
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database health check timeout')), timeoutMs)
    );

    await Promise.race([dbCheck, timeout]);
    res.status(StatusCodes.OK).json({ status: 'ok', db: 'up' });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error({ error: error.message, stack: error.stack }, 'Health check failed');
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      db: 'down',
      error: error.message
    });
  }
});

app.get('/', (_req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Welcome to the Only Must API!' });
});

app.use('/api/v1', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
