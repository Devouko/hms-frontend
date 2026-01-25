import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Toaster } from 'sonner';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { AuthPage } from './components/AuthPage';
import { MainApp } from './components/MainApp';
import { ThemeProvider } from './components/ThemeProvider';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Auth session error:', error.message);
      }
      setSession(session);
      setLoading(false);
    }).catch((error) => {
      console.warn('Auth initialization error:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

  return (
    <ThemeProvider>
      {!session ? (
        <AuthPage supabase={supabase} />
      ) : (
        <MainApp session={session} supabase={supabase} />
      )}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}