import { useEffect } from 'react';
import { themeService } from '../utils/themeService';

export function useThemeInitialization() {
  useEffect(() => {
    // Initialize theme on app startup
    const currentTheme = themeService.getCurrentTheme();
    themeService.setTheme(currentTheme);
    
    // Listen for theme changes from other components
    const handleThemeChange = (event: CustomEvent) => {
      console.log('Theme changed to:', event.detail.name);
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);
}