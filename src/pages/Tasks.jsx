import React, { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import { Trash2, Copy } from 'lucide-react'

const Tasks = () => {
  const { 
    tasks, 
    categories, 
    updateTask, 
    deleteTask, 
    toggleTask, 
    duplicateTask,
    getFilteredTasks,
    filters,
    setFilters
  } = useTasks()
  
  const [selectedTasks, setSelectedTasks] = useState(new Set())
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const filteredTasks = getFilteredTasks()

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTasks(new Set(filteredTasks.map(t => t.id)))
    } else {
      setSelectedTasks(new Set())
    }
  }

  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedTasks.size} task(s)?`)) {
      selectedTasks.forEach(id => deleteTask(id))
      setSelectedTasks(new Set())
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleUpdateTask = (updates) => {
    if (editingTask) {
      updateTask(editingTask.id, updates)
      setEditingTask(null)
      setShowForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Toolbar */}
        {selectedTasks.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedTasks.size} task(s) selected
            </span>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              <Trash2 size={18} />
              Delete Selected
            </button>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Select all on this page
                </span>
              </div>
              {filteredTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(task.id)}
                    onChange={() => handleSelectTask(task.id)}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <TaskCard
                      task={task}
                      category={categories.find(c => c.id === task.category)}
                      onToggle={() => toggleTask(task.id)}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => deleteTask(task.id)}
                      onDuplicate={() => duplicateTask(task.id)}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          categories={categories}\n          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : undefined}
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default Tasks
