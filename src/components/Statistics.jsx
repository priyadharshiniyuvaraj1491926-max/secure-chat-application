import React from 'react'
import { CheckCircle2, Circle, TrendingUp, AlertCircle } from 'lucide-react'

const Statistics = ({ stats }) => {
  const completionPercentage = stats.completionRate || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.total}
            </p>
          </div>
          <Circle size={40} className="text-blue-500 opacity-20" />
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.completed}
            </p>
          </div>
          <CheckCircle2 size={40} className="text-green-500 opacity-20" />
        </div>
      </div>

      {/* Active Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.active}
            </p>
          </div>
          <TrendingUp size={40} className="text-blue-500 opacity-20" />
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overdue</p>
            <p className={`text-3xl font-bold mt-2 ${
              stats.overdue > 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {stats.overdue}
            </p>
          </div>
          <AlertCircle size={40} className={`opacity-20 ${
            stats.overdue > 0 ? 'text-red-500' : 'text-gray-500'
          }`} />
        </div>
      </div>

      {/* Completion Rate */}
      <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 dark:text-gray-400 font-medium">Completion Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {completionPercentage}%
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default Statistics
