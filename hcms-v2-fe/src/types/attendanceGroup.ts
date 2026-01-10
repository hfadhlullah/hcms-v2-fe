/**
 * Types for Attendance Group module
 */

// Enums matching backend
export type MemberTrackingMode = 'ALL' | 'CUSTOM' | 'NONE';
export type GroupShiftType = 'FIXED' | 'SCHEDULED' | 'FREE';
export type AttendancePolicy = 'NO_CLOCK' | 'SHIFT_TIMES' | 'BEFORE_AFTER';
export type LeaveAttendancePolicy = 'NO_CLOCK' | 'ON_LEAVE_RETURN';
export type AttendanceGroupStatus = 'ACTIVE' | 'INACTIVE';

/**
 * Weekly schedule with shift IDs for each day
 */
export interface WeeklySchedule {
  mondayShiftId: number | null;
  tuesdayShiftId: number | null;
  wednesdayShiftId: number | null;
  thursdayShiftId: number | null;
  fridayShiftId: number | null;
  saturdayShiftId: number | null;
  sundayShiftId: number | null;
}

/**
 * AttendanceGroup entity
 */
export interface AttendanceGroup {
  id: number;
  name: string;
  ownerId: number | null;
  subOwnerIds: number[];
  timezone: string;
  relocationSync: boolean;

  // Member tracking
  memberTrackingRequired: MemberTrackingMode;
  memberTrackingRequiredConditions: string | null;
  memberTrackingOptional: MemberTrackingMode;
  memberTrackingOptionalConditions: string | null;

  // Shift settings
  shiftType: GroupShiftType;
  defaultShiftId: number | null;
  defaultShiftName: string | null;
  defaultShiftTime: string | null;

  // Weekly schedule
  mondayShiftId: number | null;
  tuesdayShiftId: number | null;
  wednesdayShiftId: number | null;
  thursdayShiftId: number | null;
  fridayShiftId: number | null;
  saturdayShiftId: number | null;
  sundayShiftId: number | null;

  // Schedule settings
  usePublicHolidays: boolean;
  specialDays: string[];

  // Attendance settings
  requirePhoto: boolean;
  allowOffsite: boolean;
  outOfOfficePolicy: AttendancePolicy;
  businessTripPolicy: AttendancePolicy;
  partialLeavePolicy: LeaveAttendancePolicy;
  recordOvertime: boolean;
  nonWorkingDayApproval: boolean;
  nonWorkingDayResetTime: string;
  allowCorrections: boolean;
  correctionTypes: string[];

  // Metadata
  status: AttendanceGroupStatus;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

/**
 * Request to create a new AttendanceGroup
 */
export interface CreateAttendanceGroupRequest {
  name: string;
  ownerId?: number;
  subOwnerIds?: number[];
  timezone?: string;
  relocationSync?: boolean;

  // Member tracking
  memberTrackingRequired?: MemberTrackingMode;
  memberTrackingRequiredConditions?: string;
  memberTrackingOptional?: MemberTrackingMode;
  memberTrackingOptionalConditions?: string;

  // Shift settings
  shiftType?: GroupShiftType;
  defaultShiftId?: number;

  // Weekly schedule
  mondayShiftId?: number | null;
  tuesdayShiftId?: number | null;
  wednesdayShiftId?: number | null;
  thursdayShiftId?: number | null;
  fridayShiftId?: number | null;
  saturdayShiftId?: number | null;
  sundayShiftId?: number | null;

  // Schedule settings
  usePublicHolidays?: boolean;
  specialDays?: string[];

  // Attendance settings
  requirePhoto?: boolean;
  allowOffsite?: boolean;
  outOfOfficePolicy?: AttendancePolicy;
  businessTripPolicy?: AttendancePolicy;
  partialLeavePolicy?: LeaveAttendancePolicy;
  recordOvertime?: boolean;
  nonWorkingDayApproval?: boolean;
  nonWorkingDayResetTime?: string;
  allowCorrections?: boolean;
  correctionTypes?: string[];
}

/**
 * Request to update an AttendanceGroup
 */
export type UpdateAttendanceGroupRequest = CreateAttendanceGroupRequest;

/**
 * Page response for AttendanceGroups
 */
export interface AttendanceGroupPageResponse {
  content: AttendanceGroup[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
