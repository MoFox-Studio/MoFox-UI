import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import { LoginScreen } from './components/LoginScreen';
import { AppShell } from './components/AppShell';
import { Dashboard } from './components/Dashboard';
import { ConfigCenter } from './components/ConfigCenter';
import { LogViewer } from './components/LogViewer';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { LanguageProvider } from './i18n/LanguageContext';

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('mofox-dark-mode');
    return saved ? JSON.parse(saved) : true;
  });
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(() => {
    const saved = localStorage.getItem('mofox-theme');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('mofox-dark-mode', JSON.stringify(newMode));
  };

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('mofox-theme', JSON.stringify(theme));
    
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    
    // Update glow colors and hover colors
    const primaryRgb = hexToRgb(theme.primary);
    const secondaryRgb = hexToRgb(theme.secondary);
    if (primaryRgb) {
      root.style.setProperty('--primary-glow', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`);
      root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }
    if (secondaryRgb) {
      root.style.setProperty('--secondary-glow', `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.5)`);
      root.style.setProperty('--secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Apply dark/light mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [isDarkMode]);

  // Apply saved theme on mount
  useEffect(() => {
    if (currentTheme) {
      const root = document.documentElement;
      root.style.setProperty('--primary', currentTheme.primary);
      root.style.setProperty('--secondary', currentTheme.secondary);
      
      const primaryRgb = hexToRgb(currentTheme.primary);
      const secondaryRgb = hexToRgb(currentTheme.secondary);
      if (primaryRgb) {
        root.style.setProperty('--primary-glow', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`);
        root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      }
      if (secondaryRgb) {
        root.style.setProperty('--secondary-glow', `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.5)`);
        root.style.setProperty('--secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderView = () => {
    const views = {
      dashboard: <Dashboard key="dashboard" />,
      config: <ConfigCenter key="config" />,
      logs: <LogViewer key="logs" />,
      theme: <ThemeCustomizer key="theme" currentTheme={currentTheme} onApplyTheme={applyTheme} />,
    };
    
    return views[currentView as keyof typeof views] || views.dashboard;
  };

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <AnimatePresence mode="wait">
          <LoginScreen onLogin={handleLogin} />
        </AnimatePresence>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AppShell
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="h-full w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </AppShell>
      <Toaster 
        position="top-right" 
        theme={isDarkMode ? "dark" : "light"}
        toastOptions={{
          style: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#f1f5f9' : '#0f172a',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          },
          className: '',
        }}
      />
    </LanguageProvider>
  );
}
