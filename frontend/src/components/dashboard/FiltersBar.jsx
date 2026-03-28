import React from "react";
import { Search, Download } from "lucide-react";

export default function FiltersBar({
  filters,
  setFilters,
  members,
  handleExportExcel,
}) {
  return (
    <div className="bg-white p-3.5 border-t border-gray-100 rounded-t-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px] relative">
        <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search Client, Project..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
          className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-medium text-gray-900 shadow-sm"
        />
      </div>

      {/* Member Filter */}
      <select
        value={filters.member}
        onChange={(e) =>
          setFilters({ ...filters, member: e.target.value, page: 1 })
        }
        className="bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors text-gray-700 font-medium shadow-sm min-w-[140px]"
      >
        <option value="">All Members</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value, page: 1 })
        }
        className="bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors text-gray-700 font-medium shadow-sm min-w-[140px]"
      >
        <option value="">All Statuses</option>
        <option value="In Progress">In Progress</option>
        <option value="Delivered">Delivered</option>
        <option value="Revision">Revision</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {/* Sort Filter */}
      <select
        value={filters.sort}
        onChange={(e) =>
          setFilters({ ...filters, sort: e.target.value, page: 1 })
        }
        className="bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors text-gray-700 font-medium shadow-sm min-w-[140px]"
      >
        <option value="">Recent to Old</option>
        <option value="val_high">Value: High to Low</option>
        <option value="val_low">Value: Low to High</option>
      </select>

      {/* Urgent Toggle */}
      <div className="flex items-center pl-3 border-l border-gray-100">
        <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 cursor-pointer bg-orange-50 hover:bg-orange-100 px-3 py-2.5 rounded-lg transition-colors border border-orange-100/50 shadow-sm">
          <input
            type="checkbox"
            checked={filters.urgent}
            onChange={(e) =>
              setFilters({ ...filters, urgent: e.target.checked, page: 1 })
            }
            className="rounded text-orange-500 focus:ring-orange-500 bg-white border-gray-300 w-4 h-4 m-0"
          />
          <span className="text-orange-600">≤ 4 Days</span>
        </label>
      </div>

      {/* Export Action */}
      <div className="flex items-center ml-auto">
        <button
          onClick={handleExportExcel}
          className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-green-600 cursor-pointer bg-green-50 hover:bg-green-100 px-4 py-2.5 rounded-lg transition-colors border border-green-100/50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          title="Export to Excel"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>
    </div>
  );
}
