import React, { useState } from 'react'

const MessageInput = ({ onSendMessage, onTyping, disabled = false }) => {
  const [message, setMessage] = useState('')
  const [viewOnce, setViewOnce] = useState(false)
  const [expiryTime, setExpiryTime] = useState(null)
  const [showOptions, setShowOptions] = useState(false)

  const handleSend = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message, viewOnce, expiryTime)
      setMessage('')
      setViewOnce(false)
      setExpiryTime(null)
      setShowOptions(false)
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    onTyping()
  }

  return (
    <div className="bg-white border-t border-gray-300 p-4">
      {showOptions && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={viewOnce}
                onChange={(e) => setViewOnce(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">View Once</span>
            </label>
          </div>
          <div>
            <label className="block text-sm mb-2">Auto-delete after:</label>
            <select
              value={expiryTime || ''}
              onChange={(e) => setExpiryTime(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Never</option>
              <option value="5">5 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="3600">1 hour</option>
            </select>
          </div>
        </div>
      )}
      <form onSubmit={handleSend} className="input-group">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="px-4 py-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition"
          title="Message options"
        >
          ⚙️
        </button>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-bold transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default MessageInput
