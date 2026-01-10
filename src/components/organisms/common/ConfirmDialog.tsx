/**
 * ConfirmDialog Organism - Confirmation modal with variants
 */

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/atoms';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    message: string | React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
}

const variantConfig = {
    danger: {
        icon: AlertCircle,
        iconClass: 'text-red-600 bg-red-100',
        buttonVariant: 'danger' as const,
    },
    warning: {
        icon: AlertTriangle,
        iconClass: 'text-yellow-600 bg-yellow-100',
        buttonVariant: 'primary' as const,
    },
    info: {
        icon: Info,
        iconClass: 'text-blue-600 bg-blue-100',
        buttonVariant: 'primary' as const,
    },
};

function ConfirmDialog({
    open,
    onOpenChange,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
    isLoading,
}: ConfirmDialogProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    const handleConfirm = async () => {
        await onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className={cn('flex-shrink-0 p-3 rounded-full', config.iconClass)}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 pt-1">
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription className="mt-2">{message}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-6 gap-2 sm:gap-2">
                    <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={config.buttonVariant}
                        onClick={handleConfirm}
                        isLoading={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { ConfirmDialog };
