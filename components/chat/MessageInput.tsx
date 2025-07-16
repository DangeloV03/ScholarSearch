'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, Search } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, agent: 'gemini' | 'tavily') => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function MessageInput({ 
  onSendMessage, 
  isLoading, 
  disabled = false 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [agent, setAgent] = useState<'gemini' | 'tavily'>('gemini');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim(), agent);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleAgent = () => {
    setAgent(prev => prev === 'gemini' ? 'tavily' : 'gemini');
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3 p-4 border-t border-border bg-card">
      {/* Attachment Button */}
      <button
        type="button"
        disabled={disabled}
        className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors disabled:opacity-50"
        title="Attach file"
      >
        <Paperclip size={20} />
      </button>

      {/* Text Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about scholarships, grants, or educational opportunities..."
          disabled={disabled || isLoading}
          className="w-full chat-input resize-none"
          rows={1}
          style={{ minHeight: '44px', maxHeight: '120px' }}
        />
      </div>

      {/* Agent Toggle Button */}
      <button
        type="button"
        onClick={toggleAgent}
        disabled={isLoading || disabled}
        className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted border border-border rounded-lg hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Current agent: ${agent === 'gemini' ? 'Gemini' : 'Tavily'}. Click to switch.`}
      >
        {agent === 'gemini' ? 'Gemini' : 'Tavily'}
      </button>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        title="Send message"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <Send size={20} />
        )}
      </button>
    </form>
  );
} 