import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'
import { useTheme } from '../utils/themeContext'

const FOOTER_LINKS = {
  Platform: [
    { label: 'AI Roadmap Generator', href: '/roadmap' },
    { label: 'AI Mentor Chat', href: '/chat' },
    { label: 'Resume Analyser', href: '#' },
    { label: 'Mock Interviews', href: '#' },
  ],
  Prepare: [
    { label: 'DSA Practice', href: '#' },
    { label: 'System Design', href: '#' },
    { label: 'HR Questions', href: '#' },
    { label: 'Aptitude Tests', href: '#' },
  ],
  Account: [
    { label: 'Sign Up Free', href: '/signup' },
    { label: 'Login', href: '/login' },
    { label: 'Dashboard', href: '#' },
    { label: 'Settings', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

const Footer = () => {
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600" />

      <div className="section-shell py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg">
                <span className="text-base font-black text-white">EN</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white">EduNest AI</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Placement Prep</p>
              </div>
            </div>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-400">
              The AI-powered platform helping students crack placements at top product-based companies — with personalised roadmaps, an AI mentor, and smart mock interviews.
            </p>

            <div className="flex gap-3">
              {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <p>📧 hello@edunest.ai</p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 transition-colors duration-200 hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            © {currentYear} EduNest AI. Made with <Heart size={14} className="text-rose-500" /> for placement aspirants.
          </p>
          <p className="text-xs text-slate-600">
            Powered by Gemini AI · Built with React + Vite
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
