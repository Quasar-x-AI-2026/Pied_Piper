// ChatMessage.tsx
export function ChatMessage({ message }: { message: any }) {
  const isUser = message.sender === 'User';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
        isUser 
        ? 'bg-primary text-primary-foreground rounded-tr-none' 
        : 'bg-card border border-border rounded-tl-none'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className="text-[10px] opacity-50 mt-2 block">
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}