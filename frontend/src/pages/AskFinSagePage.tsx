import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

interface Message { role: 'user' | 'ai'; content: string; timestamp: Date }

const SUGGESTED_QUESTIONS = [
  'I earn ₹12L/year. Which tax regime is better for me?',
  'How do I start investing with just ₹5,000/month?',
  'Should I buy term insurance or ULIP?',
  'What is the difference between ELSS and PPF?',
  'How much should I save for retirement?',
  'Is it better to pay off home loan early or invest in mutual funds?',
  'What are the best mutual funds for a beginner?',
  'How do I build an emergency fund from scratch?',
  'My salary is ₹8L. Am I investing enough?',
  'What is the 50/30/20 rule for budgeting?',
  'Should I invest in NPS for tax saving?',
  'How does compounding work and why does starting early matter?',
]

export default function AskFinSagePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: `Hello! I'm **FinSage AI** — your free personal finance advisor. 🙏\n\nI can help you with **any financial question** — tax planning, investments, insurance, retirement, budgeting, and more. Everything I share is specific to the Indian financial context.\n\n**Ask me anything — no question is too basic!** Most financial advice that costs thousands of rupees from advisors, I can help you with for free.\n\nWhat's on your mind?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return
    const userMsg: Message = { role: 'user', content: question, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
      const res = await axios.post('http://localhost:8000/api/v1/chat/ask', { question, history })
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer, timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I ran into an issue. Please try again in a moment.', timestamp: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#020122' }}>💬 Ask FinSage AI</h1>
        <p className="mt-1 text-sm" style={{ color: '#6B6C8A' }}>Get free, personalised financial advice. Ask anything about money, investing, tax, or insurance.</p>
      </div>

      {/* Chat window */}
      <div className="rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: '60vh', background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #F4442E, #FC9E4F)' }}>F</div>
              )}
              <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'chat-user' : 'chat-ai'}`}>
                {msg.role === 'ai' ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:text-[#020122] prose-strong:text-[#020122] prose-ul:my-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5" style={{ background: 'rgba(237,211,130,0.4)', color: '#020122' }}>You</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: 'linear-gradient(135deg, #F4442E, #FC9E4F)' }}>F</div>
              <div className="chat-ai px-4 py-3 text-sm">
                <span className="loading-pulse" style={{ color: '#6B6C8A' }}>FinSage is thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(237,211,130,0.5)' }}>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask any finance question… e.g. 'Which tax regime is better for me?'"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ background: '#FEFEF5', border: '1.5px solid #EDD382', color: '#020122' }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
              style={{ background: '#F4442E' }}
            >
              Send →
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: '#6B6C8A' }}>FinSage AI provides educational guidance, not regulated financial advice.</p>
        </div>
      </div>

      {/* Suggested questions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B6C8A' }}>💡 Common Questions (click to ask)</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ background: '#FFFBEA', border: '1.5px solid #EDD382', color: '#020122' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#F4442E'; (e.currentTarget as HTMLButtonElement).style.color = '#F4442E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(237,211,130,0.7)'; (e.currentTarget as HTMLButtonElement).style.color = '#6B6C8A' }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
