// User and Profile Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Chat and Conversation Types
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  isArchived: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  metadata?: {
    searchQuery?: string;
    resultsCount?: number;
    processingTime?: number;
    [key: string]: any;
  };
}

export interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// Search Types
export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  createdAt: Date;
  resultCount?: number;
}

export interface SearchRequest {
  query: string;
  conversationId?: string;
  threadId?: string;
}

export interface SearchResponse {
  response: string;
  conversationId?: string;
  threadId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
} 