import React, { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { useTheme } from '../utils/themeContext'

const Newsletter = () => {
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <section id="newsletter" className={`relative overflow-hidden py-16 sm:py-20 ${isDark ? 'bg-slate-950' : 'bg-[linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_45%,_#7c3aed_100%)]'}`}>
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      <div className="section-shell relative z-10">
        <div className={`rounded-[32px] border border-white/20 p-8 shadow-2xl backdrop-blur-xl sm:p-12 ${isDark ? 'bg-slate-900/70' : 'bg-white/10'}`}>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/15 p-4">
                <Mail size={36} className="text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl">Stay updated</h2>
            <p className="mb-8 text-lg text-blue-100 sm:text-xl">Subscribe for fresh courses, launch notes, and high-signal product updates.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-white/20 bg-white/90 px-6 py-4 font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-300"
                required
              />
              <button type="submit" className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                Subscribe
              </button>
            </form>

            {submitted && (
              <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur">
                <CheckCircle size={20} className="text-white" />
                <p className="font-semibold text-white">Thanks! Check your inbox for confirmation.</p>
              </div>
            )}

            <p className="mt-8 text-sm text-blue-100">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
