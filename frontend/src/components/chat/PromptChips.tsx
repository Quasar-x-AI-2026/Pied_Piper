import { Sparkles } from 'lucide-react';

interface PromptChipsProps {
  onSelect: (prompt: string) => void;
}

const quickPrompts = [
  "Am I eligible for PMAY?",
  "Schemes for students in 2025",
  "Is this message a scam?",
  "Savings schemes for senior citizens",
  "How to apply for PM Kisan?",
  "Health insurance schemes"
];

export function PromptChips({ onSelect }: PromptChipsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>Quick prompts</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="prompt-chip"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}