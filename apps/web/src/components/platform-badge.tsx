import { Badge } from '@/components/ui/badge.tsx';

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

interface PlatformBadgeProps {
  platform: { id: string; name: string };
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={`text-xs ${PLATFORM_STYLES[platform.id] ?? 'bg-muted text-muted-foreground'}`}
    >
      {platform.name}
    </Badge>
  );
}
