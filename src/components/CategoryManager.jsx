import React, { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { Plus, Trash2, Edit2, X } from 'lucide-react'

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: '', color: '#3B82F6' })
    setShowForm(true)
  }

  const handleEdit = (cat) => {
    setEditingId(cat.id)
    setFormData({ name: cat.name, color: cat.color })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (editingId) {
      updateCategory(editingId, formData)
    } else {
      addCategory({
        id: Date.now().toString(),
        ...formData
      })
    }

    setShowForm(false)
    setFormData({ name: '', color: '#3B82F6' })
  }

  return (
    <div>
      {/* Categories List */}
      <div className="space-y-2 mb-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-gray-900 dark:text-white font-medium">{cat.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cat)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <Edit2 size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
              >
                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Button */}
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors w-full justify-center"
      >
        <Plus size={18} />
        Add Category
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{formData.color}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="button-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-primary flex-1"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
