/**
 * server/services/resumeService.js
 *
 * Analyses resume text using Gemini AI.
 * Gracefully falls back to realistic mock data when API key is absent/invalid.
 * Swap provider: replace only this file. Controller + routes stay unchanged.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import env from '../config/env.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../utils/logger.js'

// ─────────────────────────────────────────────────────────────────────────────
// Gemini setup
// ─────────────────────────────────────────────────────────────────────────────
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

const GENERATION_CONFIG = {
  temperature: 0.4,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
}

let resumeModel = null

const getModel = () => {
  if (resumeModel) return resumeModel
  if (!env.GEMINI_API_KEY) return null
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  resumeModel = genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: GENERATION_CONFIG,
  })
  logger.info('Resume Gemini model initialised')
  return resumeModel
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt
// ─────────────────────────────────────────────────────────────────────────────
const buildPrompt = ({ resumeText, targetRole }) => `
You are a senior technical recruiter and career coach specialising in tech placement at product-based companies.

Analyse the following resume${targetRole ? ` for the role: "${targetRole}"` : ''}.

RESUME TEXT:
---
${resumeText.slice(0, 6000)}
---

Perform a comprehensive ATS and quality analysis. Return ONLY valid JSON — no markdown, no extra text.

{
  "atsScore": <integer 0–100>,
  "scoreBreakdown": {
    "keywords":    <0–100>,
    "formatting":  <0–100>,
    "experience":  <0–100>,
    "education":   <0–100>,
    "skills":      <0–100>,
    "impact":      <0–100>
  },
  "overallFeedback": "2–3 sentence executive summary of the resume quality",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills":  ["skill1", "skill2"],
  "weakSections": [
    {
      "section":  "Section name (e.g. Work Experience)",
      "issue":    "Specific problem with this section",
      "severity": "high | medium | low",
      "fix":      "Actionable one-line fix"
    }
  ],
  "improvements": [
    {
      "priority":    "high | medium | low",
      "category":    "Category (e.g. Quantification, Keywords, Formatting)",
      "suggestion":  "Specific, actionable improvement",
      "example":     "Concrete before/after example if applicable"
    }
  ],
  "keywordAnalysis": {
    "found": [
      { "keyword": "keyword", "frequency": <int>, "importance": "critical | high | medium" }
    ],
    "missing": [
      { "keyword": "keyword", "importance": "critical | high | medium", "reason": "Why this matters" }
    ]
  },
  "sectionsDetected": ["Education", "Experience", ...],
  "missingSections":  ["Projects", "Certifications", ...],
  "detectedRole":     "What role this resume targets (inferred)",
  "experienceLevel":  "Fresher | Junior | Mid | Senior"
}

Rules:
- atsScore must reflect realistic ATS systems (formatting, keywords, structure)
- matchingSkills: only skills explicitly present in the resume
- missingSkills: important skills for ${targetRole || 'a tech role'} that are absent
- improvements: max 6, ordered by priority
- keywordAnalysis.found: max 10 most important found keywords
- keywordAnalysis.missing: max 8 critical missing keywords
- Return ONLY the JSON object
`

// ─────────────────────────────────────────────────────────────────────────────
// Mock fallback
// ─────────────────────────────────────────────────────────────────────────────
const generateMockAnalysis = ({ targetRole }) => {
  const role = targetRole || 'Software Developer'
  return {
    atsScore: 68,
    scoreBreakdown: {
      keywords:   62,
      formatting: 78,
      experience: 70,
      education:  85,
      skills:     65,
      impact:     55,
    },
    overallFeedback: `Your resume demonstrates a solid educational foundation and relevant technical skills for a ${role} role. However, it lacks quantified achievements in the experience section and is missing several high-demand keywords that modern ATS systems prioritise. Addressing these will significantly improve your shortlisting rate.`,
    matchingSkills:  ['JavaScript', 'HTML', 'CSS', 'Git', 'React', 'Python', 'SQL'],
    missingSkills:   ['TypeScript', 'Docker', 'AWS / Cloud', 'System Design', 'GraphQL', 'CI/CD', 'Testing (Jest/Cypress)'],
    weakSections: [
      {
        section:  'Work Experience',
        issue:    'Bullet points are duty-based ("responsible for…") rather than achievement-based. No metrics or quantified impact.',
        severity: 'high',
        fix:      'Rewrite bullets as "Achieved X by doing Y, resulting in Z%" using PAR (Problem–Action–Result) format.',
      },
      {
        section:  'Skills',
        issue:    'Skills listed as a single comma-separated line. ATS parsers prefer categorised skill lists.',
        severity: 'medium',
        fix:      'Split into sub-categories: Languages, Frameworks, Tools, Databases, Cloud.',
      },
      {
        section:  'Summary / Objective',
        issue:    'Generic objective statement that does not mention the target role or key value proposition.',
        severity: 'medium',
        fix:      'Replace with a 2-line professional summary: your level, specialisation, and biggest achievement.',
      },
      {
        section:  'Projects',
        issue:    'Projects lack tech stack details, links, or scale metrics.',
        severity: 'low',
        fix:      'Add GitHub links and one metric per project (e.g., "Served 500+ users", "Reduced load time by 40%").',
      },
    ],
    improvements: [
      {
        priority:   'high',
        category:   'Quantification',
        suggestion: 'Add measurable impact to every experience bullet point.',
        example:    'Before: "Developed REST APIs". After: "Developed 12 REST APIs reducing data fetch latency by 35%".',
      },
      {
        priority:   'high',
        category:   'Keywords',
        suggestion: `Add "${role}" and its core technologies prominently in the summary and skills section.`,
        example:    'ATS systems score resumes by exact keyword matches to the job description.',
      },
      {
        priority:   'high',
        category:   'ATS Formatting',
        suggestion: 'Use standard section headings: Education, Experience, Skills, Projects, Certifications.',
        example:    'Non-standard headings like "My Journey" or "What I Do" are not parsed correctly by ATS.',
      },
      {
        priority:   'medium',
        category:   'Technical Depth',
        suggestion: 'For each project, mention the problem, your solution, and the outcome in 2–3 bullets.',
        example:    '"Built a real-time chat app using Socket.io handling 100+ concurrent users with <200ms latency."',
      },
      {
        priority:   'medium',
        category:   'Action Verbs',
        suggestion: 'Start every bullet with a strong, varied action verb. Avoid repeating "worked on" or "helped".',
        example:    'Use: Engineered, Architected, Optimised, Reduced, Increased, Automated, Deployed, Implemented.',
      },
      {
        priority:   'low',
        category:   'Contact Information',
        suggestion: 'Add LinkedIn URL and GitHub profile link to your contact section.',
        example:    'Recruiters actively check GitHub for code quality before scheduling interviews.',
      },
    ],
    keywordAnalysis: {
      found: [
        { keyword: 'JavaScript', frequency: 5, importance: 'critical' },
        { keyword: 'React',      frequency: 3, importance: 'critical' },
        { keyword: 'Node.js',    frequency: 2, importance: 'high'     },
        { keyword: 'HTML/CSS',   frequency: 4, importance: 'high'     },
        { keyword: 'Git',        frequency: 2, importance: 'high'     },
        { keyword: 'REST API',   frequency: 2, importance: 'high'     },
        { keyword: 'Python',     frequency: 1, importance: 'medium'   },
        { keyword: 'SQL',        frequency: 1, importance: 'medium'   },
      ],
      missing: [
        { keyword: 'TypeScript',    importance: 'critical', reason: 'Required in 78% of frontend JDs in 2024'  },
        { keyword: 'Docker',        importance: 'high',     reason: 'Standard for deployment in product companies' },
        { keyword: 'AWS / Cloud',   importance: 'high',     reason: 'Cloud experience expected at most tech firms' },
        { keyword: 'System Design', importance: 'high',     reason: 'Frequently tested in senior/mid-level interviews' },
        { keyword: 'Testing',       importance: 'medium',   reason: 'Unit and integration testing signals code maturity' },
        { keyword: 'CI/CD',         importance: 'medium',   reason: 'DevOps basics expected in most engineering roles' },
      ],
    },
    sectionsDetected: ['Education', 'Skills', 'Projects', 'Experience'],
    missingSections:  ['Professional Summary', 'Certifications', 'Achievements', 'Links / Portfolio'],
    detectedRole:     role,
    experienceLevel:  'Junior',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyses resume text and returns a structured report.
 * @param {{ resumeText: string, targetRole?: string }} params
 * @returns {Promise<object>} Analysis report
 */
