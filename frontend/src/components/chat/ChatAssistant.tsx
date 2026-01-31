import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { PromptChips } from './PromptChips';
import { MessageCircle, Plus, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}


const generateSessionTitle = (firstMessage: string): string => {
  if (firstMessage.length > 50) {
    return firstMessage.substring(0, 50) + '...';
  }
  return firstMessage || 'New Chat';
};

export function ChatAssistant() {
  const { token, user } = useAuth();
  const userId = user?._id || 'guest';
  console.log("ChatAssistant token:", token);
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
    timestamp: new Date(),
  };

  let activeSessionId = currentSessionId;

  if (!currentSessionId) {
    const newSessionId = Date.now().toString();

    setSessions(prev => [
      {
        id: newSessionId,
        title: generateSessionTitle(content),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...prev,
    ]);

    setCurrentSessionId(newSessionId);
    activeSessionId = newSessionId;
  } else {
    setSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              updatedAt: new Date(),
            }
          : session
      )
    );
  }

  setIsLoading(true);

  // ✅ FIXED URL (no newline)
  const aiResponse = await axios.post(
    'https://project-jan-3.onrender.com/query',
    {
      query: content,
      user_id: userId,
    }
  );

  // Log expense if transaction exists
  if (aiResponse.data.transaction && token) {
    await fetch(`${API_URL}/api/v1/airesponse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: content,
        userId,
      }),
    });
  }

  const aiMessage: Message = {
    id: Date.now().toString() + '_ai',
    role: 'assistant',
    content: aiResponse.data.answer || '',
    timestamp: new Date(),
  };

  setSessions(prev =>
    prev.map(session =>
      session.id === activeSessionId
        ? {
            ...session,
            messages: [...session.messages, aiMessage],
            updatedAt: new Date(),
          }
        : session
    )
  );

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