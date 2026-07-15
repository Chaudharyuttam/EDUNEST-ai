const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
const validLevels = ['Beginner', 'Intermediate', 'Advanced']
const validDays = [30, 60, 90]

const parseJson = (text) => JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim())

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

  const prompt = `Create a personalised ${targetDays}-day roadmap for a ${skillLevel} student targeting ${careerGoal}, studying ${dailyHours} hours per day. Return only valid JSON using this schema: {"title":"string","tagline":"string","careerGoal":"${careerGoal}","skillLevel":"${skillLevel}","totalDays":${targetDays},"dailyHours":${dailyHours},"summary":"string","totalTopics":number,"phases":[{"title":"string","duration":"string","description":"string","objectives":["string"],"topics":[{"title":"string","description":"string","estimatedHours":number,"difficulty":"Beginner|Intermediate|Advanced"}]}],"interviewTopics":["string"],"finalOutcome":"string"}. Include 3 to 5 phases and actionable placement-focused topics. Do not include external links.`

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
    roadmap.totalTopics = roadmap.phases.reduce((total, phase) => total + (Array.isArray(phase.topics) ? phase.topics.length : 0), 0)
    return res.status(200).json({ success: true, roadmap })
  } catch (error) {
    console.error('Roadmap error:', error.message)
    return res.status(502).json({ success: false, message: 'Roadmap AI is temporarily unavailable. Please try again shortly.' })
  }
}
