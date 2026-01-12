/**
 * DepartmentTree - Hierarchical department structure sidebar
 */

import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Layers, Plus } from 'lucide-react';
import type { Department } from '@/types/member';

// Mock department data
const mockDepartments: Department[] = [
    {
        id: 1,
        name: "HCMS Organization",
        children: [
            { id: 2, name: "Division A", parentId: 1 },
            { id: 3, name: "Division B", parentId: 1 },
        ],
    },
];

interface DepartmentTreeProps {
    selectedDepartmentId?: number;
    onSelectDepartment: (departmentId: number | undefined) => void;
}

interface TreeNodeProps {
    department: Department;
    level: number;
    selectedId?: number;
    onSelect: (id: number) => void;
}

function TreeNode({ department, level, selectedId, onSelect }: TreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(level === 0);
    const hasChildren = department.children && department.children.length > 0;
    const isSelected = selectedId === department.id;
    const isRoot = level === 0;

    return (
        <div>
            <button
                onClick={() => {
                    onSelect(department.id);
                    if (hasChildren) {
                        setIsExpanded(!isExpanded);
                    }
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isSelected
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                style={{ paddingLeft: `${level * 16 + 12}px` }}
            >
                {hasChildren ? (
                    isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )
                ) : (
                    <span className="w-4" />
                )}

                {isRoot ? (
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-white" />
                    </div>
                ) : (
                    <Layers className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}

                <span className="truncate flex-1 text-left">{department.name}</span>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Handle menu
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                >
                    <span className="text-gray-400">⋮</span>
                </button>
            </button>

            {hasChildren && isExpanded && (
                <div>
                    {department.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            department={child}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function DepartmentTree({ selectedDepartmentId, onSelectDepartment }: DepartmentTreeProps) {
    return (
        <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Enter name, email ..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto p-2">
                {mockDepartments.map((dept) => (
                    <TreeNode
                        key={dept.id}
                        department={dept}
                        level={0}
                        selectedId={selectedDepartmentId}
                        onSelect={onSelectDepartment}
                    />
                ))}
            </div>

            {/* Add Button */}
            <div className="p-3 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>
        </div>
    );
}
