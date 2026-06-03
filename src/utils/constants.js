export const STORAGE_KEYS = {
  TASKS: 'todo_tasks',
  CATEGORIES: 'todo_categories',
  SETTINGS: 'todo_settings',
}

export const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Work', color: '#3B82F6' },
  { id: '2', name: 'Personal', color: '#10B981' },
  { id: '3', name: 'Shopping', color: '#F59E0B' },
  { id: '4', name: 'Health', color: '#EF4444' },
  { id: '5', name: 'Learning', color: '#8B5CF6' },
]

export const DEFAULT_SETTINGS = {
  theme: 'light',
  sortBy: 'dueDate',
  showCompleted: true,
  showArchived: false,
}

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

export const RECURRENCE_OPTIONS = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
}

export const SORT_OPTIONS = {
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  CREATED: 'createdAt',
  ALPHABETICAL: 'alphabetical',
}
