import { useCallback, useState } from 'react';

import type { ViewMode } from '@/lib/view-mode';
import { VIEW_MODE_COOKIE, VIEW_MODE_MAX_AGE } from '@/lib/view-mode';

export type { ViewMode };

export function useViewMode(initialMode: ViewMode) {
  const [mode, setModeState] = useState<ViewMode>(initialMode);

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    document.cookie = `${VIEW_MODE_COOKIE}=${next};path=/;max-age=${VIEW_MODE_MAX_AGE};SameSite=Lax`;
  }, []);

  return { mode, setMode };
}
