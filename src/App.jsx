import Header from './components/Header.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import ChatInput from './components/ChatInput.jsx'
import Footer from './components/Footer.jsx'
import { useChat } from './hooks/useChat.js'

export default function App() {
  const { messages, isLoading, error, sendMessage, reset } = useChat()

  return (
    <div className="app-shell">
      <Header onReset={reset} hasConversation={messages.length > 1} />
      <main className="chat-panel">
        <ChatWindow messages={messages} isLoading={isLoading} error={error} onSend={sendMessage} />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </main>
      <Footer />
    </div>
  )
}
