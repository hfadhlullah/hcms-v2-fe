/**
 * Label Atom - Reusable form label
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    disabled?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, required, disabled, children, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    'block text-sm font-medium text-gray-700',
                    disabled && 'opacity-50',
                    className
                )}
                {...props}
            >
                {children}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
        );
    }
);

Label.displayName = 'Label';

export { Label };
