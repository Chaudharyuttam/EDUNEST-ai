const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash'

const systemInstruction = `You are EduNest AI, a clear and encouraging learning assistant for students preparing for placements, technical interviews, and exams. Explain concepts accurately, use concise Markdown, include examples when helpful, and stay focused on DSA, web development, CS fundamentals, system design, career guidance, and study planning.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!message || message.length > 4000) {
    return res.status(400).json({ success: false, message: 'Message must contain between 1 and 4000 characters.' })
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ success: false, message: 'AI Tutor is not configured. Add GEMINI_API_KEY in Vercel environment variables.' })
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
      }),
    })

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
    if (!response.ok || !reply) {
      throw new Error(data.error?.message || 'Gemini did not return a reply.')
    }

    return res.status(200).json({ success: true, reply })
  } catch (error) {
    console.error('AI Tutor error:', error.message)
    return res.status(502).json({ success: false, message: 'AI Tutor is temporarily unavailable. Please try again shortly.' })
  }
}
