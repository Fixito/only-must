import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import * as z from 'zod';

const storageKey = 'app-theme';

export const getThemeServFn = createServerFn().handler(() => getCookie(storageKey) ?? 'system');

const setThemeValidator = z.enum(['light', 'dark', 'system']);

export const setThemeServFn = createServerFn()
  .inputValidator(setThemeValidator)
  .handler(({ data }) => setCookie(storageKey, data));
