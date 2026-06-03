import React from 'react'
import { Filter, X } from 'lucide-react'

const TaskFilter = ({ filters, setFilters, categories }) => {
  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status
    }))
  }

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category
    }))
  }

  const handlePriorityChange = (priority) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority === priority ? null : priority
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      category: null,
      priority: null,
      search: '',
    })
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="input-field text-sm"
      >
        <option value="all">All Tasks</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority || ''}
        onChange={(e) => handlePriorityChange(e.target.value || null)}
        className="input-field text-sm"
      >
        <option value="">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      {/* Category Filter */}
      {categories.length > 0 && (
        <select
          value={filters.category || ''}
          onChange={(e) => handleCategoryChange(e.target.value || null)}
          className="input-field text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      )}

      {/* Clear Filters */}
      {(filters.status !== 'all' || filters.category || filters.priority) && (
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <X size={16} />
          Clear
        </button>
      )}
    </div>
  )
}

export default TaskFilter
