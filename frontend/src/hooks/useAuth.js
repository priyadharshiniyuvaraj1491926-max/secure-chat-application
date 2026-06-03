import { useState, useEffect } from 'react'
import { userService } from '../services'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setLoading(false)
          return
        }
        const response = await userService.getCurrentUser()
        setUser(response.data)
      } catch (err) {
        setError(err.message)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return { user, loading, error, logout }
}
