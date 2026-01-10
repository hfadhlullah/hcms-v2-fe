/**
 * Users API client - handles user management requests
 */

import type { CreateMemberRequest, UpdateMemberRequest, Member } from '@/types/member';

export interface ApiMember {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

/**
 * Create a new user/member
 */
export async function createUser(request: CreateMemberRequest): Promise<ApiMember> {
    const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: request.name,
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
            phoneNumber: request.phoneNumber,
            departmentId: request.departmentId,
            alias: request.alias,
            deskId: request.deskId,
            phoneExtension: request.phoneExtension,
            employeeNumber: request.employeeNumber,
            userId: request.userId,
            gender: request.gender,
            workforceType: request.workforceType,
            dateOfEmployment: request.dateOfEmployment,
            country: request.country,
            city: request.city,
            directManager: request.directManager,
            dottedLineManager: request.dottedLineManager,
            jobTitle: request.jobTitle,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to create user: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get all users with pagination
 */
export async function getUsers(
    page: number = 0,
    size: number = 20
): Promise<PageResponse<ApiMember>> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    const response = await fetch(
        `${import.meta.env.VITE_API_TARGET}/api/v1/users?${params.toString()}`
    );

    if (!response.ok) {
        console.warn(`Failed to fetch users: ${response.status} ${response.statusText}`);
        return {
            content: [],
            totalPages: 0,
            totalElements: 0,
            size: 20,
            number: 0,
        };
    }

    return response.json();
}

/**
 * Convert API member to frontend Member type
 */
export function apiMemberToMember(apiMember: ApiMember): Member {
    return {
        id: apiMember.id,
        name: `${apiMember.firstName || ''} ${apiMember.lastName || ''}`.trim() || apiMember.email,
        firstName: apiMember.firstName,
        lastName: apiMember.lastName,
        email: apiMember.email,
        status: 'ACTIVE', // TODO: Add status field to backend
    };
}

/**
 * Reset a user's password
 * @param userId the user ID
 * @param password the new password, or null to generate by system
 */
export async function resetUserPassword(userId: number, password: string | null): Promise<{ message: string; generatedPassword?: string }> {
    const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password: password,
            generateBySystem: password === null,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to reset password: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Updates an existing user
 * @param id the user ID
 * @param request the update member request
 */
export async function updateUser(id: number, request: UpdateMemberRequest): Promise<ApiMember> {
    const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to update user: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Deletes a user
 * @param id the user ID
 */
export async function deleteUser(id: number): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_TARGET}/api/v1/users/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to delete user: ${response.statusText}`);
    }
}
