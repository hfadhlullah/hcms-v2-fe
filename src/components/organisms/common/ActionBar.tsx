/**
 * ActionBar Organism - Toolbar with search, filters, and actions
 */

import { SearchInput } from '@/components/molecules';
import { cn } from '@/lib/utils';

export interface ActionBarProps {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    leftActions?: React.ReactNode;
    rightActions?: React.ReactNode;
    className?: string;
}

function ActionBar({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    leftActions,
    rightActions,
    className,
}: ActionBarProps) {
    return (
        <div className={cn('flex items-center justify-between gap-4', className)}>
            <div className="flex items-center gap-3">
                {leftActions}
            </div>
            <div className="flex items-center gap-3">
                {onSearchChange && (
                    <SearchInput
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onClear={() => onSearchChange('')}
                        placeholder={searchPlaceholder}
                        className="w-80"
                    />
                )}
                {rightActions}
            </div>
        </div>
    );
}

export { ActionBar };
