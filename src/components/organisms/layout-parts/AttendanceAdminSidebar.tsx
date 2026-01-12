import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { attendanceAdminMenuGroups } from '@/config/attendance-admin-menu';

interface AttendanceAdminSidebarProps {
    activeItem: string;
    onItemClick: (itemId: string) => void;
}

export function AttendanceAdminSidebar({ activeItem, onItemClick }: AttendanceAdminSidebarProps) {
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['attendance-settings']);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) =>
            prev.includes(groupId)
                ? prev.filter((id) => id !== groupId)
                : [...prev, groupId]
        );
    };

    const getActiveGroupId = () => {
        for (const group of attendanceAdminMenuGroups) {
            if (group.items.some((item) => item.id === activeItem)) {
                return group.id;
            }
        }
        return null;
    };

    const activeGroupId = getActiveGroupId();

    return (
        <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-52px)]">
            <nav className="py-2">
                {attendanceAdminMenuGroups.map((group) => (
                    <div key={group.id}>
                        {/* Group Header */}
                        <button
                            onClick={() => toggleGroup(group.id)}
                            className={cn(
                                "w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                                activeGroupId === group.id
                                    ? "text-blue-600"
                                    : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <span className={activeGroupId === group.id ? "text-blue-600" : "text-gray-500"}>
                                {group.icon}
                            </span>
                            <span className="flex-1 text-left">{group.label}</span>
                            {expandedGroups.includes(group.id) ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                        </button>

                        {/* Group Items */}
                        {expandedGroups.includes(group.id) && (
                            <div className="ml-4">
                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onItemClick(item.id)}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm transition-colors border-l-2",
                                            activeItem === item.id
                                                ? "bg-blue-50 text-blue-600 border-blue-600 font-medium"
                                                : "text-gray-600 border-transparent hover:bg-gray-50"
                                        )}
                                    >
                                        {item.label}
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
