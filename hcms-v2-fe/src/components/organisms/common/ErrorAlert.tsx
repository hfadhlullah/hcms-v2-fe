/**
 * ErrorAlert Organism - Dismissible error message with optional retry
 */

import { Button } from '@/components/atoms';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorAlertProps {
    message: string;
    onDismiss?: () => void;
    onRetry?: () => void;
    retryLabel?: string;
    className?: string;
}

function ErrorAlert({
    message,
    onDismiss,
    onRetry,
    retryLabel = 'Retry',
    className,
}: ErrorAlertProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4',
                className
            )}
        >
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="flex-1 text-sm font-medium text-red-800">{message}</p>
            <div className="flex items-center gap-2">
                {onRetry && (
                    <Button variant="ghost" size="sm" onClick={onRetry}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {retryLabel}
                    </Button>
                )}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

export { ErrorAlert };
