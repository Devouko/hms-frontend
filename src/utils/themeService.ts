interface ThemeColor {
  name: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  ring: string;
  gradient: string;
}

export const themeColors: ThemeColor[] = [
  {
    name: 'Sky Blue (Default)',
    primary: '#38bdf8',
    primaryForeground: '#ffffff',
    secondary: '#f0f9ff',
    accent: '#0ea5e9',
    muted: '#f8fafc',
    border: 'rgba(56, 189, 248, 0.2)',
    ring: '#38bdf8',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)'
  },
  {
    name: 'Emerald Green',
    primary: '#10b981',
    primaryForeground: '#ffffff',
    secondary: '#ecfdf5',
    accent: '#059669',
    muted: '#f0fdf4',
    border: 'rgba(16, 185, 129, 0.2)',
    ring: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    primaryForeground: '#ffffff',
    secondary: '#f5f3ff',
    accent: '#7c3aed',
    muted: '#faf5ff',
    border: 'rgba(139, 92, 246, 0.2)',
    ring: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
  },
  {
    name: 'Rose Pink',
    primary: '#f43f5e',
    primaryForeground: '#ffffff',
    secondary: '#fff1f2',
    accent: '#e11d48',
    muted: '#fef2f2',
    border: 'rgba(244, 63, 94, 0.2)',
    ring: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
  },
  {
    name: 'Orange Sunset',
    primary: '#f97316',
    primaryForeground: '#ffffff',
    secondary: '#fff7ed',
    accent: '#ea580c',
    muted: '#fffbeb',
    border: 'rgba(249, 115, 22, 0.2)',
    ring: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
  },
  {
    name: 'Teal Ocean',
    primary: '#14b8a6',
    primaryForeground: '#ffffff',
    secondary: '#f0fdfa',
    accent: '#0d9488',
    muted: '#f0fdf4',
    border: 'rgba(20, 184, 166, 0.2)',
    ring: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  },
  {
    name: 'Indigo Night',
    primary: '#6366f1',
    primaryForeground: '#ffffff',
    secondary: '#f0f9ff',
    accent: '#4f46e5',
    muted: '#f8fafc',
    border: 'rgba(99, 102, 241, 0.2)',
    ring: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
  },
  {
    name: 'Crimson Red',
    primary: '#dc2626',
    primaryForeground: '#ffffff',
    secondary: '#fef2f2',
    accent: '#b91c1c',
    muted: '#fef2f2',
    border: 'rgba(220, 38, 38, 0.2)',
    ring: '#dc2626',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
  }
];

class ThemeService {
  private currentTheme: ThemeColor;

  constructor() {
    this.currentTheme = this.loadTheme();
    this.applyTheme(this.currentTheme);
  }

  private loadTheme(): ThemeColor {
    try {
      const savedTheme = localStorage.getItem('hospital_theme');
      if (savedTheme) {
        const themeName = JSON.parse(savedTheme);
        const theme = themeColors.find(t => t.name === themeName);
        if (theme) return theme;
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
    return themeColors[0];
  }

  public setTheme(theme: ThemeColor): void {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  private applyTheme(theme: ThemeColor): void {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    // Core theme variables
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-foreground', theme.primaryForeground);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--ring', theme.primary);
    
    // Adjust colors for dark mode
    if (isDark) {
      root.style.setProperty('--background', '#0f172a');
      root.style.setProperty('--foreground', '#f8fafc');
      root.style.setProperty('--card', '#1e293b');
      root.style.setProperty('--card-foreground', '#f8fafc');
      root.style.setProperty('--input-background', '#1e293b');
      root.style.setProperty('--muted-foreground', '#94a3b8');
      root.style.setProperty('--secondary', '#334155');
      root.style.setProperty('--secondary-foreground', '#f8fafc');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#1f2937');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--card-foreground', '#1f2937');
      root.style.setProperty('--input-background', '#ffffff');
      root.style.setProperty('--muted-foreground', '#64748b');
      root.style.setProperty('--secondary', theme.secondary);
      root.style.setProperty('--secondary-foreground', '#1f2937');
    }
    
    // Sidebar variables
    root.style.setProperty('--sidebar', isDark ? '#1e293b' : theme.primary);
    root.style.setProperty('--sidebar-foreground', theme.primaryForeground);
    root.style.setProperty('--sidebar-primary', theme.primary);
    root.style.setProperty('--sidebar-primary-foreground', theme.primaryForeground);
    root.style.setProperty('--sidebar-accent', isDark ? '#334155' : `${theme.primary}1a`);
    root.style.setProperty('--sidebar-accent-foreground', theme.primaryForeground);
    root.style.setProperty('--sidebar-border', isDark ? '#475569' : `${theme.primary}1a`);
    root.style.setProperty('--sidebar-ring', theme.primary);
    
    // Chart variables
    root.style.setProperty('--chart-1', theme.primary);
    root.style.setProperty('--chart-2', theme.accent);
    root.style.setProperty('--chart-3', `${theme.primary}cc`);
    root.style.setProperty('--chart-4', `${theme.accent}cc`);
    root.style.setProperty('--chart-5', `${theme.primary}99`);
    
    // Force immediate repaint
    root.style.setProperty('--theme-timestamp', Date.now().toString());
    
    // Force body background update
    document.body.style.backgroundColor = isDark ? '#0f172a' : '#ffffff';
    document.body.style.color = isDark ? '#f8fafc' : '#1f2937';
    
    // Trigger reflow
    document.body.offsetHeight;
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
  }

  private saveTheme(theme: ThemeColor): void {
    try {
      localStorage.setItem('hospital_theme', JSON.stringify(theme.name));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  public getCurrentTheme(): ThemeColor {
    return this.currentTheme;
  }

  public getThemeByName(name: string): ThemeColor | undefined {
    return themeColors.find(theme => theme.name === name);
  }

  public getAllThemes(): ThemeColor[] {
    return themeColors;
  }
}

export const themeService = new ThemeService();