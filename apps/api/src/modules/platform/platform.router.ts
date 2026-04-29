import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as platformService from './platform.service.js';

const router = Router();

function createPlatformRouter() {
  router.get('/', async (_req, res) => {
    const platforms = await platformService.getPlatforms();
    return res.status(StatusCodes.OK).json({ data: platforms });
  });

  return router;
}

export const platformRouter: Router = createPlatformRouter();
