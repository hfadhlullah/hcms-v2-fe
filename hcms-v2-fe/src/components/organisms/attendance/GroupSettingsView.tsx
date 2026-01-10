/**
 * Group Settings View - Refactored with atomic design components
 */

import { useEffect, useState } from 'react';
import { Plus, Filter, Trash2, Users, Edit2 } from 'lucide-react';
import { useAttendanceGroupStore } from '@/store';
import type { AttendanceGroup } from '@/types';

// Atomic design components
import { Button, Badge } from '@/components/atoms';
import { SearchInput, IconButton, StatusBadge } from '@/components/molecules';
import {
    PageHeader,
    DataTable,
    Pagination,
    ConfirmDialog,
    ErrorAlert,
    type Column,
} from '@/components/organisms/common';

interface GroupSettingsViewProps {
    onCreateNew: () => void;
    onEdit: (group: AttendanceGroup) => void;
}

export function GroupSettingsView({ onCreateNew, onEdit }: GroupSettingsViewProps) {
    const {
        groups,
        isLoading,
        error,
        totalElements,
        currentPage,
        pageSize,
        searchQuery,
        fetchGroups,
        deleteGroup,
        setSearchQuery,
    } = useAttendanceGroupStore();

    const [groupToDelete, setGroupToDelete] = useState<AttendanceGroup | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchGroups(0, pageSize, value);
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    const handleDelete = async () => {
        if (!groupToDelete) return;
        setIsDeleting(true);
        try {
            await deleteGroup(groupToDelete.id);
            setGroupToDelete(null);
        } catch (error) {
            console.error('Failed to delete group:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = Math.ceil(totalElements / pageSize);

    // Define table columns
    const columns: Column<AttendanceGroup>[] = [
        {
            header: 'Attendance group name',
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
            header: 'Shift',
            accessor: 'defaultShiftTime',
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {value ? `Default shift: ${value}` : 'Not set'}
                </span>
            ),
        },
        {
            header: 'Members',
            accessor: 'memberCount',
            render: (value) => (
                <span className="text-sm text-gray-600">{(value as number) ?? 0}</span>
            ),
        },
        {
            header: 'Main person',
            accessor: 'subOwnerIds',
            render: (value) => {
                const subOwners = value as number[] | undefined;
                return (
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <Users size={12} className="text-white" />
                        </div>
                        {(subOwners?.length ?? 0) > 0 && (
                            <Badge variant="success" size="sm">
                                +{subOwners?.length ?? 0}
                            </Badge>
                        )}
                    </div>
                );
            },
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
                    />
                    <IconButton
                        icon={<Trash2 className="h-4 w-4" />}
                        variant="danger"
                        size="sm"
                        tooltip="Delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            setGroupToDelete(row);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <PageHeader title="Group Settings" />

            {/* Actions Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button leftIcon={<Plus size={18} />} onClick={onCreateNew}>
                        New
                    </Button>
                    <Button variant="secondary">
                        Bulk Set
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onClear={() => handleSearch('')}
                        placeholder="Search by group name, owner, or member..."
                        className="w-80"
                    />
                    <Button variant="secondary" leftIcon={<Filter size={18} />}>
                        Filter
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <ErrorAlert
                    message={error}
                    onRetry={() => fetchGroups()}
                />
            )}

            {/* Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <DataTable
                    columns={columns}
                    data={groups}
                    rowKey="id"
                    isLoading={isLoading}
                    emptyMessage='No attendance groups found. Click "+ New" to create one.'
                    selectable
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            onPageChange={(page) => fetchGroups(page)}
                            onPageSizeChange={(size) => fetchGroups(0, size)}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!groupToDelete}
                onOpenChange={(open) => !open && setGroupToDelete(null)}
                title="Delete Attendance Group"
                message={`Are you sure you want to delete "${groupToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
