// src/components/ChatMessage.tsx
import { Message } from '@/types';
import { User, Bot, CheckCircle, AlertCircle, HelpCircle, FileText, ArrowRight, Shield, TrendingUp, Wallet } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

  // Parse structured data if available
  let structuredData = null;
  try {
    if (message.structured) {
      structuredData = typeof message.structured === 'string' 
        ? JSON.parse(message.structured) 
        : message.structured;
    }
  } catch (error) {
    console.error('Error parsing structured data:', error);
  }

  // Get icon based on message type
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'greeting':
        return Bot;
      case 'scam_detection':
        return Shield;
      case 'transaction':
        return Wallet;
      case 'scheme_query':
        return FileText;
      default:
        return Bot;
    }
  };

  const TypeIcon = getTypeIcon(structuredData?.type);

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-4 h-4 text-accent" />
        </div>
        <div className="chat-bubble-ai space-y-3">
          {/* Main content with markdown support */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Customize markdown rendering
                p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-sm">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-sm">{children}</ol>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Display transaction info if available */}
          {structuredData?.transaction && (
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Transaction Details</p>
              <div className="space-y-1 text-sm">
                <p><strong>Amount:</strong> ₹{structuredData.transaction.amount}</p>
                <p><strong>Category:</strong> {structuredData.transaction.category}</p>
                <p><strong>Description:</strong> {structuredData.transaction.description}</p>
              </div>
            </div>
          )}

          {/* Display alert if available */}
          {structuredData?.alert && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-destructive uppercase tracking-wide mb-1">Alert</p>
                  <p className="text-sm">{structuredData.alert}</p>
                </div>
              </div>
            </div>
          )}

          {/* Display user profile info if available */}
          {structuredData?.userProfile && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">User Profile</p>
              <pre className="text-xs overflow-auto">{JSON.stringify(structuredData.userProfile, null, 2)}</pre>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground italic pt-1">
            Based on official guidelines. This is not legal or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}