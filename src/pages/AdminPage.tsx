/**
 * AdminPage - HCMS Admin Console
 * Central administration hub for managing organization settings and apps
 */

import { useState } from 'react';
import {
    AdminHeader,
    AdminSidebar,
    OrganizationInfoCard,
    ShortcutsGrid,
    AppsSection,
    MemberDepartmentView,
} from '@/components/organisms/admin';

export function AdminPage() {
    const [activeItem, setActiveItem] = useState('organization-overview');

    const handleSidebarItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const handleShortcutClick = (shortcutId: string) => {
        // Handle shortcut navigation
        if (shortcutId === 'member-department') {
            setActiveItem('member-department');
        }
        console.log('Shortcut clicked:', shortcutId);
    };

    const renderContent = () => {
        switch (activeItem) {
            case 'organization-overview':
                return (
                    <div className="space-y-6">
                        {/* Organization Info */}
                        <OrganizationInfoCard
                            name="HCMS Organization"
                            orgId="HCMS001"
                            memberCount={2}
                            departmentCount={5}
                            primaryAdminCount={1}
                            subAdminCount={0}
                        />

                        {/* Shortcuts */}
                        <ShortcutsGrid onShortcutClick={handleShortcutClick} />

                        {/* Feature Usage - Placeholder for future */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-medium text-gray-900">Feature Usage</h3>
                                <button className="text-sm text-gray-500 hover:text-gray-700">&gt;</button>
                            </div>
                            <div className="flex items-center gap-8 text-sm text-gray-500">
                                <div>
                                    <span className="text-gray-400">Active users yesterday</span>
                                    <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Active rate yesterday</span>
                                    <p className="text-2xl font-semibold text-gray-900 mt-1">0.00%</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">Trend details coming soon...</p>
                            </div>
                        </div>
                    </div>
                );
            case 'member-department':
                return <MemberDepartmentView />;
            default:
                return (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🚧</div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h2>
                            <p className="text-gray-500">This feature is under development.</p>
                        </div>
                    </div>
                );
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
                    activeItem={activeItem}
                    onItemClick={handleSidebarItemClick}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-hidden">
                    {activeItem === 'member-department' ? (
                        renderContent()
                    ) : (
                        <div className="p-6 overflow-y-auto h-full">
                            <div className="flex gap-6">
                                {/* Left Content Area */}
                                <div className="flex-1 max-w-4xl">
                                    {renderContent()}
                                </div>

                                {/* Right Sidebar - Apps */}
                                <div className="w-80 flex-shrink-0">
                                    <AppsSection />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminPage;
