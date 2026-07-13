import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot, MessageSquare, Plus, Send, Sparkles, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { sendChatMessage } from '../services/chatService'

const starterChats = [
  { id: 1, title: 'Plan a study roadmap', preview: 'Create a 6-week plan for coding and AI practice.' },
  { id: 2, title: 'Explain React hooks', preview: 'Give me a beginner-friendly breakdown with examples.' },
  { id: 3, title: 'Write a SQL query', preview: 'Show a query for recent student activity.' },
]

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hello! I can help with learning plans, coding help, summaries, and more. What would you like to explore today?',
  },
]

const ChatAssistant = () => {
  const [chats, setChats] = useState(starterChats)
  const [activeChatId, setActiveChatId] = useState(1)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || chats[0],
    [chats, activeChatId]
  )

  const handleNewChat = () => {
    const newId = Date.now()
    setChats((prev) => [{ id: newId, title: 'New chat', preview: '' }, ...prev])
    setActiveChatId(newId)
    setMessages(initialMessages)
    setError('')
  }

  const handleSend = async () => {
    const trimmed = draft.trim()
    if (!trimmed || isTyping) return

    const userMessage = { id: Date.now(), role: 'user', content: trimmed }
    const nextTitle = trimmed.slice(0, 32)

    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsTyping(true)
    setError('')

    // Update the sidebar chat title
    setChats((prev) => {
      const existing = prev.find((chat) => chat.id === activeChatId)
      if (existing) {
        return prev.map((chat) =>
          chat.id === activeChatId ? { ...chat, title: nextTitle, preview: trimmed } : chat
        )
      }
      return [{ id: Date.now() + 1, title: nextTitle, preview: trimmed }, ...prev]
    })

    try {
      // ── Call the real Express backend ──────────────────────────────────────
      const replyText = await sendChatMessage(trimmed)
      // ───────────────────────────────────────────────────────────────────────

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, role: 'assistant', content: replyText },
      ])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100">
      <div className="section-shell py-6 lg:py-8">
        <div className="flex overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside
            className={`${
              sidebarOpen ? 'w-full md:w-80' : 'w-0'
            } hidden overflow-hidden border-r border-white/10 bg-slate-950/70 md:flex md:flex-col`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">EduNest AI</p>
                <h2 className="text-lg font-semibold text-white">Assistant</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <button
              onClick={handleNewChat}
              className="mx-4 mt-4 flex items-center justify-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
            >
              <Plus size={16} /> New chat
            </button>

            <div className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`mb-2 w-full rounded-2xl border px-3 py-3 text-left transition ${
                    activeChatId === chat.id
                      ? 'border-violet-500/40 bg-violet-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <MessageSquare size={15} /> {chat.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{chat.preview}</p>
                </button>
              ))}
            </div>
          </aside>

          {/* ── Main chat panel ───────────────────────────────────────────── */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{activeChat?.title || 'New chat'}</p>
                  <p className="text-xs text-slate-400">AI assistant • online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex h-[560px] flex-col bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_40%)]">
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-3xl px-4 py-3 sm:max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-violet-600 text-white'
                          : 'border border-white/10 bg-white/10 text-slate-100'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                        {message.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                        {message.role === 'user' ? 'You' : 'EduNest AI'}
                      </div>
                      <div className="prose prose-invert max-w-none prose-pre:bg-slate-950/80 prose-pre:text-slate-100 prose-code:text-violet-300 prose-code:before:content-none prose-code:after:content-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400 animation-delay-2000" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400 animation-delay-4000" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex justify-center">
                    <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-400">
                      {error}
                    </p>
                  </div>
                )}

                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/10 bg-slate-900/80 px-4 py-4 sm:px-6">
                <div className="flex items-end gap-3 rounded-[24px] border border-white/10 bg-slate-950/70 p-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={1}
                    placeholder="Ask anything…"
                    className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isTyping || !draft.trim()}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-3 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-slate-600">
                  Press <kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-400">Enter</kbd> to send ·{' '}
                  <kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-400">Shift+Enter</kbd> for new line
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ChatAssistant
