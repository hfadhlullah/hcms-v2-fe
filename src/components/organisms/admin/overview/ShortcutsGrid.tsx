/**
 * ShortcutsGrid - Quick access shortcuts for admin features
 */

import { Users, LayoutGrid, Shield, Calculator, CheckCircle, Building2 } from 'lucide-react';

interface Shortcut {
    id: string;
    label: string;
    icon: React.ReactNode;
    iconBg: string;
    href?: string;
}

const shortcuts: Shortcut[] = [
    {
        id: 'member-department',
        label: 'Member and Department',
        icon: <Users className="w-6 h-6 text-white" />,
        iconBg: 'bg-blue-500',
    },
    {
        id: 'app-management',
        label: 'App Management',
        icon: <LayoutGrid className="w-6 h-6 text-white" />,
        iconBg: 'bg-blue-500',
    },
    {
        id: 'admin-permissions',
        label: 'Administrator Permissions',
        icon: <Shield className="w-6 h-6 text-white" />,
        iconBg: 'bg-gray-600',
    },
    {
        id: 'my-quota',
        label: 'My Quota',
        icon: <Calculator className="w-6 h-6 text-white" />,
        iconBg: 'bg-cyan-500',
    },
    {
        id: 'app-review',
        label: 'App Review',
        icon: <CheckCircle className="w-6 h-6 text-white" />,
        iconBg: 'bg-blue-500',
    },
    {
        id: 'organization-info',
        label: 'Organization Info',
        icon: <Building2 className="w-6 h-6 text-white" />,
        iconBg: 'bg-blue-500',
    },
];

interface ShortcutsGridProps {
    onShortcutClick?: (shortcutId: string) => void;
}

export function ShortcutsGrid({ onShortcutClick }: ShortcutsGridProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Shortcuts</h3>

            <div className="grid grid-cols-6 gap-4">
                {shortcuts.map((shortcut) => (
                    <button
                        key={shortcut.id}
                        onClick={() => onShortcutClick?.(shortcut.id)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                        <div className={`w-12 h-12 ${shortcut.iconBg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                            {shortcut.icon}
                        </div>
                        <span className="text-xs text-gray-600 text-center leading-tight">
                            {shortcut.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
