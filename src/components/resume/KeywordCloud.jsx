/**
 * src/components/resume/KeywordCloud.jsx
 * Two panels: Found keywords with frequency bars + Missing critical keywords.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { Hash, AlertTriangle } from 'lucide-react'

const IMPORTANCE_STYLES = {
  critical: { bar: 'bg-rose-500',    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20',    dot: 'bg-rose-500'    },
  high:     { bar: 'bg-amber-500',   badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20',   dot: 'bg-amber-500'   },
  medium:   { bar: 'bg-blue-500',    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20',     dot: 'bg-blue-500'    },
}

const KeywordCloud = ({ keywordAnalysis = {} }) => {
  const found   = keywordAnalysis.found   || []
  const missing = keywordAnalysis.missing || []
  const maxFreq = Math.max(...found.map(k => k.frequency), 1)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Found keywords */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300">
          <Hash size={16} className="text-blue-400" />
          Keywords Found
          <span className="ml-auto text-xs text-slate-600">{found.length} detected</span>
        </p>
        <div className="space-y-3">
          {found.map((kw, i) => {
            const cfg = IMPORTANCE_STYLES[kw.importance] || IMPORTANCE_STYLES.medium
            return (
              <motion.div key={kw.keyword}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                <span className="w-28 shrink-0 truncate text-sm text-slate-300">{kw.keyword}</span>
                <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={`h-full rounded-full ${cfg.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(kw.frequency / maxFreq) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-xs font-bold text-slate-500 tabular-nums">
                  ×{kw.frequency}
                </span>
                <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                  {kw.importance}
                </span>
              </motion.div>
            )
          })}
          {found.length === 0 && <p className="text-sm text-slate-600">No keywords detected</p>}
        </div>
      </div>

      {/* Missing keywords */}
      <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-amber-400">
          <AlertTriangle size={16} />
          Critical Missing Keywords
          <span className="ml-auto text-xs text-amber-600">{missing.length} gaps</span>
        </p>
        <div className="space-y-3">
          {missing.map((kw, i) => {
            const cfg = IMPORTANCE_STYLES[kw.importance] || IMPORTANCE_STYLES.medium
            return (
              <motion.div key={kw.keyword}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-white/5 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-200">{kw.keyword}</span>
                  <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                    {kw.importance}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{kw.reason}</p>
              </motion.div>
            )
          })}
          {missing.length === 0 && <p className="text-sm text-slate-600">No critical gaps found!</p>}
        </div>
      </div>
    </div>
  )
}

export default KeywordCloud
