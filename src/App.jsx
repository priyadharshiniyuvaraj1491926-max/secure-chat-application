import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useSettings } from './hooks/useSettings'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import { CheckSquare, List, Settings as SettingsIcon, Menu, X } from 'lucide-react'

function App() {
  const { settings } = useSettings()
  const [menuOpen, setMenuOpen] = React.useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (settings.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [settings.theme])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
                <CheckSquare size={28} />
                TaskHub
              </Link>

              {/* Menu Toggle (Mobile) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Links (Desktop) */}
              <div className="hidden md:flex items-center gap-8">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                >
                  <CheckSquare size={20} />
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                >
                  <List size={20} />
                  All Tasks
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                >
                  <SettingsIcon size={20} />
                  Settings
                </Link>
              </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden mt-4 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-2 font-medium">
                    <CheckSquare size={20} />
                    Dashboard
                  </div>
                </Link>
                <Link
                  to="/tasks"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-2 font-medium">
                    <List size={20} />
                    All Tasks
                  </div>
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-2 font-medium">
                    <SettingsIcon size={20} />
                    Settings
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
