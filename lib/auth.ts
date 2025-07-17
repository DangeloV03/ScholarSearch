'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export interface AuthError {
  message: string;
  code?: string;
}

export const handleAuthError = (error: any): AuthError => {
  const message = error?.message || 'An authentication error occurred';
  
  if (message.includes('Email not confirmed') || message.includes('email_confirmed_at')) {
    return {
      message: 'Your account needs to be confirmed. Please check your email for a confirmation link, or contact support if you need help.',
      code: 'EMAIL_NOT_CONFIRMED'
    };
  }
  
  if (message.includes('Invalid login credentials')) {
    return {
      message: 'Invalid email or password. Please check your credentials and try again.',
      code: 'INVALID_CREDENTIALS'
    };
  }
  
  if (message.includes('Too many requests')) {
    return {
      message: 'Too many login attempts. Please wait a moment before trying again.',
      code: 'RATE_LIMITED'
    };
  }
  
  return {
    message,
    code: 'UNKNOWN_ERROR'
  };
};

export const resendConfirmationEmail = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });
  
  return { error };
};

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { data: null, error: handleAuthError(error) };
  }
  
  return { data, error: null };
}; 

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
} 