/**
 * Attendance Admin Menu Configuration
 */

import {
    Settings,
    FileText,
    Calendar,
    Clock,
    Users,
} from 'lucide-react';
import type { MenuGroup } from '@/types';

export const attendanceAdminMenuGroups: MenuGroup[] = [
    {
        id: 'attendance-settings',
        label: 'Attendance Settings',
        icon: <Settings className="w-4 h-4" />,
        items: [
            { id: 'group-settings', label: 'Group Settings' },
            { id: 'shift-settings', label: 'Shift Settings' },
            { id: 'mobile-settings', label: 'Mobile Settings' },
            { id: 'holiday', label: 'Holiday' },
        ],
    },
    {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        icon: <FileText className="w-4 h-4" />,
        items: [
            { id: 'reports', label: 'Reports' },
            { id: 'original-records', label: 'Original Records' },
            { id: 'field-management', label: 'Field Management' },
            { id: 'timesheet-verification', label: 'Timesheet Verification' },
        ],
    },
    {
        id: 'leave-management',
        label: 'Leave Management',
        icon: <Calendar className="w-4 h-4" />,
        items: [
            { id: 'leave-type', label: 'Leave Type' },
            { id: 'leave-balance', label: 'Leave Balance' },
        ],
    },
    {
        id: 'overtime-management',
        label: 'Overtime Management',
        icon: <Clock className="w-4 h-4" />,
        items: [
            { id: 'overtime-rules', label: 'Overtime Rules' },
            { id: 'overtime-records', label: 'Overtime Records' },
        ],
    },
    {
        id: 'administrator',
        label: 'Administrator',
        icon: <Users className="w-4 h-4" />,
        items: [
            { id: 'administrator-settings', label: 'Administrator Settings' },
            { id: 'app-settings', label: 'App Settings' },
        ],
    },
];
