import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider.tsx';

function clampRange(
  [min, max]: [number, number],
  minLimit: number,
  maxLimit: number,
): [number, number] {
  const clampedMin = Math.max(minLimit, Math.min(min, maxLimit));
  const clampedMax = Math.max(minLimit, Math.min(max, maxLimit));
  return [Math.min(clampedMin, clampedMax), Math.max(clampedMin, clampedMax)];
}

interface RangeFilterFieldProps {
  id: string;
  label: string;
  min: number;
  max: number;
  urlMin: number | undefined;
  urlMax: number | undefined;
  onCommit: (next: [number, number]) => void;
  formatValue?: ((v: number) => string) | undefined;
}

export function RangeFilterField({
  id,
  label,
  min,
  max,
  urlMin,
  urlMax,
  onCommit,
  formatValue = String,
}: RangeFilterFieldProps) {
  const [value, setValue] = useState<[number, number]>(
    clampRange([urlMin ?? min, urlMax ?? max], min, max),
  );

  useEffect(() => {
    setValue(clampRange([urlMin ?? min, urlMax ?? max], min, max));
  }, [urlMin, urlMax, min, max]);

  return (
    <div className="mbs-4 w-full max-w-sm space-y-4">
      <Label htmlFor={id}>
        <span className="sr-only">{label}</span>

        <Slider
          name={id}
          id={id}
          min={min}
          max={max}
          step={1}
          value={value}
          onValueChange={(val) => {
            if (Array.isArray(val) && val.length === 2) {
              setValue(clampRange([val[0], val[1]], min, max));
            }
          }}
          onValueCommitted={(val) => {
            if (Array.isArray(val) && val.length === 2) {
              onCommit(clampRange([val[0], val[1]], min, max));
            }
          }}
        />
      </Label>

      <div className="mbs-4 flex items-center justify-between gap-2">
        <label htmlFor={`${id}-min`} className="sr-only">
          {label} min
        </label>

        <Input
          type="text"
          id={`${id}-min`}
          value={formatValue(value[0])}
          tabIndex={-1}
          readOnly
          className="pointer-events-none field-sizing-content w-auto"
        />

        <label htmlFor={`${id}-max`} className="sr-only">
          {label} max
        </label>

        <Input
          type="text"
          id={`${id}-max`}
          value={formatValue(value[1])}
          tabIndex={-1}
          readOnly
          className="pointer-events-none field-sizing-content w-auto"
        />
      </div>
    </div>
  );
}
