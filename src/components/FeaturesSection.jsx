/**
 * FeaturesSection.jsx — Refactored for placement prep focus.
 * Showcases 6 real AI features directly tied to cracking placements.
 */
import React from 'react'
import { useTheme } from '../utils/themeContext'
import {
  Map, Bot, FileText, Mic, BarChart3, BookOpen,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Map,
    color: 'from-blue-500 to-blue-700',
    glow: 'shadow-blue-500/20',
    badge: 'bg-blue-500/15 text-blue-400',
    tag: 'Roadmap AI',
    title: 'Personalised Study Roadmap',
    description:
      'Input your goal, skills, and timeline. Get a phased week-by-week plan with curated resources, daily goals, and milestones — generated in seconds.',
    href: '/roadmap',
    cta: 'Generate Roadmap →',
  },
  {
    icon: Bot,
    color: 'from-violet-500 to-violet-700',
    glow: 'shadow-violet-500/20',
    badge: 'bg-violet-500/15 text-violet-400',
    tag: 'AI Mentor',
    title: '24/7 AI Learning Mentor',
    description:
      'Ask anything — DSA concepts, system design, HR questions. Get clear, example-driven explanations adapted to your current level, at any hour.',
    href: '/chat',
    cta: 'Chat with Mentor →',
  },
  {
    icon: FileText,
    color: 'from-emerald-500 to-emerald-700',
    glow: 'shadow-emerald-500/20',
    badge: 'bg-emerald-500/15 text-emerald-400',
    tag: 'Coming Soon',
    title: 'AI Resume Analyser',
    description:
      'Upload your resume and get an instant ATS score, keyword analysis, and line-by-line improvement suggestions tailored to your target role.',
    href: '#',
    cta: 'Analyse Resume →',
  },
  {
    icon: Mic,
    color: 'from-rose-500 to-rose-700',
    glow: 'shadow-rose-500/20',
    badge: 'bg-rose-500/15 text-rose-400',
    tag: 'Coming Soon',
    title: 'Mock AI Interviews',
    description:
      'Practice technical and HR rounds with an AI interviewer that gives real-time feedback on your answers, communication, and confidence level.',
    href: '#',
    cta: 'Start Mock Interview →',
  },
  {
    icon: BarChart3,
    color: 'from-amber-500 to-amber-700',
    glow: 'shadow-amber-500/20',
    badge: 'bg-amber-500/15 text-amber-400',
    tag: 'Coming Soon',
    title: 'Progress Dashboard',
    description:
      'Track your daily streaks, topic completion, weak areas, and interview readiness score — all in one clean, visual dashboard.',
    href: '#',
    cta: 'View Dashboard →',
  },
  {
    icon: BookOpen,
    color: 'from-cyan-500 to-cyan-700',
    glow: 'shadow-cyan-500/20',
    badge: 'bg-cyan-500/15 text-cyan-400',
    tag: 'Resources',
    title: 'Curated Problem Sets',
    description:
      'Topic-wise DSA sheets, company-specific questions, system design case studies, and aptitude tests — all hand-picked and AI-sorted by difficulty.',
    href: '/chat',
    cta: 'Explore Resources →',
  },
]

const FeatureCard = ({ feature }) => {
  const { isDark } = useTheme()
  const Icon = feature.icon
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
      isDark
        ? 'border-white/10 bg-slate-900/60 hover:border-white/20'
        : 'border-slate-200 bg-white hover:border-blue-300'
    }`}>
      {/* Tag */}
      <span className={`mb-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${feature.badge}`}>
        {feature.tag}
      </span>

      {/* Icon */}
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg ${feature.glow}`}>
        <Icon size={20} className="text-white" />
      </div>

      <h3 className={`mb-2 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {feature.title}
      </h3>
      <p className={`flex-1 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {feature.description}
      </p>

      <a
        href={feature.href}
        className={`mt-5 text-sm font-bold transition-colors duration-200 ${
          isDark ? 'text-blue-400 hover:text-violet-400' : 'text-blue-600 hover:text-violet-700'
        }`}
      >
        {feature.cta}
      </a>

      {/* Hover glow */}
      <div className={`pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-5 bg-gradient-to-br ${feature.color}`} />
    </div>
  )
}

const FeaturesSection = () => {
  const { isDark } = useTheme()

  return (
    <section
      id="features"
      className={`relative overflow-hidden py-24 ${
        isDark
          ? 'bg-slate-950'
          : 'bg-[linear-gradient(135deg,_#f9fbff_0%,_#f4f7ff_100%)]'
      }`}
    >
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="section-shell relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-500">
            Everything You Need to Crack Placements
          </p>
          <h2 className={`text-4xl font-extrabold sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI Features Built for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Placement Success
            </span>
          </h2>
          <p className={`mx-auto mt-5 max-w-2xl text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            From building your roadmap to acing your final round — every tool you need, powered by AI.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
