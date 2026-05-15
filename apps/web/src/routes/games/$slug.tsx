import { ApiError } from '@only-must/shared';
import { createFileRoute, notFound } from '@tanstack/react-router';

import Error from '@/components/error.tsx';
import { NotFound } from '@/components/not-found.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import GameDetailSkeleton from '@/features/games/components/game-detail-skeleton.tsx';
import { gameQueryOptions } from '@/features/games/queries/game.query';
import { formatdate, formatDuration } from '@/lib/time';
import { queryClient } from '@/router.tsx';

const PLATFORM_STYLES: Record<string, string> = {
  'ios-iphoneipad': 'bg-black text-white dark:bg-white dark:text-black',
  'nintendo-switch': 'bg-nintendo text-white',
  'nintendo-switch-2': 'bg-nintendo text-white',
  pc: 'bg-black text-white dark:text-black dark:bg-white',
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
  loader: async ({ params }) => {
    try {
      return await queryClient.ensureQueryData(gameQueryOptions(params.slug));
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) throw notFound();
      throw error;
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.data.title ?? 'Not Found'} | OnlyMust` },
      {
        name: 'description',
        content: loaderData?.data.description
          ? `${loaderData.data.description.slice(0, 150)}...`
          : 'Discover the best games on OnlyMust.',
      },
    ],
  }),
  pendingComponent: () => <GameDetailSkeleton />,
  component: RouteComponent,
  errorComponent: ({ error, reset }) => <Error error={error} reset={reset} />,
  notFoundComponent: () => (
    <NotFound title="Game not found" message="This game does not exist or has been removed." />
  ),
});

function RouteComponent() {
  const {
    data: {
      title,
      platforms,
      releaseDate,
      description,
      genres,
      developers,
      metaScore,
      heroImage,
      durations,
    },
  } = Route.useLoaderData();

  const formatter = new Intl.ListFormat('en', { type: 'conjunction' });

  return (
    <div className="container py-12">
      <header>
        <h1 className="text-4xl font-semibold">{title}</h1>

        <div className="mbs-4 flex flex-col items-start gap-4 sm:flex-row">
          <img
            src={heroImage}
            alt={title}
            loading="lazy"
            className="w-full max-w-44 self-stretch rounded-md object-cover"
          />

          <div className="w-max">
            <div className="space-y-4">
              <div className="bg-card text-muted-foreground p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-muted-foreground rounded-md">Platforms:</span>

                  <div className="flex flex-wrap items-center gap-1">
                    {platforms
                      .toSorted((a, b) => a.name.localeCompare(b.name))
                      .map((p) => {
                        return (
                          <Badge
                            key={p.id}
                            variant="secondary"
                            className={`text-xs ${PLATFORM_STYLES[p.id] ?? 'bg-muted text-muted-foreground'}`}
                          >
                            {p.name}
                          </Badge>
                        );
                      })}
                  </div>
                </div>

                <p className="text-foreground">
                  <span className="text-muted-foreground rounded-md">Initial release date:</span>{' '}
                  {releaseDate ? formatdate(releaseDate) : 'Unknown'}
                </p>
              </div>

              <div className="bg-card p-4 shadow-sm">
                <p>
                  <span className="text-muted-foreground rounded-md">
                    {developers.length > 1 ? 'Developers:' : 'Developer:'}
                  </span>{' '}
                  {developers.length > 0
                    ? formatter.format(developers.map((d) => d.name))
                    : 'Unknown'}
                </p>
              </div>

              <div className="bg-card flex flex-wrap items-center gap-2 p-4 shadow-sm">
                <span className="text-muted-foreground rounded-md">Genres:</span>
                {genres.map((g) => (
                  <Badge key={g.id} className="text-xs">
                    {g.name}
                  </Badge>
                ))}
              </div>

              {/* Durations */}

              <div className="flex flex-wrap">
                {/* Main story */}
                <div className="bg-card border-l p-4 shadow-sm">
                  <span className="text-muted-foreground rounded-md">Main Story:</span>{' '}
                  <span className="text-foreground font-semibold">
                    {formatDuration(durations?.mainStorySeconds ?? null) || '-'}
                  </span>
                </div>

                {/* Main story + Sides */}
                <div className="bg-card border-l p-4 shadow-sm">
                  <span className="text-muted-foreground rounded-md">Main Story + Sides:</span>{' '}
                  <span className="text-foreground font-semibold">
                    {formatDuration(durations?.mainExtraSeconds ?? null) || '-'}
                  </span>
                </div>

                {/* Completionist */}
                <div className="bg-card border-l p-4 shadow-sm">
                  <span className="text-muted-foreground rounded-md">Completionist:</span>{' '}
                  <span className="text-foreground font-semibold">
                    {formatDuration(durations?.completionistSeconds ?? null) || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 p-4">
            <span className="font-semibold tracking-widest uppercase">Metascore</span>

            <div className="flex gap-4">
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
