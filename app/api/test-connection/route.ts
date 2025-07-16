import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    // Test basic connection by getting the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Test database connection by making a simple query
    const { data: testData, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    const connectionStatus = {
      success: true,
      timestamp: new Date().toISOString(),
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Missing',
      },
      auth: {
        status: userError ? 'Error' : 'Connected',
        error: userError?.message || null,
        user: user ? 'Authenticated' : 'No user',
      },
      database: {
        status: dbError ? 'Error' : 'Connected',
        error: dbError?.message || null,
        tables: testData !== null ? 'Accessible' : 'Error',
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasEnvFile: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      }
    };

    return NextResponse.json(connectionStatus);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 