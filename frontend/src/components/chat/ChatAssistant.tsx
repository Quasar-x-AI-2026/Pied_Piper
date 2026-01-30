import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { PromptChips } from './PromptChips';
import { MessageCircle, Plus, Trash2, Clock } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const generateResponse = (userMessage: string): Message => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('pmay') || lowerMessage.includes('housing')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      structured: {
        summary: 'Pradhan Mantri Awas Yojana (PMAY) provides affordable housing for economically weaker sections with interest subsidy on home loans.',
        details: [
          'Subsidy up to ₹2.67 Lakh on home loans',
          'For families with annual income up to ₹18 Lakh',
          'Available for first-time home buyers only',
          'Both urban (PMAY-U) and rural (PMAY-G) schemes available'
        ],
        eligibility: 'You may be eligible if: your annual household income is below ₹18 Lakh, you don\'t own a pucca house anywhere in India, and you\'re a first-time home buyer.',
        nextSteps: [
          'Visit pmaymis.gov.in to check eligibility',
          'Gather documents: Aadhaar, income proof, property papers',
          'Apply through nearest bank or CSC center',
          'Track application online'
        ],
        confidence: 'high'
      }
    };
  }
  
  if (lowerMessage.includes('scam') || lowerMessage.includes('fraud')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      structured: {
        summary: 'Here are key signs to identify financial scams and protect yourself from fraud.',
        details: [
          'Government never asks for money to process schemes',
          'Verify calls claiming to be from banks/officials',
          'Never share OTP, PIN, or password with anyone',
          'Genuine schemes are listed on official .gov.in websites',
          'Report suspicious activity to 1930 (Cyber Crime Helpline)'
        ],
        eligibility: 'If you\'ve received a suspicious message or call, do not respond or click any links.',
        nextSteps: [
          'Block the sender/caller immediately',
          'Report to Cyber Crime portal: cybercrime.gov.in',
          'Alert your bank if you shared any details',
          'File complaint at nearest police station if money lost'
        ],
        confidence: 'high'
      }
    };
  }
  
  if (lowerMessage.includes('student') || lowerMessage.includes('scholarship')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      structured: {
        summary: 'Multiple scholarship schemes are available for students at National Scholarship Portal (NSP).',
        details: [
          'Central sector schemes for various categories',
          'Pre-matric and post-matric scholarships',
          'Scholarships for minorities, SC/ST, OBC students',
          'Technical education scholarships available',
          'Application window usually July to November'
        ],
        eligibility: 'Most scholarships require: enrollment in recognized institution, meeting income criteria (usually ₹2-8 Lakh/year), and maintaining minimum attendance.',
        nextSteps: [
          'Register on scholarships.gov.in',
          'Complete your profile accurately',
          'Check eligible scholarships for your category',
          'Apply before deadline with all documents'
        ],
        confidence: 'high'
      }
    };
  }
  
  if (lowerMessage.includes('senior') || lowerMessage.includes('pension')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      structured: {
        summary: 'Several savings and pension schemes are available for senior citizens with attractive interest rates.',
        details: [
          'Senior Citizen Savings Scheme (SCSS): 8.2% interest',
          'Atal Pension Yojana: ₹1,000-5,000/month pension',
          'PM Vaya Vandana Yojana: Assured pension',
          'Tax benefits under Section 80C available'
        ],
        eligibility: 'SCSS requires age 60+ (55+ for defense/VRS). APY requires joining before age 40 for pension at 60.',
        nextSteps: [
          'Visit nearest post office or bank',
          'Carry age proof and identity documents',
          'Choose scheme based on your needs',
          'Set up nominee details'
        ],
        confidence: 'high'
      }
    };
  }
  
  if (lowerMessage.includes('pm kisan') || lowerMessage.includes('farmer')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      structured: {
        summary: 'PM Kisan provides ₹6,000/year direct income support to farmer families in three installments.',
        details: [
          '₹2,000 every 4 months directly to bank account',
          'For all land-holding farmer families',
          'Aadhaar-linked bank account required',
          'Over 11 crore farmers enrolled'
        ],
        eligibility: 'Eligible if you have cultivable land in your name, valid bank account linked with Aadhaar, and are not a government employee or income taxpayer.',
        nextSteps: [
          'Visit pmkisan.gov.in to register',
          'Provide land records and bank details',
          'Complete eKYC verification',
          'Check installment status online'
        ],
        confidence: 'high'
      }
    };
  }
  
  if (lowerMessage.includes('health') || lowerMessage.includes('ayushman')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      structured: {
        summary: 'Ayushman Bharat (PMJAY) provides ₹5 Lakh health insurance cover per family per year.',
        details: [
          'Covers hospitalization expenses at empaneled hospitals',
          'No premium to be paid by beneficiaries',
          'Covers pre-existing diseases from day one',
          'Cashless treatment across India'
        ],
        eligibility: 'Eligible if your family is listed in SECC 2011 database. Check eligibility at mera.pmjay.gov.in using mobile number or ration card.',
        nextSteps: [
          'Check eligibility at mera.pmjay.gov.in',
          'Get Ayushman card from CSC or hospital',
          'Find nearest empaneled hospital',
          'Show card for cashless treatment'
        ],
        confidence: 'high'
      }
    };
  }
  
  // Default response
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    structured: {
      summary: 'I can help you with information about Indian government schemes, eligibility criteria, and financial safety tips.',
      details: [
        'Ask about specific schemes like PMAY, PM Kisan, Ayushman Bharat',
        'Check eligibility for various benefits',
        'Learn about scholarships and education schemes',
        'Get guidance on pension and savings schemes',
        'Identify scams and protect yourself from fraud'
      ],
      eligibility: 'Try asking specific questions about schemes you\'re interested in for detailed guidance.',
      nextSteps: [
        'Use the quick prompts above for common queries',
        'Check the Scheme Lookup tab for detailed filtering',
        'Use Budget Manager to track your finances'
      ],
      confidence: 'medium'
    }
  };
};

