import { useEffect, useState } from 'react'
import ToolSelector from './components/ToolSelector.jsx'
import Header from './components/Header.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import ChatInput from './components/ChatInput.jsx'
import Footer from './components/Footer.jsx'
import BookmarksPanel from './components/BookmarksPanel.jsx'
import CheckupWizard from './components/CheckupWizard.jsx'
import CommunityChat from './components/CommunityChat.jsx'
import ContactsDirectory from './components/ContactsDirectory.jsx'
import { useChat } from './hooks/useChat.js'
import { useBookmarks } from './hooks/useBookmarks.js'

const MODE_TITLES = {
  deals:     'Deal Finder — Sprindl',
  campus:    'CSI Campus Guide — Sprindl',
  resources: 'Resource Guide — Sprindl',
    cuny:          'CUNY Guide — Sprindl',
    opportunities: 'Student Opportunities — Sprindl',
}

const TopBar = () => (
  <div className="topbar">
    Independent student-built resource for the College of Staten Island (CUNY) — not an official CSI service
  </div>
)

export default function App() {
  const [view, setView]               = useState('home')
  const [mode, setMode]               = useState('resources')
  const [bookmarksOpen, setBookmarksOpen] = useState(false)
  const [pendingAsk, setPendingAsk] = useState(null)

  const { messages, isLoading, error, sendMessage, reset } = useChat(mode)
  const bm = useBookmarks()

  useEffect(() => {
    document.title = view === 'chat' ? (MODE_TITLES[mode] || 'Sprindl') : 'Sprindl'
  }, [view, mode])

  const handleSelectTool = (selectedMode) => {
    setMode(selectedMode)
    setView('chat')
  }

  // From checkup results: jump into Resource Guide chat and ask about a program.
  // useChat resets history when mode changes, so the question is sent from an
  // effect that runs after that reset.
  const handleAskNavi = (programName) => {
    setMode('resources')
    setView('chat')
    setPendingAsk(`How do I apply for ${programName}? What do I need to have ready?`)
  }

  useEffect(() => {
    if (pendingAsk && view === 'chat') {
      sendMessage(pendingAsk)
      setPendingAsk(null)
    }
  }, [pendingAsk, view, sendMessage])

  if (view === 'checkup') {
    return (
      <div className="app-shell app-shell--home">
        <TopBar />
        <CheckupWizard onBack={() => setView('home')} onAskNavi={handleAskNavi} />
        <Footer minimal />
        <CommunityChat />
      </div>
    )
  }

  if (view === 'contacts') {
    return (
      <div className="app-shell app-shell--home">
        <TopBar />
        <ContactsDirectory onBack={() => setView('home')} />
        <Footer minimal />
        <CommunityChat />
      </div>
    )
  }

  if (view === 'home') {
    return (
      <div className="app-shell app-shell--home">
        <TopBar />
        <ToolSelector onSelect={handleSelectTool} onCheckup={() => setView('checkup')} onContacts={() => setView('contacts')} />
        <Footer minimal />
        <CommunityChat />
      </div>
    )
  }

  const bookmarkHandlers = {
    bookmarks: bm.bookmarks,
    add: bm.add,
    remove: bm.remove,
    isBookmarked: bm.isBookmarked,
  }

  return (
    <div className="app-shell">
      <TopBar />
      <Header
        mode={mode}
        onBack={() => setView('home')}
        onReset={reset}
        hasConversation={messages.length > 1}
        bookmarkCount={bm.bookmarks.length}
        onBookmarksToggle={() => setBookmarksOpen((o) => !o)}
      />
      <main className="chat-panel">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSend={sendMessage}
          mode={mode}
          bookmarkHandlers={bookmarkHandlers}
        />
        <ChatInput onSend={sendMessage} isLoading={isLoading} mode={mode} />
      </main>
      <Footer />
      {bookmarksOpen && (
        <BookmarksPanel
          bookmarks={bm.bookmarks}
          onRemove={bm.remove}
          onClose={() => setBookmarksOpen(false)}
        />
      )}
      <CommunityChat />
    </div>
      )
}
