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
// 导入新创建的启动错误对话框
import { StartupErrorDialog } from './components/StartupErrorDialog';
// 导入插件市场组件
import { PluginMarket } from './components/PluginMarket';
// 导入语言提供者，用于国际化
import { LanguageProvider } from './i18n/LanguageContext';
import { LogProvider } from './logs/LogContext';
import { toast } from 'sonner';

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
  // 状态：当前主题，从localStorage初始化
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(() => {
    const saved = localStorage.getItem('mofox-theme');
    return saved ? JSON.parse(saved) : null;
  });
  // 状态：启动错误
  const [startupError, setStartupError] = useState<string | null>(null);

  // 处理登录成功事件
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // 处理登出事件
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
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

  // 副作用钩子：检查后端启动状态和备用端口
  useEffect(() => {
    const checkBackend = async () => {
      // 检查是否为 Demo 模式
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
      
      if (isDemoMode) {
        console.log('Running in DEMO mode - backend checks skipped');
        toast.info('演示模式', {
          description: '当前运行在演示模式下，无需后端服务',
          duration: 5000,
        });
        return;
      }

      // 1. 检查后端主要状态
      try {
        const statusResponse = await fetch('/api/status');
        const statusData = await statusResponse.json();
        if (statusData.status === 'error') {
          setStartupError(statusData.message);
          return; // 如果有启动错误，就不再检查端口
        }
      } catch (error) {
        console.error("无法连接到后端:", error);
        setStartupError("无法连接到后端服务。请确保后端正在运行，并且代理配置正确。");
        return;
      }

      // 2. 检查备用端口状态
      try {
        const portsToCheck = [31415, 35023];
        const portsResponse = await fetch('/api/check-ports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ports: portsToCheck }),
        });
        const portsData = await portsResponse.json();
        
        let occupiedPorts: number[] = [];
        for (const result of portsData) {
          if (result.status === 'occupied') {
            occupiedPorts.push(result.port);
          }
        }

        if (occupiedPorts.length > 0) {
          toast.warning(
            `注意：备用端口 ${occupiedPorts.join(', ')} 已被占用。`,
            {
              description: '这只在主端口11451不可用时才会成为问题。',
              duration: 10000,
            }
          );
        }
      } catch (error) {
        console.error("无法检查备用端口状态:", error);
        // 这是一个非关键性检查，所以我们只在控制台记录错误
      }
    };

    // 在WebUI完全加载后稍等片刻再执行检查
    const timer = setTimeout(checkBackend, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 根据 currentView 状态渲染对应的视图组件
  const renderView = () => {
    const views = {
      dashboard: <Dashboard key="dashboard" />,
      config: <ConfigCenter key="config" />,
      logs: <LogViewer key="logs" />,
      theme: <ThemeCustomizer key="theme" currentTheme={currentTheme} onApplyTheme={applyTheme} />,
      plugins: <PluginMarket key="plugins" />,
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
        <StartupErrorDialog
          isOpen={!!startupError}
          errorMessage={startupError || ''}
        />
        <AppShell
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
        >
          <div className="flex-1 flex flex-col">
            {renderView()}
          </div>
        </AppShell>
        <Toaster
          position="top-right"
          theme="light"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid rgba(0, 0, 0, 0.1)',
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