const generateSessionTitle = (firstMessage: string): string => {
  if (firstMessage.length > 50) {
    return firstMessage.substring(0, 50) + '...';
  }
  return firstMessage || 'New Chat';
};

export function ChatAssistant() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSessions = localStorage.getItem('chatSessions');
    if (storedSessions) {
      try {
        const parsed = JSON.parse(storedSessions);
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
        
        if (sessionsWithDates.length > 0) {
          setCurrentSessionId(sessionsWithDates[0].id);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, currentSessionId]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setShowSidebar(false);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: generateSessionTitle(content),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    } else {
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const updatedMessages = [...session.messages, userMessage];
          return {
            ...session,
            messages: updatedMessages,
            title: session.messages.length === 0 ? generateSessionTitle(content) : session.title,
            updatedAt: new Date()
          };
        }
        return session;
      }));
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

    const aiResponse = generateResponse(content);
    
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...session.messages, aiResponse],
          updatedAt: new Date()
        };
      }
      return session;
    }));
    
    setIsLoading(false);
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] relative">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden fixed top-20 left-4 z-40 w-10 h-10 rounded-lg bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30
        w-72 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-4 border-b border-border">
          <button
            onClick={createNewSession}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No chat sessions yet
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`
                    group relative p-3 rounded-lg cursor-pointer transition-colors
                    ${currentSessionId === session.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted border border-transparent'
                    }
                  `}
                  onClick={() => {
                    setCurrentSessionId(session.id);
                    setShowSidebar(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {session.messages.length} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this chat session?')) {
                          deleteSession(session.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {sessions.length} chat session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">How can I help you today?</h2>
                <p className="text-muted-foreground text-sm">
                  Ask me about government schemes, check your eligibility, or learn how to protect yourself from financial scams.
                </p>
              </div>
              <PromptChips onSelect={handleSend} />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-ai flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">Searching guidelines...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="px-4">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}