/**
 * Shifts Page - Refactored with atomic design components
 */


import { useShiftStore } from '@/store';
import { useAuth } from '@/hooks';
import type { CreateShiftRequest, Shift, UpdateShiftRequest } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// Atomic design components
import { Button } from '@/components/atoms';
import { IconButton, StatusBadge } from '@/components/molecules';
import {
  PageHeader,
  DataTable,
  Pagination,
  ErrorAlert,
  ConfirmDialog,
  ShiftFilters,
  ShiftFormModal,
  type Column
} from '@/components/organisms';

export function ShiftsPage() {
  const { isLoggedIn, token } = useAuth();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = useState<Shift | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [formModalKey, setFormModalKey] = useState(Date.now());


  const shifts = useShiftStore((state) => state.shifts);
  const loading = useShiftStore((state) => state.loading);
  const error = useShiftStore((state) => state.error);
  const pagination = useShiftStore((state) => state.pagination);
  const filters = useShiftStore((state) => state.filters);

  const loadShifts = useShiftStore((state) => state.loadShifts);
  const createShift = useShiftStore((state) => state.createShift);
  const updateShift = useShiftStore((state) => state.updateShift);
  const deleteShiftAction = useShiftStore((state) => state.deleteShift);
  const clearError = useShiftStore((state) => state.clearError);

  // Load shifts on mount only if logged in AND has token
  useEffect(() => {
    if (isLoggedIn && token && !hasLoadedOnce) {
      console.log('[ShiftsPage] Loading shifts - isLoggedIn:', isLoggedIn, 'hasToken:', !!token);
      loadShifts().catch((err) => {
        console.error('Failed to load shifts:', err);
      });
      setHasLoadedOnce(true);
    } else {
      console.log('[ShiftsPage] Skipping load - isLoggedIn:', isLoggedIn, 'hasToken:', !!token, 'hasLoadedOnce:', hasLoadedOnce);
    }
  }, [isLoggedIn, token, hasLoadedOnce, loadShifts]);

  // Reload when filters change (but only after initial load)
  useEffect(() => {
    if (hasLoadedOnce && isLoggedIn && token) {
      console.log('[ShiftsPage] Reloading shifts with filters');
      loadShifts().catch((err) => {
        console.error('Failed to load shifts with filters:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status]);

  const handleCreateClick = () => {
    setEditingShift(null);
    setFormModalKey(Date.now());
    setIsFormModalOpen(true);
  };

  const handleEditClick = (shift: Shift) => {
    setEditingShift(shift);
    setFormModalKey(Date.now());
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (
    request: CreateShiftRequest | UpdateShiftRequest
  ) => {
    try {
      if (editingShift) {
        await updateShift(editingShift.id, request as UpdateShiftRequest);
      } else {
        await createShift(request as CreateShiftRequest);
      }
      setIsFormModalOpen(false);
      setEditingShift(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleDeleteClick = (shift: Shift) => {
    setDeleteShift(shift);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteShift) {
      try {
        await deleteShiftAction(deleteShift.id);
        setIsDeleteDialogOpen(false);
        setDeleteShift(null);
      } catch (error) {
        console.error('Delete error:', error);
      }
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

  // Define table columns
  const columns: Column<Shift>[] = [
    {
      header: 'Name',
      accessor: 'name',
      className: 'font-medium text-gray-900',
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
        <span>
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
      render: (_, row) => calculateWorkingHours(row),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <StatusBadge status={value as string} rounded="full" />
      ),
    },
    {
      header: 'Actions',
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
              handleEditClick(row);
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
              handleDeleteClick(row);
            }}
            disabled={loading}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Shifts"
        subtitle="Manage work shifts and schedules"
        actions={
          <Button leftIcon={<Plus className="w-5 h-5" />} onClick={handleCreateClick}>
            New Shift
          </Button>
        }
      />

      {/* Error message */}
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={clearError}
          onRetry={() => loadShifts()}
        />
      )}

      {/* Filters */}
      <ShiftFilters />

      {/* Shifts table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={shifts}
          rowKey="id"
          isLoading={loading}
          emptyMessage="No shifts found"
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        className="justify-center"
        showPageSize={false}
      />

      {/* Modals */}
      <ShiftFormModal
        key={formModalKey}
        isOpen={isFormModalOpen}
        shift={editingShift || undefined}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingShift(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={loading}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setDeleteShift(null);
          }
        }}
        title="Delete Shift"
        message={`Are you sure you want to delete "${deleteShift?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={loading}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default ShiftsPage;
