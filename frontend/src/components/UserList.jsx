import React from 'react'
import { formatDate } from '../utils/format'

const UserList = ({ users, selectedUser, onSelectUser, onlineUsers = [] }) => {
  return (
    <div className="divide-y">
      {users.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No users found</div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`p-4 cursor-pointer hover:bg-gray-200 transition ${
              selectedUser?.id === user.id ? 'bg-gray-300' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{user.username}</h3>
                  <p className="text-xs text-gray-500">
                    {user.is_online ? (
                      <span className="text-green-600 font-bold">Online</span>
                    ) : (
                      `Last seen ${formatDate(user.last_seen)}`
                    )}
                  </p>
                </div>
              </div>
              {user.is_online && (
                <div className="user-status online"></div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default UserList
