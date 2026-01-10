/**
 * ResetPasswordModal - Modal for resetting user password
 */

import { useState } from 'react';
import { X, Info, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordModalProps {
    isOpen: boolean;
    userName: string;
    onClose: () => void;
    onSubmit: (password: string | null) => void; // null means generate by system
}

export function ResetPasswordModal({ isOpen, onClose, onSubmit }: ResetPasswordModalProps) {
    const [passwordMode, setPasswordMode] = useState<'generate' | 'manual'>('generate');
    const [manualPassword, setManualPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (passwordMode === 'generate') {
            onSubmit(null);
        } else {
            onSubmit(manualPassword);
        }
        setManualPassword('');
        setPasswordMode('generate');
        onClose();
    };

    const handleClose = () => {
        setManualPassword('');
        setPasswordMode('generate');
        onClose();
    };

    const isValid = passwordMode === 'generate' || (manualPassword.length >= 8 && manualPassword.length <= 16);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Info className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Reset Password</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Once reset, the password will take effect immediately. If a password already exists,
                        the member will be logged out and required to set a new password upon next login.
                    </p>

                    {/* Radio Options */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="passwordMode"
                                checked={passwordMode === 'generate'}
                                onChange={() => setPasswordMode('generate')}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">Generate password by system</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="passwordMode"
                                checked={passwordMode === 'manual'}
                                onChange={() => setPasswordMode('manual')}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">Set password manually</span>
                        </label>
                    </div>

                    {/* Manual Password Input */}
                    {passwordMode === 'manual' && (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-500">
                                Password should be between 8 and 16 characters. Must contain two of the following: numbers, letters or characters
                            </p>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={manualPassword}
                                    onChange={(e) => setManualPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Generate a random password
                                            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
                                            let password = '';
                                            for (let i = 0; i < 12; i++) {
                                                password += chars.charAt(Math.floor(Math.random() * chars.length));
                                            }
                                            setManualPassword(password);
                                        }}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Generate password"
                                    >
                                        🎲
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
