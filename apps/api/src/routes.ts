import { Router } from 'express';

import { gameRouter } from '@/modules/game/game.router.js';
import { genreRouter } from '@/modules/genre/genre.router.js';
import { platformRouter } from '@/modules/platform/platform.router.js';

const router: Router = Router();

router.use('/games', gameRouter);
router.use('/platforms', platformRouter);
router.use('/genres', genreRouter);

export default router;
