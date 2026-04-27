import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import Footer from '@/components/footer.tsx';
import Navbar from '@/components/navbar/navbar.tsx';
import { NotFound } from '@/components/not-found.tsx';
import { getThemeServFn } from '@/lib/theme.ts';

import appCss from '../styles.css?url';

const THEME_INIT_SCRIPT = `(function(){try{var cookies=document.cookie.split(';');var themeCookie=null;for(var i=0;i<cookies.length;i++){var c=cookies[i].trim();if(c.indexOf('app-theme=')===0){themeCookie=c.substring('app-theme='.length);break;}}var mode=(themeCookie==='light'||themeCookie==='dark'||themeCookie==='system')?themeCookie:'system';var root=document.documentElement;root.classList.remove('dark','auto');root.style.colorScheme='';if(mode==='dark'){root.classList.add('dark');root.style.colorScheme='dark';}else if(mode==='light'){root.style.colorScheme='light';}else{root.classList.add('auto');root.style.colorScheme='light dark';}}catch(e){}})();`;

export const Route = createRootRoute({
  beforeLoad: async () => ({ theme: await getThemeServFn() }),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'OnlyMust',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/must-play.svg' },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound />,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="text-foreground bg-background grid min-h-screen grid-rows-[auto_1fr_auto] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
