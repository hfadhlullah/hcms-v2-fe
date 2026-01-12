/**
 * Attendance Groups API client
 */

import type {
  AttendanceGroup,
  AttendanceGroupPageResponse,
  CreateAttendanceGroupRequest,
  UpdateAttendanceGroupRequest,
} from '@/types';

/**
 * Get all attendance groups with optional filtering
 */
export async function getAttendanceGroups(
  page: number = 0,
  size: number = 20,
  search?: string,
  status?: string,
  sort?: string
): Promise<AttendanceGroupPageResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (sort) params.append('sort', sort);

  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/attendance-groups?${params.toString()}`);
  
  if (!response.ok) {
    console.warn(`Failed to fetch attendance groups: ${response.status} ${response.statusText}`);
    return {
      content: [],
      pageable: { pageNumber: 0, pageSize: 20, sort: { empty: true, sorted: false, unsorted: true }, offset: 0, paged: true, unpaged: false },
      totalPages: 0,
      totalElements: 0,
      last: true,
      size: 20,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: true,
      numberOfElements: 0,
      empty: true,
    };
  }
  return response.json();
}

/**
 * Get a single attendance group by ID
 */
export async function getAttendanceGroupById(id: number): Promise<AttendanceGroup> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/attendance-groups/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch attendance group: ${response.statusText}`);
  return response.json();
}

/**
 * Create a new attendance group
 */
export async function createAttendanceGroup(request: CreateAttendanceGroupRequest): Promise<AttendanceGroup> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/attendance-groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Failed to create attendance group: ${response.statusText}`);
  return response.json();
}

/**
 * Update an existing attendance group
 */
export async function updateAttendanceGroup(
  id: number,
  request: UpdateAttendanceGroupRequest
): Promise<AttendanceGroup> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/attendance-groups/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Failed to update attendance group: ${response.statusText}`);
  return response.json();
}

/**
 * Delete an attendance group
 */
export async function deleteAttendanceGroup(id: number): Promise<{ message: string }> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/attendance-groups/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete attendance group: ${response.statusText}`);
  return response.json();
}
