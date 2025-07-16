'use client';

import { useState } from 'react';
import { Conversation } from '@/types';
import { Plus, MessageSquare, Trash2, Archive } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isLoading: boolean;
}

export default function ConversationSidebar({
  conversations,
  currentConversation,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  isLoading
}: ConversationSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);

  const handleCreateConversation = async () => {
    setIsCreating(true);
    await onCreateConversation();
    setIsCreating(false);
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      setDeletingConversationId(conversationId);
      try {
        await onDeleteConversation(conversationId);
      } finally {
        setDeletingConversationId(null);
      }
    }
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          <button
            onClick={handleCreateConversation}
            disabled={isLoading || isCreating}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            title="New conversation"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new conversation to begin searching for scholarships</p>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors mb-1
                  ${currentConversation?.id === conversation.id
                    ? 'bg-muted border border-border'
                    : 'hover:bg-muted'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {truncateTitle(conversation.title)}
                    </h3>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span>{conversation.messageCount} messages</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(conversation.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement archive functionality
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground rounded"
                      title="Archive conversation"
                    >
                      <Archive size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      disabled={deletingConversationId === conversation.id}
                      className="p-1 text-muted-foreground hover:text-destructive rounded disabled:opacity-50"
                      title="Delete conversation"
                    >
                      {deletingConversationId === conversation.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-destructive"></div>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          ScholarSearch AI Assistant
        </div>
      </div>
    </div>
  );
} 