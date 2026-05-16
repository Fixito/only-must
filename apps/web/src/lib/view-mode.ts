import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';

export type ViewMode = 'grid' | 'list';

export const VIEW_MODE_COOKIE = 'games-view-mode';
export const VIEW_MODE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const getViewModeServFn = createServerFn().handler((): ViewMode => {
  const v = getCookie(VIEW_MODE_COOKIE);
  return v === 'list' ? 'list' : 'grid';
});
