import { v4 as uuidv4 } from 'crypto'

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Create new task object
 */
export const createTask = ({
  title,
  description = '',
  priority = 'medium',
  category = '',
  dueDate = null,
  notes = '',
  recurring = 'none',
}) => {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title,
    description,
    completed: false,
    priority,
    category,
    dueDate,
    createdAt: now,
    updatedAt: now,
    notes,
    recurring,
    reminders: [],
    subtasks: [],
    tags: [],
  }
}

/**
 * Sort tasks based on criteria
 */
export const sortTasks = (tasks, sortBy = 'dueDate') => {
  const tasksCopy = [...tasks]
  
  switch (sortBy) {
    case 'dueDate':
      return tasksCopy.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    
    case 'priority':
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return tasksCopy.sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority]
      )
    
    case 'createdAt':
      return tasksCopy.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    
    case 'alphabetical':
      return tasksCopy.sort((a, b) => 
        a.title.localeCompare(b.title)
      )
    
    default:
      return tasksCopy
  }
}

/**
 * Filter tasks based on criteria
 */
export const filterTasks = (tasks, {
  status = 'all',
  category = null,
  priority = null,
  search = '',
  hasDate = null,
} = {}) => {
  let filtered = [...tasks]
  
  // Filter by status
  if (status === 'completed') {
    filtered = filtered.filter(t => t.completed)
  } else if (status === 'active') {
    filtered = filtered.filter(t => !t.completed)
  }
  
  // Filter by category
  if (category) {
    filtered = filtered.filter(t => t.category === category)
  }
  
  // Filter by priority
  if (priority) {
    filtered = filtered.filter(t => t.priority === priority)
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.notes.toLowerCase().includes(searchLower)
    )
  }
  
  // Filter by has date
  if (hasDate !== null) {
    if (hasDate) {
      filtered = filtered.filter(t => t.dueDate)
    } else {
      filtered = filtered.filter(t => !t.dueDate)
    }
  }
  
  return filtered
}

/**
 * Calculate task statistics
 */
export const calculateStats = (tasks) => {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const active = total - completed
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
  
  const byPriority = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  }
  
  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false
    return new Date(t.dueDate) < new Date() && !isToday(t.dueDate)
  }).length
  
  return {
    total,
    completed,
    active,
    completionRate,
    byPriority,
    overdue,
  }
}

/**
 * Get tasks due today
 */
export const getTasksDueToday = (tasks) => {
  const today = new Date().toISOString().split('T')[0]
  return tasks.filter(t => t.dueDate && t.dueDate.startsWith(today))
}

/**
 * Get overdue tasks
 */
export const getOverdueTasks = (tasks) => {
  const today = new Date()
  return tasks.filter(t => {
    if (!t.dueDate || t.completed) return false
    const dueDate = new Date(t.dueDate)
    return dueDate < today && dueDate.toDateString() !== today.toDateString()
  })
}

const isToday = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

/**
 * Duplicate a task
 */
export const duplicateTask = (task) => {
  const { id, createdAt, updatedAt, completed, ...rest } = task
  return createTask({ ...rest })
}

/**
 * Batch operations
 */
export const markTasksComplete = (tasks, taskIds) => {
  return tasks.map(t => 
    taskIds.includes(t.id) ? { ...t, completed: true } : t
  )
}

export const deleteTasks = (tasks, taskIds) => {
  return tasks.filter(t => !taskIds.includes(t.id))
}

export const updateTasksPriority = (tasks, taskIds, priority) => {
  return tasks.map(t => 
    taskIds.includes(t.id) ? { ...t, priority } : t
  )
}
