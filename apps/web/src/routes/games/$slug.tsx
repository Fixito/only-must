import { createFileRoute } from '@tanstack/react-router';

import Error from '@/components/error.tsx';
import { NotFound } from '@/components/not-found.tsx';
import { PlatformBadge } from '@/components/platform-badge.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import GameDetailSkeleton from '@/features/games/components/game-detail-skeleton.tsx';
import { ScoreBadge } from '@/features/games/components/score-badge.tsx';
import { gameQueryOptions } from '@/features/games/queries/game.query';
import { ensureQueryDataOrNotFound } from '@/lib/query.ts';
import { formatdate, formatDuration } from '@/lib/time';
import { queryClient } from '@/router.tsx';

export const Route = createFileRoute('/games/$slug')({
  loader: async ({ params }) =>
    ensureQueryDataOrNotFound(() => queryClient.ensureQueryData(gameQueryOptions(params.slug))),
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
              <div className="bg-card space-y-3 p-4 shadow-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">Platforms</span>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {platforms
                      .toSorted((a, b) => a.name.localeCompare(b.name))
                      .map((p) => (
                        <PlatformBadge key={p.id} platform={p} />
                      ))}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs">Initial release date</span>
                  <span className="font-semibold">
                    {releaseDate ? formatdate(releaseDate) : 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="bg-card p-4 shadow-sm">
                <span className="text-muted-foreground block text-xs">
                  {developers.length > 1 ? 'Developers' : 'Developer'}
                </span>
                <span className="font-semibold">
                  {developers.length > 0
                    ? formatter.format(developers.map((d) => d.name))
                    : 'Unknown'}
                </span>
              </div>

              <div className="bg-card p-4 shadow-sm">
                <span className="text-muted-foreground block text-xs">Genres</span>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {genres.map((g) => (
                    <Badge key={g.id} className="text-xs">
                      {g.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Durations */}

              <div className="grid w-full grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {/* Main story */}
                <div className="bg-card p-4 shadow-sm">
                  <span className="text-muted-foreground block text-xs">Main Story</span>
                  <span className="text-foreground font-semibold">
                    {formatDuration(durations?.mainStorySeconds ?? null) || '—'}
                  </span>
                </div>

                {/* Main story + Sides */}
                <div className="bg-card p-4 shadow-sm">
                  <span className="text-muted-foreground block text-xs">Main + Sides</span>
                  <span className="text-foreground font-semibold">
                    {formatDuration(durations?.mainExtraSeconds ?? null) || '—'}
                  </span>
                </div>

                {/* Completionist */}
                <div className="bg-card p-4 shadow-sm">
                  <span className="text-muted-foreground block text-xs">Completionist</span>
                  <span className="text-foreground font-semibold">
                    {formatDuration(durations?.completionistSeconds ?? null) || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-semibold tracking-widest uppercase">Metascore</span>
            <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start">
              {metaScore != null ? (
                <ScoreBadge score={metaScore} size="lg" />
              ) : (
                <span className="text-muted-foreground text-sm">N/A</span>
              )}
              <img src="/must-play.svg" alt="Must Play" className="w-20" />
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
