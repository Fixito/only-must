import * as React from 'react';

import { cn } from '@/lib/utils';

interface LabelProps extends React.ComponentProps<'label'> {
  htmlFor?: string;
}

/**
 * Renders a styled label element for form controls.
 *
 * @param className - Additional CSS classes appended to the component's default styles.
 * @param htmlFor - The id of the form control this label is associated with.
 * @returns The label element with combined classes and any additional props spread onto it.
 */
function Label({ className, htmlFor, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn(
        'flex items-center gap-2 text-xs/relaxed leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
