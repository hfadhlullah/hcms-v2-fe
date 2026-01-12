/**
 * ShiftSettingsPage - Page wrapper for ShiftSettingsView
 * Used within AttendanceAdminLayout
 */

import { useState } from 'react';
import { ShiftSettingsView, ShiftFormPage } from '@/components/organisms';
import type { Shift } from '@/types';

type PageView = 'list' | 'form';

export function ShiftSettingsPage() {
    const [pageView, setPageView] = useState<PageView>('list');
    const [editingShiftId, setEditingShiftId] = useState<number | undefined>(undefined);

    const handleCreateNew = () => {
        setEditingShiftId(undefined);
        setPageView('form');
    };

    const handleEdit = (shift: Shift) => {
        setEditingShiftId(shift.id);
        setPageView('form');
    };

    const handleBackToList = () => {
        setEditingShiftId(undefined);
        setPageView('list');
    };

    const handleSave = () => {
        setEditingShiftId(undefined);
        setPageView('list');
    };

    if (pageView === 'form') {
        return (
            <ShiftFormPage
                shiftId={editingShiftId}
                onBack={handleBackToList}
                onSave={handleSave}
            />
        );
    }

    return (
        <ShiftSettingsView
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
        />
    );
}

export default ShiftSettingsPage;
