import React, { useState, useEffect } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useSettings } from '../hooks/useSettings'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import TaskFilter from '../components/TaskFilter'
import Statistics from '../components/Statistics'
import { Plus, Settings } from 'lucide-react'

const Dashboard = () => {
  const { tasks, categories, filters, setFilters, getFilteredTasks, getStats, addTask } = useTasks()
  const { settings } = useSettings()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTasks = getFilteredTasks()
  const stats = getStats()

  const handleAddTask = (taskData) => {
    addTask(taskData)
    setShowForm(false)
  }

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }))
  }, [searchTerm, setFilters])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Organize your day, one task at a time</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Statistics */}
        <Statistics stats={stats} />

        {/* Search and Filter */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <TaskFilter filters={filters} setFilters={setFilters} categories={categories} />
        </div>

        {/* Task List */}
        <div className="mt-8">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p className="text-lg">No tasks found</p>
              <p className="text-sm">Create one to get started</p>
            </div>
          ) : (
            <TaskList tasks={filteredTasks} categories={categories} />
          )}
        </div>
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          categories={categories}
          onSubmit={handleAddTask}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
