'use client';

import { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '@/types';
import ConversationSidebar from './ConversationSidebar';
import ChatArea from './ChatArea';
import { supabase } from '@/lib/supabaseClient';

interface ChatInterfaceProps {
  initialConversationId?: string;
}

export default function ChatInterface({ initialConversationId }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      
      if (response.ok) {
        setConversations(data.conversations || []);
      } else {
        setError(data.error || 'Failed to fetch conversations');
      }
    } catch (err) {
      setError('Failed to fetch conversations');
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('Failed to fetch messages');
    }
  };

  const createNewConversation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const newConversation = data.conversation;
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
        setMessages([]);
      } else {
        setError(data.error || 'Failed to create conversation');
      }
    } catch (err) {
      setError('Failed to create conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove from conversations list
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // If this was the current conversation, clear it
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete conversation');
      }
    } catch (err) {
      setError('Failed to delete conversation');
    }
  };

  // Update sendMessage to accept agent
  const sendMessage = async (content: string, agent: 'gemini' | 'tavily') => {
    if (!currentConversation || !content.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to UI immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: currentConversation.id,
        role: 'user',
        content,
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Save user message to database
      const userResponse = await fetch(`/api/conversations/${currentConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'user',
          content,
          metadata: { searchQuery: content }
        })
      });

      if (!userResponse.ok) {
        throw new Error('Failed to save user message');
      }

      // Get agent response, pass agent param
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: content,
          conversationId: currentConversation.id,
          threadId: currentConversation.id,
          agent
        })
      });

      const searchData = await searchResponse.json();
      
      if (!searchResponse.ok) {
        throw new Error(searchData.error || 'Failed to get agent response');
      }

      // Save assistant message to database
      const assistantResponse = await fetch(`/api/conversations/${currentConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'assistant',
          content: searchData.response,
          metadata: { 
            searchQuery: content,
            resultsCount: 1,
            processingTime: 1000
          }
        })
      });

      if (!assistantResponse.ok) {
        throw new Error('Failed to save assistant message');
      }

      const assistantData = await assistantResponse.json();

      // Update messages with the saved assistant message
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== userMessage.id),
        userMessage,
        assistantData.message
      ]);

      // Refresh conversations to update message count and title
      fetchConversations();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the temporary user message on error
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await fetchMessages(conversation.id);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
    }
  }, [currentConversation?.id]);

  // Handle initial conversation selection
  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const targetConversation = conversations.find(conv => conv.id === initialConversationId);
      if (targetConversation) {
        setCurrentConversation(targetConversation);
        fetchMessages(targetConversation.id);
      }
    }
  }, [initialConversationId, conversations]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={selectConversation}
        onCreateConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        isLoading={isLoading}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea
          messages={messages}
          currentConversation={currentConversation}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
} 