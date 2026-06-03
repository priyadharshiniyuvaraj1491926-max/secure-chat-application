import { useState, useEffect } from 'react'
import { getFromStorage, saveToStorage } from '../utils/storage'

/**
 * Custom hook for localStorage with JSON serialization
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = getFromStorage(key)
      return item !== null ? item : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      saveToStorage(key, valueToStore)
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}
