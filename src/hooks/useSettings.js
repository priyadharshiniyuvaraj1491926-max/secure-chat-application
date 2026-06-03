import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants'

/**
 * Custom hook for managing app settings
 */
export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [setSettings])

  const toggleTheme = useCallback(() => {
    updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')
  }, [settings.theme, updateSetting])

  const setSortBy = useCallback((sortBy) => {
    updateSetting('sortBy', sortBy)
  }, [updateSetting])

  const setShowCompleted = useCallback((show) => {
    updateSetting('showCompleted', show)
  }, [updateSetting])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [setSettings])

  return {
    settings,
    updateSetting,
    toggleTheme,
    setSortBy,
    setShowCompleted,
    resetSettings,
  }
}
