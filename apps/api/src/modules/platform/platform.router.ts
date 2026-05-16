import { PlatformSchema } from '@only-must/shared';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as platformRepository from './platform.repository.js';

const router = Router();

function createPlatformRouter() {
  router.get('/', async (_req, res) => {
    const platforms = PlatformSchema.array().parse(await platformRepository.findPlatforms());
    return res.status(StatusCodes.OK).json({ data: platforms });
  });

  return router;
}

export const platformRouter: Router = createPlatformRouter();
