/**
 * src/components/resume/WeakSectionsPanel.jsx
 * List of weak resume sections with severity color-coding.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info, Wrench } from 'lucide-react'

const SEVERITY = {
  high:   { icon: AlertCircle,   border: 'border-rose-500/25',   bg: 'bg-rose-500/8',   badge: 'bg-rose-500/20 text-rose-300',   dot: 'bg-rose-500'   },
  medium: { icon: AlertTriangle, border: 'border-amber-500/25',  bg: 'bg-amber-500/8',  badge: 'bg-amber-500/20 text-amber-300', dot: 'bg-amber-500'  },
  low:    { icon: Info,          border: 'border-blue-500/25',   bg: 'bg-blue-500/8',   badge: 'bg-blue-500/20 text-blue-300',   dot: 'bg-blue-500'   },
}

const WeakSectionsPanel = ({ weakSections = [] }) => {
  const sorted = [...weakSections].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
  })

  return (
    <div className="space-y-3">
      {sorted.map((sec, i) => {
        const cfg = SEVERITY[sec.severity] || SEVERITY.low
        const Icon = cfg.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-5`}
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon size={16} className={`shrink-0 ${sec.severity === 'high' ? 'text-rose-400' : sec.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'}`} />
                <span className="font-bold text-white">{sec.section}</span>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.badge}`}>
                {sec.severity}
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-slate-400">{sec.issue}</p>
            <div className="flex gap-2 rounded-2xl bg-white/5 px-3 py-2.5">
              <Wrench size={13} className="mt-0.5 shrink-0 text-emerald-400" />
              <p className="text-xs text-slate-400"><span className="font-semibold text-emerald-400">Fix: </span>{sec.fix}</p>
            </div>
          </motion.div>
        )
      })}
      {weakSections.length === 0 && (
        <p className="rounded-3xl border border-white/5 bg-white/5 p-6 text-center text-sm text-slate-600">
          No major weak sections detected 🎉
        </p>
      )}
    </div>
  )
}

export default WeakSectionsPanel
