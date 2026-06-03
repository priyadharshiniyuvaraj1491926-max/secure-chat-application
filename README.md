# To-Do List Application

A modern, feature-rich to-do list application built with React and Vite, featuring local storage functionality for persistent data management.

## Features

### Core Functionality
- ✅ **Create Tasks** - Add new to-do items with title and description
- ✅ **Edit Tasks** - Modify existing task details
- ✅ **Delete Tasks** - Remove tasks from the list
- ✅ **Mark as Complete** - Toggle task completion status
- ✅ **Local Storage** - Persist tasks across browser sessions
- ✅ **Task Categories** - Organize tasks by categories
- ✅ **Priority Levels** - Set task priority (High, Medium, Low)
- ✅ **Due Dates** - Add deadlines to tasks
- ✅ **Search & Filter** - Find tasks by title or status
- ✅ **Statistics** - View task completion metrics

### Advanced Features
- ✅ **Drag & Drop** - Reorder tasks
- ✅ **Bulk Operations** - Delete multiple tasks
- ✅ **Task Notes** - Add detailed notes to tasks
- ✅ **Recurrence** - Set recurring tasks (Daily, Weekly, Monthly)
- ✅ **Reminders** - Get task reminders
- ✅ **Export/Import** - Backup and restore tasks
- ✅ **Dark Mode** - Theme switching
- ✅ **Responsive Design** - Mobile-friendly interface

## Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Date-fns** - Date manipulation
- **Lucide Icons** - Icon library

### Storage
- **LocalStorage API** - Browser-based data persistence
- **JSON serialization** - Data format

## Project Structure

```
todo-app/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Tasks.jsx
│   │   └── Settings.jsx
│   ├── components/
│   │   ├── TaskForm.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskFilter.jsx
│   │   ├── Statistics.jsx
│   │   ├── CategoryManager.jsx
│   │   └── ThemeToggle.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useTasks.js
│   │   └── useCategories.js
│   ├── utils/
│   │   ├── storage.js
│   │   ├── taskUtils.js
│   │   └── dateUtils.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .gitignore
├── README.md
└── DOCUMENTATION.md
```

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/todo-app.git
cd todo-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Access the application at `http://localhost:5173`

## Usage

### Creating a Task
1. Click "Add New Task" button
2. Enter task title and description
3. Set priority, category, and due date (optional)
4. Click "Create Task"

### Editing a Task
1. Click the edit icon on a task card
2. Modify the task details
3. Click "Save Changes"

### Completing a Task
- Click the checkbox on a task card to mark it complete/incomplete

### Filtering Tasks
- Use the filter dropdown to view:
  - All tasks
  - Active tasks
  - Completed tasks
  - By category
  - By priority

### Searching Tasks
- Type in the search bar to find tasks by title or description

### Managing Categories
1. Go to Settings
2. Click "Manage Categories"
3. Add, edit, or delete categories

### Export/Import
1. Go to Settings
2. Click "Export Tasks" to download JSON file
3. Click "Import Tasks" to upload JSON file

## Local Storage Implementation

### Data Structure

Tasks are stored in localStorage as JSON:
```json
{
  "tasks": [
    {
      "id": "unique-id",
      "title": "Task Title",
      "description": "Task description",
      "completed": false,
      "priority": "high",
      "category": "work",
      "dueDate": "2024-12-31",
      "createdAt": "2024-01-10T12:00:00Z",
      "updatedAt": "2024-01-10T12:00:00Z",
      "notes": "Additional notes",
      "recurring": "none",
      "reminders": []
    }
  ],
  "categories": [
    {
      "id": "unique-id",
      "name": "Work",
      "color": "#3B82F6"
    }
  ],
  "settings": {
    "theme": "light",
    "sortBy": "dueDate",
    "showCompleted": true
  }
}
```

### Storage Keys
- `todo_tasks` - All tasks
- `todo_categories` - Task categories
- `todo_settings` - User preferences

### Storage Limits
- LocalStorage limit: ~5-10MB per domain
- Current app uses minimal storage
- Consider migration to IndexedDB for larger datasets

## Custom Hooks

### useLocalStorage
Manages localStorage operations with JSON serialization.

### useTasks
Handles task CRUD operations and state management.

### useCategories
Manages task categories.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Create new task |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl/Cmd + E` | Export tasks |
| `Escape` | Close modal |

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

## API Reference

### Task Object
```javascript
{
  id: string,              // Unique identifier
  title: string,           // Task title (required)
  description: string,     // Task description
  completed: boolean,      // Completion status
  priority: 'low'|'medium'|'high',  // Priority level
  category: string,        // Category ID
  dueDate: string,         // ISO date string
  createdAt: string,       // ISO timestamp
  updatedAt: string,       // ISO timestamp
  notes: string,           // Additional notes
  recurring: 'none'|'daily'|'weekly'|'monthly',
  reminders: string[]      // Reminder times
}
```

### Category Object
```javascript
{
  id: string,        // Unique identifier
  name: string,      // Category name
  color: string      // Hex color code
}
```

## Performance Considerations

1. **Debouncing**: Search input is debounced to prevent excessive renders
2. **Memoization**: Components use React.memo for optimization
3. **Lazy Loading**: Route components are code-split
4. **LocalStorage**: Minimal I/O operations

## Data Backup & Recovery

### Automatic Backup
- Tasks are saved to localStorage immediately after changes
- No manual backup required

### Manual Backup
1. Export tasks as JSON file
2. Store file in safe location
3. Import anytime to restore

## Security Considerations

1. **LocalStorage Security**
   - Data stored in browser, not on server
   - No sensitive data stored (passwords, API keys)
   - Subject to XSS attacks - keep dependencies updated

2. **Data Privacy**
   - No data sent to external servers
   - User has full control of data
   - Clear data anytime from Settings

## Limitations

1. **Storage**: Limited to ~5-10MB per browser
2. **Sync**: No cross-device synchronization
3. **Offline**: Requires local browser storage
4. **Sharing**: Cannot share tasks with other users
5. **Backups**: Manual backup only

## Future Enhancements

1. **Cloud Sync** - Firebase/Supabase integration
2. **Collaboration** - Share tasks with others
3. **Mobile App** - React Native version
4. **Notifications** - Browser notifications
5. **Subtasks** - Break tasks into smaller items
6. **Time Tracking** - Track time spent on tasks
7. **Analytics** - Task completion analytics
8. **Templates** - Task templates for recurring workflows
9. **Integration** - Calendar, email integration
10. **AI Suggestions** - Smart task recommendations

## Troubleshooting

### Tasks not saving
- Check if localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

### Data lost
- Check if private/incognito mode is enabled
- LocalStorage may be cleared automatically
- Use export feature for manual backups

### Performance issues
- Clear completed tasks to reduce dataset
- Export old tasks and clear data
- Restart browser if UI feels slow

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation

## Credits

Built with React, Vite, and Tailwind CSS
