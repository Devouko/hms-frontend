'use client';

import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

// Dynamically import ThemeProvider with no SSR to prevent
// document/window access during server-side rendering
const ThemeProvider = dynamic(
  () => import('@/components/ThemeProvider').then((m) => m.ThemeProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
