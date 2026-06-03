import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { createTask, sortTasks, filterTasks, calculateStats } from '../utils/taskUtils'
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from '../utils/constants'

/**
 * Custom hook for managing tasks
 */
export const useTasks = () => {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, [])
  const [categories, setCategories] = useLocalStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
  const [filters, setFilters] = useState({
    status: 'all',
    category: null,
    priority: null,
    search: '',
  })
  const [sortBy, setSortBy] = useState('dueDate')

  // Add task
  const addTask = useCallback((taskData) => {
    const newTask = createTask(taskData)
    setTasks([...tasks, newTask])
    return newTask
  }, [tasks, setTasks])

  // Update task
  const updateTask = useCallback((taskId, updates) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    ))
  }, [tasks, setTasks])

  // Delete task
  const deleteTask = useCallback((taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }, [tasks, setTasks])

  // Toggle task completion
  const toggleTask = useCallback((taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
        : t
    ))
  }, [tasks, setTasks])

  // Duplicate task
  const duplicateTask = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const { id, createdAt, updatedAt, ...rest } = task
      const newTask = createTask(rest)
      setTasks([...tasks, newTask])
      return newTask
    }
  }, [tasks, setTasks])

  // Get filtered and sorted tasks
  const getFilteredTasks = useCallback(() => {
    let filtered = filterTasks(tasks, filters)
    return sortTasks(filtered, sortBy)
  }, [tasks, filters, sortBy])

  // Get task statistics
  const getStats = useCallback(() => {
    return calculateStats(tasks)
  }, [tasks])

  // Clear all tasks
  const clearAllTasks = useCallback(() => {
    setTasks([])
  }, [setTasks])

  // Add category
  const addCategory = useCallback((category) => {
    setCategories([...categories, category])
  }, [categories, setCategories])

  // Update category
  const updateCategory = useCallback((categoryId, updates) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, ...updates } : c
    ))
  }, [categories, setCategories])

  // Delete category
  const deleteCategory = useCallback((categoryId) => {
    setCategories(categories.filter(c => c.id !== categoryId))
    // Remove category from tasks
    setTasks(tasks.map(t => 
      t.category === categoryId ? { ...t, category: '' } : t
    ))
  }, [categories, setCategories, tasks, setTasks])

  return {
    tasks,
    categories,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    duplicateTask,
    getFilteredTasks,
    getStats,
    clearAllTasks,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
