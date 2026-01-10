/**
 * FormSection Organism - Card-like container for form groups
 */

import { cn } from '@/lib/utils';

export interface FormSectionProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

function FormSection({ title, description, children, className }: FormSectionProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-gray-200 bg-gray-50/50 p-4',
                className
            )}
        >
            {(title || description) && (
                <div className="mb-4">
                    {title && (
                        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
                    )}
                    {description && (
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

export { FormSection };
