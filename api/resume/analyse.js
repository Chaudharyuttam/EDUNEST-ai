const MAX_RESUME_LENGTH = 15000
const MIN_RESUME_LENGTH = 100

const knownSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
  'SQL', 'MongoDB', 'Git', 'Docker', 'AWS', 'HTML', 'CSS', 'Android',
  'Machine Learning', 'REST API', 'Firebase',
]

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const findSkills = (resumeText) => knownSkills.filter((skill) => (
  new RegExp(escapeRegExp(skill), 'i').test(resumeText)
))

const fallbackAnalysis = ({ resumeText, targetRole }) => {
  const role = targetRole || 'Software Engineer'
  const matchingSkills = findSkills(resumeText)
  const missingSkills = ['TypeScript', 'Docker', 'AWS', 'Testing', 'CI/CD']
    .filter((skill) => !matchingSkills.some((found) => found.toLowerCase() === skill.toLowerCase()))

  return {
    atsScore: Math.min(88, Math.max(62, 62 + matchingSkills.length * 3)),
    scoreBreakdown: {
      keywords: Math.min(90, 50 + matchingSkills.length * 5),
      formatting: 78,
      experience: /intern|experience|worked/i.test(resumeText) ? 75 : 60,
      education: /university|college|b\.tech|bachelor|education/i.test(resumeText) ? 85 : 65,
      skills: Math.min(90, 50 + matchingSkills.length * 5),
      impact: /%|increased|reduced|improved|\d+x/i.test(resumeText) ? 75 : 58,
    },
    overallFeedback: `Your resume has a solid foundation for a ${role} role. Strengthen it by tailoring keywords to the job description and adding measurable outcomes to each experience or project bullet.`,
    matchingSkills,
    missingSkills,
    weakSections: [
      {
        section: 'Impact statements',
        issue: 'Some accomplishments may not show measurable outcomes.',
        severity: 'high',
        fix: 'Add a result, scale, or percentage to each experience and project bullet.',
      },
      {
        section: 'Target keywords',
        issue: `The resume should be tailored more closely to each ${role} job description.`,
        severity: 'medium',
        fix: 'Mirror relevant skills and tools from the job description where they are genuinely applicable.',
      },
    ],
    improvements: [
      {
        priority: 'high',
        category: 'Quantification',
        suggestion: 'Add measurable results to your strongest experience and project bullets.',
        example: 'Improved document-processing accuracy to 99.7% by engineering 24 detection features.',
      },
      {
        priority: 'high',
        category: 'Keywords',
        suggestion: `Add the most relevant ${role} keywords from the target job description.`,
        example: 'Place core technologies in both the skills section and relevant project bullets.',
      },
      {
        priority: 'medium',
        category: 'Structure',
        suggestion: 'Use clear, standard section headings and concise action-led bullet points.',
        example: 'Education, Experience, Projects, Skills, Achievements, and Certifications.',
      },
    ],
    keywordAnalysis: {
      found: matchingSkills.slice(0, 10).map((keyword) => ({ keyword, frequency: 1, importance: 'high' })),
      missing: missingSkills.slice(0, 8).map((keyword) => ({
        keyword,
        importance: 'high',
        reason: `Commonly requested for ${role} roles when relevant to the job description.`,
      })),
    },
    sectionsDetected: ['Education', 'Experience', 'Projects', 'Skills'].filter((section) => (
      new RegExp(section, 'i').test(resumeText)
    )),
    missingSections: ['Summary', 'Certifications', 'Links'].filter((section) => !new RegExp(section, 'i').test(resumeText)),
    detectedRole: role,
    experienceLevel: /intern|experience/i.test(resumeText) ? 'Junior' : 'Fresher',
  }
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  const { resumeText, targetRole = '' } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})

  if (typeof resumeText !== 'string' || resumeText.trim().length < MIN_RESUME_LENGTH) {
    return res.status(400).json({ success: false, message: 'Resume text is too short. Please upload a readable PDF.' })
  }
  if (resumeText.length > MAX_RESUME_LENGTH) {
    return res.status(413).json({ success: false, message: 'Resume text exceeds the maximum allowed length.' })
  }

  return res.status(200).json({
    success: true,
    analysis: fallbackAnalysis({ resumeText: resumeText.trim(), targetRole: String(targetRole).trim().slice(0, 100) }),
  })
}
