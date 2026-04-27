import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import * as z from 'zod';

const storageKey = 'app-theme';

const validThemes = ['light', 'dark', 'system'] as const;

export const getThemeServFn = createServerFn().handler(() => {
  const cookieValue = getCookie(storageKey);
  // Validate cookie value against allowed themes
  if (cookieValue && validThemes.includes(cookieValue as typeof validThemes[number])) {
    return cookieValue as typeof validThemes[number];
  }
  // Return safe default if cookie is missing or invalid
  return 'system';
});

const setThemeValidator = z.enum(['light', 'dark', 'system']);

export const setThemeServFn = createServerFn()
  .inputValidator(setThemeValidator)
  .handler(({ data }) => setCookie(storageKey, data));
