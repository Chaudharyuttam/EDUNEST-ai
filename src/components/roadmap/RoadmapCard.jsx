import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, BookOpen, Lightbulb, Target, Clock, ExternalLink } from 'lucide-react'

// Color palette map — maps color names from AI to Tailwind classes
const COLOR_MAP = {
  blue:    { bg: 'from-blue-500/20 to-blue-600/10',    border: 'border-blue-500/30',    badge: 'bg-blue-500/20 text-blue-300',    dot: 'bg-blue-500',    icon: 'text-blue-400',    num: 'from-blue-500 to-blue-700'   },
  violet:  { bg: 'from-violet-500/20 to-violet-600/10',border: 'border-violet-500/30',  badge: 'bg-violet-500/20 text-violet-300',dot: 'bg-violet-500',  icon: 'text-violet-400',  num: 'from-violet-500 to-violet-700' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10',border:'border-emerald-500/30',badge: 'bg-emerald-500/20 text-emerald-300',dot:'bg-emerald-500', icon: 'text-emerald-400', num: 'from-emerald-500 to-emerald-700'},
  amber:   { bg: 'from-amber-500/20 to-amber-600/10',  border: 'border-amber-500/30',   badge: 'bg-amber-500/20 text-amber-300',   dot: 'bg-amber-500',   icon: 'text-amber-400',   num: 'from-amber-500 to-amber-700'   },
  rose:    { bg: 'from-rose-500/20 to-rose-600/10',    border: 'border-rose-500/30',    badge: 'bg-rose-500/20 text-rose-300',    dot: 'bg-rose-500',    icon: 'text-rose-400',    num: 'from-rose-500 to-rose-700'     },
  cyan:    { bg: 'from-cyan-500/20 to-cyan-600/10',    border: 'border-cyan-500/30',    badge: 'bg-cyan-500/20 text-cyan-300',    dot: 'bg-cyan-500',    icon: 'text-cyan-400',    num: 'from-cyan-500 to-cyan-700'     },
  fuchsia: { bg: 'from-fuchsia-500/20 to-fuchsia-600/10',border:'border-fuchsia-500/30',badge:'bg-fuchsia-500/20 text-fuchsia-300',dot:'bg-fuchsia-500',icon:'text-fuchsia-400',    num: 'from-fuchsia-500 to-fuchsia-700'},
}

const RESOURCE_TYPE_STYLES = {
  Video:    'bg-red-500/15 text-red-300',
  Article:  'bg-sky-500/15 text-sky-300',
  Book:     'bg-amber-500/15 text-amber-300',
  Practice: 'bg-emerald-500/15 text-emerald-300',
  Course:   'bg-violet-500/15 text-violet-300',
}

const RoadmapCard = ({ phase, index }) => {
  const colors = COLOR_MAP[phase.color] || COLOR_MAP.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${colors.bg} ${colors.border} p-6 backdrop-blur-sm`}
    >
      {/* Phase number badge */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.num} shadow-lg text-xl`}>
            {phase.emoji}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Phase {phase.phaseNumber}
            </p>
            <h3 className="text-lg font-bold text-white leading-tight">{phase.title}</h3>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
          <Clock size={10} className="mr-1 inline" />{phase.duration}
        </span>
      </div>

      {/* Focus line */}
      <p className="mb-4 text-sm font-medium text-slate-300 leading-relaxed">{phase.focus}</p>

      {/* Topics */}
      <div className="mb-4">
        <p className={`mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${colors.icon}`}>
          <BookOpen size={12} /> Topics
        </p>
        <div className="flex flex-wrap gap-2">
          {phase.topics?.map((topic, i) => (
            <span key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Daily plan */}
      {phase.dailyPlan && (
        <div className="mb-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Daily Plan</p>
          <p className="text-sm text-slate-300">{phase.dailyPlan}</p>
        </div>
      )}

      {/* Resources */}
      {phase.resources?.length > 0 && (
        <div className="mb-4">
          <p className={`mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${colors.icon}`}>
            <ExternalLink size={12} /> Resources
          </p>
          <div className="flex flex-wrap gap-2">
            {phase.resources.map((res, i) => (
              <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-medium ${RESOURCE_TYPE_STYLES[res.type] || RESOURCE_TYPE_STYLES.Article}`}>
                {res.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Milestone */}
      <div className={`mb-4 flex gap-2 rounded-2xl border px-4 py-3 ${colors.border} bg-white/5`}>
        <Target size={16} className={`mt-0.5 shrink-0 ${colors.icon}`} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">Milestone</p>
          <p className="text-sm font-semibold text-white">{phase.milestone}</p>
        </div>
      </div>

      {/* Tip */}
      {phase.tips && (
        <div className="flex gap-2 rounded-2xl bg-white/5 px-4 py-3">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-xs text-slate-400">{phase.tips}</p>
        </div>
      )}

      {/* Completion checkbox visual */}
      <div className="mt-4 flex justify-end">
        <button className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition hover:bg-white/10 ${colors.border} ${colors.icon}`}>
          <CheckCircle2 size={14} /> Mark complete
        </button>
      </div>
    </motion.div>
  )
}

export default RoadmapCard
