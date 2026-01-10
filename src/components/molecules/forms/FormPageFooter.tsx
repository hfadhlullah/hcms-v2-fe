/**
 * FormPageFooter - Consistent footer with Confirm/Cancel buttons for form pages
 * Fixed to bottom of the form page layout
 */

interface FormPageFooterProps {
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    confirmText?: string;
    cancelText?: string;
    loadingText?: string;
}

export function FormPageFooter({
    onConfirm,
    onCancel,
    isLoading = false,
    isDisabled = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loadingText = 'Saving...',
}: FormPageFooterProps) {
    return (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={onConfirm}
                    disabled={isLoading || isDisabled}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? loadingText : confirmText}
                </button>
                <button
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    {cancelText}
                </button>
            </div>
        </div>
    );
}
