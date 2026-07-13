/**
 * src/components/roadmap/TopicItem.jsx
 * Single topic row inside a phase card.
 * Features: checkbox, expand/collapse subtopics + practice task, estimated hours badge.
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, Circle, Clock, Zap, Wrench } from 'lucide-react'

const DIFFICULTY_STYLES = {
  Beginner:     'bg-emerald-500/15 text-emerald-400',
  Intermediate: 'bg-amber-500/15 text-amber-400',
  Advanced:     'bg-rose-500/15 text-rose-400',
}

const TopicItem = ({ topic, isCompleted, onToggle, accentColor }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`rounded-2xl border transition-all duration-200 ${
      isCompleted
        ? 'border-emerald-500/20 bg-emerald-500/5'
        : 'border-white/5 bg-white/5 hover:border-white/10'
    }`}>
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(topic.id)}
          className="shrink-0 transition-transform duration-150 hover:scale-110"
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted
            ? <CheckCircle2 size={20} className="text-emerald-400" />
            : <Circle size={20} className="text-slate-600 hover:text-slate-400" />
          }
        </button>

        {/* Topic name */}
        <span className={`flex-1 text-sm font-semibold transition-colors ${
          isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'
        }`}>
          {topic.name}
        </span>

        {/* Meta badges */}
        <div className="flex shrink-0 items-center gap-2">
          <span className={`hidden rounded-lg px-2 py-0.5 text-xs font-medium sm:block ${
            DIFFICULTY_STYLES[topic.difficulty] || DIFFICULTY_STYLES.Intermediate
          }`}>
            {topic.difficulty}
          </span>

          <span className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-0.5 text-xs text-slate-500">
            <Clock size={10} /> {topic.estimatedHours}h
          </span>

          {/* Expand toggle */}
          {(topic.subtopics?.length > 0 || topic.practiceTask) && (
            <button
              onClick={() => setExpanded(p => !p)}
              className="rounded-full p-1 text-slate-500 transition-all hover:bg-white/10 hover:text-slate-300"
            >
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.div>
            </button>
          )}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-3">
              {/* Subtopics */}
              {topic.subtopics?.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Zap size={10} /> Subtopics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topic.subtopics.map((sub, i) => (
                      <span key={i} className="rounded-xl border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-400">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice task */}
              {topic.practiceTask && (
                <div className={`flex gap-2 rounded-xl border px-3 py-2.5 ${
                  isCompleted
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-amber-500/15 bg-amber-500/5'
                }`}>
                  <Wrench size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-amber-400 mb-0.5">Practice Task</p>
                    <p className="text-xs leading-relaxed text-slate-400">{topic.practiceTask}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TopicItem
