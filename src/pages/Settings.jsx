import React, { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useSettings } from '../hooks/useSettings'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { exportToJSON, importFromJSON, getStorageSize, clearAllStorage } from '../utils/storage'
import { Download, Upload, Trash2, RotateCcw } from 'lucide-react'
import CategoryManager from '../components/CategoryManager'
import ThemeToggle from '../components/ThemeToggle'

const Settings = () => {
  const { clearAllTasks } = useTasks()
  const { settings, resetSettings, setSortBy, setShowCompleted } = useSettings()
  const [storageSize, setStorageSize] = useState(getStorageSize())
  const [exportData, setExportData] = useState(null)

  const handleExport = async () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem('todo_tasks') || '[]'),
      categories: JSON.parse(localStorage.getItem('todo_categories') || '[]'),
      settings: JSON.parse(localStorage.getItem('todo_settings') || '{}'),
      exportedAt: new Date().toISOString(),
    }
    exportToJSON(data, `tasks-backup-${new Date().getTime()}.json`)
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const data = await importFromJSON(file)
        if (data.tasks) localStorage.setItem('todo_tasks', JSON.stringify(data.tasks))
        if (data.categories) localStorage.setItem('todo_categories', JSON.stringify(data.categories))
        if (data.settings) localStorage.setItem('todo_settings', JSON.stringify(data.settings))
        setStorageSize(getStorageSize())
        alert('Tasks imported successfully!')
        window.location.reload()
      } catch (err) {
        alert('Error importing tasks: ' + err.message)
      }
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      clearAllStorage()
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Appearance */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Theme</label>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Sort by</label>
              <select
                value={settings.sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="createdAt">Created Date</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Show completed tasks</label>
              <input
                type="checkbox"
                checked={settings.showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
          <CategoryManager />
        </section>

        {/* Data Management */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data Management</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Storage used</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{storageSize} KB</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={18} />
                Export Tasks
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-green-600 text-white rounded-lg font-medium transition-colors cursor-pointer">
                <Upload size={18} />
                Import Tasks
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-red-600">Danger Zone</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">These actions cannot be undone.</p>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 size={18} />
            Clear All Data
          </button>
        </section>
      </main>
    </div>
  )
}

export default Settings
