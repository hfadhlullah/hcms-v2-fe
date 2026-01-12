/**
 * AdminLayout - Layout wrapper for HCMS Admin pages
 * Provides consistent header and sidebar for all admin routes
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AdminHeader, AdminSidebar } from '@/components/organisms';

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract active item from current path
    const getActiveItem = () => {
        const path = location.pathname;
        if (path.includes('/member-department')) return 'member-department';
        if (path.includes('/organization')) return 'organization-overview';
        return 'organization-overview'; // default
    };

    const handleItemClick = (itemId: string) => {
        // Map menu item IDs to routes
        const routes: Record<string, string> = {
            'organization-overview': '/hcms-admin',
            'member-department': '/hcms-admin/member-department',
        };
        const route = routes[itemId];
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <AdminHeader userName="Admin" />

            {/* Main Layout */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <AdminSidebar
                    activeItem={getActiveItem()}
                    onItemClick={handleItemClick}
                />

                {/* Main Content - renders child routes */}
                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
