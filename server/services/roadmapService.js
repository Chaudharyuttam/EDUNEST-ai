/**
 * services/roadmapService.js
 * Generates a structured, phase-based learning roadmap.
 *
 * Architecture:
 *  - Tries Gemini first (if API key is present).
 *  - Falls back to a smart mock-data generator so the frontend always works.
 *  - The prompt intentionally NEVER asks for external resources, YouTube links,
 *    or course recommendations — only pure knowledge structure.
 *  - Swapping providers (Gemini → OpenAI) requires changing only this file.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import env from '../config/env.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../utils/logger.js'

// ─────────────────────────────────────────────────────────────────────────────
// Gemini configuration
// ─────────────────────────────────────────────────────────────────────────────
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

const GENERATION_CONFIG = {
  temperature: 0.55,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
}

let geminiModel = null

const getModel = () => {
  if (geminiModel) return geminiModel
  if (!env.GEMINI_API_KEY) return null   // Fall back to mock
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  geminiModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: GENERATION_CONFIG,
  })
  logger.info('Roadmap Gemini model initialised')
  return geminiModel
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt builder  (no YouTube / resource URLs — pure knowledge plan)
// ─────────────────────────────────────────────────────────────────────────────
const buildPrompt = ({ careerGoal, skillLevel, dailyHours, targetDays }) => `
You are an expert curriculum designer for EduNest AI — a placement prep platform for engineering students.

Student profile:
- Career Goal      : "${careerGoal}"
- Current Level    : "${skillLevel}"
- Daily Study Hours: ${dailyHours} hours/day
- Target Duration  : ${targetDays} days

Generate a complete, professional, phase-based learning roadmap. 

CRITICAL RULES:
1. Do NOT suggest any YouTube videos, online courses, websites, or external resources.
2. Focus ONLY on WHAT to learn (topics, concepts, skills) and HOW to practice them.
3. Each topic must have clear, actionable learning objectives — not vague descriptions.
4. Every phase must have concrete prerequisites and measurable expected outcomes.
5. Return ONLY valid JSON — no markdown, no extra text.

Return this exact JSON schema:

{
  "title": "Concise roadmap title (max 55 chars)",
  "tagline": "One motivational line about reaching the goal",
  "careerGoal": "${careerGoal}",
  "skillLevel": "${skillLevel}",
  "totalDays": ${targetDays},
  "dailyHours": ${dailyHours},
  "totalTopics": <count all topics across all phases>,
  "summary": "3-4 sentence strategic overview. No resource mentions.",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title (clear, specific)",
      "emoji": "one relevant emoji",
      "durationDays": <integer number of days>,
      "difficulty": "Beginner | Intermediate | Advanced",
      "prerequisites": ["prerequisite 1", "prerequisite 2"],
      "learningObjectives": [
        "By end of this phase, student can do X",
        "Student will understand Y deeply",
        "Student can build Z independently"
      ],
      "expectedOutcome": "One concrete sentence: what the student can BUILD or DEMONSTRATE after this phase",
      "topics": [
        {
          "id": "p1_t1",
          "name": "Topic name (specific, not vague)",
          "estimatedHours": <number>,
          "difficulty": "Beginner | Intermediate | Advanced",
          "subtopics": ["subtopic A", "subtopic B", "subtopic C"],
          "practiceTask": "One hands-on mini-project or coding task to validate understanding"
        }
      ]
    }
  ],
  "finalOutcome": "Complete sentence: what the student can do, build, or demonstrate after finishing the entire roadmap",
  "interviewTopics": ["Topic 1 likely to appear in interviews", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
}

Rules:
- Create ${targetDays <= 30 ? '3–4' : targetDays <= 60 ? '4–5' : '5–6'} phases
- Phases must be sequential — each builds on the previous
- Topics must be specific (e.g. "Closures and Lexical Scope", NOT "JavaScript")
- durationDays across all phases must sum to approximately ${targetDays}
- estimatedHours per topic must be realistic given ${dailyHours} hours/day
- Tailor depth and complexity precisely to "${skillLevel}" level
- practiceTask must be a concrete mini-task (e.g. "Build a to-do list using only vanilla JS")
- Return ONLY the JSON object
`

// ─────────────────────────────────────────────────────────────────────────────
// Mock data generator (used when GEMINI_API_KEY is missing)
// ─────────────────────────────────────────────────────────────────────────────
const generateMockRoadmap = ({ careerGoal, skillLevel, dailyHours, targetDays }) => {
  const phases = [
    {
      phaseNumber: 1,
      title: 'Core Foundations',
      emoji: '🧱',
      durationDays: Math.round(targetDays * 0.25),
      difficulty: 'Beginner',
      prerequisites: ['Basic computer operation', 'Logical thinking'],
      learningObjectives: [
        `Understand the foundational concepts required for ${careerGoal}`,
        'Write clean, readable code following industry conventions',
        'Debug and troubleshoot errors independently',
      ],
      expectedOutcome: `Build a small functional project demonstrating core ${careerGoal.split(' ')[0]} concepts`,
      topics: [
        {
          id: 'p1_t1',
          name: 'Fundamentals & Syntax',
          estimatedHours: Math.round(dailyHours * 3),
          difficulty: 'Beginner',
          subtopics: ['Variables & Data Types', 'Control Flow', 'Functions & Scope', 'Error Handling'],
          practiceTask: 'Build a CLI calculator that handles edge cases and invalid inputs gracefully',
        },
        {
          id: 'p1_t2',
          name: 'Data Structures Basics',
          estimatedHours: Math.round(dailyHours * 2),
          difficulty: 'Beginner',
          subtopics: ['Arrays & Strings', 'Objects & Maps', 'Stacks & Queues', 'Linked Lists'],
          practiceTask: 'Implement a stack-based bracket validator from scratch without libraries',
        },
        {
          id: 'p1_t3',
          name: 'Problem Solving Patterns',
          estimatedHours: Math.round(dailyHours * 2),
          difficulty: 'Beginner',
          subtopics: ['Two Pointers', 'Sliding Window', 'Frequency Counters', 'Recursion Basics'],
          practiceTask: 'Solve 10 easy-level array problems using at least 3 different patterns',
        },
      ],
    },
    {
      phaseNumber: 2,
      title: 'Core Domain Skills',
      emoji: '⚡',
      durationDays: Math.round(targetDays * 0.35),
      difficulty: skillLevel === 'Beginner' ? 'Intermediate' : 'Advanced',
      prerequisites: ['Phase 1 complete', 'Comfortable with basic syntax and data structures'],
      learningObjectives: [
        `Apply ${careerGoal}-specific technologies and patterns`,
        'Design and architect small systems independently',
        'Write maintainable, scalable code with proper separation of concerns',
      ],
      expectedOutcome: `Build a functional ${careerGoal.includes('Full') ? 'full-stack' : 'domain-specific'} project with proper architecture`,
      topics: [
        {
          id: 'p2_t1',
          name: 'Advanced Data Structures',
          estimatedHours: Math.round(dailyHours * 3),
          difficulty: 'Intermediate',
          subtopics: ['Binary Trees & BST', 'Heaps & Priority Queues', 'Graphs & BFS/DFS', 'Tries'],
          practiceTask: 'Implement a task scheduler using a min-heap with custom priority logic',
        },
        {
          id: 'p2_t2',
          name: 'Algorithm Design',
          estimatedHours: Math.round(dailyHours * 3),
          difficulty: 'Intermediate',
          subtopics: ['Sorting Algorithms', 'Binary Search Variants', 'Greedy Algorithms', 'Divide & Conquer'],
          practiceTask: 'Solve 15 medium-level problems covering at least 4 algorithm paradigms',
        },
        {
          id: 'p2_t3',
          name: 'Domain-Specific Frameworks',
          estimatedHours: Math.round(dailyHours * 4),
          difficulty: 'Intermediate',
          subtopics: ['Architecture Patterns', 'State Management', 'API Design', 'Testing Fundamentals'],
          practiceTask: 'Build a RESTful API or UI module following MVC/MVVM architecture principles',
        },
      ],
    },
    {
      phaseNumber: 3,
      title: 'System Design & Architecture',
      emoji: '🏗️',
      durationDays: Math.round(targetDays * 0.25),
      difficulty: 'Advanced',
      prerequisites: ['Phase 2 complete', 'Comfortable building end-to-end features'],
      learningObjectives: [
        'Design scalable systems from first principles',
        'Reason about trade-offs in distributed architectures',
        'Communicate design decisions clearly in technical interviews',
      ],
      expectedOutcome: 'Design and present a complete system architecture for a real-world application',
      topics: [
        {
          id: 'p3_t1',
          name: 'System Design Fundamentals',
          estimatedHours: Math.round(dailyHours * 3),
          difficulty: 'Advanced',
          subtopics: ['Scalability Principles', 'Load Balancing', 'Caching Strategies', 'Database Sharding'],
          practiceTask: 'Design a URL shortener end-to-end: capacity estimation, API design, DB schema, caching',
        },
        {
          id: 'p3_t2',
          name: 'Dynamic Programming',
          estimatedHours: Math.round(dailyHours * 3),
          difficulty: 'Advanced',
          subtopics: ['Memoisation vs Tabulation', '1D & 2D DP', 'DP on Trees/Graphs', 'Interval DP'],
          practiceTask: 'Solve 10 classic DP problems (knapsack, LCS, LIS, coin change) with all approaches',
        },
      ],
    },
    {
      phaseNumber: 4,
      title: 'Placement Readiness',
      emoji: '🎯',
      durationDays: Math.round(targetDays * 0.15),
      difficulty: 'Advanced',
      prerequisites: ['Phases 1–3 complete', 'Portfolio project ready'],
      learningObjectives: [
        'Articulate technical decisions clearly under interview pressure',
        'Optimise solutions for time and space complexity on the fly',
        'Present projects confidently with business context',
      ],
      expectedOutcome: 'Clear technical rounds at product-based companies with structured, confident answers',
      topics: [
        {
          id: 'p4_t1',
          name: 'Interview Patterns & Communication',
          estimatedHours: Math.round(dailyHours * 2),
          difficulty: 'Advanced',
          subtopics: ['STAR Method for Behavioural', 'Think-aloud Coding', 'Complexity Analysis', 'Clarifying Questions'],
          practiceTask: 'Record yourself solving 3 problems aloud and critique communication clarity',
        },
        {
          id: 'p4_t2',
          name: 'Company-Specific Prep',
          estimatedHours: Math.round(dailyHours * 2),
          difficulty: 'Advanced',
          subtopics: ['Product Company OA Patterns', 'HR & Cultural Fit', 'Negotiation Basics', 'Portfolio Walkthrough'],
          practiceTask: 'Conduct 2 full mock interviews (45 min each) and document weak areas',
        },
      ],
    },
  ]

  const totalTopics = phases.reduce((sum, p) => sum + p.topics.length, 0)

  return {
    title: `${careerGoal} Roadmap`,
    tagline: `Your personalised ${targetDays}-day path to cracking ${careerGoal} placements`,
    careerGoal,
    skillLevel,
    totalDays: targetDays,
    dailyHours,
    totalTopics,
    summary: `This ${targetDays}-day roadmap is designed for a ${skillLevel.toLowerCase()}-level student targeting ${careerGoal} roles. Studying ${dailyHours} hours daily, you will progress through ${phases.length} carefully sequenced phases — from foundational concepts to placement-ready system design and interview preparation. Each phase builds directly on the previous, ensuring depth without overwhelm.`,
    phases,
    finalOutcome: `After completing this roadmap, you will confidently build production-ready ${careerGoal} applications, solve medium-to-hard DSA problems under pressure, design scalable systems, and articulate your thinking clearly in technical interviews at product-based companies.`,
    interviewTopics: ['Arrays & Hashing', 'Two Pointers & Sliding Window', 'Binary Search', 'Trees & Graphs', 'Dynamic Programming', 'System Design Basics'],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a structured learning roadmap.
 * Tries Gemini; falls back to mock data if key is absent.
 *
 * @param {{ careerGoal, skillLevel, dailyHours, targetDays }} params
 * @returns {Promise<object>} Validated roadmap object
 */
