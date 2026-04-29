import { GetPlatformsResponseSchema } from '@only-must/shared';
import axios from 'axios';

export async function getPlatforms() {
  const res = await axios.get('http://localhost:5000/api/v1/platforms');
  const parsed = GetPlatformsResponseSchema.parse(res.data);
  return parsed;
}
