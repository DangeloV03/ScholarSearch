import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import ChatInterface from '@/components/chat/ChatInterface';

interface DashboardPageProps {
  searchParams: { conversation?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = createSupabaseServerClient();
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatInterface initialConversationId={searchParams.conversation} />
    </div>
  );
} 