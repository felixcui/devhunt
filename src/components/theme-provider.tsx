'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [isSystemDark, setIsSystemDark] = useState(false);

  useEffect(() => {
    // Check system preference
    const checkSystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsSystemDark(isDark);
      
      // If no theme is set in localStorage, use system preference
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (!savedTheme) {
        setCurrentTheme(isDark ? 'dark' : 'light');
      }
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    checkSystemTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
      // Only update if no theme is explicitly set
      if (!localStorage.getItem('theme')) {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(`${currentTheme}-mode`);
    
    // Save to localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
  };

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      theme: currentTheme,
      setTheme,
      toggleTheme,
      isSystemDark,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme toggle component
export function ThemeToggle() {
  const { theme, toggleTheme, isSystemDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}${(theme === 'dark' && isSystemDark) || (theme === 'light' && !isSystemDark) ? ' (system)' : ''}`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

// Theme-aware component wrapper
export function ThemeAware({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`theme-aware ${className}`}>
      {children}
    </div>
  );
}

// CSS class generator for theme-aware components
export function getThemeClasses(
  lightClasses: string,
  darkClasses: string,
  baseClasses = ''
): string {
  return `${baseClasses} light:${lightClasses} dark:${darkClasses}`;
}

// Color utility that adapts to current theme
export function useThemeColor() {
  const { theme } = useTheme();

  const getColor = (lightColor: string, darkColor: string) => {
    return theme === 'dark' ? darkColor : lightColor;
  };

  const getGradient = (lightGradient: string, darkGradient: string) => {
    return theme === 'dark' ? darkGradient : lightGradient;
  };

  return {
    getColor,
    getGradient,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}