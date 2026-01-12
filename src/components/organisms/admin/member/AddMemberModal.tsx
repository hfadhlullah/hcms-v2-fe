/**
 * AddMemberModal - Modal form for adding new members
 */

import { useState } from 'react';
import { X, HelpCircle, ExternalLink } from 'lucide-react';
import type { CreateMemberRequest, Gender, WorkforceType } from '@/types/member';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateMemberRequest) => void;
    initialData?: CreateMemberRequest;
    mode?: 'add' | 'edit';
}

const initialFormData: CreateMemberRequest = {
    name: '',
    lastName: '',
    firstName: '',
    departmentId: undefined,
    phoneNumber: '',
    email: '',
    alias: '',
    deskId: '',
    phoneExtension: '',
    employeeNumber: '',
    userId: '',
    gender: undefined,
    workforceType: 'REGULAR',
    dateOfEmployment: '',
    country: '',
    city: '',
    directManager: '',
    dottedLineManager: '',
    jobTitle: '',
};

export function AddMemberModal({ isOpen, onClose, onSubmit, initialData, mode = 'add' }: AddMemberModalProps) {
    const [formData, setFormData] = useState<CreateMemberRequest>(initialFormData);

    // Update form data when initialData changes or modal opens
    if (isOpen && initialData && JSON.stringify(formData) === JSON.stringify(initialFormData) && mode === 'edit') {
        setFormData(initialData);
    }

    // Reset form when opening in add mode if it has data
    if (isOpen && mode === 'add' && formData.name && !initialData) {
        // This check might be too aggressive, better to handle in useEffect
    }

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData(initialFormData);
        onClose();
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">{mode === 'edit' ? 'Edit Member' : 'Add Members'}</h2>
                        <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                            <ExternalLink className="w-3 h-3" />
                            Feature overview
                        </button>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-600 rounded" />
                            Basic info
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Last name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>First name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.departmentId || ''}
                                    onChange={(e) => setFormData({ ...formData, departmentId: parseInt(e.target.value) || undefined })}
                                    className={inputClasses}
                                >
                                    <option value="">Select department</option>
                                    <option value="1">HCMS Organization</option>
                                    <option value="2">Division A</option>
                                    <option value="3">Division B</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    Phone number <HelpCircle className="inline w-3 h-3 text-gray-400 ml-1" />
                                </label>
                                <div className="flex gap-2">
                                    <select className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm">
                                        <option>+1</option>
                                        <option>+62</option>
                                        <option>+44</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className={`${inputClasses} flex-1`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    Work email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Assign work email to member"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClasses}
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">This email will be used for login</p>
                            </div>
                        </div>
                    </section>

                    {/* Other Info Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-600 rounded" />
                            Other info
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>
                                    Alias <HelpCircle className="inline w-3 h-3 text-gray-400 ml-1" />
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Alias"
                                    value={formData.alias}
                                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Desk ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter Desk ID"
                                    value={formData.deskId}
                                    onChange={(e) => setFormData({ ...formData, deskId: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Phone extension</label>
                                <input
                                    type="text"
                                    placeholder="Enter an extension"
                                    value={formData.phoneExtension}
                                    onChange={(e) => setFormData({ ...formData, phoneExtension: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Employee number</label>
                                <input
                                    type="text"
                                    placeholder="Enter Employee number"
                                    value={formData.employeeNumber}
                                    onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    User ID <HelpCircle className="inline w-3 h-3 text-gray-400 ml-1" />
                                </label>
                                <input
                                    type="text"
                                    placeholder="Member's unique identifier. User ID can be modified."
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Gender</label>
                                <select
                                    value={formData.gender || ''}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender || undefined })}
                                    className={inputClasses}
                                >
                                    <option value="">Please select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Job Details Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-600 rounded" />
                            Job details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>
                                    Workforce Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.workforceType || 'REGULAR'}
                                    onChange={(e) => setFormData({ ...formData, workforceType: e.target.value as WorkforceType })}
                                    className={inputClasses}
                                >
                                    <option value="REGULAR">Regular</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERN">Intern</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Date of employment</label>
                                <input
                                    type="date"
                                    value={formData.dateOfEmployment}
                                    onChange={(e) => setFormData({ ...formData, dateOfEmployment: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Country or region</label>
                                <select
                                    value={formData.country || ''}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className={inputClasses}
                                >
                                    <option value="">Please select Country or region</option>
                                    <option value="ID">Indonesia</option>
                                    <option value="US">United States</option>
                                    <option value="UK">United Kingdom</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>City</label>
                                <select
                                    value={formData.city || ''}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className={inputClasses}
                                >
                                    <option value="">Please select City</option>
                                    <option value="Jakarta">Jakarta</option>
                                    <option value="Surabaya">Surabaya</option>
                                    <option value="Bandung">Bandung</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Direct manager</label>
                                <input
                                    type="text"
                                    placeholder="Enter Direct manager"
                                    value={formData.directManager}
                                    onChange={(e) => setFormData({ ...formData, directManager: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Dotted-line manager</label>
                                <input
                                    type="text"
                                    placeholder="Enter Dotted-line manager"
                                    value={formData.dottedLineManager}
                                    onChange={(e) => setFormData({ ...formData, dottedLineManager: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className={labelClasses}>Job Title</label>
                                <select
                                    value={formData.jobTitle || ''}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    className={inputClasses}
                                >
                                    <option value="">Please select Job title</option>
                                    <option value="Software Engineer">Software Engineer</option>
                                    <option value="Product Manager">Product Manager</option>
                                    <option value="Designer">Designer</option>
                                    <option value="HR Manager">HR Manager</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.email}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
