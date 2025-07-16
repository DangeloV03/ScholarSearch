import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { generateConversationTitle } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify conversation belongs to user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get messages for the conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', params.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    // Transform the data to match the frontend types
    const transformedMessages = messages?.map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      role: msg.role,
      content: msg.content,
      createdAt: new Date(msg.created_at),
      metadata: msg.metadata || {}
    })) || [];

    return NextResponse.json({ messages: transformedMessages });
  } catch (error) {
    console.error('Error in GET /api/conversations/[id]/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify conversation belongs to user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, message_count, title')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const { role, content, metadata } = await request.json();

    // Create new message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: params.id,
        role,
        content,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
    }

    // Update conversation message count and updated_at
    const updateData: any = { 
      message_count: conversation.message_count + 1,
      updated_at: new Date().toISOString()
    };

    // If this is the first user message, generate a contextual title
    if (role === 'user' && conversation.message_count === 0) {
      const contextualTitle = generateConversationTitle(content);
      updateData.title = contextualTitle;
    }

    await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', params.id);

    // Transform the message to match the frontend types
    const transformedMessage = {
      id: message.id,
      conversationId: message.conversation_id,
      role: message.role,
      content: message.content,
      createdAt: new Date(message.created_at),
      metadata: message.metadata || {}
    };

    return NextResponse.json({ message: transformedMessage });
  } catch (error) {
    console.error('Error in POST /api/conversations/[id]/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 