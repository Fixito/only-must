interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function heatClass(score: number): string {
  if (score >= 90) return 'bg-[oklch(39.3%_0.095_152.535)]';
  if (score >= 75) return 'bg-[oklch(68%_0.17_85)]';
  if (score >= 60) return 'bg-[oklch(62%_0.19_35)]';
  return 'bg-destructive';
}

const sizeClass = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-16 h-16 text-3xl',
} as const;

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  return (
    <span
      className={`${heatClass(score)} ${sizeClass[size]} inline-flex items-center justify-center rounded-sm font-semibold text-white`}
    >
      {score}
    </span>
  );
}
