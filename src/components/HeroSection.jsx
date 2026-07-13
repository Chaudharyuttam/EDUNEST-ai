import React from 'react'
import { ArrowRight, Sparkles, Bot, BrainCircuit, MapPin, FileText, LayoutDashboard } from 'lucide-react'
import { useTheme } from '../utils/themeContext'

const STATS = [
  { value: '50K+', label: 'Students Placed' },
  { value: '92%', label: 'Interview Success Rate' },
  { value: '200+', label: 'Companies Hiring' },
]

const HeroSection = () => {
  const { isDark } = useTheme()

  return (
    <section
      id="home"
      className={`relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28 ${
        isDark
          ? 'bg-slate-950 text-slate-100'
          : 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.13),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#fdfbff_50%,_#f5f7ff_100%)]'
      }`}
    >
      {/* Ambient blobs */}
      <div className="absolute left-[-5rem] top-20 h-80 w-80 animate-blob rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute bottom-10 right-[-2rem] h-80 w-80 animate-blob animation-delay-2000 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-64 w-64 animate-blob animation-delay-4000 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="section-shell relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ── Left: copy ── */}
          <div className="animate-slideUp">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${
              isDark ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-blue-200 bg-blue-50 text-blue-700'
            }`}>
              <Sparkles size={14} />
              AI-Powered Placement Prep Platform
            </div>

            {/* Headline */}
            <h1 className={`mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.75rem] ${
              isDark
                ? 'text-white'
                : 'bg-gradient-to-r from-blue-700 via-violet-700 to-fuchsia-700 bg-clip-text text-transparent'
            }`}>
              Crack Your Dream Job with an AI Mentor By Your Side
            </h1>

            <p className={`mt-6 max-w-xl text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              EduNest AI builds your personalised study roadmap, reviews your resume, and coaches you through mock interviews — so you walk into every placement round fully prepared.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Generate My Roadmap <ArrowRight size={18} />
              </a>
              <a
                href="/chat"
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-base font-semibold transition-all duration-300 ${
                  isDark
                    ? 'border-white/10 bg-slate-900/60 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-300 bg-white/80 text-slate-700 hover:border-violet-400 hover:text-violet-700'
                }`}
              >
                <Bot size={18} /> Try AI Mentor
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border p-4 text-center transition-transform duration-300 hover:-translate-y-1 ${
                    isDark ? 'border-white/10 bg-slate-900/60' : 'border-white/80 bg-white/70 shadow-lg shadow-slate-200/60'
                  }`}
                >
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{s.value}</p>
                  <p className={`mt-1 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: feature preview card ── */}
          <div className="animate-fadeIn">
            <div className={`rounded-[32px] border p-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
              isDark ? 'border-white/10 bg-slate-900/70' : 'border-white/80 bg-white/80 backdrop-blur-xl'
            }`}>
              {/* Card header */}
              <div className="rounded-[24px] bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">Your AI Dashboard</p>
                    <h2 className="mt-1 text-xl font-bold">Placement Prep Command Centre</h2>
                  </div>
                  <div className="rounded-2xl border border-white/30 bg-white/15 p-3">
                    <BrainCircuit size={22} />
                  </div>
                </div>

                {/* Mock items */}
                <div className="mt-6 space-y-3">
                  {[
                    { icon: MapPin,         label: 'Roadmap',  sub: 'DSA → System Design → HR', pct: 62 },
                    { icon: FileText,       label: 'Resume',   sub: 'ATS Score: 87/100',         pct: 87 },
                    { icon: LayoutDashboard,label: 'Mock AI',  sub: '3 interviews completed',     pct: 75 },
                  ].map(({ icon: Icon, label, sub, pct }) => (
                    <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={15} className="text-white/80" />
                          <span className="text-sm font-semibold">{label}</span>
                        </div>
                        <span className="text-xs text-white/60">{pct}%</span>
                      </div>
                      <p className="mt-0.5 text-xs text-white/60">{sub}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
                        <div className="h-full rounded-full bg-white/70" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom nudge */}
              <div className={`mt-4 flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${
                isDark ? 'bg-slate-800/80' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>AI mentor is ready</span>
                </div>
                <a href="/chat" className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90">
                  Start Chat →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
