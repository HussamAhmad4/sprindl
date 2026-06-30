import { useState } from 'react'
import ToolSelector from './components/ToolSelector.jsx'
import Header from './components/Header.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import ChatInput from './components/ChatInput.jsx'
import Footer from './components/Footer.jsx'
import { useChat } from './hooks/useChat.js'

export default function App() {
  const [view, setView] = useState('home')  // 'home' | 'chat'
  const [mode, setMode] = useState('resources')

  const { messages, isLoading, error, sendMessage, reset } = useChat(mode)

  const handleSelectTool = (selectedMode) => {
    setMode(selectedMode)
    setView('chat')
  }

  const handleBack = () => {
    setView('home')
  }

  if (view === 'home') {
    return (
      <div className="app-shell app-shell--home">
        <ToolSelector onSelect={handleSelectTool} />
        <Footer minimal />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header mode={mode} onBack={handleBack} onReset={reset} hasConversation={messages.length > 1} />
      <main className="chat-panel">
        <ChatWindow messages={messages} isLoading={isLoading} error={error} onSend={sendMessage} mode={mode} />
        <ChatInput onSend={sendMessage} isLoading={isLoading} mode={mode} />
      </main>
      <Footer />
    </div>
  )
}
