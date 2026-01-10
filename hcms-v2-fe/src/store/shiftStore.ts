/**
 * Shift store - Zustand state management for shifts
 */

import { create } from 'zustand';
import type {
  CreateShiftRequest,
  PageResponse,
  Shift,
  UpdateShiftRequest,
} from '@/types';
import {
  createShift as apiCreateShift,
  deleteShift as apiDeleteShift,
  getShifts as apiGetShifts,
  updateShift as apiUpdateShift,
} from '@/api';

interface ShiftStore {
  // State
  shifts: Shift[];
  selectedShift: Shift | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
  filters: {
    search: string;
    status?: string;
    sort?: string;
  };

  // Actions
  loadShifts: (page?: number) => Promise<void>;
  selectShift: (shift: Shift | null) => void;
  createShift: (request: CreateShiftRequest) => Promise<Shift>;
  updateShift: (id: number, request: UpdateShiftRequest) => Promise<Shift>;
  deleteShift: (id: number) => Promise<void>;
  setFilters: (filters: Partial<ShiftStore['filters']>) => void;
  clearError: () => void;
}

export const useShiftStore = create<ShiftStore>((set, get) => ({
  // Initial state
  shifts: [],
  selectedShift: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    pageSize: 20,
    totalPages: 0,
    totalElements: 0,
  },
  filters: {
    search: '',
    status: undefined,
    sort: undefined,
  },

  // Actions
  loadShifts: async (page = 0) => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      const response: PageResponse<Shift> = await apiGetShifts(
        page,
        pagination.pageSize,
        filters.search || undefined,
        filters.status,
        filters.sort
      );

      set({
        shifts: response.content,
        pagination: {
          currentPage: response.number,
          pageSize: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
        },
        loading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load shifts';
      set({ error: message, loading: false });
      throw error;
    }
  },

  selectShift: (shift: Shift | null) => {
    set({ selectedShift: shift });
  },

  createShift: async (request: CreateShiftRequest) => {
    set({ loading: true, error: null });
    try {
      const shift = await apiCreateShift(request);
      set((state) => ({
        shifts: [shift, ...state.shifts],
        loading: false,
      }));
      return shift;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create shift';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateShift: async (id: number, request: UpdateShiftRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedShift = await apiUpdateShift(id, request);
      set((state) => ({
        shifts: state.shifts.map((s) => (s.id === id ? updatedShift : s)),
        selectedShift:
          state.selectedShift?.id === id ? updatedShift : state.selectedShift,
        loading: false,
      }));
      return updatedShift;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update shift';
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteShift: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteShift(id);
      set((state) => ({
        shifts: state.shifts.filter((s) => s.id !== id),
        selectedShift:
          state.selectedShift?.id === id ? null : state.selectedShift,
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete shift';
      set({ error: message, loading: false });
      throw error;
    }
  },

  setFilters: (filters: Partial<ShiftStore['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));
