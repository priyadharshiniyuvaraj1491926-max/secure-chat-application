import React, { useState } from 'react'
import { Check, Trash2, Copy, Edit2, Calendar, Tag } from 'lucide-react'
import { formatDate, isOverdue } from '../utils/dateUtils'

const TaskCard = ({ task, category, onToggle, onEdit, onDelete, onDuplicate }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge-danger'
      case 'medium':
        return 'badge-warning'
      case 'low':
        return 'badge-success'
      default:
        return 'badge-primary'
    }
  }

  const overdue = isOverdue(task.dueDate)

  return (
    <div className={`task-card ${
      task.completed ? 'opacity-60' : ''
    } ${
      overdue ? 'border-l-4 border-red-500' : ''
    }`}>
      <div className="flex gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
          }`}
        >
          {task.completed && <Check size={16} className="text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${
            task.completed
              ? 'line-through text-gray-500 dark:text-gray-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Priority Badge */}
            <span className={`badge ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {/* Category Badge */}
            {category && (
              <span
                className="badge text-white text-xs"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                overdue
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              }`}>
                <Calendar size={14} />
                {overdue ? 'Overdue: ' : ''}{formatDate(task.dueDate)}
              </div>
            )}

            {/* Recurrence */}
            {task.recurring !== 'none' && (
              <span className="badge-primary text-xs">
                {task.recurring.charAt(0).toUpperCase() + task.recurring.slice(1)}
              </span>
            )}
          </div>

          {/* Notes Preview */}
          {task.notes && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
              "{task.notes.substring(0, 50)}{task.notes.length > 50 ? '...' : ''}"
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDuplicate}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            title="Duplicate"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors text-red-600 dark:text-red-400"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
