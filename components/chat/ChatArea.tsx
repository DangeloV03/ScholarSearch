'use client';

import { useRef, useEffect } from 'react';
import { Message, Conversation } from '@/types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { Bot } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  currentConversation: Conversation | null;
  onSendMessage: (content: string, agent: 'gemini' | 'tavily') => void;
  isLoading: boolean;
  error: string | null;
}

export default function ChatArea({
  messages,
  currentConversation,
  onSendMessage,
  isLoading,
  error
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, agent: 'gemini' | 'tavily') => {
    if (content.trim() && !isLoading) {
      onSendMessage(content, agent);
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Bot size={64} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Welcome to ScholarSearch
          </h3>
          <p className="text-muted-foreground max-w-md">
            Start a new conversation to begin searching for scholarships. 
            I can help you find opportunities based on your academic background, 
            field of study, and other criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center">
          <Bot size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-semibold text-foreground">
            {currentConversation.title}
          </h2>
          {isLoading && (
            <div className="ml-2 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            <Bot size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation by asking about scholarships</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!currentConversation}
      />
    </div>
  );
} 