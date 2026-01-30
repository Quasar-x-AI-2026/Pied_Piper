import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { MessageCircle, Plus, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { PromptChips } from "./PromptChips";
import { Message } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  hasLoaded?: boolean; // New flag to prevent redundant API calls
}

export function ChatAssistant() {
  const { token, user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Memoize headers to prevent effect re-runs
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token]);

  /* ------------------------- Auto Scroll ------------------------- */
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, currentSessionId, scrollToBottom]);

  /* ---------------------- Initial Load --------------------------- */
  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setError("Authentication required");
      setLoadingChats(false);
      return;
    }
    loadConversations();
  }, [authLoading, token]);

  /* ---------------------- API Actions --------------------- */
  
  const loadConversations = async () => {
    try {
      const res = await axios.get(`${API_URL}/conversations`, { headers });
      const chats = res.data.data.map((c: any) => ({
        id: c._id,
        title: c.title,
        messages: [],
        hasLoaded: false,
      }));

      setSessions(chats);
      if (chats.length > 0) {
        setCurrentSessionId(chats[0].id);
        loadMessages(chats[0].id);
      }
    } catch (err) {
      setError("Failed to load conversations");
    } finally {
      setLoadingChats(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const session = sessions.find(s => s.id === conversationId);
    if (session?.hasLoaded) return; // Prevent double-fetching

    try {
      const res = await axios.get(`${API_URL}/conversations/${conversationId}`, { headers });
      const messages = res.data.data.messages.map((m: any) => ({
        id: m._id,
        role: m.sender.toLowerCase(),
        content: m.content,
        timestamp: new Date(m.createdAt),
      }));

      setSessions(prev => prev.map(s => 
        s.id === conversationId ? { ...s, messages, hasLoaded: true } : s
      ));
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const createNewChat = async () => {
    try {
      const res = await axios.post(`${API_URL}/conversations`, { title: "New Chat" }, { headers });
      const newChat: ChatSession = {
        id: res.data.data._id,
        title: res.data.data.title,
        messages: [],
        hasLoaded: true,
      };
      setSessions(prev => [newChat, ...prev]);
      setCurrentSessionId(newChat.id);
    } catch (err) {
      alert("Could not create chat");
    }
  };

  const deleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;

    try {
      await axios.delete(`${API_URL}/conversations/${id}`, { headers });
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) setCurrentSessionId("");
    } catch (err) {
      alert("Failed to delete chat");
    }
  };

  const handleSend = async (content: string) => {
    if (!currentSessionId || !content.trim()) return;

    const tempId = `tmp-${Date.now()}`;
    const userMsg: Message = { id: tempId, role: "user", content, timestamp: new Date() };

    setSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, messages: [...s.messages, userMsg] } : s
    ));
    setIsSending(true);

    try {
      const res = await axios.post(`${API_URL}/messages`, 
        { conversationId: currentSessionId, content }, 
        { headers }
      );
      
      // Extract from the structure shown in your console log
      const { botMessage, type } = res.data.data;

      const botMsg: Message = {
        id: botMessage._id,
        role: "assistant",
        content: botMessage.content,
        timestamp: new Date(botMessage.createdAt),
      };

      setSessions(prev => prev.map(s => {
        if (s.id !== currentSessionId) return s;
        
        // Remove the temporary message and add the real ones
        let newMessages = [...s.messages.filter(m => m.id !== tempId), botMsg];
        
        // Check if this was a financial transaction based on your "type": "finance" field
        if (type === "finance" && botMessage.structured) {
          try {
            const structuredData = JSON.parse(botMessage.structured);
            const { amount, category, description } = structuredData.transaction;
            
            newMessages.push({
              id: `exp-${Date.now()}`,
              role: "assistant",
              content: `✅ Transaction Logged: ₹${amount} for ${category || description}`,
              timestamp: new Date(),
            });
          } catch (e) {
            console.error("Failed to parse structured finance data", e);
          }
        }
        
        return { ...s, messages: newMessages };
      }));
    } catch (err) {
      console.error(err);
      alert("Message failed to send.");
    } finally {
      setIsSending(false);
    }
  };

  /* ---------------------- UI States --------------------------- */

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-primary underline">Retry</button>
      </div>
    );
  }

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-card/50 backdrop-blur flex flex-col">
        <div className="p-4 border-b">
          <button onClick={createNewChat} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingChats ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentSessionId(s.id);
                  loadMessages(s.id);
                }}
                className={`group p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                  currentSessionId === s.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm font-medium">{s.title}</span>
                </div>
                <button onClick={(e) => deleteChat(e, s.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-20">
          {!currentSessionId ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full"><MessageCircle className="w-8 h-8 text-primary" /></div>
              <h2 className="text-xl font-semibold">Ready to track your expenses?</h2>
              <p className="text-muted-foreground max-w-xs">Select a conversation or start a new one to begin chatting with your assistant.</p>
            </div>
          ) : currentSession?.messages.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center mb-10">
                <h1 className="text-2xl font-bold mb-2">Hello, {user?.name || 'there'}!</h1>
                <p className="text-muted-foreground">How can I help you manage your budget today?</p>
              </div>
              <PromptChips onSelect={handleSend} />
            </div>
          ) : (
            <div className="space-y-6">
              {currentSession?.messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {isSending && (
                <div className="flex gap-2 items-center text-muted-foreground animate-pulse text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> assistant is typing...
                </div>
              )}
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>

        <footer className="p-4 border-t bg-background/80 backdrop-blur">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={handleSend} isLoading={isSending} />
          </div>
        </footer>
      </main>
    </div>
  );
}