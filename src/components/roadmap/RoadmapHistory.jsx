import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, ChevronRight, Trash2, Clock, Target } from 'lucide-react'

const RoadmapHistory = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={16} className="text-violet-400" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-violet-400">
            History
          </h3>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 transition hover:border-rose-500/40 hover:text-rose-400"
        >
          <Trash2 size={11} /> Clear
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {history.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(item)}
              className="group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left transition hover:border-violet-500/30 hover:bg-violet-500/10"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white group-hover:text-violet-300">
                  {item.roadmap.title}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Target size={10} />
                    {item.goal.slice(0, 30)}{item.goal.length > 30 ? '…' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="ml-2 shrink-0 text-slate-600 group-hover:text-violet-400 transition" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default RoadmapHistory
