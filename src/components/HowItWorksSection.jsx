/**
 * HowItWorksSection.jsx
 * "How EduNest AI Works" — 3-step numbered process showing the student journey
 * from sign-up to placement. Placed between Hero and Features.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../utils/themeContext'
import { ClipboardList, Sparkles, Briefcase, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: ClipboardList,
    color: 'from-blue-500 to-blue-700',
    glow: 'shadow-blue-500/30',
    title: 'Tell Us Your Goal',
    description:
      'Enter your target role, current skills, and time available. Our AI analyses your profile in seconds and identifies your exact gaps.',
  },
  {
    number: '02',
    icon: Sparkles,
    color: 'from-violet-500 to-violet-700',
    glow: 'shadow-violet-500/30',
    title: 'Get a Personalised Roadmap',
    description:
      'Receive a week-by-week study plan, curated resources, daily goals, and mock interview prep — all tailored to your specific situation.',
  },
  {
    number: '03',
    icon: Briefcase,
    color: 'from-emerald-500 to-emerald-700',
    glow: 'shadow-emerald-500/30',
    title: 'Land the Offer',
    description:
      'Practice with the AI mentor, get your resume scored, and track your progress until you walk into your dream company fully prepared.',
  },
]

const HowItWorksSection = () => {
  const { isDark } = useTheme()

  return (
    <section
      id="how-it-works"
      className={`relative scroll-mt-20 overflow-hidden py-24 ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      {/* Subtle top border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="section-shell">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-500">
            Simple. Structured. Effective.
          </p>
          <h2 className={`text-4xl font-extrabold sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How EduNest AI Works
          </h2>
          <p className={`mx-auto mt-4 max-w-xl text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Three steps from where you are now to where you want to be.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30 md:block" />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`relative rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-2 ${
                  isDark
                    ? 'border-white/10 bg-slate-800/60 hover:border-white/20'
                    : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:shadow-xl'
                }`}
              >
                {/* Step number */}
                <div className="mb-5 flex items-center gap-3">
                  <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg ${step.glow}`}>
                    <Icon size={22} className="text-white" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[10px] font-black text-white ring-2 ring-white/10">
                      {i + 1}
                    </span>
                  </div>
                  <span className={`text-6xl font-black leading-none ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>
                    {step.number}
                  </span>
                </div>

                <h3 className={`mb-3 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.description}
                </p>

                {/* Arrow between steps */}
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="absolute -right-4 top-10 z-10 hidden text-slate-400 md:block"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <Sparkles size={16} /> Start Your Journey Free
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
