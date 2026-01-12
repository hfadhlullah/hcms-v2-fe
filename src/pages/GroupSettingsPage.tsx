/**
 * GroupSettingsPage - Page wrapper for GroupSettingsView
 * Used within AttendanceAdminLayout
 */

import { useState } from 'react';
import { GroupSettingsView, GroupFormPage } from '@/components/organisms';
import type { AttendanceGroup } from '@/types';

type PageView = 'list' | 'form';

export function GroupSettingsPage() {
    const [pageView, setPageView] = useState<PageView>('list');
    const [editingGroupId, setEditingGroupId] = useState<number | undefined>(undefined);

    const handleCreateNew = () => {
        setEditingGroupId(undefined);
        setPageView('form');
    };

    const handleEdit = (group: AttendanceGroup) => {
        setEditingGroupId(group.id);
        setPageView('form');
    };

    const handleBackToList = () => {
        setEditingGroupId(undefined);
        setPageView('list');
    };

    const handleSave = () => {
        setEditingGroupId(undefined);
        setPageView('list');
    };

    if (pageView === 'form') {
        return (
            <GroupFormPage
                groupId={editingGroupId}
                onBack={handleBackToList}
                onSave={handleSave}
            />
        );
    }

    return (
        <GroupSettingsView
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
        />
    );
}

export default GroupSettingsPage;
