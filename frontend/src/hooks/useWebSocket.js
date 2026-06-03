import { useState, useEffect, useRef, useCallback } from 'react'

export const useWebSocket = (userId, onMessage) => {
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'
    wsRef.current = new WebSocket(`${wsUrl}/ws/chat/${userId}`)

    wsRef.current.onopen = () => setIsConnected(true)
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }
    wsRef.current.onclose = () => setIsConnected(false)

    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [userId, onMessage])

  const sendMessage = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  return { isConnected, sendMessage }
}