export const generateRoadmap = async ({ careerGoal, skillLevel, dailyHours, targetDays }) => {
  const model = getModel()

  // ── No API key → use smart mock ────────────────────────────────────────────
  if (!model) {
    logger.warn('GEMINI_API_KEY not set — returning mock roadmap')
    return generateMockRoadmap({ careerGoal, skillLevel, dailyHours, targetDays })
  }

  // ── Gemini path ─────────────────────────────────────────────────────────────
  try {
    logger.info(`Generating roadmap: goal="${careerGoal}", level=${skillLevel}, days=${targetDays}`)

    const prompt = buildPrompt({ careerGoal, skillLevel, dailyHours, targetDays })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    let roadmap
    try {
      roadmap = JSON.parse(text)
    } catch {
      logger.error('Gemini returned invalid JSON — falling back to mock')
      return generateMockRoadmap({ careerGoal, skillLevel, dailyHours, targetDays })
    }

    if (!roadmap.phases || !Array.isArray(roadmap.phases) || roadmap.phases.length === 0) {
      logger.error('Gemini returned incomplete roadmap — falling back to mock')
      return generateMockRoadmap({ careerGoal, skillLevel, dailyHours, targetDays })
    }

    // Ensure every topic has a unique id
    roadmap.phases = roadmap.phases.map((phase, pi) => ({
      ...phase,
      topics: (phase.topics || []).map((topic, ti) => ({
        ...topic,
        id: topic.id || `p${pi + 1}_t${ti + 1}`,
      })),
    }))

    roadmap.totalTopics = roadmap.phases.reduce((s, p) => s + (p.topics?.length || 0), 0)

    logger.info(`Roadmap generated: ${roadmap.phases.length} phases, ${roadmap.totalTopics} topics`)
    return roadmap

  } catch (error) {
    if (error instanceof AppError) throw error

    const msg = error.message || ''
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      logger.warn('Invalid API key — falling back to mock roadmap')
      return generateMockRoadmap({ careerGoal, skillLevel, dailyHours, targetDays })
    }
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      throw new AppError('AI quota exceeded. Please try again in a few minutes.', 429)
    }
    if (msg.includes('DEADLINE_EXCEEDED') || msg.includes('timeout')) {
      logger.warn('Gemini timeout — falling back to mock')
      return generateMockRoadmap({ careerGoal, skillLevel, dailyHours, targetDays })
    }

    logger.error('Unexpected roadmap error — falling back to mock:', msg)
    return generateMockRoadmap({ careerGoal, skillLevel, dailyHours, targetDays })
  }
}
