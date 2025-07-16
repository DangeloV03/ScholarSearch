'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Search, Home, MessageSquare, Settings, User, Send, Bot, Search as SearchIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigationWithTransition } from '@/lib/navigation';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const { isTransitioning, navigateWithTransition, navigateWithTransitionAndData } = useNavigationWithTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage(''); // Clear the input immediately

    if (!user) {
      // If user is not signed in, redirect to register page
      navigateWithTransition('/register');
      return;
    }

    // If user is signed in, create a new conversation and redirect to dashboard
    setIsLoading(true);

    try {
      await navigateWithTransitionAndData(
        '/dashboard',
        { message: messageToSend, agent: 'gemini' },
        '/api/conversations/create-with-message'
      );
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Still redirect to dashboard even if there's an error
      navigateWithTransition('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setMessage(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay isVisible={isTransitioning} />
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">ScholarSearch</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="sidebar-item active">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link href="/dashboard" className="sidebar-item">
              <Search size={20} />
              <span>Search</span>
            </Link>
            <Link href="/chat" className="sidebar-item">
              <MessageSquare size={20} />
              <span>Chat</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {user ? (
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.email}</div>
                  <div className="text-xs text-muted-foreground">Signed in</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Guest User</div>
                  <div className="text-xs text-muted-foreground">
                    <Link href="/login" className="text-primary hover:text-primary/80">
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex flex-col h-screen">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Find Your Perfect
                <span className="text-primary block">Scholarship Match</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Discover scholarships and educational opportunities with AI-powered search. 
                Get personalized recommendations tailored to your background and goals.
              </p>
              
              {/* Chat Interface */}
              <div className="max-w-3xl mx-auto w-full">
                <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div>
                      <div className="font-medium">AI Assistant</div>
                      <div className="text-sm text-muted-foreground">
                        {user ? 'Ask me about scholarships' : 'Sign up to start chatting'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {messages.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          {user ? 'How can I help you today?' : 'Ready to find scholarships?'}
                        </p>
                        <p className="text-sm">
                          {user 
                            ? 'Try asking about scholarships, grants, or educational opportunities'
                            : 'Sign up to start your scholarship search journey'
                          }
                        </p>
                      </div>
                    )}
                    
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-4 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Input */}
                  <form onSubmit={handleSubmit} className="flex space-x-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={user 
                        ? "Ask about scholarships, grants, or educational opportunities..."
                        : "Sign up to start searching for scholarships..."
                      }
                      className="flex-1 chat-input"
                      disabled={isLoading || isTransitioning}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || isLoading || isTransitioning}
                      className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading || isTransitioning ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => handleQuickAction('Show me scholarships for computer science students')}
                  className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-secondary transition-colors text-sm"
                >
                  Computer Science Scholarships
                </button>
                <button
                  onClick={() => handleQuickAction('What are the best scholarships for international students?')}
                  className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-secondary transition-colors text-sm"
                >
                  International Students
                </button>
                <button
                  onClick={() => handleQuickAction('Show me need-based scholarships')}
                  className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-secondary transition-colors text-sm"
                >
                  Need-Based Aid
                </button>
              </div>

              {/* Sign up prompt for non-authenticated users */}
              {!user && (
                <div className="mt-8 p-6 bg-card border border-border rounded-2xl">
                  <h3 className="text-lg font-semibold mb-2">Ready to start your scholarship search?</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a free account to access our AI-powered scholarship search and save your conversations.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => navigateWithTransition('/register')}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Sign Up Free
                    </button>
                    <button
                      onClick={() => navigateWithTransition('/login')}
                      className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="p-6 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 ScholarSearch. AI-powered scholarship discovery.</p>
          </footer>
        </div>
      </div>
    </>
  );
} 