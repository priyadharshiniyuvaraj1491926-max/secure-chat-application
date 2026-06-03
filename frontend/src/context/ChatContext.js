import { createContext, useContext } from 'react'
const ChatContext = createContext(null)

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}

export default ChatContext
