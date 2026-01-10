/**
 * Shift form modal component using shadcn Dialog - Lark-style
 */

import type { CreateShiftRequest, Shift, UpdateShiftRequest } from '@/types';
import { ShiftForm } from './ShiftForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';

interface ShiftFormModalProps {
  isOpen: boolean;
  shift?: Shift;
  onClose: () => void;
  onSubmit: (
    request: CreateShiftRequest | UpdateShiftRequest
  ) => Promise<void>;
  isLoading?: boolean;
}

export function ShiftFormModal({
  isOpen,
  shift,
  onClose,
  onSubmit,
  isLoading,
}: ShiftFormModalProps) {
  const handleSubmit = async (request: CreateShiftRequest | UpdateShiftRequest) => {
    await onSubmit(request);
    onClose();
  };

  const modalTitle = shift ? 'Edit Shift' : 'Create Shift';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {modalTitle}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-6">
          <ShiftForm
            shift={shift}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShiftFormModal;
