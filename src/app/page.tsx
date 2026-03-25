'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { AuthPage } from '@/components/AuthPage';
import { MainApp } from '@/components/MainApp';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.warn('Auth session error:', error.message);
        setSession(session);
      } catch (error) {
        console.warn('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading SmartCare...</p>
        </div>
      </div>
    );
  }

  return !session ? (
    <AuthPage supabase={supabase} />
  ) : (
    <MainApp session={session} supabase={supabase} />
  );
}
