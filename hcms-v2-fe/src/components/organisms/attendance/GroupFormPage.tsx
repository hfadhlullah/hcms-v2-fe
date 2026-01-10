/**
 * Group Form Page - Full page form for creating/editing attendance groups
 */

import { useState, useEffect } from 'react';
import { useAttendanceGroupStore, useShiftStore } from '@/store';
import { FormPageLayout } from '@/components/molecules/forms';
import type {
    CreateAttendanceGroupRequest,
    MemberTrackingMode,
    GroupShiftType,
    AttendancePolicy,
    LeaveAttendancePolicy,
} from '@/types';

interface GroupFormPageProps {
    groupId?: number;
    onBack: () => void;
    onSave: () => void;
}

export function GroupFormPage({ groupId, onBack, onSave }: GroupFormPageProps) {
    const { fetchGroupById, createGroup, updateGroup, isLoading } = useAttendanceGroupStore();
    const { shifts, loadShifts } = useShiftStore();
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState<CreateAttendanceGroupRequest>({
        name: '',
        timezone: 'GMT+07:00',
        relocationSync: false,
        memberTrackingRequired: 'NONE',
        memberTrackingOptional: 'NONE',
        shiftType: 'FIXED',
        usePublicHolidays: false,
        requirePhoto: false,
        allowOffsite: false,
        outOfOfficePolicy: 'NO_CLOCK',
        businessTripPolicy: 'NO_CLOCK',
        partialLeavePolicy: 'NO_CLOCK',
        recordOvertime: false,
        nonWorkingDayApproval: false,
        nonWorkingDayResetTime: '04:00',
        allowCorrections: true,
        correctionTypes: ['NO_RECORD', 'LATE_IN', 'EARLY_OUT', 'REGULAR'],
    });

    // Weekly schedule with checkboxes
    const [weeklySchedule, setWeeklySchedule] = useState({
        monday: { enabled: true, shiftId: null as number | null },
        tuesday: { enabled: true, shiftId: null as number | null },
        wednesday: { enabled: true, shiftId: null as number | null },
        thursday: { enabled: true, shiftId: null as number | null },
        friday: { enabled: true, shiftId: null as number | null },
        saturday: { enabled: false, shiftId: null as number | null },
        sunday: { enabled: false, shiftId: null as number | null },
    });

    const loadGroup = async (id: number) => {
        try {
            const group = await fetchGroupById(id);
            setFormData({
                name: group.name,
                ownerId: group.ownerId ?? undefined,
                subOwnerIds: group.subOwnerIds,
                timezone: group.timezone,
                relocationSync: group.relocationSync,
                memberTrackingRequired: group.memberTrackingRequired,
                memberTrackingOptional: group.memberTrackingOptional,
                shiftType: group.shiftType,
                defaultShiftId: group.defaultShiftId ?? undefined,
                usePublicHolidays: group.usePublicHolidays,
                requirePhoto: group.requirePhoto,
                allowOffsite: group.allowOffsite,
                outOfOfficePolicy: group.outOfOfficePolicy,
                businessTripPolicy: group.businessTripPolicy,
                partialLeavePolicy: group.partialLeavePolicy,
                recordOvertime: group.recordOvertime,
                nonWorkingDayApproval: group.nonWorkingDayApproval,
                nonWorkingDayResetTime: group.nonWorkingDayResetTime,
                allowCorrections: group.allowCorrections,
                correctionTypes: group.correctionTypes,
            });
            setWeeklySchedule({
                monday: { enabled: !!group.mondayShiftId, shiftId: group.mondayShiftId },
                tuesday: { enabled: !!group.tuesdayShiftId, shiftId: group.tuesdayShiftId },
                wednesday: { enabled: !!group.wednesdayShiftId, shiftId: group.wednesdayShiftId },
                thursday: { enabled: !!group.thursdayShiftId, shiftId: group.thursdayShiftId },
                friday: { enabled: !!group.fridayShiftId, shiftId: group.fridayShiftId },
                saturday: { enabled: !!group.saturdayShiftId, shiftId: group.saturdayShiftId },
                sunday: { enabled: !!group.sundayShiftId, shiftId: group.sundayShiftId },
            });
        } catch (error) {
            console.error('Failed to load group:', error);
        }
    };

    useEffect(() => {
        loadShifts();
        if (groupId) {
            loadGroup(groupId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId]);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const request: CreateAttendanceGroupRequest = {
                ...formData,
                mondayShiftId: weeklySchedule.monday.enabled ? weeklySchedule.monday.shiftId : null,
                tuesdayShiftId: weeklySchedule.tuesday.enabled ? weeklySchedule.tuesday.shiftId : null,
                wednesdayShiftId: weeklySchedule.wednesday.enabled ? weeklySchedule.wednesday.shiftId : null,
                thursdayShiftId: weeklySchedule.thursday.enabled ? weeklySchedule.thursday.shiftId : null,
                fridayShiftId: weeklySchedule.friday.enabled ? weeklySchedule.friday.shiftId : null,
                saturdayShiftId: weeklySchedule.saturday.enabled ? weeklySchedule.saturday.shiftId : null,
                sundayShiftId: weeklySchedule.sunday.enabled ? weeklySchedule.sunday.shiftId : null,
            };

            if (groupId) {
                await updateGroup(groupId, request);
            } else {
                await createGroup(request);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save group:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { id: 'basic-info', label: 'Basic info' },
        { id: 'shift', label: 'Shift' },
        { id: 'attendance-method', label: 'Attendance Method' },
        { id: 'attendance-settings', label: 'Attendance Settings' },
    ];

    const timezones = [
        'GMT+07:00 Western Indonesia Time',
        'GMT+08:00 Central Indonesia Time',
        'GMT+09:00 Eastern Indonesia Time',
        'GMT+00:00 Greenwich Mean Time',
    ];


    return (
        <FormPageLayout
            title={groupId ? 'Edit Attendance Group' : 'Add Attendance Group'}
            sections={sections}
            onBack={onBack}
            onConfirm={handleSubmit}
            isLoading={isLoading && !!groupId}
            isSaving={isSaving}
            isDisabled={!formData.name}
        >
            {/* Basic Info Section */}
            <section id="basic-info" className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
                    Basic info
                </h2>

                <div className="space-y-6">
                    {/* Group Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attendance group name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            maxLength={64}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter group name"
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">
                            {formData.name?.length || 0}/64
                        </div>
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Group time zone
                        </label>
                        <select
                            value={formData.timezone}
                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {timezones.map((tz) => (
                                <option key={tz} value={tz.split(' ')[0]}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Relocation Sync */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relocation synchronization
                        </label>
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={formData.relocationSync}
                                onChange={(e) => setFormData({ ...formData, relocationSync: e.target.checked })}
                                className="mt-1 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">
                                When new employees join the organization or when employees relocate, new members who meet the conditions will be added to this attendance group automatically.
                            </span>
                        </label>
                    </div>

                    {/* Members Tracking Required */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Members (time tracking required)
                        </label>
                        <div className="flex gap-6">
                            {(['ALL', 'CUSTOM', 'NONE'] as const).map((mode) => (
                                <label key={mode} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="memberTrackingRequired"
                                        value={mode}
                                        checked={formData.memberTrackingRequired === mode}
                                        onChange={(e) => setFormData({ ...formData, memberTrackingRequired: e.target.value as MemberTrackingMode })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600 capitalize">{mode.toLowerCase()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Members Tracking Optional */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Members (time tracking optional)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            These members will be recorded as Attended by default. They can request leaves and overtime based on work start and end times.
                        </p>
                        <div className="flex gap-6">
                            {(['ALL', 'CUSTOM', 'NONE'] as const).map((mode) => (
                                <label key={mode} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="memberTrackingOptional"
                                        value={mode}
                                        checked={formData.memberTrackingOptional === mode}
                                        onChange={(e) => setFormData({ ...formData, memberTrackingOptional: e.target.value as MemberTrackingMode })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600 capitalize">{mode.toLowerCase()}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Shift Section */}
            <section id="shift" className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
                    Shift
                </h2>

                <div className="space-y-6">
                    {/* Shift Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Shift type
                        </label>
                        <div className="space-y-3">
                            {[
                                { value: 'FIXED', label: 'Fixed Shift', description: 'Members in the same attendance group clock in/out at the same time' },
                                { value: 'SCHEDULED', label: 'Scheduled Shift', description: 'Customize individual shifts. Please start scheduling after you have saved the settings for your Attendance Group' },
                                { value: 'FREE', label: 'Free Shift', description: 'Clock in/out any time with no shifts scheduled' },
                            ].map((type) => (
                                <label key={type.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="shiftType"
                                        value={type.value}
                                        checked={formData.shiftType === type.value}
                                        onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as GroupShiftType })}
                                        className="mt-1 text-blue-600"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{type.label}</div>
                                        <div className="text-sm text-gray-500">{type.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Default Shift */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Shift
                        </label>
                        <select
                            value={formData.defaultShiftId || ''}
                            onChange={(e) => setFormData({ ...formData, defaultShiftId: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a shift</option>
                            {shifts.map((shift) => (
                                <option key={shift.id} value={shift.id}>
                                    {shift.name} ({shift.startTime} ~ {shift.endTime})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Weekly Schedule */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Shift Settings
                        </label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-10 px-4 py-2">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Workday</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Shift</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {Object.entries(weeklySchedule).map(([day, config]) => (
                                        <tr key={day}>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={config.enabled}
                                                    onChange={(e) => setWeeklySchedule({
                                                        ...weeklySchedule,
                                                        [day]: { ...config, enabled: e.target.checked }
                                                    })}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900 capitalize">{day}</td>
                                            <td className="px-4 py-2">
                                                {config.enabled ? (
                                                    <select
                                                        value={config.shiftId || formData.defaultShiftId || ''}
                                                        onChange={(e) => setWeeklySchedule({
                                                            ...weeklySchedule,
                                                            [day]: { ...config, shiftId: e.target.value ? parseInt(e.target.value) : null }
                                                        })}
                                                        className="text-sm text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer"
                                                    >
                                                        <option value="">Default shift</option>
                                                        {shifts.map((shift) => (
                                                            <option key={shift.id} value={shift.id}>
                                                                {shift.name}: {shift.startTime} ~ {shift.endTime}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="text-sm text-gray-500">Day off</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button className="text-sm text-blue-600 hover:text-blue-700">
                                                    Change
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Schedule Settings */}
                    <div>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.usePublicHolidays}
                                onChange={(e) => setFormData({ ...formData, usePublicHolidays: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">
                                Set up holidays automatically based on public holiday calendar
                            </span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Attendance Method Section - Simplified since GPS/WiFi is out of scope */}
            <section id="attendance-method" className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
                    Attendance Method
                </h2>

                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
                    GPS and Wi-Fi attendance methods will be available in a future update.
                </div>
            </section>

            {/* Attendance Settings Section */}
            <section id="attendance-settings" className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
                    Attendance Settings
                </h2>

                <div className="space-y-6">
                    {/* Photo Requirement */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Take photo to record attendance
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.requirePhoto}
                                onChange={(e) => setFormData({ ...formData, requirePhoto: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">
                                Require employees to submit a photo each time they clock in or out
                            </span>
                        </label>
                    </div>

                    {/* Out-of-office Policy */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Out-of-office attendance
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'NO_CLOCK', label: 'No clock in/out required for out-of-office' },
                                { value: 'SHIFT_TIMES', label: 'Record attendance at start and end times of each shift' },
                                { value: 'BEFORE_AFTER', label: 'Record attendance before leaving and upon returning from an out-of-office period' },
                            ].map((policy) => (
                                <label key={policy.value} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="outOfOfficePolicy"
                                        value={policy.value}
                                        checked={formData.outOfOfficePolicy === policy.value}
                                        onChange={(e) => setFormData({ ...formData, outOfOfficePolicy: e.target.value as AttendancePolicy })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">{policy.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Business Trip Policy */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Business trip attendance
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'NO_CLOCK', label: 'No clock in/out required for business trip' },
                                { value: 'SHIFT_TIMES', label: 'Record attendance at start and end times of each shift' },
                                { value: 'BEFORE_AFTER', label: 'Record attendance before leaving and upon returning from a business trip' },
                            ].map((policy) => (
                                <label key={policy.value} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="businessTripPolicy"
                                        value={policy.value}
                                        checked={formData.businessTripPolicy === policy.value}
                                        onChange={(e) => setFormData({ ...formData, businessTripPolicy: e.target.value as AttendancePolicy })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">{policy.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Partial Leave Policy */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Partial day leave attendance
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'NO_CLOCK', label: 'No clock in/out required for leave' },
                                { value: 'ON_LEAVE_RETURN', label: 'Clock in/out required upon leaving or returning for leave' },
                            ].map((policy) => (
                                <label key={policy.value} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="partialLeavePolicy"
                                        value={policy.value}
                                        checked={formData.partialLeavePolicy === policy.value}
                                        onChange={(e) => setFormData({ ...formData, partialLeavePolicy: e.target.value as LeaveAttendancePolicy })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">{policy.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Record Overtime */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overtime records
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.recordOvertime}
                                onChange={(e) => setFormData({ ...formData, recordOvertime: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">
                                Record attendance at the start and end of overtime
                            </span>
                        </label>
                    </div>

                    {/* Allow Corrections */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Corrections
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.allowCorrections}
                                onChange={(e) => setFormData({ ...formData, allowCorrections: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">Allow to request corrections</span>
                        </label>
                    </div>
                </div>
            </section>
        </FormPageLayout>
    );
}
