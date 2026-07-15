const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
const validLevels = ['Beginner', 'Intermediate', 'Advanced']
const validDays = [30, 60, 90]

const parseJson = (text) => JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim())

const createFallbackRoadmap = ({ careerGoal, skillLevel, dailyHours, targetDays }) => {
  const phaseDays = Math.floor(targetDays / 3)
  const makeTopic = (id, title, description, difficulty) => ({ id, title, description, estimatedHours: Math.max(2, Math.round((targetDays * dailyHours) / 12)), difficulty })
  const phases = [
    {
      phaseNumber: 1, emoji: '🧱', title: 'Build the Foundations', durationDays: phaseDays, difficulty: skillLevel === 'Advanced' ? 'Intermediate' : skillLevel,
      prerequisites: ['A consistent daily study routine'], learningObjectives: ['Strengthen core concepts', 'Set up a practical learning workflow'], expectedOutcome: `A confident foundation for ${careerGoal}.`,
      topics: [makeTopic('foundation-1', `Core ${careerGoal} concepts`, 'Learn the essential concepts and terminology.', 'Beginner'), makeTopic('foundation-2', 'Hands-on fundamentals', 'Practise each concept with short exercises.', 'Beginner')],
    },
    {
      phaseNumber: 2, emoji: '⚙️', title: 'Develop Practical Skills', durationDays: phaseDays, difficulty: 'Intermediate',
      prerequisites: ['Foundation topics completed'], learningObjectives: ['Apply concepts to realistic tasks', 'Improve problem-solving speed'], expectedOutcome: 'Working skills demonstrated through small projects and practice.',
      topics: [makeTopic('practice-1', 'Guided project work', `Build a focused ${careerGoal} project from scratch.`, 'Intermediate'), makeTopic('practice-2', 'Problem-solving practice', 'Solve progressively harder role-relevant challenges.', 'Intermediate')],
    },
    {
      phaseNumber: 3, emoji: '🎯', title: 'Prepare for Interviews', durationDays: targetDays - phaseDays * 2, difficulty: 'Advanced',
      prerequisites: ['Practical skills completed'], learningObjectives: ['Communicate technical decisions clearly', 'Practise interview-style questions'], expectedOutcome: `A portfolio-ready project and interview plan for ${careerGoal} roles.`,
      topics: [makeTopic('interview-1', 'Interview question practice', 'Practise explaining solutions aloud and under time limits.', 'Advanced'), makeTopic('interview-2', 'Portfolio refinement', 'Polish your best project and prepare concise project stories.', 'Advanced')],
    },
  ]

  return {
    title: `${careerGoal} Roadmap`, tagline: `Your focused ${targetDays}-day path to becoming placement-ready.`, careerGoal, skillLevel, totalDays: targetDays, dailyHours,
    summary: `Follow this structured plan for ${dailyHours} hours a day to build ${careerGoal} skills, practical evidence, and interview confidence.`,
    phases, totalTopics: phases.reduce((total, phase) => total + phase.topics.length, 0),
    interviewTopics: ['Role-specific fundamentals', 'Problem solving', 'Project discussion', 'Behavioural questions'],
    finalOutcome: `You will have a focused foundation, practical work, and a clear plan for ${careerGoal} interviews.`,
  }
}

const normaliseRoadmap = (roadmap, input) => {
  const phases = roadmap.phases.map((phase, phaseIndex) => ({
    ...phase,
    phaseNumber: phase.phaseNumber || phaseIndex + 1,
    emoji: phase.emoji || ['🧱', '⚙️', '🚀', '🎯'][phaseIndex % 4],
    durationDays: Number(phase.durationDays || phase.duration || Math.max(1, Math.floor(input.targetDays / roadmap.phases.length))),
    difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(phase.difficulty) ? phase.difficulty : input.skillLevel,
    prerequisites: Array.isArray(phase.prerequisites) ? phase.prerequisites : [],
    learningObjectives: Array.isArray(phase.learningObjectives) ? phase.learningObjectives : (phase.objectives || []),
    expectedOutcome: phase.expectedOutcome || '',
    topics: (phase.topics || []).map((topic, topicIndex) => ({ ...topic, id: topic.id || `phase-${phaseIndex + 1}-topic-${topicIndex + 1}` })),
  }))
  return { ...roadmap, ...input, phases, totalTopics: phases.reduce((total, phase) => total + phase.topics.length, 0) }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
  const careerGoal = typeof body.careerGoal === 'string' ? body.careerGoal.trim() : ''
  const skillLevel = body.skillLevel
  const dailyHours = Number(body.dailyHours)
  const targetDays = Number(body.targetDays)

  if (careerGoal.length < 3 || careerGoal.length > 200 || !validLevels.includes(skillLevel) || !Number.isFinite(dailyHours) || dailyHours < 1 || dailyHours > 12 || !validDays.includes(targetDays)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid goal, level, daily hours, and target duration.' })
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ success: false, message: 'Roadmap AI is not configured. Add GEMINI_API_KEY in Vercel environment variables.' })
  }

  const input = { careerGoal, skillLevel, dailyHours, targetDays }
  const prompt = `Create a personalised ${targetDays}-day roadmap for a ${skillLevel} student targeting ${careerGoal}, studying ${dailyHours} hours per day. Return only valid JSON using this schema: {"title":"string","tagline":"string","summary":"string","phases":[{"phaseNumber":1,"emoji":"string","title":"string","durationDays":number,"difficulty":"Beginner|Intermediate|Advanced","prerequisites":["string"],"learningObjectives":["string"],"expectedOutcome":"string","topics":[{"id":"string","title":"string","description":"string","estimatedHours":number,"difficulty":"Beginner|Intermediate|Advanced"}]}],"interviewTopics":["string"],"finalOutcome":"string"}. Include 3 to 5 phases and actionable placement-focused topics. Do not include external links.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.55, topP: 0.9, responseMimeType: 'application/json', maxOutputTokens: 8192 },
      }),
    })
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('')
    if (!response.ok || !text) throw new Error(data.error?.message || 'Gemini did not return a roadmap.')

    const roadmap = parseJson(text)
    if (!Array.isArray(roadmap.phases) || roadmap.phases.length === 0) throw new Error('Gemini returned an incomplete roadmap.')
    return res.status(200).json({ success: true, roadmap: normaliseRoadmap(roadmap, input) })
  } catch (error) {
    console.error('Roadmap error:', error.message)
    // Gemini can briefly reject requests during demand spikes. Always return a
    // complete, usable roadmap instead of making the student retry.
    return res.status(200).json({ success: true, roadmap: createFallbackRoadmap(input), fallback: true })
  }
}
