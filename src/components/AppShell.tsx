import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Settings, Terminal, Palette, LogOut, Sun, Moon, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../i18n/LanguageContext';

interface AppShellProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function AppShell({ children, currentView, onViewChange, onLogout, isDarkMode, onToggleDarkMode }: AppShellProps) {
  const { language, setLanguage, t } = useLanguage();
  
  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'config', label: t.nav.config, icon: Settings },
    { id: 'logs', label: t.nav.logs, icon: Terminal },
    { id: 'theme', label: t.nav.theme, icon: Palette },
  ];
  
  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };
  return (
    <div className="h-screen w-screen aurora-bg flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 glass border-r border-border/50 flex flex-col items-center py-6 gap-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
        {/* Logo */}
        <motion.div 
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 relative z-10 shadow-lg shadow-primary/20"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.5
          }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-background" style={{ fontWeight: 700, fontSize: '1.25rem' }}>M</span>
        </motion.div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-4 relative z-10">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`group relative w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? 'bg-primary/10 border border-primary shadow-lg shadow-primary/15'
                    : 'glass-hover hover:border-primary/50'
                }`}
                title={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 relative z-10 ${
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}
                />
              </motion.button>
            );
          })}
        </nav>

        {/* Language Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={toggleLanguage}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-2xl glass-hover hover:border-secondary/50 hover:text-secondary relative z-10 mb-2"
            title={language === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <motion.div
              key={language}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <Languages className="w-5 h-5" />
                <span className="text-xs mt-0.5" style={{ fontSize: '0.625rem' }}>
                  {language.toUpperCase()}
                </span>
              </div>
            </motion.div>
          </Button>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onToggleDarkMode}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-2xl glass-hover hover:border-primary/50 hover:text-primary relative z-10 mb-2"
            title={isDarkMode ? (language === 'zh' ? '切换到亮色模式' : 'Switch to Light Mode') : (language === 'zh' ? '切换到暗色模式' : 'Switch to Dark Mode')}
          >
            <motion.div
              key={isDarkMode ? 'sun' : 'moon'}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </Button>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onLogout}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-2xl glass-hover hover:border-error/50 hover:text-error relative z-10"
            title={t.nav.logout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
