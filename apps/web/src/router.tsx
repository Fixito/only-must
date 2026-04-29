import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import queryString from 'query-string';

import { NotFound } from './components/not-found.tsx';
import { routeTree } from './routeTree.gen';

export const queryClient = new QueryClient();

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => <NotFound />,
    parseSearch: (search) => queryString.parse(search.startsWith('?') ? search.slice(1) : search),
    stringifySearch: (search) => {
      const str = queryString.stringify(search as Record<string, unknown>, {
        skipNull: true,
        skipEmptyString: true,
      });

      return str ? `?${str}` : '';
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
