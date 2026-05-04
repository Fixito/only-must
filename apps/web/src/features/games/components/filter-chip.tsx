import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';

export default function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge onClick={onRemove} className="hover:bg-primary/80 cursor-pointer uppercase">
      {label} <X />
    </Badge>
  );
}
