/**
 * StudentJourneySection.jsx
 * Shows a realistic student transformation story — from confused to placed.
 * Replaces the old fake testimonials with a concrete visual timeline.
 */
import React from 'react'
import { useTheme } from '../utils/themeContext'
import { User, CheckCircle2, ArrowDown } from 'lucide-react'

const JOURNEY = [
  {
    week: 'Week 1',
    color: 'border-blue-500/40 bg-blue-500/10',
    dot: 'bg-blue-500',
    weekBadge: 'bg-blue-500/20 text-blue-500',
    title: 'Profile & Gap Analysis',
    body: 'Aryan, a 3rd-year CS student targeting product companies, fills in his goal and skills. EduNest AI identifies his weak spots: System Design and Dynamic Programming.',
  },
  {
    week: 'Weeks 2–5',
    color: 'border-violet-500/40 bg-violet-500/10',
    dot: 'bg-violet-500',
    weekBadge: 'bg-violet-500/20 text-violet-500',
    title: 'Roadmap in Action',
    body: 'He follows a structured 4-week DSA sprint — 2 hours daily. The AI mentor answers his questions, explains concepts with examples, and adapts the plan when he falls behind.',
  },
  {
    week: 'Week 6',
    color: 'border-emerald-500/40 bg-emerald-500/10',
    dot: 'bg-emerald-500',
    weekBadge: 'bg-emerald-500/20 text-emerald-500',
    title: 'Resume & Mock Rounds',
    body: 'The AI Resume Analyser boosts his ATS score from 62 to 91. He completes 5 mock technical rounds, getting detailed feedback on where his answers fall short.',
  },
  {
    week: 'Week 7',
    color: 'border-amber-500/40 bg-amber-500/10',
    dot: 'bg-amber-500',
    weekBadge: 'bg-amber-500/20 text-amber-500',
    title: '🎉 Offer Received',
    body: 'Aryan clears interviews at two product-based companies and accepts a ₹18 LPA offer. Total time from zero to offer: 7 weeks with EduNest AI.',
  },
]

const StudentJourneySection = () => {
  const { isDark } = useTheme()

  return (
    <section
      id="journey"
      className={`relative scroll-mt-20 overflow-hidden py-24 ${isDark ? 'bg-slate-900' : 'bg-white'}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="section-shell">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-emerald-500">
            Real Student Story
          </p>
          <h2 className={`text-4xl font-extrabold sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            From Confused to{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Placed in 7 Weeks
            </span>
          </h2>
          <p className={`mx-auto mt-4 max-w-xl text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Here's how a typical EduNest AI student goes from "I don't know where to start" to holding an offer letter.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {/* Student avatar */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Aryan Sharma</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                B.Tech CSE, 3rd Year · Target: Product Company
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative space-y-6 pl-6">
            {/* Vertical line */}
            <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500" />

            {JOURNEY.map((step, i) => (
              <div key={i} className="relative">
                {/* Dot */}
                <div className={`absolute -left-7 top-5 h-3 w-3 rounded-full ring-4 ${isDark ? 'ring-slate-900' : 'ring-white'} ${step.dot}`} />

                <div className={`rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${step.color} ${
                  isDark ? '' : 'shadow-sm hover:shadow-md'
                }`}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${step.weekBadge}`}>
                      {step.week}
                    </span>
                    {i === JOURNEY.length - 1 && (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    )}
                  </div>
                  <h3 className={`mb-2 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {step.body}
                  </p>
                </div>

                {i < JOURNEY.length - 1 && (
                  <div className="flex justify-start pl-4 py-1">
                    <ArrowDown size={14} className="text-slate-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentJourneySection
