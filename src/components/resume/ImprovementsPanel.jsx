/**
 * src/components/resume/ImprovementsPanel.jsx
 * Numbered improvement suggestions with priority and before/after examples.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ChevronRight } from 'lucide-react'

const PRIORITY = {
  high:   { badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20',   num: 'from-rose-500 to-rose-700'   },
  medium: { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20', num: 'from-amber-500 to-amber-700' },
  low:    { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20',    num: 'from-blue-500 to-blue-700'   },
}

const ImprovementsPanel = ({ improvements = [] }) => {
  const sorted = [...improvements].sort((a, b) => {
    const o = { high: 0, medium: 1, low: 2 }
    return (o[a.priority] ?? 3) - (o[b.priority] ?? 3)
  })

  return (
    <div className="space-y-4">
      {sorted.map((item, i) => {
        const cfg = PRIORITY[item.priority] || PRIORITY.low
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 rounded-3xl border border-white/8 bg-slate-900/40 p-5 transition hover:border-white/15"
          >
            {/* Number circle */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.num} text-sm font-black text-white shadow`}>
              {i + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${cfg.badge}`}>
                  {item.priority} priority
                </span>
                {item.category && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    {item.category}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-200 leading-snug">{item.suggestion}</p>

              {item.example && (
                <div className="mt-2.5 rounded-2xl border border-white/5 bg-white/5 px-3 py-2.5">
                  <p className="text-xs leading-relaxed text-slate-500">
                    <span className="font-bold text-slate-400">Example: </span>
                    {item.example}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
      {improvements.length === 0 && (
        <p className="rounded-3xl border border-white/5 bg-white/5 p-6 text-center text-sm text-slate-600">
          No improvement suggestions available.
        </p>
      )}
    </div>
  )
}

export default ImprovementsPanel
