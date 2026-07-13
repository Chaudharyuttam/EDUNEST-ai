/**
 * src/components/roadmap/PhaseCard.jsx
 * Phase card in the vertical timeline.
 * Features: expand/collapse topics, phase progress bar, difficulty badge,
 *           prerequisites, learning objectives, expected outcome.
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Target, ListChecks, GitBranch, Award } from 'lucide-react'
import TopicItem from './TopicItem'

const COLOR_MAP = {
  0: { gradient: 'from-blue-600 to-blue-800',    ring: 'ring-blue-500/30',   bar: 'bg-blue-500',    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
  1: { gradient: 'from-violet-600 to-violet-800', ring: 'ring-violet-500/30', bar: 'bg-violet-500',  badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20' },
  2: { gradient: 'from-emerald-600 to-emerald-800',ring:'ring-emerald-500/30',bar: 'bg-emerald-500', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
  3: { gradient: 'from-amber-600 to-amber-800',   ring: 'ring-amber-500/30',  bar: 'bg-amber-500',   badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20' },
  4: { gradient: 'from-rose-600 to-rose-800',     ring: 'ring-rose-500/30',   bar: 'bg-rose-500',    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20' },
  5: { gradient: 'from-cyan-600 to-cyan-800',     ring: 'ring-cyan-500/30',   bar: 'bg-cyan-500',    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20' },
}

const DIFFICULTY_COLORS = {
  Beginner:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Advanced:     'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

const PhaseCard = ({ phase, index, completedTopics, onToggleTopic, isLast }) => {
  const [open, setOpen] = useState(index === 0) // first phase open by default
  const colors = COLOR_MAP[index % 6]

  const totalTopics = phase.topics?.length || 0
  const doneTopics = phase.topics?.filter(t => completedTopics.has(t.id)).length || 0
  const phasePct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0
  const phaseComplete = phasePct === 100

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* ── Timeline stem + dot ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center">
        {/* Phase dot */}
        <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-lg ring-4 ${colors.ring} transition-all duration-300`}>
          <span className="text-xl leading-none">{phase.emoji}</span>
          {phaseComplete && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white ring-2 ring-slate-950">
              ✓
            </div>
          )}
        </div>

        {/* Vertical line to next phase */}
        {!isLast && (
          <div className="mt-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
        )}
      </div>

      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div className={`mb-8 flex-1 overflow-hidden rounded-3xl border transition-all duration-300 ${
        phaseComplete
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : 'border-white/10 bg-slate-900/60 hover:border-white/15'
      }`}>

        {/* Card header */}
        <button
          onClick={() => setOpen(p => !p)}
          className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
        >
          <div className="min-w-0 flex-1">
            {/* Phase label + duration */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${colors.badge}`}>
                Phase {phase.phaseNumber}
              </span>
              <span className="text-xs text-slate-500">{phase.durationDays} days</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[phase.difficulty]}`}>
                {phase.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{phase.title}</h3>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${colors.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${phasePct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-bold text-slate-500 tabular-nums">{doneTopics}/{totalTopics}</span>
            </div>
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="mt-1 shrink-0">
            <ChevronDown size={18} className="text-slate-500" />
          </motion.div>
        </button>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5 px-5 pb-6 pt-4 sm:px-6 space-y-5">

                {/* Prerequisites */}
                {phase.prerequisites?.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <GitBranch size={11} /> Prerequisites
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.prerequisites.map((p, i) => (
                        <span key={i} className="rounded-xl border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-400">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Objectives */}
                {phase.learningObjectives?.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <ListChecks size={11} /> Learning Objectives
                    </p>
                    <ul className="space-y-1.5">
                      {phase.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${colors.bar}`} />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Topics list */}
                {phase.topics?.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                      Topics ({phase.topics.length})
                    </p>
                    <div className="space-y-2">
                      {phase.topics.map((topic) => (
                        <TopicItem
                          key={topic.id}
                          topic={topic}
                          isCompleted={completedTopics.has(topic.id)}
                          onToggle={onToggleTopic}
                          accentColor={colors.bar}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected Outcome */}
                {phase.expectedOutcome && (
                  <div className={`flex gap-3 rounded-2xl border px-4 py-3 ${colors.badge.replace('text-', 'border-').split(' ')[1]?.replace('border', 'border')}`}
                    style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <Award size={16} className={`mt-0.5 shrink-0 ${colors.badge.split(' ')[1]}`} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Expected Outcome</p>
                      <p className="text-sm font-semibold text-slate-300">{phase.expectedOutcome}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PhaseCard
