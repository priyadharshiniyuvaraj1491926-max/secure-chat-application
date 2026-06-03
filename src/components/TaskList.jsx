import React from 'react'
import TaskCard from './TaskCard'
import { useTasks } from '../hooks/useTasks'

const TaskList = ({ tasks, categories }) => {
  const { toggleTask, deleteTask, updateTask, duplicateTask } = useTasks()

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No tasks to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          category={categories.find(c => c.id === task.category)}
          onToggle={() => toggleTask(task.id)}
          onEdit={() => {}} // Handled by parent
          onDelete={() => deleteTask(task.id)}
          onDuplicate={() => duplicateTask(task.id)}
        />
      ))}
    </div>
  )
}

export default TaskList
