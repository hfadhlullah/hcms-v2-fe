/**
 * MembersTab - Members list view with department tree and data table
 */

import { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, Plus } from 'lucide-react';
import type { Member, CreateMemberRequest } from '@/types/member';
import { createUser, getUsers, updateUser, deleteUser, apiMemberToMember, resetUserPassword } from '@/api/usersApi';
import { DepartmentTree } from './DepartmentTree';
import { MemberTable } from './MemberTable';
import { AddMemberModal } from './AddMemberModal';
import { MemberDetailsDrawer } from './MemberDetailsDrawer';
import { ResetPasswordModal } from './ResetPasswordModal';
import { PasswordSuccessModal } from './PasswordSuccessModal';

export function MembersTab() {
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(1);
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [, setIsLoading] = useState(false);
    const [, setIsSaving] = useState(false);
    const [resetPasswordMember, setResetPasswordMember] = useState<Member | null>(null);
    const [detailsMember, setDetailsMember] = useState<Member | null>(null);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [successModalData, setSuccessModalData] = useState<{ isOpen: boolean; password?: string }>({ isOpen: false });

    // Load users from API
    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getUsers(0, 100);
            const apiMembers = response.content.map(apiMemberToMember);
            setMembers(apiMembers);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSelectMember = (id: number, selected: boolean) => {
        setSelectedMemberIds((prev) =>
            selected ? [...prev, id] : prev.filter((i) => i !== id)
        );
    };

    const handleSelectAll = (selected: boolean) => {
        setSelectedMemberIds(selected ? members.map((m) => m.id) : []);
    };

    const handleSaveMember = async (data: CreateMemberRequest) => {
        setIsSaving(true);
        try {
            if (editMember) {
                // Update existing member
                const response = await updateUser(editMember.id, data);
                setMembers((prev) => prev.map(m => m.id === editMember.id ? apiMemberToMember(response) : m));
                setEditMember(null);
            } else {
                // Create new member
                const response = await createUser(data);
                const newMember = apiMemberToMember(response);
                setMembers((prev) => [...prev, newMember]);
                setIsAddModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to save user:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteMember = async (member: Member) => {
        if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;

        try {
            await deleteUser(member.id);
            setMembers((prev) => prev.filter((m) => m.id !== member.id));
            setDetailsMember(null);
            setSelectedMemberIds((prev) => prev.filter((id) => id !== member.id));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleEditMember = (member: Member) => {
        setEditMember(member);
        setDetailsMember(null); // Close details drawer if open
    };

    const handleResetPassword = async (password: string | null) => {
        if (!resetPasswordMember) return;
        try {
            const response = await resetUserPassword(resetPasswordMember.id, password);
            setSuccessModalData({
                isOpen: true,
                password: response.generatedPassword
            });
            setResetPasswordMember(null);
        } catch (error) {
            console.error('Failed to reset password:', error);
        }
    };

    const filteredMembers = members.filter((m) => {
        if (statusFilter === 'all') return true;
        return m.status === statusFilter.toUpperCase();
    });

    const activeCount = members.filter((m) => m.status === 'ACTIVE').length;
    const invitedCount = members.filter((m) => m.status === 'INVITED').length;

    return (
        <div className="flex h-full">
            {/* Department Tree Sidebar */}
            <DepartmentTree
                selectedDepartmentId={selectedDepartmentId}
                onSelectDepartment={setSelectedDepartmentId}
            />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Organization Context */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-900 font-medium">HCMS Organization</span>
                        <span className="text-sm text-gray-500">
                            Users <span className="text-blue-600 font-medium">{activeCount}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Invited <span className="font-medium">{invitedCount}</span>
                        </span>
                    </div>
                </div>

                {/* Filters and Actions Row */}
                <div className="flex items-center justify-between mb-4">
                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Status</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="invited">Invited</option>
                            </select>
                        </div>
                        <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>All members</option>
                            <option>Direct members</option>
                        </select>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Search className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            disabled={selectedMemberIds.length === 0}
                            className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Delete
                        </button>
                        <button
                            disabled={selectedMemberIds.length === 0}
                            className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Change Department
                        </button>
                        <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batch Import/Export
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
                            <UserPlus className="w-4 h-4" />
                            Invite Member
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4" />
                            Add Members
                        </button>
                    </div>
                </div>

                {/* Members Table */}
                <MemberTable
                    members={filteredMembers}
                    selectedIds={selectedMemberIds}
                    onSelectMember={handleSelectMember}
                    onSelectAll={handleSelectAll}
                    onViewDetails={(member) => setDetailsMember(member)}
                    onResetPassword={(member) => setResetPasswordMember(member)}
                />
            </div>

            {/* Add/Edit Member Modal */}
            <AddMemberModal
                isOpen={isAddModalOpen || !!editMember}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditMember(null);
                }}
                onSubmit={handleSaveMember}
                initialData={editMember ? {
                    name: editMember.name,
                    email: editMember.email,
                    departmentId: editMember.departmentId,
                    phoneNumber: editMember.phoneNumber,
                    alias: editMember.alias,
                    deskId: editMember.deskId,
                    phoneExtension: editMember.phoneExtension,
                    employeeNumber: editMember.employeeNumber,
                    userId: editMember.userId,
                    gender: editMember.gender,
                    workforceType: editMember.workforceType,
                    dateOfEmployment: editMember.dateOfEmployment,
                    country: editMember.country,
                    city: editMember.city,
                    directManager: editMember.directManager,
                    dottedLineManager: editMember.dottedLineManager,
                    jobTitle: editMember.jobTitle,
                    firstName: editMember.firstName,
                    lastName: editMember.lastName
                } : undefined}
                mode={editMember ? 'edit' : 'add'}
            />

            {/* Member Details Drawer */}
            <MemberDetailsDrawer
                isOpen={!!detailsMember}
                member={detailsMember}
                onClose={() => setDetailsMember(null)}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
            />

            {/* Reset Password Modal */}
            <ResetPasswordModal
                isOpen={!!resetPasswordMember}
                userName={resetPasswordMember?.name || ''}
                onClose={() => setResetPasswordMember(null)}
                onSubmit={handleResetPassword}
            />

            {/* Success Modal */}
            <PasswordSuccessModal
                isOpen={successModalData.isOpen}
                password={successModalData.password}
                onClose={() => setSuccessModalData({ isOpen: false })}
            />
        </div>
    );
}
