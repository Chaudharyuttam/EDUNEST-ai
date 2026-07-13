import React, { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Target, Brain, Clock, Calendar,
  AlertCircle, ChevronRight, Layers, RotateCcw, TrendingUp,
} from 'lucide-react'
import PhaseCard from '../components/roadmap/PhaseCard'
import ProgressPanel from '../components/roadmap/ProgressPanel'
import { generateRoadmap } from '../services/roadmapService'

// ── LocalStorage keys ─────────────────────────────────────────────────────────
const ROADMAP_KEY  = 'edunest_active_roadmap'
const PROGRESS_KEY = 'edunest_roadmap_progress'

const loadSaved = () => {
  try {
    const roadmap = JSON.parse(localStorage.getItem(ROADMAP_KEY) || 'null')
    const progress = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]'))
    return { roadmap, progress }
  } catch {
    return { roadmap: null, progress: new Set() }
  }
}

const persist = (roadmap, progress) => {
  localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmap))
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...progress]))
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const TARGET_OPTIONS = [
  { days: 30, label: '30 Days', sub: 'Intensive Sprint' },
  { days: 60, label: '60 Days', sub: 'Balanced Pace' },
  { days: 90, label: '90 Days', sub: 'Thorough Prep' },
]
const CAREER_SUGGESTIONS = [
  'MERN Stack Developer',
  'Frontend Developer',
  'Backend Developer (Node.js)',
  'Data Analyst',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Android Developer',
  'Full Stack Developer',
]
const HOUR_OPTIONS = [1, 2, 3, 4, 5, 6, 8]

