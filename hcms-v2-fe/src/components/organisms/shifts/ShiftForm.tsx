/**
 * Shift form component - Refactored with atomic design
 */

import type { CreateShiftRequest, Shift, UpdateShiftRequest, DateType, ShiftType } from '@/types';
import { useMemo, useState } from 'react';
import { TimePicker } from '@/components/ui/time-picker';
import { Info } from 'lucide-react';

// Atomic design components
import { Button, Input, Select, Checkbox } from '@/components/atoms';
import { FormField, RadioGroup } from '@/components/molecules';
import { FormSection, ErrorAlert } from '../common';

interface ShiftFormProps {
  shift?: Shift;
  onSubmit: (request: CreateShiftRequest | UpdateShiftRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ShiftForm({ shift, onSubmit, isLoading }: ShiftFormProps) {
  const [formData, setFormData] = useState<CreateShiftRequest>(() => {
    if (shift) {
      return {
        name: shift.name,
        description: shift.description || '',
        shiftType: shift.shiftType,
        dateType: shift.dateType,
        startTime: shift.startTime,
        endTime: shift.endTime,
        isNextDayEnd: shift.isNextDayEnd,
        requireClockIn: shift.requireClockIn,
        requireClockOut: shift.requireClockOut,
        clockInEarlyMinutes: shift.clockInEarlyMinutes,
        lateThresholdMinutes: shift.lateThresholdMinutes,
        halfDayLateThresholdMinutes: shift.halfDayLateThresholdMinutes,
        clockOutLateMinutes: shift.clockOutLateMinutes,
        earlyOutThresholdMinutes: shift.earlyOutThresholdMinutes,
        halfDayEarlyThresholdMinutes: shift.halfDayEarlyThresholdMinutes,
        flexLateHours: shift.flexLateHours,
        flexLateMinutes: shift.flexLateMinutes,
        flexEarlyHours: shift.flexEarlyHours,
        flexEarlyMinutes: shift.flexEarlyMinutes,
        hasBreaks: shift.hasBreaks,
        breakDurationMinutes: shift.breakDurationMinutes,
      };
    }
    return {
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
    };
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string>('');

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Shift name is required';
    } else if (formData.name.length > 64) {
      newErrors.name = 'Name must be at most 64 characters';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      let errorMessage = 'An error occurred while saving the shift';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSubmitError(errorMessage);
    }
  };

  // Small inline input for time rules (preserved for specialized layout)
  const smallInputClasses =
    'w-16 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center';

  const isFlextime = formData.shiftType === 'FLEXTIME';
  const isOffDays = formData.dateType === 'OFF_DAYS';

  const shiftTypeOptions = [
    { value: 'FIXED_TIME', label: 'Fixed-time' },
    { value: 'FLEXTIME', label: 'Flextime' },
  ];

  const dateTypeOptions = [
    { value: 'WORK_DAYS', label: 'Work days' },
    { value: 'OFF_DAYS', label: 'Off days' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Shift Name & Date Type */}
      <div className="grid grid-cols-2 gap-6">
        <FormField label="Shift Name" required error={errors.name}>
          <div className="relative">
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Please enter a name. Maximum character limit: 64"
              maxLength={64}
              disabled={isLoading}
              error={!!errors.name}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {formData.name.length}/64
            </span>
          </div>
        </FormField>

        <FormField label="Date type of the shift">
          <Select
            value={formData.dateType}
            onChange={(e) => setFormData({ ...formData, dateType: e.target.value as DateType })}
            disabled={isLoading}
            options={dateTypeOptions}
          />
        </FormField>
      </div>

      {/* Shift Type Radio */}
      <FormField label="Shift type">
        <RadioGroup
          name="shiftType"
          options={shiftTypeOptions}
          value={formData.shiftType}
          onChange={(value) => setFormData({ ...formData, shiftType: value as ShiftType })}
          disabled={isLoading || isOffDays}
          className={isOffDays ? 'opacity-50' : ''}
        />
      </FormField>

      {/* Time Parameters Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          Time parameters <span className="text-red-500">*</span>
        </label>

        <div className="border border-gray-200 rounded-lg p-4 mt-2 bg-gray-50/50">
          {/* Headers */}
          <div className="grid grid-cols-4 gap-4 mb-4 text-sm font-medium text-gray-600">
            <div>Work starts</div>
            <div>Work ends</div>
            <div>Clock-In rules</div>
            <div>Clock-Out rules</div>
          </div>

          {/* Time Parameters Row */}
          <div className="grid grid-cols-4 gap-4 items-start">
            {/* Work Starts */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <select
                  className="px-2 py-1.5 border border-gray-200 rounded text-xs bg-gray-50 text-gray-400 cursor-not-allowed"
                  value="same"
                  disabled
                >
                  <option value="same">Sa...</option>
                </select>
                <TimePicker
                  value={formData.startTime}
                  onChange={(time) => setFormData({ ...formData, startTime: time })}
                  disabled={isLoading}
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-3.5 h-3.5 text-gray-300 bg-gray-100 border-gray-300 cursor-not-allowed"
                />
                Clock In
              </label>
            </div>

            {/* Work Ends */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <select
                  className="px-2 py-1.5 border border-gray-300 rounded text-xs"
                  value={formData.isNextDayEnd ? 'next' : 'same'}
                  onChange={(e) => setFormData({ ...formData, isNextDayEnd: e.target.value === 'next' })}
                  disabled={isLoading}
                >
                  <option value="same">Same day</option>
                  <option value="next">Next day</option>
                </select>
                <TimePicker
                  value={formData.endTime}
                  onChange={(time) => setFormData({ ...formData, endTime: time })}
                  disabled={isLoading}
                />
              </div>
              <Checkbox
                label="Clock Out"
                checked={formData.requireClockOut}
                onChange={(e) => setFormData({ ...formData, requireClockOut: e.target.checked })}
                disabled={isLoading}
                className="text-xs"
              />
            </div>

            {/* Clock-In Rules */}
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-center flex-wrap gap-1">
                <span>Clock in up to</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.clockInEarlyMinutes}
                  onChange={(e) => setFormData({ ...formData, clockInEarlyMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={480}
                />
                <span>min earlier</span>
              </div>
              <div className="flex items-center flex-wrap gap-1">
                <span>Over</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.lateThresholdMinutes}
                  onChange={(e) => setFormData({ ...formData, lateThresholdMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={480}
                />
                <span>min late for clocking in will be marked as Late in.</span>
              </div>
              <div className="flex items-center flex-wrap gap-1">
                <span>Over</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.halfDayLateThresholdMinutes}
                  onChange={(e) => setFormData({ ...formData, halfDayLateThresholdMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={480}
                />
                <span>min late for clocking in will be marked as Half-day no record.</span>
              </div>
            </div>

            {/* Clock-Out Rules */}
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-center flex-wrap gap-1">
                <span>Clock out up to</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.clockOutLateMinutes}
                  onChange={(e) => setFormData({ ...formData, clockOutLateMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={960}
                />
                <span>min later</span>
              </div>
              <div className="flex items-center flex-wrap gap-1">
                <span>Over</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.earlyOutThresholdMinutes}
                  onChange={(e) => setFormData({ ...formData, earlyOutThresholdMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={480}
                />
                <span>min early will be marked as "Early out".</span>
              </div>
              <div className="flex items-center flex-wrap gap-1">
                <span>Over</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.halfDayEarlyThresholdMinutes}
                  onChange={(e) => setFormData({ ...formData, halfDayEarlyThresholdMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={480}
                />
                <span>min will be marked as Half-day no record.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Breaks */}
      <div>
        <div className="flex items-center gap-2">
          <Checkbox
            label="Set breaks within working hours"
            checked={formData.hasBreaks}
            onChange={(e) => setFormData({ ...formData, hasBreaks: e.target.checked })}
            disabled={isLoading}
          />
          <Info className="w-4 h-4 text-gray-400" />
        </div>

        {formData.hasBreaks && (
          <div className="mt-3 ml-6 flex items-center gap-2">
            <span className="text-sm text-gray-600">Break duration:</span>
            <Input
              type="number"
              value={formData.breakDurationMinutes}
              onChange={(e) => setFormData({ ...formData, breakDurationMinutes: parseInt(e.target.value) || 0 })}
              disabled={isLoading}
              min={0}
              max={240}
              className="w-16 text-center"
              inputSize="sm"
            />
            <span className="text-sm text-gray-600">minutes</span>
          </div>
        )}
      </div>

      {/* Flextime Section */}
      {isFlextime && !isOffDays && (
        <FormSection title="Flextime">

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Can come late at most</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.flexLateHours}
                  onChange={(e) => setFormData({ ...formData, flexLateHours: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={12}
                />
                <span className="text-sm text-gray-600">Hours</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.flexLateMinutes}
                  onChange={(e) => setFormData({ ...formData, flexLateMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={59}
                />
                <span className="text-sm text-gray-600">Minutes</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-0">
                How many minutes come late, how many minutes the member needs to stay late
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Can leave early at most</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.flexEarlyHours}
                  onChange={(e) => setFormData({ ...formData, flexEarlyHours: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={12}
                />
                <span className="text-sm text-gray-600">Hours</span>
                <input
                  type="number"
                  className={smallInputClasses}
                  value={formData.flexEarlyMinutes}
                  onChange={(e) => setFormData({ ...formData, flexEarlyMinutes: parseInt(e.target.value) || 0 })}
                  disabled={isLoading}
                  min={0}
                  max={59}
                />
                <span className="text-sm text-gray-600">Minutes</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-0">
                How many minutes come early, how many minutes the member can leave early
              </p>
            </div>
          </div>
        </FormSection>
      )}

      {/* Total Working Hours */}
      <div className="text-sm text-gray-700">
        Total working hours: <span className="font-medium">{totalWorkingHours.hours} Hours {totalWorkingHours.minutes} Minutes</span>
      </div>

      {/* Error Message */}
      {submitError && (
        <ErrorAlert message={submitError} />
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : shift ? 'Update Shift' : 'Create Shift'}
      </Button>
    </form>
  );
}
