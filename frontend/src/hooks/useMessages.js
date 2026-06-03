import { useState, useEffect } from 'react'
import { messageService } from '../services'

export const useMessages = (userId, otherUserId) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadMessages = async (skip = 0) => {
    try {
      setLoading(true)
      const response = await messageService.getChat(otherUserId, skip)
      setMessages(response.data.reverse())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (otherUserId) {
      loadMessages()
    }
  }, [otherUserId])

  const sendMessage = async (message, viewOnce, expiryTime) => {
    try {
      const response = await messageService.sendMessage({
        receiver_id: otherUserId,
        message,
        view_once: viewOnce,
        expiry_time: expiryTime
      })
      setMessages([...messages, response.data])
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { messages, loading, error, sendMessage, loadMessages }
}
