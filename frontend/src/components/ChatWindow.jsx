import React, { useState, useEffect, useRef } from 'react'
import { messageService } from '../services'
import { useWebSocket } from '../hooks/useWebSocket'
import { decryptMessage } from '../utils/encryption'
import { formatTime } from '../utils/format'
import MessageInput from './MessageInput'

const ChatWindow = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [showPrivacyOverlay, setShowPrivacyOverlay] = useState(false)

  const { isConnected, sendMessage } = useWebSocket(
    currentUser?.id,
    (message) => {
      if (message.type === 'message' && message.sender_id === selectedUser.id) {
        try {
          const decrypted = decryptMessage(message.message)
          setMessages(prev => [...prev, {
            ...message,
            encrypted_message: decrypted
          }])
        } catch (err) {
          console.error('Failed to decrypt message:', err)
        }
      } else if (message.type === 'typing') {
        setIsTyping(message.sender_id === selectedUser.id)
      }
    }
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true)
      try {
        const response = await messageService.getChat(selectedUser.id)
        setMessages(response.data.map(msg => ({
          ...msg,
          encrypted_message: msg.encrypted_message
        })))
      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        setLoading(false)
      }
    }

    if (selectedUser) {
      loadMessages()
    }
  }, [selectedUser])

  useEffect(() => {
    const handleFocus = () => setShowPrivacyOverlay(false)
    const handleBlur = () => setShowPrivacyOverlay(true)

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  const handleSendMessage = async (message, viewOnce, expiryTime) => {
    try {
      const response = await messageService.sendMessage({
        receiver_id: selectedUser.id,
        message,
        view_once: viewOnce,
        expiry_time: expiryTime
      })

      setMessages(prev => [...prev, response.data])

      // Send via WebSocket if connected
      if (isConnected) {
        sendMessage({
          type: 'message',
          receiver_id: selectedUser.id,
          message,
          timestamp: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleTyping = () => {
    if (isConnected) {
      sendMessage({
        type: 'typing',
        receiver_id: selectedUser.id
      })
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between shadow">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center mr-3">
            {selectedUser.username[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold">{selectedUser.username}</h2>
            <p className="text-xs text-green-100">
              {selectedUser.is_online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 bg-light ${
        showPrivacyOverlay ? 'blur-content' : ''
      }`}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="spinner"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-2 ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`message-bubble ${
                  msg.sender_id === currentUser.id ? 'sent' : 'received'
                }`}
              >
                <p className="break-words">{msg.encrypted_message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === currentUser.id ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.created_at)}
                  {msg.sender_id === currentUser.id && (
                    <span className="ml-2">
                      {msg.read_status ? '✓✓' : '✓'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
        {isTyping && <p className="text-gray-500 text-sm italic">User is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* Privacy Overlay */}
      {showPrivacyOverlay && (
        <div className="privacy-overlay">
          Sensitive Content Hidden
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!isConnected}
      />
    </div>
  )
}

export default ChatWindow
