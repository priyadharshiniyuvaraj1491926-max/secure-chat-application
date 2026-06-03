import React from 'react'
import { useSettings } from '../hooks/useSettings'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const { settings, toggleTheme } = useSettings()
  const isDark = settings.theme === 'dark'

  React.useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [isDark])

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-gray-700" />
      )}
    </button>
  )
}

export default ThemeToggle
