import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';

export default function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRemove();
    }
  };

  return (
    <Badge
      onClick={onRemove}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Remove filter ${label}`}
      className="hover:bg-primary/80 cursor-pointer uppercase"
    >
      {label} <X aria-hidden="true" />
    </Badge>
  );
}
