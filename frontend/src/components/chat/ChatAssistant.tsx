import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Plus, Trash2, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { PromptChips } from './PromptChips';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface ChatSession {
  _id: string;
  title: string;
  messages?: any[];
  updatedAt: string;
}

export function ChatAssistant() {
  const { token, user } = useAuth();
  const userId = user?._id;
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Track which sessions have messages loaded IN STATE (not ref)
  const [loadedMessageSessions, setLoadedMessageSessions] = useState<Set<string>>(new Set());

  // 1. Fetch Conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return;
      
      console.log('📋 Fetching conversations...');
      try {
        const res = await axios.get(`${API_URL}/api/v1/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          console.log('✅ Conversations loaded:', res.data.data.length);
          setSessions(res.data.data);
          
          // Get saved session from localStorage
          const savedSessionId = localStorage.getItem('activeChatId');
          
          // Check if saved session exists in fetched conversations
          const validSession = res.data.data.find((s: any) => s._id === savedSessionId);
          
          if (validSession) {
            console.log('✅ Restoring saved session:', savedSessionId);
            setCurrentSessionId(savedSessionId!);
          } else if (res.data.data.length > 0) {
            console.log('✅ Setting first session as current');
            setCurrentSessionId(res.data.data[0]._id);
          }
          
          setConversationsLoaded(true);
        }
      } catch (err) { 
        console.error("❌ Sidebar load failed", err); 
        setConversationsLoaded(true);
      }
    };
    
    fetchConversations();
  }, [token]);

  // 2. Fetch Messages when session changes
  useEffect(() => {
    const fetchMessages = async () => {
      // Wait for conversations to load first
      if (!conversationsLoaded || !currentSessionId || !token) {
        console.log('⏭️ Skipping message fetch:', { conversationsLoaded, currentSessionId: !!currentSessionId, token: !!token });
        return;
      }
      
      // Check if already loaded
      if (loadedMessageSessions.has(currentSessionId)) {
        console.log('✨ Messages already loaded for:', currentSessionId);
        return;
      }

      // Verify session exists
      const sessionExists = sessions.some(s => s._id === currentSessionId);
      if (!sessionExists) {
        console.log('⚠️ Session not found in list:', currentSessionId);
        return;
      }

      console.log('📨 Fetching messages for:', currentSessionId);
      setIsFetching(true);
      
      try {
        const res = await axios.get(`${API_URL}/api/v1/messages/${currentSessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Messages loaded:', res.data.data?.length || 0);
        
        setSessions(prev => prev.map(s => 
          s._id === currentSessionId ? { ...s, messages: res.data.data || [] } : s
        ));
        
        // Mark as loaded
        setLoadedMessageSessions(prev => new Set([...prev, currentSessionId]));
        
        localStorage.setItem('activeChatId', currentSessionId);
      } catch (err) { 
        console.error("❌ Message load failed", err); 
      } finally { 
        setIsFetching(false); 
      }
    };
    
    fetchMessages();
  }, [currentSessionId, token, conversationsLoaded, sessions.length]);

  const currentSession = sessions.find(s => s._id === currentSessionId);
  const messages = currentSession?.messages || [];

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    setDeletingId(sessionId);
    
    try {
      const res = await axios.delete(`${API_URL}/api/v1/conversations/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSessions(prev => prev.filter(s => s._id !== sessionId));
        
        // Remove from loaded sessions
        setLoadedMessageSessions(prev => {
          const newSet = new Set(prev);
          newSet.delete(sessionId);
          return newSet;
        });
        
        if (currentSessionId === sessionId) {
          const remainingSessions = sessions.filter(s => s._id !== sessionId);
          if (remainingSessions.length > 0) {
            setCurrentSessionId(remainingSessions[0]._id);
          } else {
            setCurrentSessionId('');
            localStorage.removeItem('activeChatId');
          }
        }
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert('Failed to delete conversation. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSend = async (content: string) => {
    const tempUserMsg = { 
      sender: 'User', 
      content, 
      _id: 'temp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    
    if (currentSessionId) {
      setSessions(prev => prev.map(s => 
        s._id === currentSessionId ? { ...s, messages: [...(s.messages || []), tempUserMsg] } : s
      ));
    }

    setIsLoading(true);
    try {
      // 1. Get AI response
      const aiRes = await axios.post('https://project-jan-3.onrender.com/query', {
        query: content,
        user_id: userId,
      });

      let conversationId = currentSessionId;

      // 2. Create conversation if new chat
      if (!currentSessionId) {
        const convRes = await axios.post(`${API_URL}/api/v1/conversations`, {
          title: content.substring(0, 50)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (convRes.data.success) {
          conversationId = convRes.data.data._id;
          const newConv = { ...convRes.data.data, messages: [] };
          setSessions(prev => [newConv, ...prev]);
          setCurrentSessionId(conversationId);
          
          // Mark new session as loaded
          setLoadedMessageSessions(prev => new Set([...prev, conversationId]));
        } else {
          throw new Error('Failed to create conversation');
        }
      }

      // 3. Save user message
      const userMsgRes = await axios.post(`${API_URL}/api/v1/messages`, {
        conversationId: conversationId,
        sender: 'User',
        content: content,
        type: aiRes.data.type || 'text'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 4. Save bot message
      const botMsgRes = await axios.post(`${API_URL}/api/v1/messages`, {
        conversationId: conversationId,
        sender: 'Bot',
        content: aiRes.data.answer,
        type: aiRes.data.type || 'text'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 5. BUDGET INTEGRATION - Log expense if transaction exists
      if (aiRes.data.transaction && token) {
        try {
          await axios.post(`${API_URL}/api/v1/airesponse`, {
            message: content,
            userId: userId,
          }, {
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            }
          });
          console.log('✅ Expense logged successfully');
        } catch (expenseErr) {
          console.error('❌ Failed to log expense:', expenseErr);
        }
      }

      // 6. Update local state with actual saved messages
      if (userMsgRes.data.success && botMsgRes.data.success) {
        setSessions(prev => prev.map(s => 
          s._id === conversationId ? { 
            ...s, 
            messages: [
              ...(s.messages || []).filter(m => !m._id.toString().startsWith('temp-')),
              userMsgRes.data.data,
              botMsgRes.data.data
            ] 
          } : s
        ));
      }

    } catch (err) { 
      console.error("Chat save error", err);
      if (currentSessionId) {
        setSessions(prev => prev.map(s => 
          s._id === currentSessionId ? { 
            ...s, 
            messages: (s.messages || []).filter(m => !m._id.toString().startsWith('temp-'))
          } : s
        ));
      }
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-[calc(100vh-5rem)] relative bg-background">
      <button 
        onClick={() => setShowSidebar(!showSidebar)} 
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-card border rounded-lg shadow-md"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      <div className={`fixed lg:relative z-30 w-72 bg-card border-r h-full transition-transform ${
        showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        <div className="p-4 border-b">
          <button 
            onClick={() => { 
              setCurrentSessionId(''); 
              setShowSidebar(false); 
            }} 
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {!conversationsLoaded ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            sessions.map(s => (
              <div 
                key={s._id} 
                onClick={() => { 
                  setCurrentSessionId(s._id); 
                  setShowSidebar(false); 
                }}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSessionId === s._id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title || 'New Chat'}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" /> 
                      {new Date(s.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(s._id, e)}
                    disabled={deletingId === s._id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive disabled:opacity-50"
                    title="Delete conversation"
                  >
                    {deletingId === s._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">Loading history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">FINLIT Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Ask me about financial literacy, scams, or your budget.
              </p>
              <PromptChips onSelect={handleSend} />
            </div>
          ) : (
            <>
              {messages.map((m: any, i: number) => (
                <ChatMessage key={m._id || i} message={m} />
              ))}
              {isLoading && (
                <div className="animate-pulse text-xs text-muted-foreground">
                  AI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        <div className="p-4 border-t bg-background">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}