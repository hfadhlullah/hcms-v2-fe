/**
 * Shift filters component
 */

import { useShiftStore } from '@/store';
import { Search } from 'lucide-react';

export function ShiftFilters() {
  const filters = useShiftStore((state) => state.filters);
  const setFilters = useShiftStore((state) => state.setFilters);

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or code..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filters.status || ''}
        onChange={(e) =>
          setFilters({ status: e.target.value || undefined })
        }
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>
  );
}
