import React from 'react'
import { Sparkles } from 'lucide-react'

const PromptSuggestions = ({ onSelect }) => {
  const prompts = [
    'Create a 2-week study plan for AI basics',
    'Explain React hooks in simple terms',
    'Help me build a portfolio project idea',
  ]

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {prompts.map((prompt) => (
        <button key={prompt} onClick={() => onSelect(prompt)} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20">
          <span className="mr-2 inline-flex">
            <Sparkles size={14} />
          </span>
          {prompt}
        </button>
      ))}
    </div>
  )
}

export default PromptSuggestions
