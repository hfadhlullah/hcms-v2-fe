/**
 * MemberDepartmentView - Main view for Member and Department management
 */

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MembersTab } from './MembersTab';

type TabType = 'members' | 'departments' | 'deleted';

export function MemberDepartmentView() {
    const [activeTab, setActiveTab] = useState<TabType>('members');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'members', label: 'Members' },
        { id: 'departments', label: 'Departments' },
        { id: 'deleted', label: 'Deleted Members' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'members':
                return <MembersTab />;
            case 'departments':
            case 'deleted':
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
        <div className="h-full flex flex-col bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Organization</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">Member and Department</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6">
                <div className="flex gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {renderTabContent()}
            </div>
        </div>
    );
}
