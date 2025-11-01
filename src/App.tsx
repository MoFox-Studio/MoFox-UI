// 导入React的核心库和钩子
import { useState, useEffect } from 'react';
// 导入用于动画效果的framer-motion库
import { motion, AnimatePresence } from 'framer-motion';
// 导入自定义的Sonner组件，用于显示通知
import { Toaster } from './components/ui/sonner';
// 导入登录界面组件
import { LoginScreen } from './components/LoginScreen';
// 导入应用外壳组件，包含侧边栏和主要内容区域
import { AppShell } from './components/AppShell';
// 导入仪表盘组件
import { Dashboard } from './components/Dashboard';
// 导入配置中心组件
import { ConfigCenter } from './components/ConfigCenter';
// 导入日志查看器组件
import { LogViewer } from './components/LogViewer';
// 导入主题定制器组件
import { ThemeCustomizer } from './components/ThemeCustomizer';
// 导入语言提供者，用于国际化
import { LanguageProvider } from './i18n/LanguageContext';
import { LogProvider } from './logs/LogContext';

// 定义主题对象的接口
export interface Theme {
  id: string; // 主题唯一标识
  name: string; // 主题名称
  primary: string; // 主色
  secondary: string; // 次色
  background: string; // 背景色
}

// 应用的主组件
export default function App() {
  // 状态：用户是否已认证
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  // 状态：当前显示的主视图
  const [currentView, setCurrentView] = useState('dashboard');
  // 状态：是否为暗黑模式，从localStorage初始化
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('mofox-dark-mode');
    return saved ? JSON.parse(saved) : true;
  });
  // 状态：当前主题，从localStorage初始化
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(() => {
    const saved = localStorage.getItem('mofox-theme');
    return saved ? JSON.parse(saved) : null;
  });

  // 处理登录成功事件
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // 处理登出事件
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  // 切换暗黑/明亮模式
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('mofox-dark-mode', JSON.stringify(newMode));
  };

  // 应用新主题
  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('mofox-theme', JSON.stringify(theme));
    
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    
    // 更新辉光颜色和悬停颜色
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

  // 将十六进制颜色转换为RGB格式的辅助函数
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // 副作用钩子：根据 isDarkMode 状态应用暗黑/明亮模式的类
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [isDarkMode]);

  // 副作用钩子：在组件挂载时应用保存的主题
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

  // 根据 currentView 状态渲染对应的视图组件
  const renderView = () => {
    const views = {
      dashboard: <Dashboard key="dashboard" />,
      config: <ConfigCenter key="config" />,
      logs: <LogViewer key="logs" />,
      theme: <ThemeCustomizer key="theme" currentTheme={currentTheme} onApplyTheme={applyTheme} />,
    };
    
    return views[currentView as keyof typeof views] || views.dashboard;
  };

  // 如果用户未认证，显示登录界面
  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <AnimatePresence mode="wait">
          <LoginScreen onLogin={handleLogin} />
        </AnimatePresence>
      </LanguageProvider>
    );
  }

  // 如果用户已认证，显示应用主界面
  return (
    <LanguageProvider>
      <LogProvider>
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
      </LogProvider>
    </LanguageProvider>
  );
}
