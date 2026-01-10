/**
 * FormField Molecule - Combines Label + Input + error message
 */

import { cn } from '@/lib/utils';
import { Label } from '@/components/atoms';

export interface FormFieldProps {
    label?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

function FormField({
    label,
    required,
    error,
    helperText,
    disabled,
    children,
    className,
}: FormFieldProps) {
    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <Label required={required} disabled={disabled}>
                    {label}
                </Label>
            )}
            {children}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!error && helperText && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}

export { FormField };
