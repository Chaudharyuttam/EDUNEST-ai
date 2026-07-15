const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
const validLevels = ['Beginner', 'Intermediate', 'Advanced']
const validDays = [30, 60, 90]

const parseJson = (text) => JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim())

const createFallbackRoadmap = ({ careerGoal, skillLevel, dailyHours, targetDays }) => {
  const phaseDays = Math.floor(targetDays / 4)
  const makeTopic = (id, title, description, difficulty) => ({ id, title, description, estimatedHours: Math.max(2, Math.round((targetDays * dailyHours) / 12)), difficulty })
  const role = careerGoal.toLowerCase()
  const profile = role.includes('mern') || role.includes('full stack') || role.includes('fullstack')
    ? { foundations: [['JavaScript and modern ES features', 'Practise asynchronous JavaScript, modules, array methods, and error handling.'], ['HTML, CSS, and responsive design', 'Build accessible layouts that work on mobile and desktop.'], ['React essentials', 'Use components, hooks, forms, routing, and state correctly.']], build: [['Node.js and Express APIs', 'Create REST endpoints with validation, errors, authentication, and tests.'], ['MongoDB and Mongoose', 'Model data, query efficiently, and connect MongoDB to an Express service.'], ['Full-stack integration', 'Connect React, APIs, authentication, protected routes, and deployment.']], interview: ['MERN architecture discussion', 'Explain data flow, authentication, API design, component design, and scaling choices.'], interviewTopics: ['JavaScript', 'React', 'Node.js and Express', 'MongoDB', 'REST APIs', 'System design'], project: 'a deployed full-stack application with authentication, CRUD, and a MongoDB database' }
    : role.includes('data') || role.includes('analyst')
    ? { foundations: [['SQL and relational databases', 'Query, filter, join, aggregate, and model business data.'], ['Excel and data cleaning', 'Clean inconsistent data and build repeatable analysis workflows.']], build: [['Python for analysis', 'Use pandas and notebooks to explore and transform datasets.'], ['Dashboards and storytelling', 'Build a dashboard and explain insights to a non-technical audience.']], interview: ['Case-study analysis', 'Analyse a business dataset and communicate your recommendation.'], interviewTopics: ['SQL queries', 'Statistics', 'Excel', 'Business case studies'], project: 'an end-to-end sales or product analytics dashboard' }
    : role.includes('machine learning') || role.includes('ai ') || role.includes('ml ')
      ? { foundations: [['Python and data structures', 'Write clean Python and work confidently with arrays, dataframes, and files.'], ['Math for machine learning', 'Practise probability, statistics, linear algebra, and optimisation essentials.']], build: [['Classical machine learning', 'Train, validate, and compare regression and classification models.'], ['Model evaluation and deployment', 'Measure model quality and ship a small prediction service.']], interview: ['ML system case studies', 'Explain model choices, trade-offs, bias, and evaluation metrics.'], interviewTopics: ['Python', 'Statistics', 'Machine learning algorithms', 'Model metrics'], project: 'a deployed machine-learning prediction project' }
      : role.includes('devops') || role.includes('cloud')
        ? { foundations: [['Linux, networking, and Git', 'Use the command line, understand HTTP/DNS, and manage code with Git.'], ['Cloud fundamentals', 'Learn compute, storage, IAM, and networking concepts.']], build: [['Docker and CI/CD', 'Containerise an application and automate its test and deployment workflow.'], ['Infrastructure and observability', 'Provision infrastructure and add logs, metrics, and alerts.']], interview: ['Production incident practice', 'Diagnose reliability, scaling, and deployment scenarios.'], interviewTopics: ['Linux', 'Docker', 'CI/CD', 'Cloud architecture'], project: 'a containerised application with a CI/CD pipeline' }
        : role.includes('android') || role.includes('mobile')
          ? { foundations: [['Mobile programming fundamentals', 'Learn Kotlin or your chosen mobile stack, layouts, navigation, and state.'], ['API integration and local storage', 'Consume REST APIs and persist app data safely.']], build: [['Production mobile features', 'Build authentication, lists, forms, and offline-friendly interactions.'], ['Testing and release readiness', 'Test critical flows and prepare a polished release build.']], interview: ['Mobile architecture discussion', 'Explain lifecycle, performance, networking, and app architecture decisions.'], interviewTopics: ['Kotlin or mobile framework', 'Android lifecycle', 'REST APIs', 'Mobile architecture'], project: 'a polished mobile app connected to a real API' }
          : role.includes('backend') || role.includes('node') || role.includes('java')
            ? { foundations: [['Programming and backend fundamentals', 'Master language syntax, HTTP, REST principles, and Git.'], ['Databases and data modelling', 'Design schemas, write queries, and understand indexes and transactions.']], build: [['API development', 'Build authenticated REST APIs with validation, tests, and error handling.'], ['Scalability and deployment', 'Add caching, queues, logging, and deploy a production-ready service.']], interview: ['Backend system design', 'Discuss API design, databases, reliability, and scaling trade-offs.'], interviewTopics: ['REST APIs', 'SQL/NoSQL', 'Authentication', 'System design'], project: 'a deployed backend API with authentication and database persistence' }
            : role.includes('frontend') || role.includes('react') || role.includes('ui')
              ? { foundations: [['HTML, CSS, and JavaScript', 'Build responsive layouts and master modern JavaScript fundamentals.'], ['React fundamentals', 'Use components, state, hooks, routing, and reusable UI patterns.']], build: [['Advanced frontend development', 'Manage API state, forms, accessibility, and performance.'], ['Portfolio-quality UI', 'Create a responsive application with polished loading, empty, and error states.']], interview: ['Frontend coding and architecture', 'Practise JavaScript, React, browser, accessibility, and performance questions.'], interviewTopics: ['JavaScript', 'React', 'CSS', 'Web performance'], project: 'a responsive React application with real API integration' }
              : { foundations: [[`Core ${careerGoal} concepts`, 'Learn the essential terminology, workflows, and tools for the role.'], ['Programming and problem solving', 'Practise clear logic, debugging, and version control.']], build: [[`${careerGoal} practical skills`, 'Apply role-specific tools and techniques to realistic tasks.'], ['Portfolio project', `Build and document a focused ${careerGoal} project from scratch.`]], interview: ['Role-specific interview practice', 'Practise explaining solutions, decisions, and project outcomes.'], interviewTopics: [`${careerGoal} fundamentals`, 'Problem solving', 'Project discussion', 'Behavioural questions'], project: `a portfolio-quality ${careerGoal} project` }
  const phases = [
    {
      phaseNumber: 1, emoji: '🧱', title: `${careerGoal}: Core Foundations`, durationDays: phaseDays, difficulty: skillLevel === 'Advanced' ? 'Intermediate' : skillLevel,
      prerequisites: ['A consistent daily study routine'], learningObjectives: ['Strengthen role-specific foundations', 'Set up a practical learning workflow'], expectedOutcome: `A confident foundation for ${careerGoal}.`,
      topics: profile.foundations.map(([title, description], index) => makeTopic(`foundation-${index + 1}`, title, description, 'Beginner')),
    },
    {
      phaseNumber: 2, emoji: '⚙️', title: `${careerGoal}: Build Production Skills`, durationDays: phaseDays, difficulty: 'Intermediate',
      prerequisites: ['Foundation topics completed'], learningObjectives: ['Apply role-specific tools to realistic tasks', 'Build visible evidence of your skills'], expectedOutcome: `Working skills demonstrated through ${profile.project}.`,
      topics: [...profile.build, ['Role workflow and quality', `Use Git branches, documentation, testing, and feedback loops while building ${careerGoal} work.`]].map(([title, description], index) => makeTopic(`practice-${index + 1}`, title, description, 'Intermediate')),
    },
    {
      phaseNumber: 3, emoji: '🚀', title: `${careerGoal}: Capstone and Portfolio`, durationDays: phaseDays, difficulty: 'Intermediate',
      prerequisites: ['Production skills completed'], learningObjectives: ['Ship a complete role-specific project', 'Create evidence recruiters can review'], expectedOutcome: `A portfolio featuring ${profile.project}.`,
      topics: [makeTopic('capstone-1', `${careerGoal} capstone`, `Plan, build, test, and deploy ${profile.project}.`, 'Intermediate'), makeTopic('capstone-2', 'Portfolio case study', 'Document the problem, architecture, key decisions, screenshots, and measurable outcomes.', 'Intermediate'), makeTopic('capstone-3', 'Resume and GitHub polish', `Add ${careerGoal} keywords, project impact, clean commits, and a strong README.`, 'Intermediate')],
    },
    {
      phaseNumber: 4, emoji: '🎯', title: `${careerGoal}: Interview Readiness`, durationDays: targetDays - phaseDays * 3, difficulty: 'Advanced',
      prerequisites: ['Capstone completed'], learningObjectives: ['Communicate technical decisions clearly', 'Practise role-specific and behavioural questions'], expectedOutcome: `A portfolio-ready project and focused interview plan for ${careerGoal} roles.`,
      topics: [makeTopic('interview-1', profile.interview[0], profile.interview[1], 'Advanced'), makeTopic('interview-2', `${careerGoal} mock interview`, `Complete timed questions on ${profile.interviewTopics.slice(0, 3).join(', ')} and explain your capstone clearly.`, 'Advanced'), makeTopic('interview-3', 'Job application system', 'Tailor resume bullets, track applications, request feedback, and practise behavioural stories.', 'Advanced')],
    },
  ]

  return {
    title: `${careerGoal} Roadmap`, tagline: `Your focused ${targetDays}-day path to becoming placement-ready.`, careerGoal, skillLevel, totalDays: targetDays, dailyHours,
    summary: `Follow this structured plan for ${dailyHours} hours a day to build ${careerGoal} skills, practical evidence, and interview confidence.`,
    phases, totalTopics: phases.reduce((total, phase) => total + phase.topics.length, 0),
    interviewTopics: profile.interviewTopics,
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
