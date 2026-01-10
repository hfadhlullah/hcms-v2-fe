/**
 * MemberDetailsDrawer - Drawer component for viewing member details
 */

import { X, MoreHorizontal, ChevronLeft, ChevronRight, User, Mail, Phone, Building2, Calendar, MapPin, Briefcase } from 'lucide-react';
import type { Member } from '@/types/member';
import { useState } from 'react';

interface MemberDetailsDrawerProps {
    isOpen: boolean;
    member: Member | null;
    onClose: () => void;
    onEdit: (member: Member) => void;
    onDelete: (member: Member) => void;
}

export function MemberDetailsDrawer({ isOpen, member, onClose, onEdit, onDelete }: MemberDetailsDrawerProps) {
    const [activeTab, setActiveTab] = useState<'basic' | 'job' | 'login' | 'other'>('basic');
    const [showOptions, setShowOptions] = useState(false);

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-40 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 transition-opacity" onClick={onClose} />

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out slide-in-from-right">
                {/* Header */}
                <div className="h-14 px-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-base font-medium text-gray-900">Member Details</span>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex items-center gap-1 text-gray-400">
                            <button className="p-1 hover:text-gray-600 disabled:opacity-50" disabled>
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm">Previous</span>
                            <span className="text-sm">Next</span>
                            <button className="p-1 hover:text-gray-600 disabled:opacity-50" disabled>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto">
                    {/* Profile Header */}
                    <div className="px-8 py-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium">
                                    {member.avatar ? (
                                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        member.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${member.status === 'ACTIVE'
                                            ? 'bg-blue-50 text-blue-700'
                                            : member.status === 'INVITED'
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {member.status === 'ACTIVE' ? 'Active' : member.status === 'INVITED' ? 'Invited' : 'Deactivated'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{member.department || 'No Department'}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {showOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                        <button
                                            onClick={() => {
                                                onDelete(member);
                                                setShowOptions(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            Delete Member
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
                            {[
                                { id: 'basic', label: 'Basic Info' },
                                { id: 'job', label: 'Job details' },
                                { id: 'login', label: 'Login Method' },
                                { id: 'other', label: 'Other' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {activeTab === 'basic' && (
                                <>
                                    <InfoGroup label="Name" value={member.name} />
                                    <InfoGroup label="Last name" value={member.lastName || member.name.split(' ').slice(1).join(' ') || '-'} />
                                    <InfoGroup label="First name" value={member.firstName || member.name.split(' ')[0] || '-'} />
                                    <InfoGroup label="Alias" value={member.alias || '-'} icon={<User className="w-4 h-4" />} />
                                    <InfoGroup label="User ID" value={member.userId || `U${member.id}`} />
                                    <InfoGroup label="Phone number" value={member.phoneNumber || '-'} icon={<Phone className="w-4 h-4" />} />
                                    <InfoGroup label="Work email" value={member.email} icon={<Mail className="w-4 h-4" />} />
                                    <InfoGroup label="Department" value={member.department || '-'} icon={<Building2 className="w-4 h-4" />} />
                                </>
                            )}

                            {activeTab === 'job' && (
                                <>
                                    <InfoGroup label="Job Title" value={member.jobTitle || '-'} icon={<Briefcase className="w-4 h-4" />} />
                                    <InfoGroup label="Desk ID" value={member.deskId || '-'} />
                                    <InfoGroup label="Employee number" value={member.employeeNumber || '-'} />
                                    <InfoGroup label="Workforce Type" value={member.workforceType || '-'} />
                                    <InfoGroup label="Date of employment" value={member.dateOfEmployment || '-'} icon={<Calendar className="w-4 h-4" />} />
                                    <InfoGroup label="Country/Region" value={member.country || '-'} icon={<MapPin className="w-4 h-4" />} />
                                    <InfoGroup label="City" value={member.city || '-'} />
                                    <InfoGroup label="Direct Manager" value={member.directManager || '-'} />
                                    [/] <InfoGroup label="Dotted Line Manager" value={member.dottedLineManager || '-'} />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
                    <button
                        onClick={() => onEdit(member)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Edit Basic Info
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoGroup({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="group">
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                {label}
                {icon && <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1">{icon}</span>}
            </div>
            <div className="text-sm text-gray-900 font-medium">{value}</div>
        </div>
    );
}
