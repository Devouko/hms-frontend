import { useEffect } from 'react';
import { getCurrentTheme, setCurrentTheme, applyTheme, colorThemes } from '../utils/themeColors';

export function useThemeInitialization() {
  useEffect(() => {
    // Initialize theme on app startup
    const currentTheme = getCurrentTheme();
    const theme = colorThemes[currentTheme];
    
    if (theme) {
      applyTheme(theme);
    }
    
    // Listen for theme changes and apply them
    const handleThemeChange = (event: CustomEvent) => {
      const themeKey = event.detail.theme;
      const themeData = event.detail.themeData;
      
      if (themeData) {
        applyTheme(themeData);
      } else if (themeKey && colorThemes[themeKey]) {
        applyTheme(colorThemes[themeKey]);
      }
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);
}