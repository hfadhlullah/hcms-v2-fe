/**
 * Member Types
 */

export type MemberStatus = 'ACTIVE' | 'INVITED' | 'DELETED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type WorkforceType = 'REGULAR' | 'CONTRACT' | 'INTERN';

export interface Member {
    id: number;
    name: string;
    lastName?: string;
    firstName?: string;
    email: string;
    status: MemberStatus;
    department?: string;
    departmentId?: number;
    alias?: string;
    deskId?: string;
    phoneExtension?: string;
    phoneNumber?: string;
    employeeNumber?: string;
    userId?: string;
    gender?: Gender;
    workforceType?: WorkforceType;
    dateOfEmployment?: string;
    country?: string;
    city?: string;
    directManager?: string;
    dottedLineManager?: string;
    jobTitle?: string;
    avatar?: string;
}

export interface Department {
    id: number;
    name: string;
    parentId?: number;
    children?: Department[];
}

export interface CreateMemberRequest {
    name: string;
    lastName?: string;
    firstName?: string;
    email?: string;
    departmentId?: number;
    phoneNumber?: string;
    alias?: string;
    deskId?: string;
    phoneExtension?: string;
    employeeNumber?: string;
    userId?: string;
    gender?: Gender;
    workforceType?: WorkforceType;
    dateOfEmployment?: string;
    country?: string;
    city?: string;
    directManager?: string;
    dottedLineManager?: string;
    jobTitle?: string;
}

export interface UpdateMemberRequest {
    name?: string;
    lastName?: string;
    firstName?: string;
    email?: string;
    departmentId?: number;
    phoneNumber?: string;
    alias?: string;
    deskId?: string;
    phoneExtension?: string;
    employeeNumber?: string;
    userId?: string;
    gender?: Gender;
    workforceType?: WorkforceType;
    dateOfEmployment?: string;
    country?: string;
    city?: string;
    directManager?: string;
    dottedLineManager?: string;
    jobTitle?: string;
}
