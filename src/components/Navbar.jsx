import React, { useState } from 'react'
import { Menu, X, Moon, Sun, Map, Bot, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../utils/themeContext'

const NAV_LINKS = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Journey', href: '/#journey' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
      isDark ? 'border-white/10 bg-slate-950/75' : 'border-slate-200/80 bg-white/75'
    }`}>
      <div className="section-shell">
        <div className="flex h-16 items-center justify-between sm:h-20">

          {/* Brand */}
          <Link to="/" className="flex cursor-pointer items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105">
              <span className="text-sm font-black text-white">EN</span>
            </div>
            <div className="hidden sm:block">
              <p className={`text-lg font-bold leading-none ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                EduNest
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-500">AI</p>
            </div>
          </Link>

          {/* Desktop center nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:text-blue-600 ${
                  isDark ? 'text-slate-300 hover:bg-slate-800/80' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`hidden rounded-full p-2.5 transition-all duration-300 sm:inline-flex ${
                isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Roadmap link */}
            <Link
              to="/roadmap"
              className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 sm:flex ${
                isDark
                  ? 'border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20'
                  : 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
              }`}
            >
              <Map size={15} /> Roadmap
            </Link>

            {/* AI Chat link */}
            <Link
              to="/chat"
              className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 sm:flex ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
              }`}
            >
              <Bot size={15} /> AI Mentor
            </Link>

            <Link
              to="/resume"
              className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 sm:flex ${
                isDark
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <FileText size={15} /> Resume
            </Link>

            {/* Sign up CTA */}
            <Link
              to="/signup"
              className="hidden rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:block"
            >
              Get Started Free
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`rounded-full p-2.5 md:hidden ${
                isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`animate-slideDown border-t py-4 md:hidden ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <div className={`my-2 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              <Link to="/roadmap" onClick={() => setIsOpen(false)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${isDark ? 'text-violet-300 hover:bg-slate-800' : 'text-violet-700 hover:bg-violet-50'}`}>
                <Map size={15} /> Roadmap Generator
              </Link>
              <Link to="/chat" onClick={() => setIsOpen(false)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}>
                <Bot size={15} /> AI Mentor Chat
              </Link>
              <Link to="/resume" onClick={() => setIsOpen(false)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${isDark ? 'text-emerald-300 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
                <FileText size={15} /> Resume Analyser
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="mt-2 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-bold text-white">
                Get Started Free
              </Link>

              <button
                type="button"
                onClick={() => { toggleTheme(); setIsOpen(false) }}
                className={`mt-1 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <span>Switch Theme</span>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
