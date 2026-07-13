/**
 * src/components/resume/ATSScoreRing.jsx
 * Animated SVG ring gauge for ATS score (0-100).
 */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const getScoreConfig = (score) => {
  if (score >= 80) return { color: '#10b981', glow: 'rgba(16,185,129,0.3)', label: 'Excellent',  gradStart: '#10b981', gradEnd: '#059669' }
  if (score >= 65) return { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  label: 'Good',       gradStart: '#f59e0b', gradEnd: '#d97706' }
  if (score >= 50) return { color: '#f97316', glow: 'rgba(249,115,22,0.3)',  label: 'Fair',       gradStart: '#f97316', gradEnd: '#ea580c' }
  return           { color: '#ef4444', glow: 'rgba(239,68,68,0.3)',   label: 'Needs Work', gradStart: '#ef4444', gradEnd: '#dc2626' }
}

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const BREAKDOWN_LABELS = {
  keywords:   'Keywords',
  formatting: 'Formatting',
  experience: 'Experience',
  education:  'Education',
  skills:     'Skills',
  impact:     'Impact',
}

const ATSScoreRing = ({ score, scoreBreakdown }) => {
  const [animated, setAnimated] = useState(0)
  const cfg = getScoreConfig(score)
  const offset = CIRCUMFERENCE * (1 - animated / 100)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 120)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row">
      {/* Ring */}
      <div className="relative flex shrink-0 items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 120 120" className="-rotate-90">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={cfg.gradStart} />
              <stop offset="100%" stopColor={cfg.gradEnd} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            filter="url(#glow)"
          />
        </svg>
        {/* Centre text */}
        <div className="absolute flex flex-col items-center">
          <motion.span
            className="text-4xl font-black text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {score}
          </motion.span>
          <span className="text-xs font-bold text-slate-500">/ 100</span>
          <span className="mt-0.5 text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 space-y-3 w-full">
        {Object.entries(scoreBreakdown || {}).map(([key, val]) => {
          const barCfg = getScoreConfig(val)
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-semibold text-slate-500 text-right">
                {BREAKDOWN_LABELS[key] || key}
              </span>
              <div className="flex-1 h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${barCfg.gradStart}, ${barCfg.gradEnd})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                />
              </div>
              <span className="w-8 shrink-0 text-xs font-bold tabular-nums" style={{ color: barCfg.color }}>
                {val}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ATSScoreRing
