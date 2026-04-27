import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import * as z from 'zod';

const storageKey = 'app-theme';

const validThemes = ['light', 'dark', 'system'] as const;
type Theme = (typeof validThemes)[number];

function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (validThemes as ReadonlyArray<string>).includes(value);
}

export const getThemeServFn = createServerFn().handler(() => {
  const cookieValue = getCookie(storageKey);

  if (isValidTheme(cookieValue)) {
    return cookieValue;
  }

  return 'system';
});

const setThemeValidator = z.enum(['light', 'dark', 'system']);

export const setThemeServFn = createServerFn()
  .inputValidator(setThemeValidator)
  .handler(({ data }) => setCookie(storageKey, data));
