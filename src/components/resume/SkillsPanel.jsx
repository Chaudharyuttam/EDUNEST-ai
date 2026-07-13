/**
 * src/components/resume/SkillsPanel.jsx
 * Two-column grid: Matching Skills (green) + Missing Skills (red/amber).
 */
import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Plus } from 'lucide-react'

const chip = (text, i, type) => (
  <motion.span
    key={text}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: i * 0.04, duration: 0.25 }}
    className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-sm font-medium ${
      type === 'match'
        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
        : 'border-rose-500/25 bg-rose-500/10 text-rose-300'
    }`}
  >
    {type === 'match'
      ? <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
      : <XCircle size={12} className="shrink-0 text-rose-400" />
    }
    {text}
  </motion.span>
)

const SkillsPanel = ({ matchingSkills = [], missingSkills = [] }) => (
  <div className="grid gap-6 sm:grid-cols-2">
    {/* Matching */}
    <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-400">
        <CheckCircle2 size={16} />
        Matching Skills
        <span className="ml-auto rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs">{matchingSkills.length}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {matchingSkills.length > 0
          ? matchingSkills.map((s, i) => chip(s, i, 'match'))
          : <p className="text-xs text-slate-600">No skills detected</p>
        }
      </div>
    </div>

    {/* Missing */}
    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-400">
        <Plus size={16} className="rotate-45" />
        Missing Skills
        <span className="ml-auto rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs">{missingSkills.length}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {missingSkills.length > 0
          ? missingSkills.map((s, i) => chip(s, i, 'miss'))
          : <p className="text-xs text-slate-600">Great — no critical gaps found!</p>
        }
      </div>
    </div>
  </div>
)

export default SkillsPanel
