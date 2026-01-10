/**
 * Shifts API client
 */

import type {
  CreateShiftRequest,
  PageResponse,
  Shift,
  UpdateShiftRequest,
} from '@/types';

/**
 * Get all shifts with optional filtering
 */
export async function getShifts(
  page: number = 0,
  size: number = 20,
  search?: string,
  status?: string,
  sort?: string
): Promise<PageResponse<Shift>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (sort) params.append('sort', sort);

  const response = await fetch(
    `${import.meta.env.VITE_API_TARGET}/api/v1/shifts?${params.toString()}`
  );
  
  // If not OK, return empty page instead of throwing
  if (!response.ok) {
    console.warn(`Failed to fetch shifts: ${response.status} ${response.statusText}`);
    // Return empty page response to prevent crashes
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
 * Get a shift by ID
 */
export async function getShiftById(id: number): Promise<Shift> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/shifts/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch shift: ${response.statusText}`);
  return response.json();
}

/**
 * Create a new shift
 */
export async function createShift(request: CreateShiftRequest): Promise<Shift> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/shifts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Failed to create shift: ${response.statusText}`);
  return response.json();
}

/**
 * Update an existing shift
 */
export async function updateShift(
  id: number,
  request: UpdateShiftRequest
): Promise<Shift> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/shifts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Failed to update shift: ${response.statusText}`);
  return response.json();
}

/**
 * Delete a shift
 */
export async function deleteShift(id: number): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/shifts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete shift: ${response.statusText}`);
}
