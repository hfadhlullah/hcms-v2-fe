/**
 * AdminSidebar - Collapsible sidebar for HCMS Admin console
 */

import { useState } from 'react';
import {
    Building2,
    Users,
    ExternalLink,
    Video,
    Briefcase,
    CreditCard,
    HardDrive,
    Lock,
    Scale,
    BarChart2,
    Palette,
    Settings,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    children?: { id: string; label: string }[];
}

const sidebarItems: SidebarItem[] = [
    {
        id: 'organization-overview',
        label: 'Organization Overview',
        icon: <Building2 className="w-5 h-5" />,
    },
    {
        id: 'organization',
        label: 'Organization',
        icon: <Users className="w-5 h-5" />,
        children: [
            { id: 'member-department', label: 'Member and Department' },
            { id: 'role', label: 'Role' },
            { id: 'unit', label: 'Unit' },
            { id: 'user-group', label: 'User Group' },
            { id: 'field-management', label: 'Field Management' },
        ],
    },
    {
        id: 'external-collaborations',
        label: 'External Collaborations',
        icon: <ExternalLink className="w-5 h-5" />,
    },
    {
        id: 'meeting-rooms',
        label: 'Meeting Rooms',
        icon: <Video className="w-5 h-5" />,
    },
    {
        id: 'workplace',
        label: 'Workplace',
        icon: <Briefcase className="w-5 h-5" />,
    },
    {
        id: 'billing',
        label: 'Billing',
        icon: <CreditCard className="w-5 h-5" />,
    },
    {
        id: 'storage',
        label: 'Storage',
        icon: <HardDrive className="w-5 h-5" />,
    },
    {
        id: 'security',
        label: 'Security',
        icon: <Lock className="w-5 h-5" />,
    },
    {
        id: 'compliance',
        label: 'Compliance',
        icon: <Scale className="w-5 h-5" />,
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: <BarChart2 className="w-5 h-5" />,
    },
    {
        id: 'customization',
        label: 'Customization',
        icon: <Palette className="w-5 h-5" />,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <Settings className="w-5 h-5" />,
    },
];

interface AdminSidebarProps {
    activeItem: string;
    onItemClick: (itemId: string) => void;
}

export function AdminSidebar({ activeItem, onItemClick }: AdminSidebarProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>(['organization']);

    const toggleExpand = (itemId: string) => {
        setExpandedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleClick = (item: SidebarItem) => {
        if (item.children) {
            toggleExpand(item.id);
        } else {
            onItemClick(item.id);
        }
    };

    return (
        <aside className="w-56 bg-white border-r border-gray-200 overflow-y-auto">
            <nav className="py-2">
                {sidebarItems.map((item) => (
                    <div key={item.id}>
                        {/* Parent Item */}
                        <button
                            onClick={() => handleClick(item)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${activeItem === item.id
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={activeItem === item.id ? 'text-blue-600' : 'text-gray-500'}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </div>
                            {item.children && (
                                <span className="text-gray-400">
                                    {expandedItems.includes(item.id) ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </span>
                            )}
                        </button>

                        {/* Children */}
                        {item.children && expandedItems.includes(item.id) && (
                            <div className="ml-4">
                                {item.children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => onItemClick(child.id)}
                                        className={`w-full text-left px-4 py-2 pl-10 text-sm transition-colors ${activeItem === child.id
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
