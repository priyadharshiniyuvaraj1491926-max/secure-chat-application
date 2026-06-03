/**
 * LocalStorage utility functions
 */

const parseJSON = (value, defaultValue) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    console.error('Error parsing JSON:', err)
    return defaultValue
  }
}

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? parseJSON(item, defaultValue) : defaultValue
  } catch (err) {
    console.error('Error reading from localStorage:', err)
    return defaultValue
  }
}

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error('Error saving to localStorage:', err)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (err) {
    console.error('Error removing from localStorage:', err)
    return false
  }
}

export const clearAllStorage = () => {
  try {
    localStorage.clear()
    return true
  } catch (err) {
    console.error('Error clearing localStorage:', err)
    return false
  }
}

export const exportToJSON = (data, filename = 'tasks.json') => {
  try {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (err) {
    console.error('Error exporting to JSON:', err)
    return false
  }
}

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result)
        resolve(data)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsText(file)
    } catch (err) {
      reject(err)
    }
  })
}

export const getStorageSize = () => {
  let size = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage[key].length + key.length
    }
  }
  return (size / 1024).toFixed(2) // Return size in KB
}
