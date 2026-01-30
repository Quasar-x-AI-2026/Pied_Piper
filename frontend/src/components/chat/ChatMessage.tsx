import { Message } from '@/types';
import { User, Bot, CheckCircle, AlertCircle, HelpCircle, FileText, ArrowRight } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="chat-bubble-user">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  const { structured } = message;
  const confidence = structured?.confidence;

  const ConfidenceIcon = confidence === 'high' ? CheckCircle : confidence === 'medium' ? AlertCircle : HelpCircle;

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-accent" />
        </div>
        <div className="chat-bubble-ai space-y-3">
          {structured?.summary && (
            <p className="text-sm font-medium leading-relaxed">{structured.summary}</p>
          )}

          {!structured?.summary && (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}

          {structured?.details && structured.details.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Details</p>
              <ul className="space-y-1">
                {structured.details.map((detail, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {structured?.eligibility && (
            <div className="p-2 bg-background/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Eligibility</p>
              <p className="text-sm">{structured.eligibility}</p>
            </div>
          )}

          {structured?.nextSteps && structured.nextSteps.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Next Steps
              </p>
              <ol className="space-y-1">
                {structured.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {confidence && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className={`confidence-badge confidence-${confidence}`}>
                <ConfidenceIcon className="w-3 h-3" />
                {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
              </span>
            </div>
          )}

          {structured && (
            <p className="text-xs text-muted-foreground italic pt-1">
              Based on official guidelines. This is not legal or financial advice.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
