/**
 * Shift Settings View - Refactored with atomic design components (same as GroupSettingsView)
 */

import { useState, useEffect } from 'react';
import { Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import { useShiftStore } from '@/store';
import { useAuth } from '@/hooks';
import type { Shift } from '@/types';

// Atomic design components
import { Button } from '@/components/atoms';
import { SearchInput, IconButton, StatusBadge } from '@/components/molecules';
import {
    PageHeader,
    DataTable,
    Pagination,
    ConfirmDialog,
    ErrorAlert,
    type Column,
} from '@/components/organisms/common';

interface ShiftSettingsViewProps {
    onCreateNew: () => void;
    onEdit: (shift: Shift) => void;
}

export function ShiftSettingsView({ onCreateNew, onEdit }: ShiftSettingsViewProps) {
    const { isLoggedIn, token } = useAuth();

    const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const shifts = useShiftStore((state) => state.shifts);
    const loading = useShiftStore((state) => state.loading);
    const error = useShiftStore((state) => state.error);
    const pagination = useShiftStore((state) => state.pagination);
    const loadShifts = useShiftStore((state) => state.loadShifts);
    const deleteShiftAction = useShiftStore((state) => state.deleteShift);
    const clearError = useShiftStore((state) => state.clearError);

    // Initial load
    useEffect(() => {
        if (isLoggedIn && token) {
            loadShifts().catch(console.error);
        }
    }, [isLoggedIn, token, loadShifts]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        // Debounce search - in a real app you'd use useShiftStore's filter
    };

    const handleDelete = async () => {
        if (!shiftToDelete) return;
        setIsDeleting(true);
        try {
            await deleteShiftAction(shiftToDelete.id);
            setShiftToDelete(null);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePageChange = (page: number) => {
        loadShifts(page);
    };

    // Helper functions
    const calculateWorkingHours = (shift: Shift) => {
        const hours = Math.floor(shift.workingHoursMinutes / 60);
        const minutes = shift.workingHoursMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    // Define table columns (same structure as GroupSettingsView)
    const columns: Column<Shift>[] = [
        {
            header: 'Shift name',
            accessor: 'name',
            render: (_, row) => (
                <button
                    onClick={() => onEdit(row)}
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                    {row.name}
                </button>
            ),
        },
        {
            header: 'Type',
            accessor: 'shiftType',
            render: (value) => (
                <StatusBadge status={value as string} />
            ),
        },
        {
            header: 'Date Type',
            accessor: 'dateType',
            render: (value) => (
                <StatusBadge status={value as string} />
            ),
        },
        {
            header: 'Time',
            accessor: 'startTime',
            render: (_, row) => (
                <span className="text-sm text-gray-600">
                    {row.startTime} - {row.endTime}
                    {row.isNextDayEnd && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            +1 day
                        </span>
                    )}
                </span>
            ),
        },
        {
            header: 'Working Hours',
            accessor: 'workingHoursMinutes',
            render: (_, row) => (
                <span className="text-sm text-gray-600">{calculateWorkingHours(row)}</span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (value) => (
                <StatusBadge status={value as string} rounded="full" />
            ),
        },
        {
            header: 'Action',
            accessor: 'id',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (_, row) => (
                <div className="flex items-center justify-end gap-1">
                    <IconButton
                        icon={<Edit2 className="h-4 w-4" />}
                        variant="primary"
                        size="sm"
                        tooltip="Edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                        }}
                        disabled={loading}
                    />
                    <IconButton
                        icon={<Trash2 className="h-4 w-4" />}
                        variant="danger"
                        size="sm"
                        tooltip="Delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShiftToDelete(row);
                        }}
                        disabled={loading}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <PageHeader title="Shift Settings" />

            {/* Actions Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button leftIcon={<Plus size={18} />} onClick={onCreateNew}>
                        New
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <SearchInput
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        onClear={() => handleSearch('')}
                        placeholder="Search by shift name or creator's name"
                        className="w-72"
                    />
                    <Button variant="secondary" leftIcon={<Filter size={18} />}>
                        Filter
                    </Button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <ErrorAlert
                    message={error}
                    onDismiss={clearError}
                    onRetry={() => loadShifts()}
                />
            )}

            {/* Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <DataTable
                    columns={columns}
                    data={shifts}
                    rowKey="id"
                    isLoading={loading}
                    emptyMessage='No shifts found. Click "+ New" to create one.'
                />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!shiftToDelete}
                onOpenChange={(open) => !open && setShiftToDelete(null)}
                title="Delete Shift"
                message={`Are you sure you want to delete "${shiftToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
