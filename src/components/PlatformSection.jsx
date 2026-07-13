import React from 'react'
import { BrainCircuit, Sparkles, Rocket, CheckCircle2 } from 'lucide-react'
import { useTheme } from '../utils/themeContext'

const PlatformSection = () => {
  const { isDark } = useTheme()

  const pillars = [
    {
      icon: BrainCircuit,
      title: 'Adaptive learning paths',
      description: 'The platform tailors lessons, pacing, and exercises around your goals and confidence level.',
    },
    {
      icon: Sparkles,
      title: 'AI tutor feedback',
      description: 'Get instant explanations, summaries, and study suggestions that feel like a personal mentor.',
    },
    {
      icon: Rocket,
      title: 'Practical skill labs',
      description: 'Move from theory to real-world work with interactive prompts, coding drills, and portfolios.',
    },
  ]

  return (
    <section id="paths" className={`relative overflow-hidden py-20 sm:py-24 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white'}`}>
      <div className="section-shell relative z-10">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Built for modern learners</p>
            <h2 className={`text-4xl font-black sm:text-5xl ${isDark ? 'text-white' : 'bg-gradient-to-r from-blue-700 via-violet-700 to-fuchsia-700 bg-clip-text text-transparent'}`}>
              An AI learning environment that actually helps you grow.
            </h2>
            <p className={`mt-6 max-w-2xl text-lg leading-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              From planning your next study sprint to getting instant explanations, EduNest AI turns learning into a guided, motivating experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/chat" className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1">Open the AI tutor</a>
              <a href="/signup" className={`rounded-full border px-6 py-3 font-semibold transition ${isDark ? 'border-white/10 bg-slate-900/70 text-slate-100 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600'}`}>Create free account</a>
            </div>
          </div>

          <div className={`rounded-[32px] border p-6 shadow-2xl ${isDark ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-slate-50'}`}>
            <div className={`rounded-[28px] border p-5 ${isDark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-3 text-white">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-violet-400">Today’s focus</p>
                  <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Build a 30-minute learning sprint</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  'Review one concept with the AI tutor',
                  'Practice three targeted prompts',
                  'Capture what you learned in your notes',
                ].map((item) => (
                  <div key={item} className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className={`${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div key={pillar.title} className={`rounded-[28px] border p-6 transition hover:-translate-y-1 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white shadow-lg shadow-slate-100'}`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                  <Icon size={20} />
                </div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{pillar.title}</h3>
                <p className={`mt-3 leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{pillar.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PlatformSection
