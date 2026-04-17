import { Router } from 'express';

import { gamesRouter } from './modules/game/game.router.js';

const router = Router();

router.use('/games', gamesRouter);

export default router;
