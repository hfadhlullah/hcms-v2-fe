/**
 * Checkbox Atom - Reusable checkbox with optional label
 */

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, indeterminate, id, ...props }, ref) => {
        const generatedId = useId();
        const checkboxId = id || generatedId;

        return (
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={checkboxId}
                    ref={(el) => {
                        if (el) {
                            el.indeterminate = indeterminate || false;
                        }
                        if (typeof ref === 'function') {
                            ref(el);
                        } else if (ref) {
                            ref.current = el;
                        }
                    }}
                    className={cn(
                        'h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors',
                        'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';

export { Checkbox };
