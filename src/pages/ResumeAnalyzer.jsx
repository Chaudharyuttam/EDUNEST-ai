import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, Sparkles, AlertCircle, RotateCcw,
  CheckCircle2, X, Eye, Loader2, BrainCircuit,
  Target, Hash, TrendingUp, ChevronRight, User, ScanLine, Cpu,
} from 'lucide-react'
import ATSScoreRing from '../components/resume/ATSScoreRing'
import SkillsPanel from '../components/resume/SkillsPanel'
import KeywordCloud from '../components/resume/KeywordCloud'
import WeakSectionsPanel from '../components/resume/WeakSectionsPanel'
import ImprovementsPanel from '../components/resume/ImprovementsPanel'
import { analyseResume } from '../services/resumeService'
import { extractPdfText } from '../utils/pdfExtractor'

// ── Upload zone ────────────────────────────────────────────────────────────────
const UploadZone = ({ onFile }) => {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }, [onFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`group cursor-pointer rounded-3xl border-2 border-dashed p-14 text-center transition-all duration-300 ${
        dragging
          ? 'border-blue-500/60 bg-blue-500/10 scale-[1.01]'
          : 'border-white/15 bg-white/3 hover:border-blue-500/40 hover:bg-blue-500/5'
      }`}
    >
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]) }} />

      <motion.div animate={{ y: dragging ? -6 : 0 }} transition={{ type: 'spring', stiffness: 200 }}
        className="flex flex-col items-center gap-5">
        <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-2xl shadow-blue-600/20 transition-transform duration-300 ${dragging ? 'scale-110' : 'group-hover:scale-105'}`}>
          <Upload size={32} className="text-white" />
        </div>

        <div>
          <p className="text-xl font-bold text-white">
            {dragging ? 'Drop your PDF here' : 'Upload Your Resume'}
          </p>
          <p className="mt-2 text-sm text-slate-500">Drag & drop or click · PDF only · Max 10MB</p>
        </div>

        {/* Supports both types */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <FileText size={12} /> Text-based PDFs
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-3 py-1.5 text-xs font-medium text-violet-400">
            <ScanLine size={12} /> Scanned / Image PDFs (OCR)
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {['ATS Score', 'Skills Gap', 'Keyword Analysis', 'Improvements'].map(tag => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-500">{tag}</span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── Extraction progress bar ────────────────────────────────────────────────────
const ExtractionProgress = ({ stage, progress }) => {
  const stageLabel = {
    reading:    'Reading file…',
    extracting: 'Extracting text from PDF…',
    ocr:        'Running OCR on scanned pages…',
    done:       'Extraction complete',
  }[stage] || 'Processing…'

  const isOcr = stage === 'ocr'

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          {isOcr
            ? <><Cpu size={15} className="text-violet-400 animate-pulse" /> {stageLabel}</>
            : <><Loader2 size={15} className="text-blue-400 animate-spin" /> {stageLabel}</>
          }
        </div>
        <span className="text-xs font-bold text-slate-500 tabular-nums">{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full ${isOcr ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : 'bg-gradient-to-r from-blue-500 to-emerald-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {isOcr && (
        <p className="mt-2 text-xs text-slate-600">
          This PDF appears to be scanned. Running OCR to extract text — this may take 15–30 seconds.
        </p>
      )}
    </div>
  )
}

// ── Tab config ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'score',       label: 'ATS Score',    icon: Target       },
  { id: 'skills',      label: 'Skills',       icon: CheckCircle2 },
  { id: 'keywords',    label: 'Keywords',     icon: Hash         },
  { id: 'sections',    label: 'Weak Areas',   icon: AlertCircle  },
  { id: 'suggestions', label: 'Improvements', icon: TrendingUp   },
]

// ── Main page ──────────────────────────────────────────────────────────────────
const ResumeAnalyzer = () => {
  const [file, setFile]           = useState(null)
  const [fileUrl, setFileUrl]     = useState(null)
  const [extrStatus, setExtrStatus] = useState(null)  // { stage, progress }
  const [extractedText, setTxt]   = useState('')
  const [extractMethod, setMethod]= useState('')      // 'digital' | 'ocr'
  const [analysing, setAnal]      = useState(false)
  const [analysis, setAnalysis]   = useState(null)
  const [error, setError]         = useState('')
  const [targetRole, setRole]     = useState('')
  const [activeTab, setTab]       = useState('score')
  const [showPreview, setPreview] = useState(false)

  const isExtracting = extrStatus && extrStatus.stage !== 'done'

  const handleFile = useCallback(async (f) => {
    const isPdf = f?.type === 'application/pdf' || f?.name?.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setError('Please select a PDF resume file.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('This PDF is larger than 10 MB. Please upload a smaller file.')
      return
    }

    setFile(f)
    setFileUrl(URL.createObjectURL(f))
    setAnalysis(null)
    setError('')
    setTxt('')
    setMethod('')
    setExtrStatus({ stage: 'reading', progress: 5 })

    try {
      const result = await extractPdfText(f, (status) => setExtrStatus(status))
      setTxt(result.text)
      setMethod(result.method)
    } catch (e) {
      const reason = e instanceof Error ? e.message : ''
      setError(reason || 'Failed to extract text from this PDF. Please try another file.')
      setExtrStatus(null)
    }
  }, [])

  const handleAnalyse = useCallback(async () => {
    if (!extractedText) return
    setAnal(true)
    setError('')
    setAnalysis(null)
    try {
      const result = await analyseResume({ resumeText: extractedText, targetRole })
      setAnalysis(result)
      setTab('score')
    } catch (e) {
      setError(e.message || 'Analysis failed. Please try again.')
    } finally {
      setAnal(false)
    }
  }, [extractedText, targetRole])

  const handleReset = () => {
    setFile(null); setFileUrl(null); setTxt(''); setAnalysis(null)
    setError(''); setRole(''); setExtrStatus(null); setMethod('')
  }

  const scoreColor = analysis
    ? analysis.atsScore >= 80 ? 'text-emerald-400' : analysis.atsScore >= 65 ? 'text-amber-400' : 'text-rose-400'
    : ''

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100">

      {/* ── Page header ── */}
      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -left-16 top-0 h-72 w-72 rounded-full bg-emerald-600/8 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-600/8 blur-3xl" />
        </div>
        <div className="section-shell relative text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300">
              <BrainCircuit size={14} /> AI Resume Analyser
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Get Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Resume Analysed
              </span>
              {' '}by AI
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Supports <strong className="text-emerald-400">text-based</strong> and{' '}
              <strong className="text-violet-400">scanned / image PDFs</strong> — get ATS score,
              skills gap, keyword audit, and actionable improvement plan.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-shell mt-10 space-y-6">

        {/* ── Step 1: Upload ── */}
        {!file && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <UploadZone onFile={handleFile} />
          </motion.div>
        )}

        {/* ── File loaded ── */}
        <AnimatePresence>
          {file && !analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

              {/* File card */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg ${
                    extractMethod === 'ocr'
                      ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600'
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                  }`}>
                    {extractMethod === 'ocr' ? <ScanLine size={20} className="text-white" /> : <FileText size={20} className="text-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{file.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                      {extractMethod && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          extractMethod === 'ocr'
                            ? 'bg-violet-500/15 text-violet-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                        }`}>
                          {extractMethod === 'ocr' ? '🔍 OCR Extracted' : '⚡ Digital Text'}
                        </span>
                      )}
                      {extractedText && (
                        <span className="text-xs text-slate-600">{extractedText.length.toLocaleString()} chars</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {fileUrl && !isExtracting && (
                    <button onClick={() => setPreview(p => !p)}
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-400 transition hover:text-white">
                      <Eye size={15} /> {showPreview ? 'Hide' : 'Preview'}
                    </button>
                  )}
                  <button onClick={handleReset} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-500 transition hover:text-rose-400">
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Extraction progress */}
              {isExtracting && extrStatus && (
                <ExtractionProgress stage={extrStatus.stage} progress={extrStatus.progress} />
              )}

              {/* PDF preview */}
              <AnimatePresence>
                {showPreview && fileUrl && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 500, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden rounded-3xl border border-white/10">
                    <object data={fileUrl} type="application/pdf" className="h-full w-full rounded-3xl bg-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              {!isExtracting && (
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <User size={14} className="text-violet-400" /> Target Role
                      <span className="text-slate-600 font-normal">(optional)</span>
                    </label>
                    <input type="text" value={targetRole} onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Frontend Developer, Data Analyst, Backend Engineer"
                      className="w-full rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20" />
                    <p className="mt-1.5 text-xs text-slate-600">Providing a role makes the AI tailor keyword and skills analysis more precisely.</p>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                        <AlertCircle size={16} className="shrink-0" /> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={handleAnalyse} disabled={analysing || !extractedText}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50">
                    {analysing
                      ? <><Loader2 size={18} className="animate-spin" /> Analysing with AI…</>
                      : <><Sparkles size={17} /> Analyse My Resume <ChevronRight size={16} /></>
                    }
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Analytics dashboard ── */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Summary header */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400">
                        {analysis.experienceLevel}
                      </span>
                      {extractMethod && (
                        <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                          extractMethod === 'ocr' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {extractMethod === 'ocr' ? '🔍 OCR Scan' : '⚡ Digital PDF'}
                        </span>
                      )}
                      <span className="text-xs text-slate-600">Detected: {analysis.detectedRole}</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">{file?.name}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{analysis.overallFeedback}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-5xl font-black ${scoreColor}`}>{analysis.atsScore}</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-600">ATS</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Score</p>
                    </div>
                  </div>
                </div>

                {/* Section inventory */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {analysis.sectionsDetected?.map(s => (
                    <span key={s} className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">✓ {s}</span>
                  ))}
                  {analysis.missingSections?.map(s => (
                    <span key={s} className="rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400">✗ {s}</span>
                  ))}
                </div>

                <div className="mt-4">
                  <button onClick={handleReset} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:text-white">
                    <RotateCcw size={13} /> Analyse New Resume
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto gap-2 pb-1">
                {TABS.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button key={tab.id} onClick={() => setTab(tab.id)}
                      className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                          : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
                      }`}>
                      <Icon size={14} /> {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Tab panels */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}>
                  {activeTab === 'score' && (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                      <h3 className="mb-6 text-lg font-bold text-white">ATS Score Breakdown</h3>
                      <ATSScoreRing score={analysis.atsScore} scoreBreakdown={analysis.scoreBreakdown} />
                    </div>
                  )}
                  {activeTab === 'skills' && <SkillsPanel matchingSkills={analysis.matchingSkills} missingSkills={analysis.missingSkills} />}
                  {activeTab === 'keywords' && <KeywordCloud keywordAnalysis={analysis.keywordAnalysis} />}
                  {activeTab === 'sections' && (
                    <div>
                      <h3 className="mb-4 text-lg font-bold text-white">Weak Sections</h3>
                      <WeakSectionsPanel weakSections={analysis.weakSections} />
                    </div>
                  )}
                  {activeTab === 'suggestions' && (
                    <div>
                      <h3 className="mb-4 text-lg font-bold text-white">Improvement Suggestions</h3>
                      <ImprovementsPanel improvements={analysis.improvements} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ResumeAnalyzer
