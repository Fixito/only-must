import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  logger.info({ env: env.NODE_ENV }, `Server is running on http://localhost:${PORT}/`);
});
