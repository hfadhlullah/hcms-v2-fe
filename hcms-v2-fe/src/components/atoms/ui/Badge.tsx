/**
 * Badge Atom - Status indicators and labels
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center font-medium transition-colors',
    {
        variants: {
            variant: {
                success: 'bg-green-100 text-green-800',
                warning: 'bg-yellow-100 text-yellow-800',
                error: 'bg-red-100 text-red-800',
                info: 'bg-blue-100 text-blue-700',
                neutral: 'bg-gray-100 text-gray-800',
                purple: 'bg-purple-100 text-purple-700',
                orange: 'bg-orange-100 text-orange-700',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-1 text-xs',
                lg: 'px-3 py-1 text-sm',
            },
            rounded: {
                default: 'rounded',
                full: 'rounded-full',
            },
        },
        defaultVariants: {
            variant: 'neutral',
            size: 'md',
            rounded: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, size, rounded, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant, size, rounded, className }))} {...props} />
    );
}

export { Badge };

// eslint-disable-next-line react-refresh/only-export-components
export { badgeVariants };
