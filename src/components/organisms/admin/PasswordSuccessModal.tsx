/**
 * PasswordSuccessModal - Modal for showing the generated password
 */

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PasswordSuccessModalProps {
    isOpen: boolean;
    password?: string;
    onClose: () => void;
}

export function PasswordSuccessModal({ isOpen, password, onClose }: PasswordSuccessModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-6 h-6 text-green-600" />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successfully</h2>

                    {password ? (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                The new password has been generated. Please copy and share it with the member.
                            </p>
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                                <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                                    {password}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Copy password"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-600 mb-6">
                            The new password has been set successfully.
                        </p>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
