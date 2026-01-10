/**
 * PageHeader Organism - Consistent page headers
 */

import { cn } from '@/lib/utils';

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                    <p className="mt-1 text-gray-500">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}

export { PageHeader };
