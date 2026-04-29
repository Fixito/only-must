import { PlatformSchema } from '@only-must/shared';

import * as platformRepository from './platform.repository.js';

export async function getPlatforms() {
  const platforms = await platformRepository.findPlatforms();
  return PlatformSchema.array().parse(platforms);
}
