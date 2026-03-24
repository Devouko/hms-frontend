import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import { getCurrentTheme, applyTheme, colorThemes } from '../utils/themeColors';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    let newTheme: 'light' | 'dark';
    
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'light';
    } else {
      // If system, toggle to light first
      newTheme = 'light';
    }
    
    setTheme(newTheme);
    
    // Force immediate reapplication of color theme
    setTimeout(() => {
      const currentColorTheme = getCurrentTheme();
      const colorTheme = colorThemes[currentColorTheme];
      if (colorTheme) {
        applyTheme(colorTheme);
      }
    }, 50);
  };

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 glass-bg rounded-xl hover:bg-card/20"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
