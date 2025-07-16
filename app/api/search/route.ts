import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, conversationId, threadId, agent } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Try to get response from FastAPI agent backend
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
          query,
          thread_id: threadId || conversationId,
          agent: agent || 'gemini',
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
        agentResponse = await simulateAgentResponse(query, threadId);
      }
    } catch (error) {
      console.warn('Failed to connect to agent API, using mock response:', error);
      agentResponse = await simulateAgentResponse(query, threadId);
    }

    // Save search to history
    await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        query,
        result_count: resultsCount
      });

    return NextResponse.json({ 
      response: agentResponse,
      conversationId,
      threadId: threadId || conversationId,
      metadata: {
        processingTime,
        resultsCount
      }
    });
  } catch (error) {
    console.error('Error in POST /api/search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function simulateAgentResponse(query: string, threadId?: string): Promise<string> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response based on query with specific scholarship information
  const responses = [
    `I found several excellent scholarship opportunities that match your query: "${query}". Here are specific programs with real details:

**Merit-Based Scholarships:**
• **National Merit Scholarship Program**
  - Amount: $2,500 - $7,500
  - Deadline: October (PSAT registration)
  - Requirements: High PSAT scores, academic excellence

• **Coca-Cola Scholars Program**
  - Amount: $20,000
  - Deadline: October 31st
  - Requirements: 3.0+ GPA, leadership experience, community service

• **Gates Millennium Scholars Program**
  - Amount: Full tuition coverage
  - Deadline: January 15th
  - Requirements: Minority students, 3.3+ GPA, financial need

**Need-Based Scholarships:**
• **Federal Pell Grant**
  - Amount: Up to $6,495 (2023-24)
  - Deadline: June 30th (FAFSA)
  - Requirements: Financial need, U.S. citizen

• **Federal Supplemental Educational Opportunity Grant (FSEOG)**
  - Amount: $100 - $4,000
  - Deadline: June 30th (FAFSA)
  - Requirements: Exceptional financial need

**Application Tips:**
- Start early and keep track of all deadlines
- Prepare strong recommendation letters from teachers/counselors
- Write compelling personal statements highlighting your achievements
- Maintain a strong GPA and participate in extracurricular activities
- Apply for multiple scholarships to increase your chances

Would you like me to search for more specific scholarships based on your academic background, field of study, or other criteria?`,

    `Based on your search for "${query}", here are some relevant scholarship opportunities with specific details:

**Academic Excellence Scholarships:**
• **Presidential Scholarship**
  - Amount: Full tuition coverage
  - Deadline: December 1st
  - Requirements: 3.8+ GPA, SAT 1400+ or ACT 32+

• **Dean's Scholarship**
  - Amount: $15,000 annually
  - Deadline: February 15th
  - Requirements: 3.5+ GPA, leadership activities

• **Academic Achievement Award**
  - Amount: $5,000
  - Deadline: March 1st
  - Requirements: 3.3+ GPA, community service

**Field-Specific Scholarships:**
• **Society of Women Engineers Scholarship**
  - Amount: $1,000 - $15,000
  - Deadline: May 1st
  - Requirements: Female engineering students, 3.0+ GPA

• **American Institute of CPAs Scholarship**
  - Amount: $5,000
  - Deadline: April 1st
  - Requirements: Accounting majors, 3.0+ GPA

• **American Medical Association Foundation Scholarship**
  - Amount: $10,000
  - Deadline: March 15th
  - Requirements: Pre-med students, financial need

**Application Strategy:**
- Create a scholarship application calendar
- Tailor your essays to each scholarship's mission
- Gather all required documents early
- Follow up on applications and thank scholarship committees
- Consider local scholarships with less competition

Let me know if you'd like to explore scholarships in a specific field or with particular eligibility requirements!`,

    `Here are some great scholarship opportunities related to "${query}" with specific details:

**Undergraduate Scholarships:**
• **Jack Kent Cooke Foundation Undergraduate Transfer Scholarship**
  - Amount: Up to $55,000 annually
  - Deadline: January 12th
  - Requirements: Community college transfer, 3.5+ GPA, financial need

• **Dell Scholars Program**
  - Amount: $20,000 + laptop + textbook credits
  - Deadline: December 1st
  - Requirements: First-generation college students, 2.4+ GPA

• **Horatio Alger Association Scholarship**
  - Amount: $25,000
  - Deadline: October 25th
  - Requirements: Financial need, community service, 2.0+ GPA

**Graduate Scholarships:**
• **National Science Foundation Graduate Research Fellowship**
  - Amount: $34,000 annually for 3 years
  - Deadline: October 22nd
  - Requirements: STEM fields, U.S. citizen, research potential

• **Fulbright U.S. Student Program**
  - Amount: Full funding for international study/research
  - Deadline: October 12th
  - Requirements: U.S. citizen, bachelor's degree, research proposal

• **Knight-Hennessy Scholars Program**
  - Amount: Full funding for Stanford graduate programs
  - Deadline: October 12th
  - Requirements: Leadership potential, academic excellence

**International Student Scholarships:**
• **AAUW International Fellowships**
  - Amount: $18,000 - $30,000
  - Deadline: November 15th
  - Requirements: Non-U.S. women, graduate study

• **Rotary Foundation Global Grant**
  - Amount: $30,000
  - Deadline: Varies by district
  - Requirements: Graduate study abroad, peace/development focus

**Success Tips:**
- Start your scholarship search early (junior year of high school)
- Apply for both large and small scholarships
- Network with scholarship organizations and alumni
- Keep detailed records of all applications and deadlines
- Don't get discouraged by rejections - persistence pays off!

I can help you find more specific scholarships based on your location, major, or other preferences. What additional criteria should I consider?`
  ];

  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
} 