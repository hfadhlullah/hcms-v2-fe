/**
 * Select Atom - Reusable select dropdown
 */

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const selectVariants = cva(
    'flex w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'border-gray-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20',
                error: 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
            },
            selectSize: {
                sm: 'h-8 text-xs',
                md: 'h-10 text-sm',
                lg: 'h-12 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            selectSize: 'md',
        },
    }
);

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
    options: SelectOption[];
    placeholder?: string;
    error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, variant, selectSize, options, placeholder, error, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        selectVariants({ variant: error ? 'error' : variant, selectSize, className })
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select };

// eslint-disable-next-line react-refresh/only-export-components
export { selectVariants };