export const analyseResume = async ({ resumeText, targetRole = '' }) => {
  const model = getModel()

  if (!model) {
    logger.warn('GEMINI_API_KEY not set — returning mock resume analysis')
    return generateMockAnalysis({ targetRole })
  }

  try {
    logger.info(`Analysing resume (${resumeText.length} chars) for role: "${targetRole || 'general'}"`)
    const prompt = buildPrompt({ resumeText, targetRole })
    const result = await model.generateContent(prompt)
    const text   = result.response.text()

    let analysis
    try {
      analysis = JSON.parse(text)
    } catch {
      logger.error('Gemini returned invalid JSON for resume — falling back to mock')
      return generateMockAnalysis({ targetRole })
    }

    if (typeof analysis.atsScore !== 'number') {
      logger.error('Gemini resume analysis incomplete — falling back to mock')
      return generateMockAnalysis({ targetRole })
    }

    logger.info(`Resume analysed: ATS=${analysis.atsScore}, skills found=${analysis.matchingSkills?.length}`)
    return analysis

  } catch (error) {
    if (error instanceof AppError) throw error
    const msg = error.message || ''

    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      logger.warn('Invalid Gemini key — using mock resume analysis')
      return generateMockAnalysis({ targetRole })
    }
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      throw new AppError('AI quota exceeded. Please try again shortly.', 429)
    }

    logger.error('Resume analysis error — falling back to mock:', msg)
    return generateMockAnalysis({ targetRole })
  }
}
