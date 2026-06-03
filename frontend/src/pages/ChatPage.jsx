import React, { useState, useEffect } from 'react'
import { userService, messageService } from '../services'
import { useWebSocket } from '../hooks/useWebSocket'
import { formatDate, formatTime, getInitials } from '../utils/format'
import ChatWindow from '../components/ChatWindow'
import UserList from '../components/UserList'

const ChatPage = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await userService.getCurrentUser()
        setCurrentUser(response.data)
      } catch (err) {
        console.error('Failed to load current user:', err)
      }
    }

    const loadUsers = async () => {
      try {
        const response = await userService.getUsers()
        const filtered = response.data.filter(u => u.id !== currentUser?.id)
        setUsers(filtered)
      } catch (err) {
        console.error('Failed to load users:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCurrentUser().then(() => loadUsers())
  }, [])

  const handleSearch = async (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.length === 0) {
      const response = await userService.getUsers()
      const filtered = response.data.filter(u => u.id !== currentUser?.id)
      setUsers(filtered)
    } else {
      try {
        const response = await userService.searchUser(term)
        if (response.data.id !== currentUser?.id) {
          setUsers([response.data])
        } else {
          setUsers([])
        }
      } catch (err) {
        setUsers([])
      }
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-primary mb-4">Chats</h1>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          onlineUsers={onlineUsers}
        />
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <ChatWindow
            currentUser={currentUser}
            selectedUser={selectedUser}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
              <p>Select a user to begin messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
