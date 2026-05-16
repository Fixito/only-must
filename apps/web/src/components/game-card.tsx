import { Link } from '@tanstack/react-router';
import { Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { ScoreBadge } from '@/features/games/components/score-badge.tsx';
import { formatdate, formatDuration } from '@/lib/time';

interface GameCardProps {
  game: {
    id: string;
    slug: string;
    title: string;
    description: string;
    releaseDate: string | null;
    metaScore: number;
    heroImage: string;
    durations: {
      mainStorySeconds: number | null;
    } | null;
  };
  index: number;
  showDuration: boolean;
}

export default function GameCard({ game, index, showDuration }: GameCardProps) {
  const { id, slug, title, heroImage, description, releaseDate, metaScore, durations } = game;
  const { mainStorySeconds } = durations ?? {};
  const playtime = formatDuration(mainStorySeconds ?? null);

  return (
    <Card
      key={id}
      className="bg-card text-card-foreground group has-focus-visible:border-ring has-focus-visible:ring-ring hover:border-primary/30 relative isolate grid cursor-pointer grid-cols-[7rem_auto] gap-4 p-0 shadow-sm transition-all outline-none hover:-translate-y-0.5 hover:shadow-md has-focus-visible:ring-3"
    >
      <div className="relative shrink-0">
        <img src={heroImage} alt={title} className="h-full w-full object-cover" />
        <img
          src="/must-play.svg"
          alt="Must Play"
          aria-hidden="true"
          className="absolute bottom-2 left-1/2 w-14 -translate-x-1/2"
        />
      </div>

      <CardContent className="py-4 ps-0">
        <CardHeader className="px-0">
          <CardTitle className="text-foreground flex gap-1 text-base font-semibold">
            <span>{index + 1}.</span>
            <h3 className="line-clamp-1">
              <Link
                to="/games/$slug"
                params={{ slug: slug }}
                className="focus-visible:outline-none"
                preload="intent"
              >
                {title}
                <span aria-hidden="true" className="absolute inset-0 z-10"></span>
              </Link>
            </h3>
          </CardTitle>

          <CardDescription>
            <time dateTime={releaseDate ?? undefined} className="text-xs">
              {releaseDate ? formatdate(releaseDate) : null}
            </time>
          </CardDescription>
        </CardHeader>

        <CardDescription className="mbs-3 line-clamp-2 text-sm text-ellipsis">
          {description}
        </CardDescription>

        <CardFooter className="mbs-3 flex-wrap items-center gap-x-3 gap-y-1 px-0">
          <ScoreBadge score={metaScore} size="sm" />

          {showDuration && playtime ? (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="size-3" aria-hidden="true" />
              <span>{playtime}</span>
            </div>
          ) : null}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
