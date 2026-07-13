import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useTheme } from '../utils/themeContext'

const AuthShell = ({ title, subtitle, children, footerText, footerLink }) => {
  const { isDark } = useTheme()

  return (
    <div className={`relative min-h-[calc(100vh-5rem)] overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.22),_transparent_30%)]" />
      <div className="section-shell relative py-16">
        <div className={`mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border shadow-2xl shadow-blue-900/10 lg:flex-row ${isDark ? 'border-white/10 bg-slate-900/80' : 'border-slate-200/80 bg-white/80 backdrop-blur-xl'}`}>
          <div className={`w-full p-8 sm:p-10 lg:w-[45%] lg:p-12 ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-fuchsia-500/10'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
                <Sparkles size={20} />
              </div>
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>EduNest AI</p>
                <p className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Secure learning, anywhere</p>
              </div>
            </div>

            <h2 className={`mt-8 text-3xl font-semibold sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
            <p className={`mt-3 max-w-md text-base leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{subtitle}</p>

            <div className="mt-8 space-y-3">
              {[
                'AI-guided study plans and instant feedback',
                'Secure access with JWT-ready session handling',
                'Polished experience for every device',
              ].map((item) => (
                <div key={item} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white/70 text-slate-700'}`}>
                  <ShieldCheck size={18} className="text-blue-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full p-8 sm:p-10 lg:w-[55%] lg:p-12">
            {children}
            {footerText && footerLink && (
              <p className={`mt-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {footerText}{' '}
                <Link to={footerLink} className="font-semibold text-blue-600 transition hover:text-violet-600">Continue</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthShell
