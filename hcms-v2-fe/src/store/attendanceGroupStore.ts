/**
 * Zustand store for Attendance Groups
 */

import { create } from 'zustand';
import type {
  AttendanceGroup,
  CreateAttendanceGroupRequest,
  UpdateAttendanceGroupRequest,
} from '@/types';
import {
  getAttendanceGroups,
  getAttendanceGroupById,
  createAttendanceGroup,
  updateAttendanceGroup,
  deleteAttendanceGroup,
} from '@/api';

interface AttendanceGroupState {
  // Data
  groups: AttendanceGroup[];
  selectedGroup: AttendanceGroup | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Actions
  fetchGroups: (page?: number, size?: number, search?: string) => Promise<void>;
  fetchGroupById: (id: number) => Promise<AttendanceGroup>;
  createGroup: (request: CreateAttendanceGroupRequest) => Promise<AttendanceGroup>;
  updateGroup: (id: number, request: UpdateAttendanceGroupRequest) => Promise<AttendanceGroup>;
  deleteGroup: (id: number) => Promise<void>;
  setSelectedGroup: (group: AttendanceGroup | null) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useAttendanceGroupStore = create<AttendanceGroupState>((set, get) => ({
  // Initial data
  groups: [],
  selectedGroup: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,
  
  // Initial UI state
  isLoading: false,
  error: null,
  searchQuery: '',
  
  // Actions
  fetchGroups: async (page = 0, size = 20, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAttendanceGroups(page, size, search || get().searchQuery);
      set({
        groups: response.content,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        pageSize: response.size,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch attendance groups:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch attendance groups',
        isLoading: false 
      });
    }
  },
  
  fetchGroupById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const group = await getAttendanceGroupById(id);
      set({ selectedGroup: group, isLoading: false });
      return group;
    } catch (error) {
      console.error('Failed to fetch attendance group:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch attendance group',
        isLoading: false 
      });
      throw error;
    }
  },
  
  createGroup: async (request: CreateAttendanceGroupRequest) => {
    set({ isLoading: true, error: null });
    try {
      const group = await createAttendanceGroup(request);
      // Refresh the list
      await get().fetchGroups();
      set({ isLoading: false });
      return group;
    } catch (error) {
      console.error('Failed to create attendance group:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create attendance group',
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateGroup: async (id: number, request: UpdateAttendanceGroupRequest) => {
    set({ isLoading: true, error: null });
    try {
      const group = await updateAttendanceGroup(id, request);
      // Refresh the list
      await get().fetchGroups();
      set({ selectedGroup: group, isLoading: false });
      return group;
    } catch (error) {
      console.error('Failed to update attendance group:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update attendance group',
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteGroup: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteAttendanceGroup(id);
      // Refresh the list
      await get().fetchGroups();
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to delete attendance group:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete attendance group',
        isLoading: false 
      });
      throw error;
    }
  },
  
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  clearError: () => set({ error: null }),
}));
