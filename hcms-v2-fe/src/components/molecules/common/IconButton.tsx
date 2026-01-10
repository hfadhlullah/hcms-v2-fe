/**
 * IconButton Molecule - Icon-only button with tooltip
 */

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconButtonVariants = cva(
    'inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                primary: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
                danger: 'text-red-600 hover:bg-red-50 hover:text-red-700',
                ghost: 'text-gray-500 hover:text-gray-700',
            },
            size: {
                sm: 'h-8 w-8',
                md: 'h-10 w-10',
                lg: 'h-12 w-12',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

export interface IconButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
    icon: React.ReactNode;
    tooltip?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, variant, size, icon, tooltip, ...props }, ref) => {
        const button = (
            <button
                ref={ref}
                className={cn(iconButtonVariants({ variant, size, className }))}
                {...props}
            >
                {icon}
            </button>
        );

        if (tooltip) {
            return (
                <div className="relative group">
                    {button}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {tooltip}
                    </div>
                </div>
            );
        }

        return button;
    }
);

IconButton.displayName = 'IconButton';

export { IconButton };

// eslint-disable-next-line react-refresh/only-export-components
export { iconButtonVariants };
