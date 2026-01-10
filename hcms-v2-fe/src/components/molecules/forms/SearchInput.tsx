/**
 * SearchInput Molecule - Input with search icon and optional clear button
 */

import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input, type InputProps } from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends Omit<InputProps, 'leftAddon' | 'rightAddon'> {
    onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, value, onClear, ...props }, ref) => {
        const showClear = onClear && value && String(value).length > 0;

        return (
            <div className={cn('relative', className)}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    ref={ref}
                    value={value}
                    className={cn('pl-10', showClear && 'pr-10')}
                    {...props}
                />
                {showClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
