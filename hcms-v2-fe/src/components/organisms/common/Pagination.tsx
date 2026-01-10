/**
 * Pagination Organism - Page navigation with page size selector
 */

import { Button } from '@/components/atoms';
import { Select } from '@/components/atoms';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    showPageSize?: boolean;
}

function Pagination({
    currentPage,
    totalPages,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50],
    className,
    showPageSize = true,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else {
            pages.push(0);

            if (currentPage > 2) pages.push('ellipsis');

            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 3) pages.push('ellipsis');

            if (!pages.includes(totalPages - 1)) pages.push(totalPages - 1);
        }

        return pages;
    };

    return (
        <div className={cn('flex items-center justify-end gap-2', className)}>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrev}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, idx) =>
                page === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            'min-w-[2rem] px-3 py-1 text-sm rounded border transition-colors',
                            currentPage === page
                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        )}
                    >
                        {page + 1}
                    </button>
                )
            )}

            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            {showPageSize && onPageSizeChange && (
                <Select
                    value={String(pageSize)}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    options={pageSizeOptions.map((size) => ({
                        value: String(size),
                        label: `${size} / page`,
                    }))}
                    selectSize="sm"
                    className="ml-2 w-28"
                />
            )}
        </div>
    );
}

export { Pagination };
