/**
 * Attendance Admin Page - Lark-style admin interface
 */

import { useState } from 'react';
import {
    AttendanceAdminHeader,
    AttendanceAdminSidebar,
    ShiftSettingsView,
    ShiftFormPage,
    GroupSettingsView,
    GroupFormPage,
} from '@/components/organisms';
import type { AttendanceGroup, Shift } from '@/types';

type PageView = 'list' | 'form';

export function AttendanceAdminPage() {
    const [activeItem, setActiveItem] = useState('group-settings');
    const [pageView, setPageView] = useState<PageView>('list');
    const [editingGroupId, setEditingGroupId] = useState<number | undefined>(undefined);
    const [editingShiftId, setEditingShiftId] = useState<number | undefined>(undefined);

    // Group handlers
    const handleCreateNewGroup = () => {
        setEditingGroupId(undefined);
        setPageView('form');
    };

    const handleEditGroup = (group: AttendanceGroup) => {
        setEditingGroupId(group.id);
        setPageView('form');
    };

    // Shift handlers
    const handleCreateNewShift = () => {
        setEditingShiftId(undefined);
        setPageView('form');
    };

    const handleEditShift = (shift: Shift) => {
        setEditingShiftId(shift.id);
        setPageView('form');
    };

    const handleBackToList = () => {
        setEditingGroupId(undefined);
        setEditingShiftId(undefined);
        setPageView('list');
    };

    const handleSave = () => {
        setEditingGroupId(undefined);
        setEditingShiftId(undefined);
        setPageView('list');
    };

    // If showing form, render full-screen form
    if (activeItem === 'group-settings' && pageView === 'form') {
        return (
            <GroupFormPage
                groupId={editingGroupId}
                onBack={handleBackToList}
                onSave={handleSave}
            />
        );
    }

    if (activeItem === 'shift-settings' && pageView === 'form') {
        return (
            <ShiftFormPage
                shiftId={editingShiftId}
                onBack={handleBackToList}
                onSave={handleSave}
            />
        );
    }

    const renderContent = () => {
        switch (activeItem) {
            case 'group-settings':
                return (
                    <GroupSettingsView
                        onCreateNew={handleCreateNewGroup}
                        onEdit={handleEditGroup}
                    />
                );
            case 'shift-settings':
                return (
                    <ShiftSettingsView
                        onCreateNew={handleCreateNewShift}
                        onEdit={handleEditShift}
                    />
                );
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <AttendanceAdminHeader />

            <div className="flex">
                {/* Sidebar */}
                <AttendanceAdminSidebar
                    activeItem={activeItem}
                    onItemClick={setActiveItem}
                />

                {/* Main Content */}
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default AttendanceAdminPage;
