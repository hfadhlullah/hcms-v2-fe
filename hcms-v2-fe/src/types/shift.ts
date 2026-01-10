/**
 * Shift domain types - Lark-style
 */

export type ShiftStatus = 'ACTIVE' | 'INACTIVE';
export type ShiftType = 'FIXED_TIME' | 'FLEXTIME';
export type DateType = 'WORK_DAYS' | 'OFF_DAYS';

export interface Shift {
  id: number;
  code?: string;
  name: string;
  description?: string;
  shiftType: ShiftType;
  dateType: DateType;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isNextDayEnd: boolean;
  requireClockIn: boolean;
  requireClockOut: boolean;
  
  // Clock-In Rules
  clockInEarlyMinutes: number;
  lateThresholdMinutes: number;
  halfDayLateThresholdMinutes: number;
  
  // Clock-Out Rules
  clockOutLateMinutes: number;
  earlyOutThresholdMinutes: number;
  halfDayEarlyThresholdMinutes: number;
  
  // Flextime
  flexLateHours: number;
  flexLateMinutes: number;
  flexEarlyHours: number;
  flexEarlyMinutes: number;
  
  // Breaks
  hasBreaks: boolean;
  breakDurationMinutes: number;
  
  workingHoursMinutes: number;
  status: ShiftStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateShiftRequest {
  name: string;
  description?: string;
  shiftType: ShiftType;
  dateType: DateType;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isNextDayEnd?: boolean;
  requireClockIn?: boolean;
  requireClockOut?: boolean;
  
  // Clock-In Rules
  clockInEarlyMinutes?: number;
  lateThresholdMinutes?: number;
  halfDayLateThresholdMinutes?: number;
  
  // Clock-Out Rules
  clockOutLateMinutes?: number;
  earlyOutThresholdMinutes?: number;
  halfDayEarlyThresholdMinutes?: number;
  
  // Flextime
  flexLateHours?: number;
  flexLateMinutes?: number;
  flexEarlyHours?: number;
  flexEarlyMinutes?: number;
  
  // Breaks
  hasBreaks?: boolean;
  breakDurationMinutes?: number;
}

export type UpdateShiftRequest = Partial<CreateShiftRequest>;

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
