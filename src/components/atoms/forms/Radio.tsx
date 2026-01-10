/**
 * Radio Atom - Reusable radio button with optional label
 */

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ className, label, id, ...props }, ref) => {
        const generatedId = useId();
        const radioId = id || generatedId;

        return (
            <div className="flex items-center gap-2">
                <input
                    type="radio"
                    id={radioId}
                    ref={ref}
                    className={cn(
                        'h-4 w-4 border-gray-300 text-blue-600 transition-colors',
                        'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={radioId}
                        className={cn(
                            'text-sm text-gray-700 select-none cursor-pointer',
                            props.disabled && 'cursor-not-allowed opacity-50'
                        )}
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Radio.displayName = 'Radio';

export { Radio };
