import { useState, KeyboardEvent, useRef } from 'react';
import { Send, Loader2, Mic, ShieldCheck, Wallet, ArrowRightLeft, ChevronUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  onModelChange?: (model: string) => void;
  currentModel?: string;
}

type ModelType = 'scam-detection' | 'financial-query' | 'transaction-guide';

const models = [
  { 
    id: 'scam-detection', 
    name: 'Scam Detection', 
    icon: ShieldCheck, 
  },
  { 
    id: 'financial-query', 
    name: 'Financial Assistant', 
    icon: Wallet, 
  },
  { 
    id: 'transaction-guide', 
    name: 'Transaction Guide', 
    icon: ArrowRightLeft, 
  },
];

export function ChatInput({ 
  onSend, 
  isLoading, 
  onModelChange, 
  currentModel = 'financial-query'
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    if (onModelChange) {
      onModelChange(modelId);
    }
    setShowModelPicker(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setInput('[Voice input - captured successfully]');
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const currentModelData = models.find(m => m.id === selectedModel) || models[1];
  const CurrentModelIcon = currentModelData.icon;

  return (
    <div className="sticky bottom-0 w-full bg-gradient-to-t from-background via-background pt-8 pb-6 px-4 border-t border-border/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-3 px-1 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold glass-card">
            <CurrentModelIcon className="w-4 h-4 text-primary" />
            <span className="text-foreground">{currentModelData.name}</span>
          </div>
        </div>

        <div className="relative card-elevated hover:border-primary/30 transition-all duration-200">
          <div className="flex items-end gap-2 p-3">
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                disabled={isLoading}
                className="h-11 w-11 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-border group"
                title="Switch model"
              >
                <ChevronUp className={`w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-200 ${showModelPicker ? 'rotate-180' : ''}`} />
              </button>

              {showModelPicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowModelPicker(false)}
                  />
                  
                  <div className="absolute bottom-full left-0 mb-2 card-elevated py-2 min-w-[240px] z-50 overflow-hidden animate-scale-in">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Select Model
                      </p>
                    </div>
                    {models.map((model) => {
                      const Icon = model.icon;
                      const isActive = selectedModel === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model.id)}
                          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors text-left ${
                            isActive ? 'bg-secondary' : ''
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {model.name}
                            </p>
                          </div>
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about government schemes, eligibility, or financial safety…"
              className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground min-h-[44px] max-h-32"
              rows={1}
              disabled={isLoading}
            />

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`relative flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border ${
                isRecording
                  ? 'bg-destructive hover:bg-destructive/90 text-white border-destructive shadow-lg glow-accent'
                  : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border-border'
              }`}
              title={isRecording ? 'Recording... Click to stop' : 'Voice input'}
            >
              {isRecording && (
                <span 
                  className="absolute inset-0 rounded-xl bg-destructive/30 animate-[ping_2s_ease-in-out_infinite]"
                />
              )}
              <Mic className={`w-5 h-5 relative z-10 transition-transform duration-300 ${
                isRecording ? 'scale-110' : 'scale-100'
              }`} />
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 h-12 w-12 rounded-xl btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-xl disabled:shadow-none font-bold"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
              ) : (
                <Send className="w-6 h-6" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        <div className="mt-2 px-1">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-mono text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-mono text-xs">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}