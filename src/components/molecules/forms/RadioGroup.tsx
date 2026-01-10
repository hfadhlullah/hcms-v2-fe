/**
 * RadioGroup Molecule - Group of radio buttons
 */

import { Radio } from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface RadioGroupProps {
    name: string;
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    direction?: 'horizontal' | 'vertical';
}

function RadioGroup({
    name,
    options,
    value,
    onChange,
    disabled,
    className,
    direction = 'horizontal',
}: RadioGroupProps) {
    return (
        <div
            className={cn(
                'flex gap-4',
                direction === 'vertical' && 'flex-col gap-2',
                className
            )}
        >
            {options.map((option) => (
                <Radio
                    key={option.value}
                    name={name}
                    value={option.value}
                    label={option.label}
                    checked={value === option.value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled || option.disabled}
                />
            ))}
        </div>
    );
}

export { RadioGroup };
