import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { generateConversationTitle } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, agent = 'gemini' } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Generate a contextual title from the message
    const contextualTitle = generateConversationTitle(message);

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title: contextualTitle,
        message_count: 1
      })
      .select()
      .single();

    if (convError) {
      console.error('Error creating conversation:', convError);
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }

    // Create the user message
    const { data: userMessage, error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
        metadata: { searchQuery: message }
      })
      .select()
      .single();

    if (userMsgError) {
      console.error('Error creating user message:', userMsgError);
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
    }

    // Get AI response
    const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8000';
    let agentResponse: string;
    let processingTime = 1000;
    let resultsCount = 1;

    try {
      const startTime = Date.now();
      
      const response = await fetch(`${AGENT_API_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          thread_id: conversation.id,
          agent: agent,
        }),
      });

      processingTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        agentResponse = data.response;
        resultsCount = data.metadata?.results_count || 1;
      } else {
        // Fallback to mock response if agent is not available
        console.warn('Agent API not available, using mock response');
        agentResponse = `I found several scholarships that match your query: "${message}". Here are some relevant opportunities...`;
      }
    } catch (error) {
      console.warn('Failed to connect to agent API, using mock response:', error);
      agentResponse = `I found several scholarships that match your query: "${message}". Here are some relevant opportunities...`;
    }

    // Create the assistant message
    const { data: assistantMessage, error: assistantMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: agentResponse,
        metadata: { 
          searchQuery: message,
          resultsCount: resultsCount,
          processingTime: processingTime
        }
      })
      .select()
      .single();

    if (assistantMsgError) {
      console.error('Error creating assistant message:', assistantMsgError);
      return NextResponse.json({ error: 'Failed to create assistant message' }, { status: 500 });
    }

    // Update conversation message count
    await supabase
      .from('conversations')
      .update({ 
        message_count: 2,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversation.id);

    // Transform the data to match the frontend types
    const transformedConversation = {
      id: conversation.id,
      userId: conversation.user_id,
      title: conversation.title,
      createdAt: new Date(conversation.created_at),
      updatedAt: new Date(conversation.updated_at),
      messageCount: 2,
      isArchived: conversation.is_archived
    };

    const transformedUserMessage = {
      id: userMessage.id,
      conversationId: userMessage.conversation_id,
      role: userMessage.role,
      content: userMessage.content,
      createdAt: new Date(userMessage.created_at),
      metadata: userMessage.metadata || {}
    };

    const transformedAssistantMessage = {
      id: assistantMessage.id,
      conversationId: assistantMessage.conversation_id,
      role: assistantMessage.role,
      content: assistantMessage.content,
      createdAt: new Date(assistantMessage.created_at),
      metadata: assistantMessage.metadata || {}
    };

    return NextResponse.json({ 
      conversation: transformedConversation,
      messages: [transformedUserMessage, transformedAssistantMessage]
    });
  } catch (error) {
    console.error('Error in POST /api/conversations/create-with-message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 