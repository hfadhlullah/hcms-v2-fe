/**
 * DataTable Organism - Reusable table with column definitions
 */

import { cn } from '@/lib/utils';

export interface Column<T> {
    header: string;
    accessor: keyof T | string;
    render?: (value: unknown, row: T) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    rowKey: keyof T | ((row: T) => string | number);
    onRowClick?: (row: T) => void;
    className?: string;
    selectable?: boolean;
    selectedIds?: Set<number | string>;
    onSelectionChange?: (ids: Set<number | string>) => void;
}

function DataTable<T extends object>({
    columns,
    data,
    isLoading,
    emptyMessage = 'No data found',
    rowKey,
    onRowClick,
    className,
    selectable,
    selectedIds,
    onSelectionChange,
}: DataTableProps<T>) {
    const getRowKey = (row: T): string | number => {
        if (typeof rowKey === 'function') {
            return rowKey(row);
        }
        return row[rowKey] as string | number;
    };

    const getValue = (row: T, accessor: keyof T | string): unknown => {
        if (typeof accessor === 'string' && accessor.includes('.')) {
            const keys = accessor.split('.');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return keys.reduce((obj: any, key) => obj?.[key], row);
        }
        return row[accessor as keyof T];
    };

    const handleSelectAll = () => {
        if (!onSelectionChange) return;
        const allIds = data.map((row) => getRowKey(row));
        const allSelected = allIds.every((id) => selectedIds?.has(id));
        if (allSelected) {
            onSelectionChange(new Set());
        } else {
            onSelectionChange(new Set(allIds));
        }
    };

    const handleSelectRow = (id: string | number) => {
        if (!onSelectionChange || !selectedIds) return;
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        onSelectionChange(newSelected);
    };

    const allSelected = data.length > 0 && data.every((row) => selectedIds?.has(getRowKey(row)));
    const someSelected = data.some((row) => selectedIds?.has(getRowKey(row)));

    return (
        <div className={cn('overflow-x-auto rounded-lg border border-gray-200', className)}>
            <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        {selectable && (
                            <th className="w-10 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someSelected && !allSelected;
                                    }}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                />
                            </th>
                        )}
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={cn(
                                    'px-4 py-3 text-left text-sm font-medium text-gray-600',
                                    col.headerClassName
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading && (
                        <tr>
                            <td
                                colSpan={columns.length + (selectable ? 1 : 0)}
                                className="px-4 py-8 text-center text-gray-500"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg
                                        className="h-5 w-5 animate-spin text-blue-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Loading...
                                </div>
                            </td>
                        </tr>
                    )}

                    {!isLoading && data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + (selectable ? 1 : 0)}
                                className="px-4 py-8 text-center text-gray-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}

                    {!isLoading &&
                        data.map((row) => {
                            const key = getRowKey(row);
                            const isSelected = selectedIds?.has(key);
                            return (
                                <tr
                                    key={key}
                                    onClick={() => onRowClick?.(row)}
                                    className={cn(
                                        'hover:bg-gray-50',
                                        onRowClick && 'cursor-pointer',
                                        isSelected && 'bg-blue-50'
                                    )}
                                >
                                    {selectable && (
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(key)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                            />
                                        </td>
                                    )}
                                    {columns.map((col, idx) => {
                                        const value = getValue(row, col.accessor);
                                        return (
                                            <td
                                                key={idx}
                                                className={cn('px-4 py-3 text-sm text-gray-700', col.className)}
                                            >
                                                {col.render ? col.render(value, row) : (value as React.ReactNode)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

export { DataTable };
