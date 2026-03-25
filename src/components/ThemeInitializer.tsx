'use client';

import { useEffect } from 'react';
import { themeService } from '../utils/themeService';
import { getCurrentTheme, setCurrentTheme } from '../utils/themeColors';

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize both theme services
    themeService.initializeTheme();
    
    // Apply color theme
    const currentColorTheme = getCurrentTheme();
    setCurrentTheme(currentColorTheme);
    
    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = getCurrentTheme();
      setCurrentTheme(newTheme);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);
  
  return null;
}

