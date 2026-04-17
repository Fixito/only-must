import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';

import { logger } from './config/logger.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';

import router from './routes.js';

const app = express();

app.use(cors());

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

app.use('/api/v1', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