// ── Skeleton loader ───────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="rounded-3xl border border-white/5 bg-slate-900/40 p-6">
        <div className="flex gap-4">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-800" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-800" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-800" />
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-800" />
          </div>
        </div>
      </div>
    ))}
    <p className="text-center text-sm text-slate-600 animate-pulse">
      ✨ AI is building your personalised roadmap…
    </p>
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────
const RoadmapGenerator = () => {
  const saved = loadSaved()
  const [roadmap, setRoadmap]           = useState(saved.roadmap)
  const [completedTopics, setCompleted] = useState(saved.progress)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState('')
  const [selectedDays, setSelectedDays] = useState(60)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { skillLevel: 'Beginner', dailyHours: 2 },
  })

  // Persist whenever roadmap or progress changes
  useEffect(() => {
    if (roadmap) persist(roadmap, completedTopics)
  }, [roadmap, completedTopics])

  // ── Toggle a topic checkbox ─────────────────────────────────────────────────
  const handleToggleTopic = useCallback((topicId) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(topicId) ? next.delete(topicId) : next.add(topicId)
      return next
    })
  }, [])

  // ── Form submit ─────────────────────────────────────────────────────────────
  const onSubmit = useCallback(async (data) => {
    setIsLoading(true)
    setError('')
    setRoadmap(null)
    setCompleted(new Set())
    localStorage.removeItem(ROADMAP_KEY)
    localStorage.removeItem(PROGRESS_KEY)

    try {
      const result = await generateRoadmap({
        careerGoal: data.careerGoal,
        skillLevel: data.skillLevel,
        dailyHours: Number(data.dailyHours),
        targetDays: selectedDays,
      })
      setRoadmap(result)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedDays])

  const handleReset = () => {
    setRoadmap(null)
    setCompleted(new Set())
    localStorage.removeItem(ROADMAP_KEY)
    localStorage.removeItem(PROGRESS_KEY)
    setError('')
  }

  const overallPct = roadmap
    ? Math.round((completedTopics.size / (roadmap.totalTopics || 1)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -left-16 -top-16 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
        </div>
        <div className="section-shell relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-semibold text-violet-300">
              <Sparkles size={14} /> AI Roadmap Generator
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Your Personalised{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Tell us your goal and we'll build a structured, phase-by-phase study plan — with topics, objectives, practice tasks, and progress tracking.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-shell mt-10">
        {/* ── If no roadmap yet: show form ─────────────────────────────── */}
        {!roadmap && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl"
          >
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-7 backdrop-blur-sm sm:p-9">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">
                  <Brain size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Build My Roadmap</h2>
                  <p className="text-sm text-slate-500">AI generates your personalised study plan</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Career Goal */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <Target size={14} className="text-blue-400" /> Career Goal
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MERN Stack Developer, Data Analyst, Frontend Developer"
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                    {...register('careerGoal', {
                      required: 'Enter your target career goal',
                      minLength: { value: 3, message: 'Must be at least 3 characters' },
                    })}
                  />
                  {errors.careerGoal && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400"><AlertCircle size={12}/>{errors.careerGoal.message}</p>}

                  {/* Suggestion chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {CAREER_SUGGESTIONS.map(s => (
                      <button
                        key={s} type="button"
                        onClick={() => setValue('careerGoal', s, { shouldValidate: true })}
                        className="rounded-xl border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-500 transition hover:border-blue-500/40 hover:text-blue-400"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill Level + Daily Hours */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <Layers size={14} className="text-violet-400" /> Current Skill Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {SKILL_LEVELS.map(level => {
                        const watched = watch('skillLevel')
                        return (
                          <button
                            key={level} type="button"
                            onClick={() => setValue('skillLevel', level)}
                            className={`rounded-2xl border py-2.5 text-sm font-semibold transition-all ${
                              watched === level
                                ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                                : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
                            }`}
                          >
                            {level}
                          </button>
                        )
                      })}
                    </div>
                    <input type="hidden" {...register('skillLevel')} />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <Clock size={14} className="text-emerald-400" /> Daily Study Hours
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {HOUR_OPTIONS.map(h => {
                        const watched = Number(watch('dailyHours'))
                        return (
                          <button
                            key={h} type="button"
                            onClick={() => setValue('dailyHours', h)}
                            className={`rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
                              watched === h
                                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                                : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
                            }`}
                          >
                            {h}h
                          </button>
                        )
                      })}
                    </div>
                    <input type="hidden" {...register('dailyHours')} />
                  </div>
                </div>

                {/* Target Duration */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <Calendar size={14} className="text-amber-400" /> Target Completion Time
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TARGET_OPTIONS.map(opt => (
                      <button
                        key={opt.days} type="button"
                        onClick={() => setSelectedDays(opt.days)}
                        className={`rounded-2xl border py-3 text-center transition-all ${
                          selectedDays === opt.days
                            ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                            : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
                        }`}
                      >
                        <p className="text-base font-black">{opt.label}</p>
                        <p className="text-xs opacity-60">{opt.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                      <AlertCircle size={16} className="shrink-0" /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  <Sparkles size={17} /> Generate My Roadmap
                  <ChevronRight size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── Loading skeleton ──────────────────────────────────────────── */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl">
            <Skeleton />
          </motion.div>
        )}

        {/* ── Roadmap output ────────────────────────────────────────────── */}
        <AnimatePresence>
          {roadmap && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid gap-8 lg:grid-cols-[1fr_340px]"
            >
              {/* ── Left: Timeline ────────────────────────────────────── */}
              <div>
                {/* Roadmap header */}
                <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-0.5 text-xs font-bold text-violet-400">
                          {roadmap.skillLevel}
                        </span>
                        <span className="text-xs text-slate-600">{roadmap.totalDays} days · {roadmap.dailyHours}h/day</span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-white">{roadmap.title}</h2>
                      <p className="mt-1 text-sm text-slate-400">{roadmap.tagline}</p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-white/20 hover:text-white"
                    >
                      <RotateCcw size={13} /> New Roadmap
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">{roadmap.summary}</p>

                  {/* Overall progress bar */}
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1"><TrendingUp size={11}/> Overall Progress</span>
                      <span className="font-bold text-white">{overallPct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${overallPct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {completedTopics.size} of {roadmap.totalTopics} topics completed
                    </p>
                  </div>
                </div>

                {/* Vertical timeline */}
                <div>
                  {roadmap.phases?.map((phase, i) => (
                    <PhaseCard
                      key={phase.phaseNumber}
                      phase={phase}
                      index={i}
                      completedTopics={completedTopics}
                      onToggleTopic={handleToggleTopic}
                      isLast={i === roadmap.phases.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* ── Right: Progress panel (sticky) ────────────────────── */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ProgressPanel
                  roadmap={roadmap}
                  completedTopics={completedTopics}
                  onReset={handleReset}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RoadmapGenerator
