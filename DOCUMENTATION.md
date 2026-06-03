# To-Do List Application - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Local Storage Implementation](#local-storage-implementation)
4. [Component Structure](#component-structure)
5. [Custom Hooks](#custom-hooks)
6. [API Reference](#api-reference)
7. [Usage Guide](#usage-guide)
8. [Performance & Best Practices](#performance--best-practices)
9. [Troubleshooting](#troubleshooting)

## Project Overview

### What is TaskHub?
TaskHub is a modern, feature-rich to-do list application that helps users organize and manage their daily tasks efficiently. Built with React and Vite, it leverages the browser's LocalStorage API to persist data without requiring a backend server.

### Key Characteristics
- **No Backend Required**: All data is stored locally in the browser
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Eye-friendly interface with theme switching
- **Advanced Filtering**: Filter by status, priority, category, and custom searches
- **Comprehensive Statistics**: Real-time task metrics and completion tracking
- **Data Export/Import**: Backup and restore tasks in JSON format

## Architecture

### System Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
├─────────────────────────────────────────────────────────────┤
│  Pages          Components         Hooks      Utilities      │
│  ─────────────  ──────────────────  ─────────  ────────────  │
│  • Dashboard    • TaskForm          • useTasks • storage.js  │
│  • Tasks        • TaskList          • useSettings • taskUtils│
│  • Settings     • TaskCard          • useLocalStorage • date │
│                 • TaskFilter                                 │
│                 • Statistics                                 │
│                 • CategoryManager                            │
│                 • ThemeToggle                                │
└──────────────┬──────────────────────────────────────────────┘
               │
        ┌──────▼─────────┐
        │  LocalStorage   │
        │  Browser API    │
        └─────────────────┘
```

### Data Flow
```
1. User Interaction
   ↓
2. Component State Update
   ↓
3. Hook Processing (useTasks, useSettings)
   ↓
4. Storage Operations (useLocalStorage)
   ↓
5. Browser LocalStorage
   ↓
6. UI Re-render
```

## Local Storage Implementation

### Storage Keys
```javascript
const STORAGE_KEYS = {
  TASKS: 'todo_tasks',           // Array of task objects
  CATEGORIES: 'todo_categories', // Array of category objects
  SETTINGS: 'todo_settings',     // Settings object
}
```

### Data Structure

#### Tasks Collection
```json
{
  "id": "1234567890",
  "title": "Complete project",
  "description": "Finish the React component",
  "completed": false,
  "priority": "high",
  "category": "work-id",
  "dueDate": "2024-12-31",
  "createdAt": "2024-01-10T12:00:00Z",
  "updatedAt": "2024-01-10T12:00:00Z",
  "notes": "Important deadline",
  "recurring": "weekly",
  "reminders": ["09:00", "18:00"],
  "subtasks": [],
  "tags": ["urgent", "work"]
}
```

#### Categories Collection
```json
{
  "id": "cat-1",
  "name": "Work",
  "color": "#3B82F6"
}
```

#### Settings Object
```json
{
  "theme": "light",
  "sortBy": "dueDate",
  "showCompleted": true,
  "showArchived": false
}
```

### Storage Size Management

**Current Estimate:**
- Single task: ~300-500 bytes
- Single category: ~50-100 bytes
- Settings: ~100 bytes

**Practical Limits:**
- LocalStorage quota: 5-10MB per domain
- Typical capacity: 10,000-20,000 tasks
- Actual limit depends on browser and user settings

**Optimization Tips:**
1. Regularly archive old tasks
2. Export and clear old data
3. Use categories efficiently
4. Keep notes concise

### Storage Operations

#### Save Data
```javascript
// Automatic on task changes
const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
```

#### Load Data
```javascript
const getFromStorage = (key, defaultValue) => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : defaultValue
}
```

#### Export Data
```javascript
// Downloads tasks as JSON file
exportToJSON({
  tasks: [...],
  categories: [...],
  settings: {...},
  exportedAt: new Date()
})
```

#### Import Data
```javascript
// Uploads and restores from JSON file
await importFromJSON(file)
```

## Component Structure

### Page Components

#### Dashboard (`/`)
- **Purpose**: Main landing page with overview
- **Features**:
  - Statistics widget
  - Quick task creation
  - Search and filter
  - Task list display

#### Tasks (`/tasks`)
- **Purpose**: Comprehensive task management
- **Features**:
  - Bulk task selection
  - Bulk delete operations
  - Detailed task editing
  - Select all/none functionality

#### Settings (`/settings`)
- **Purpose**: Application preferences and data management
- **Features**:
  - Theme switching
  - Sort preferences
  - Category management
  - Data import/export
  - Storage stats
  - Data cleanup

### Presentational Components

#### TaskForm
```javascript
Props:
- categories: Category[]
- task?: Task (optional for edit mode)
- onSubmit: (formData) => void
- onClose: () => void
```

#### TaskCard
```javascript
Props:
- task: Task
- category?: Category
- onToggle: () => void
- onEdit: () => void
- onDelete: () => void
- onDuplicate: () => void
```

#### TaskList
```javascript
Props:
- tasks: Task[]
- categories: Category[]
```

#### TaskFilter
```javascript
Props:
- filters: FilterObject
- setFilters: (filters) => void
- categories: Category[]
```

#### Statistics
```javascript
Props:
- stats: StatsObject
```

#### CategoryManager
- **Purpose**: CRUD operations for categories
- **Features**:
  - Add new categories
  - Edit existing categories
  - Delete categories
  - Color picker

#### ThemeToggle
- **Purpose**: Dark/Light mode switching
- **Features**:
  - Instant theme change
  - Persistent theme selection
  - Visual feedback

## Custom Hooks

### useLocalStorage
```javascript
const [value, setValue] = useLocalStorage(key, initialValue)

// Automatically syncs with localStorage
// Returns same interface as useState
```

**Features:**
- JSON serialization/deserialization
- Error handling
- Initial value fallback
- Functional update support

### useTasks
```javascript
const {
  tasks,                    // Array of tasks
  categories,               // Array of categories
  filters,                  // Current filter state
  setFilters,               // Update filters
  sortBy,                   // Current sort
  setSortBy,                // Update sort
  addTask,                  // Create task
  updateTask,               // Modify task
  deleteTask,               // Remove task
  toggleTask,               // Complete/uncomplete
  duplicateTask,            // Copy task
  getFilteredTasks,         // Get filtered & sorted tasks
  getStats,                 // Get statistics
  clearAllTasks,            // Delete all tasks
  addCategory,              // Create category
  updateCategory,           // Modify category
  deleteCategory,           // Remove category
} = useTasks()
```

**Key Methods:**

```javascript
// Add new task
const task = addTask({
  title: 'Learn React',
  priority: 'high',
  category: 'learning',
  dueDate: '2024-12-31'
})

// Update existing task
updateTask(taskId, {
  completed: true,
  priority: 'medium'
})

// Get filtered and sorted tasks
const filtered = getFilteredTasks()
// Applies current filters and sort order

// Get statistics
const stats = getStats()
// Returns: { total, completed, active, completionRate, byPriority, overdue }
```

### useSettings
```javascript
const {
  settings,        // Current settings object
  updateSetting,   // Update single setting
  toggleTheme,     // Switch theme
  setSortBy,       // Set sort order
  setShowCompleted,// Toggle completed visibility
  resetSettings,   // Reset to defaults
} = useSettings()
```

## API Reference

### Task Object
```typescript
interface Task {
  id: string                              // Unique identifier
  title: string                          // Task title (required)
  description?: string                   // Task details
  completed: boolean                     // Completion status
  priority: 'low' | 'medium' | 'high'   // Priority level
  category?: string                      // Category ID
  dueDate?: string                       // ISO date string
  createdAt: string                      // ISO timestamp
  updatedAt: string                      // ISO timestamp
  notes?: string                         // Additional notes
  recurring?: 'none'|'daily'|'weekly'|'monthly'  // Recurrence
  reminders?: string[]                   // Reminder times
  subtasks?: Subtask[]                   // Sub-tasks
  tags?: string[]                        // Tag labels
}
```

### Category Object
```typescript
interface Category {
  id: string        // Unique identifier
  name: string      // Category name
  color: string     // Hex color code
}
```

### Statistics Object
```typescript
interface Statistics {
  total: number                    // Total tasks
  completed: number                // Completed tasks
  active: number                   // Active tasks
  completionRate: number           // 0-100 percentage
  byPriority: {                    // Count by priority
    high: number
    medium: number
    low: number
  }
  overdue: number                  // Overdue tasks
}
```

### Filter Object
```typescript
interface FilterObject {
  status: 'all' | 'active' | 'completed'
  category?: string
  priority?: string
  search: string
  hasDate?: boolean
}
```

## Usage Guide

### Creating Tasks
1. Click "Add Task" button
2. Fill in task details
3. Set priority and category
4. Optionally add due date and recurrence
5. Click "Create Task"

### Managing Tasks
- **Complete**: Click checkbox to toggle status
- **Edit**: Click edit icon to modify
- **Delete**: Click trash icon to remove
- **Duplicate**: Click copy icon to clone

### Filtering & Searching
- Use dropdown filters for status, priority, category
- Type in search box to find by title/description
- Filter results update in real-time

### Data Management
1. **Export**: Settings → Export Tasks (saves JSON)
2. **Import**: Settings → Import Tasks (uploads JSON)
3. **Backup Strategy**:
   - Export weekly
   - Keep multiple versions
   - Store in cloud backup

## Performance & Best Practices

### Optimization Techniques

1. **Debounced Search**
   ```javascript
   // Search is debounced to prevent excessive re-renders
   const [searchTerm, setSearchTerm] = useState('')
   // Updates to filters happen with delay
   ```

2. **Memoized Components**
   ```javascript
   // TaskCard is memoized to prevent unnecessary renders
   const TaskCard = React.memo(({ task, ...props }) => ...)
   ```

3. **Lazy Filtering**
   ```javascript
   // Filtering happens only when filters change
   const filtered = useMemo(() => 
     filterTasks(tasks, filters),
     [tasks, filters]
   )
   ```

4. **Efficient Storage**
   - Only changed data is written
   - JSON stringification is efficient for datasets <10k items
   - Consider IndexedDB for larger datasets

### Best Practices

1. **Regular Backups**
   - Export tasks monthly
   - Keep backup files secure
   - Test imports regularly

2. **Data Cleanup**
   - Archive old completed tasks
   - Remove obsolete categories
   - Keep notes concise

3. **Browser Maintenance**
   - Clear cache periodically
   - Keep browser updated
   - Monitor storage usage

4. **Task Organization**
   - Use categories effectively
   - Set appropriate priorities
   - Add meaningful descriptions

## Troubleshooting

### Tasks Not Saving
**Symptom**: Tasks disappear after refresh

**Solutions**:
1. Check if localStorage is enabled
2. Check browser storage quota
3. Disable browser extensions that may block storage
4. Try incognito/private mode

### Data Lost After Update
**Symptom**: Tasks disappeared after browser update

**Recovery**:
1. Check browser history for export files
2. Check Downloads folder for backups
3. Use browser history to recover data
4. Import from backup file if available

### Performance Issues
**Symptom**: App feels slow with many tasks

**Solutions**:
1. Archive or delete old tasks
2. Reduce number of categories
3. Clear browser cache
4. Update to latest browser version
5. Restart browser

### Import Fails
**Symptom**: Error when importing JSON file

**Check**:
1. File format is valid JSON
2. File was exported from TaskHub
3. File size is reasonable
4. Try with different file

### Theme Not Persisting
**Symptom**: Theme resets after page refresh

**Solution**:
1. Check if localStorage is enabled
2. Clear browser cache
3. Disable browser extensions
4. Try different browser

## Advanced Features

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Ctrl/Cmd + N` | Create new task |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl/Cmd + E` | Export tasks |
| `Escape` | Close modal |

### Local Storage Limits
- **Standard**: 5-10MB per domain
- **Firefox**: 10MB
- **Chrome**: 10MB
- **Safari**: 5MB
- **Edge**: 10MB

### Browser Compatibility
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Chrome Mobile

## Future Enhancements

1. **Cloud Sync**
   - Firebase integration
   - Cross-device sync
   - Real-time collaboration

2. **Advanced Features**
   - Subtasks with progress
   - Time tracking
   - Task templates
   - Recurring task automation

3. **Integrations**
   - Calendar sync
   - Email reminders
   - Slack notifications
   - Google Tasks import

4. **Mobile App**
   - React Native version
   - Offline support
   - Push notifications
   - Home screen widgets

## Development

### Project Setup
```bash
cd todo-app
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

### File Structure
```
src/
├── pages/           # Route pages
├── components/      # UI components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── styles/         # CSS styles
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Support & Contact

For issues, suggestions, or questions:
1. Check the troubleshooting guide
2. Review existing issues
3. Create a new issue with details
4. Include browser/OS information

---

**Created with ❤️ using React + Vite**
