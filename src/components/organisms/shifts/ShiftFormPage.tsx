/**
 * Shift Form Page - Full page form for creating/editing shifts
 * Uses shared FormPageLayout for UI consistency
 */

import { useState, useEffect, useMemo } from 'react';
import { Info } from 'lucide-react';
import { useShiftStore } from '@/store';
import { TimePicker } from '@/components/ui/time-picker';
import { FormPageLayout } from '@/components/molecules/forms';
import type { CreateShiftRequest, DateType } from '@/types';

interface ShiftFormPageProps {
    shiftId?: number;
    onBack: () => void;
    onSave: () => void;
}

export function ShiftFormPage({ shiftId, onBack, onSave }: ShiftFormPageProps) {
    const { shifts, loading, createShift, updateShift, loadShifts } = useShiftStore();
    const [isSaving, setIsSaving] = useState(false);

    // Find the shift being edited
    const editingShift = shiftId ? shifts.find((s) => s.id === shiftId) : undefined;

    // Form state
    const [formData, setFormData] = useState<CreateShiftRequest>({
        name: '',
        description: '',
        shiftType: 'FIXED_TIME',
        dateType: 'WORK_DAYS',
        startTime: '09:00',
        endTime: '18:00',
        isNextDayEnd: false,
        requireClockIn: true,
        requireClockOut: true,
        clockInEarlyMinutes: 60,
        lateThresholdMinutes: 0,
        halfDayLateThresholdMinutes: 30,
        clockOutLateMinutes: 480,
        earlyOutThresholdMinutes: 0,
        halfDayEarlyThresholdMinutes: 30,
        flexLateHours: 1,
        flexLateMinutes: 0,
        flexEarlyHours: 1,
        flexEarlyMinutes: 0,
        hasBreaks: false,
        breakDurationMinutes: 0,
    });

    useEffect(() => {
        loadShifts();
    }, [loadShifts]);

    useEffect(() => {
        if (editingShift) {
            setFormData({
                name: editingShift.name,
                description: editingShift.description || '',
                shiftType: editingShift.shiftType,
                dateType: editingShift.dateType,
                startTime: editingShift.startTime,
                endTime: editingShift.endTime,
                isNextDayEnd: editingShift.isNextDayEnd,
                requireClockIn: editingShift.requireClockIn,
                requireClockOut: editingShift.requireClockOut,
                clockInEarlyMinutes: editingShift.clockInEarlyMinutes,
                lateThresholdMinutes: editingShift.lateThresholdMinutes,
                halfDayLateThresholdMinutes: editingShift.halfDayLateThresholdMinutes,
                clockOutLateMinutes: editingShift.clockOutLateMinutes,
                earlyOutThresholdMinutes: editingShift.earlyOutThresholdMinutes,
                halfDayEarlyThresholdMinutes: editingShift.halfDayEarlyThresholdMinutes,
                flexLateHours: editingShift.flexLateHours,
                flexLateMinutes: editingShift.flexLateMinutes,
                flexEarlyHours: editingShift.flexEarlyHours,
                flexEarlyMinutes: editingShift.flexEarlyMinutes,
                hasBreaks: editingShift.hasBreaks,
                breakDurationMinutes: editingShift.breakDurationMinutes,
            });
        }
    }, [editingShift]);

    // Calculate total working hours
    const totalWorkingHours = useMemo(() => {
        if (!formData.startTime || !formData.endTime) return { hours: 0, minutes: 0 };

        const [startH, startM] = formData.startTime.split(':').map(Number);
        const [endH, endM] = formData.endTime.split(':').map(Number);

        let totalMinutes: number;
        if (formData.isNextDayEnd) {
            totalMinutes = (24 * 60 - startH * 60 - startM) + (endH * 60 + endM);
        } else {
            totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        }

        if (formData.hasBreaks && formData.breakDurationMinutes) {
            totalMinutes -= formData.breakDurationMinutes;
        }

        totalMinutes = Math.max(0, totalMinutes);
        return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
    }, [formData.startTime, formData.endTime, formData.isNextDayEnd, formData.hasBreaks, formData.breakDurationMinutes]);

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            return;
        }

        setIsSaving(true);
        try {
            if (shiftId) {
                await updateShift(shiftId, formData);
            } else {
                await createShift(formData);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save shift:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { id: 'basic-info', label: 'Basic info' },
        { id: 'time-parameters', label: 'Time Parameters' },
        { id: 'flextime-settings', label: 'Flextime Settings' },
    ];

    const isFlextime = formData.shiftType === 'FLEXTIME';
    const isOffDays = formData.dateType === 'OFF_DAYS';

    const smallInputClasses =
        'w-16 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center';

    return (
        <FormPageLayout
            title={shiftId ? 'Edit Shift' : 'Add Shift'}
            sections={sections}
            onBack={onBack}
            onConfirm={handleSubmit}
            isLoading={loading && !!shiftId}
            isSaving={isSaving}
            isDisabled={!formData.name}
        >
            {/* Basic Info Section */}
            <section id="basic-info" className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
                    Basic info
                </h2>

                <div className="space-y-6">
                    {/* Shift Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shift name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            maxLength={64}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter shift name"
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">
                            {formData.name?.length || 0}/64
                        </div>
                    </div>

                    {/* Date Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date type of the shift
                        </label>
                        <select
                            value={formData.dateType}
                            onChange={(e) => setFormData({ ...formData, dateType: e.target.value as DateType })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="WORK_DAYS">Work days</option>
                            <option value="OFF_DAYS">Off days</option>
                        </select>
                    </div>

                    {/* Shift Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Shift type
                        </label>
                        <div className="space-y-3">
                            {[
                                { value: 'FIXED_TIME', label: 'Fixed-time', description: 'Members clock in/out at fixed times' },
                                { value: 'FLEXTIME', label: 'Flextime', description: 'Members have flexible clock in/out times within allowed range' },
                            ].map((type) => (
                                <label
                                    key={type.value}
                                    className={`flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${isOffDays ? 'opacity-50' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="shiftType"
                                        value={type.value}
                                        checked={formData.shiftType === type.value}
                                        onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as 'FIXED_TIME' | 'FLEXTIME' })}
                                        disabled={isOffDays}
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

                    {/* Total Working Hours */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm text-gray-700">
                            Total working hours: <span className="font-medium">{totalWorkingHours.hours} Hours {totalWorkingHours.minutes} Minutes</span>
                        </span>
                    </div>
                </div>
            </section>

            {/* Time Parameters Section */}
            <section id="time-parameters" className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
                    Time Parameters
                </h2>

                <div className="space-y-6">
                    {/* Work Start/End Times */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Work starts <span className="text-red-500">*</span>
                            </label>
                            <TimePicker
                                value={formData.startTime}
                                onChange={(time) => setFormData({ ...formData, startTime: time })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Work ends <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <select
                                    className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
                                    value={formData.isNextDayEnd ? 'next' : 'same'}
                                    onChange={(e) => setFormData({ ...formData, isNextDayEnd: e.target.value === 'next' })}
                                >
                                    <option value="same">Same day</option>
                                    <option value="next">Next day</option>
                                </select>
                                <TimePicker
                                    value={formData.endTime}
                                    onChange={(time) => setFormData({ ...formData, endTime: time })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clock In/Out Requirements */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.requireClockIn}
                                onChange={(e) => setFormData({ ...formData, requireClockIn: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">Require Clock In</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.requireClockOut}
                                onChange={(e) => setFormData({ ...formData, requireClockOut: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">Require Clock Out</span>
                        </label>
                    </div>

                    {/* Clock-In Rules */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Clock-In Rules
                        </label>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center flex-wrap gap-2">
                                <span>Clock in up to</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.clockInEarlyMinutes}
                                    onChange={(e) => setFormData({ ...formData, clockInEarlyMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={480}
                                />
                                <span>minutes earlier</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                                <span>Over</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.lateThresholdMinutes}
                                    onChange={(e) => setFormData({ ...formData, lateThresholdMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={480}
                                />
                                <span>minutes late will be marked as "Late in"</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                                <span>Over</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.halfDayLateThresholdMinutes}
                                    onChange={(e) => setFormData({ ...formData, halfDayLateThresholdMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={480}
                                />
                                <span>minutes late will be marked as "Half-day no record"</span>
                            </div>
                        </div>
                    </div>

                    {/* Clock-Out Rules */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Clock-Out Rules
                        </label>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center flex-wrap gap-2">
                                <span>Clock out up to</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.clockOutLateMinutes}
                                    onChange={(e) => setFormData({ ...formData, clockOutLateMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={960}
                                />
                                <span>minutes later</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                                <span>Over</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.earlyOutThresholdMinutes}
                                    onChange={(e) => setFormData({ ...formData, earlyOutThresholdMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={480}
                                />
                                <span>minutes early will be marked as "Early out"</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                                <span>Over</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.halfDayEarlyThresholdMinutes}
                                    onChange={(e) => setFormData({ ...formData, halfDayEarlyThresholdMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={480}
                                />
                                <span>minutes early will be marked as "Half-day no record"</span>
                            </div>
                        </div>
                    </div>

                    {/* Set Breaks */}
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.hasBreaks}
                                onChange={(e) => setFormData({ ...formData, hasBreaks: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">Set breaks within working hours</span>
                            <Info className="w-4 h-4 text-gray-400" />
                        </label>

                        {formData.hasBreaks && (
                            <div className="mt-3 ml-6 flex items-center gap-2">
                                <span className="text-sm text-gray-600">Break duration:</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.breakDurationMinutes}
                                    onChange={(e) => setFormData({ ...formData, breakDurationMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={240}
                                />
                                <span className="text-sm text-gray-600">minutes</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Flextime Settings Section */}
            <section id="flextime-settings" className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
                    Flextime Settings
                </h2>

                {!isFlextime || isOffDays ? (
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
                        Flextime settings are only available when shift type is "Flextime" and date type is "Work days".
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Flexible late arrival
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-600">Can come late at most</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.flexLateHours}
                                    onChange={(e) => setFormData({ ...formData, flexLateHours: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={12}
                                />
                                <span className="text-sm text-gray-600">Hours</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.flexLateMinutes}
                                    onChange={(e) => setFormData({ ...formData, flexLateMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={59}
                                />
                                <span className="text-sm text-gray-600">Minutes</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                How many minutes come late, how many minutes the member needs to stay late
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Flexible early departure
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-600">Can leave early at most</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.flexEarlyHours}
                                    onChange={(e) => setFormData({ ...formData, flexEarlyHours: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={12}
                                />
                                <span className="text-sm text-gray-600">Hours</span>
                                <input
                                    type="number"
                                    className={smallInputClasses}
                                    value={formData.flexEarlyMinutes}
                                    onChange={(e) => setFormData({ ...formData, flexEarlyMinutes: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={59}
                                />
                                <span className="text-sm text-gray-600">Minutes</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                How many minutes come early, how many minutes the member can leave early
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </FormPageLayout>
    );
}
