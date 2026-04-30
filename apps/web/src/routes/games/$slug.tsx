import { createFileRoute } from '@tanstack/react-router';

import { Badge } from '@/components/ui/badge.tsx';
import { gameQueryOptions } from '@/features/games/queries/game.query';
import { formatdate } from '@/lib/date.ts';
import { queryClient } from '@/router.tsx';

const PLATFORM_STYLES: Record<string, string> = {
  'ios-iphoneipad': 'bg-black text-white dark:bg-white dark:text-black',
  'nintendo-switch': 'bg-nintendo text-white',
  'nintendo-switch-2': 'bg-nintendo text-white',
  pc: 'bg-black text-white',
  playstation: 'bg-playstation text-white dark:text-black',
  'playstation-2': 'bg-playstation text-white dark:text-black',
  'playstation-3': 'bg-playstation text-white dark:text-black',
  'playstation-4': 'bg-playstation text-white dark:text-black',
  'playstation-5': 'bg-playstation text-white dark:text-black',
  xbox: 'bg-xbox text-white',
  'xbox-360': 'bg-xbox text-white',
  'xbox-one': 'bg-xbox text-white',
  'xbox-series-x': 'bg-xbox text-white',
};

export const Route = createFileRoute('/games/$slug')({
  loader: ({ params }) => queryClient.ensureQueryData(gameQueryOptions(params.slug)),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.data.title} | OnlyMust`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: { title, platforms, releaseDate, description, genres, developers, metaScore, heroImage },
  } = Route.useLoaderData();

  const formatter = new Intl.ListFormat('en', { type: 'conjunction' });

  return (
    <div className="container py-12">
      <header>
        <h1 className="text-4xl font-semibold">{title}</h1>

        <div className="mbs-4 flex flex-col items-start gap-4 sm:flex-row">
          <img src={heroImage} alt={title} loading="lazy" className="rounded-md object-cover" />

          <div className="w-max">
            <div className="space-y-4">
              <div className="bg-card text-muted-foreground p-4 shadow-sm">
                <p className="flex items-center gap-[0.25ch]">
                  <strong className="text-foreground rounded-md font-semibold">Platforms:</strong>
                  {platforms
                    .toSorted((a, b) => a.name.localeCompare(b.name))
                    .map((p) => {
                      return (
                        <Badge
                          key={p.id}
                          variant="secondary"
                          className={`text-xs ${PLATFORM_STYLES[p.id]}`}
                        >
                          {p.name}
                        </Badge>
                      );
                    })}
                </p>

                <p>
                  <strong className="text-foreground rounded-md font-semibold">
                    Initial release date:
                  </strong>{' '}
                  {releaseDate ? formatdate(releaseDate) : 'Unknown'}
                </p>
              </div>

              <div className="bg-card text-muted-foreground p-4 shadow-sm">
                <p>
                  <strong className="text-foreground rounded-md font-semibold">
                    {developers.length > 1 ? 'Developers:' : 'Developer:'}
                  </strong>{' '}
                  {developers.length > 0
                    ? formatter.format(developers.map((d) => d.name))
                    : 'Unknown'}
                </p>
              </div>

              <div className="bg-card text-muted-foreground flex flex-wrap items-center gap-2 p-4 shadow-sm">
                <strong className="text-foreground rounded-md font-semibold">Genres:</strong>
                {genres.map((g) => (
                  <Badge key={g.id} className="text-xs">
                    {g.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4">
            <span className="font-semibold tracking-widest uppercase">Metascore</span>

            <div className="mbs-4 flex gap-4">
              <img
                src="/must-play.svg"
                alt="Must Play"
                loading="lazy"
                className="aspect-square w-16 object-cover"
              />

              <span className="bg-success inline-flex aspect-square w-16 items-center justify-center rounded-md px-1 text-3xl font-semibold text-white">
                {metaScore}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="mbs-8">
        <h2 className="text-2xl font-semibold">Summary</h2>

        <p className="text-muted-foreground mbs-4">{description}</p>
      </section>
    </div>
  );
}
