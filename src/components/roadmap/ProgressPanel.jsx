/**
 * src/components/roadmap/ProgressPanel.jsx
 * Sticky stats panel — shows overall progress, estimated finish date,
 * total / completed / remaining topics, and interview topics.
 */
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, CheckCircle2, Circle, CalendarCheck2, Clock, Flame, BrainCircuit } from 'lucide-react'

const ProgressPanel = ({ roadmap, completedTopics, onReset }) => {
  const stats = useMemo(() => {
    const total     = roadmap.totalTopics || 0
    const completed = completedTopics.size
    const remaining = total - completed
    const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

    // Estimate finish date based on remaining topics + daily hours
    const remainingHours = roadmap.phases
      ?.flatMap(p => p.topics || [])
      .filter(t => !completedTopics.has(t.id))
      .reduce((s, t) => s + (t.estimatedHours || 0), 0) || 0

    const daysLeft = roadmap.dailyHours > 0
      ? Math.ceil(remainingHours / roadmap.dailyHours)
      : 0

    const finishDate = new Date()
    finishDate.setDate(finishDate.getDate() + daysLeft)
    const finishStr = finishDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

    return { total, completed, remaining, pct, daysLeft, finishStr }
  }, [roadmap, completedTopics])

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Overall Progress</h3>
          <span className="text-2xl font-black text-white">{stats.pct}%</span>
        </div>

        {/* Ring-style progress indicator */}
        <div className="mb-4 flex justify-center">
          <div className="relative h-28 w-28">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - stats.pct / 100) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white">{stats.completed}</span>
              <span className="text-xs text-slate-500">of {stats.total}</span>
            </div>
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-emerald-500/10 px-2 py-2">
            <p className="text-lg font-black text-emerald-400">{stats.completed}</p>
            <p className="text-[10px] font-medium text-slate-500">Done</p>
          </div>
          <div className="rounded-2xl bg-amber-500/10 px-2 py-2">
            <p className="text-lg font-black text-amber-400">{stats.remaining}</p>
            <p className="text-[10px] font-medium text-slate-500">Left</p>
          </div>
          <div className="rounded-2xl bg-blue-500/10 px-2 py-2">
            <p className="text-lg font-black text-blue-400">{stats.total}</p>
            <p className="text-[10px] font-medium text-slate-500">Total</p>
          </div>
        </div>
      </div>

      {/* Finish date estimate */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <CalendarCheck2 size={15} className="text-violet-400" />
              Estimated Finish
            </div>
            <span className="text-sm font-bold text-white">{stats.finishStr}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock size={15} className="text-blue-400" />
              Days Remaining
            </div>
            <span className="text-sm font-bold text-white">{stats.daysLeft} days</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Flame size={15} className="text-orange-400" />
              Daily Target
            </div>
            <span className="text-sm font-bold text-white">{roadmap.dailyHours}h / day</span>
          </div>
        </div>
      </div>

      {/* Interview topics */}
      {roadmap.interviewTopics?.length > 0 && (
        <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-400">
            <BrainCircuit size={13} /> High-Priority Interview Topics
          </p>
          <div className="space-y-2">
            {roadmap.interviewTopics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-black text-violet-400">
                  {i + 1}
                </span>
                {topic}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final outcome */}
      {roadmap.finalOutcome && (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Target size={13} /> Your End Goal
          </p>
          <p className="text-sm leading-relaxed text-slate-400">{roadmap.finalOutcome}</p>
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-500 transition hover:border-rose-500/30 hover:text-rose-400"
      >
        Generate New Roadmap
      </button>
    </div>
  )
}

export default ProgressPanel
