/**
 * MemberTable - Data table for displaying members
 */

import { useState, useRef } from 'react';
import { MoreHorizontal, Key, Trash2, FolderInput, Pause, ArrowUpToLine } from 'lucide-react';
import type { Member } from '@/types/member';

interface MemberTableProps {
    members: Member[];
    selectedIds: number[];
    onSelectMember: (id: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    onViewDetails: (member: Member) => void;
    onResetPassword?: (member: Member) => void;
    onDelete?: (member: Member) => void;
}

function StatusBadge({ status }: { status: Member['status'] }) {
    const styles = {
        ACTIVE: 'bg-green-100 text-green-700',
        INVITED: 'bg-orange-100 text-orange-700',
        DELETED: 'bg-gray-100 text-gray-500',
    };

    const labels = {
        ACTIVE: 'Active',
        INVITED: 'Invited',
        DELETED: 'Deleted',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
            {status === 'ACTIVE' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />}
            {labels[status]}
        </span>
    );
}

function ActionDropdown({ member, onResetPassword, onDelete }: { member: Member; onResetPassword?: (member: Member) => void; onDelete?: (member: Member) => void; }) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleOpen = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                left: rect.right - 192, // 192px = w-48
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleOpen}
                className="p-1 hover:bg-gray-100 rounded"
            >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div
                        className="fixed w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        style={{ top: position.top, left: position.left }}
                    >
                        <div className="py-1">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <FolderInput className="w-4 h-4" />
                                Change Department
                            </button>
                            <button
                                onClick={() => {
                                    onDelete?.(member);
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Pause className="w-4 h-4" />
                                Suspend Account
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                Transfer Resources
                            </button>
                            <button
                                onClick={() => {
                                    onResetPassword?.(member);
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Key className="w-4 h-4" />
                                Reset Login Password
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <ArrowUpToLine className="w-4 h-4" />
                                Pin to top
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


export function MemberTable({
    members,
    selectedIds,
    onSelectMember,
    onSelectAll,
    onViewDetails,
    onResetPassword,
    onDelete,
}: MemberTableProps) {
    const allSelected = members.length > 0 && selectedIds.length === members.length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="w-12 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => onSelectAll(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Work email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {members.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(member.id)}
                                    onChange={(e) => onSelectMember(member.id, e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                        style={{
                                            backgroundColor: member.status === 'ACTIVE' ? '#3b82f6' : '#f59e0b',
                                        }}
                                    >
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        onClick={() => onViewDetails(member)}
                                        className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline"
                                    >
                                        {member.name}
                                    </button>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={member.status} />
                                    {member.status === 'INVITED' && (
                                        <button className="text-xs text-blue-600 hover:underline">
                                            Remind
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {member.email}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {member.department || '-'}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onViewDetails(member)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Details
                                    </button>
                                    <ActionDropdown member={member} onResetPassword={onResetPassword} onDelete={onDelete} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    {members.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                No members found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

