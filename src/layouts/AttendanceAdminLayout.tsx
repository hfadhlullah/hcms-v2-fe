/**
 * AttendanceAdminLayout - Layout wrapper for Attendance Admin pages
 * Provides consistent header and sidebar for all attendance admin routes
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AttendanceAdminHeader, AttendanceAdminSidebar } from '@/components/organisms';

export function AttendanceAdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract active item from current path
    const getActiveItem = () => {
        const path = location.pathname;
        if (path.includes('/groups')) return 'group-settings';
        if (path.includes('/shifts')) return 'shift-settings';
        return 'group-settings'; // default
    };

    const handleItemClick = (itemId: string) => {
        // Map menu item IDs to routes
        const routes: Record<string, string> = {
            'group-settings': '/attendance-admin/groups',
            'shift-settings': '/attendance-admin/shifts',
        };
        const route = routes[itemId];
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <AttendanceAdminHeader />

            <div className="flex">
                {/* Sidebar */}
                <AttendanceAdminSidebar
                    activeItem={getActiveItem()}
                    onItemClick={handleItemClick}
                />

                {/* Main Content - renders child routes */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
