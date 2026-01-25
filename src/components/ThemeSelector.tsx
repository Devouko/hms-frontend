'use client';

import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { colorThemes, getCurrentTheme, setCurrentTheme, applyTheme } from '../utils/themeColors';

export function ThemeSelector() {
  const [currentTheme, setCurrentThemeState] = useState('blue');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const theme = getCurrentTheme();
    setCurrentThemeState(theme);
    
    // Listen for theme changes from other components
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentThemeState(event.detail.theme);
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const handleThemeChange = (themeKey: string) => {
    const theme = colorThemes[themeKey];
    if (theme) {
      setCurrentTheme(themeKey);
      setCurrentThemeState(themeKey);
      applyTheme(theme);
      setIsOpen(false);
      
      // Force immediate visual update
      requestAnimationFrame(() => {
        document.body.offsetHeight;
      });
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-bg rounded-xl hover:bg-card/20"
        title="Change Theme"
      >
        <Palette className="size-5" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-80 z-50 glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Choose Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(colorThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      currentTheme === key ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{
                      borderColor: currentTheme === key ? theme.primary : 'hsl(var(--border))',
                      backgroundColor: 'hsl(var(--card))',
                      ringColor: currentTheme === key ? theme.primary : undefined
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="text-xs font-medium text-card-foreground">
                        {theme.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    {currentTheme === key && (
                      <div className="absolute top-1 right-1">
                        <div 
                          className="size-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <Check className="size-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}