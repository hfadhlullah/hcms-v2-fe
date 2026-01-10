/**
 * Input Atom - Reusable input field with error state support
 */

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
    'flex w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'border-gray-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20',
                error: 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
            },
            inputSize: {
                sm: 'h-8 text-xs',
                md: 'h-10 text-sm',
                lg: 'h-12 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'md',
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    error?: boolean;
    leftAddon?: React.ReactNode;
    rightAddon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant, inputSize, error, leftAddon, rightAddon, ...props }, ref) => {
        const inputClass = cn(
            inputVariants({ variant: error ? 'error' : variant, inputSize, className }),
            leftAddon && 'pl-10',
            rightAddon && 'pr-10'
        );

        if (leftAddon || rightAddon) {
            return (
                <div className="relative">
                    {leftAddon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftAddon}
                        </div>
                    )}
                    <input type={type} className={inputClass} ref={ref} {...props} />
                    {rightAddon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightAddon}
                        </div>
                    )}
                </div>
            );
        }

        return <input type={type} className={inputClass} ref={ref} {...props} />;
    }
);

Input.displayName = 'Input';

export { Input };

// eslint-disable-next-line react-refresh/only-export-components
export { inputVariants };
