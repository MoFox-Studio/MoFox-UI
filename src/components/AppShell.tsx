// 导入React的ReactNode类型，用于定义children属性的类型
import { ReactNode } from 'react';
// 导入framer-motion库，用于实现动画效果
import { motion } from 'framer-motion';
// 从lucide-react库导入图标组件
import { LayoutDashboard, Settings, Terminal, Palette, LogOut, Sun, Moon, Languages, Package } from 'lucide-react';
// 导入自定义的Button组件
import { Button } from './ui/button';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../i18n/LanguageContext';

// 定义AppShell组件的属性接口
interface AppShellProps {
  children: ReactNode; // 子组件
  currentView: string; // 当前活动的视图标识
  onViewChange: (view: string) => void; // 视图切换时的回调函数
  onLogout: () => void; // 登出时的回调函数
  isDarkMode: boolean; // 是否为暗黑模式
  onToggleDarkMode: () => void; // 切换暗黑模式的回调函数
}

// AppShell组件定义，是应用的主要布局框架
export function AppShell({ children, currentView, onViewChange, onLogout, isDarkMode, onToggleDarkMode }: AppShellProps) {
  // 使用语言上下文
  const { language, setLanguage, t } = useLanguage();
  
  // 定义导航项数组
  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'config', label: t.nav.config, icon: Settings },
    { id: 'plugins', label: language === 'zh' ? '插件市场' : 'Plugins', icon: Package },
    { id: 'logs', label: t.nav.logs, icon: Terminal },
    { id: 'theme', label: t.nav.theme, icon: Palette },
  ];
  
  // 切换语言的函数
  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="h-full w-full aurora-bg flex">
      {/* 侧边栏 */}
      <aside className="w-20 glass border-r border-border/50 flex flex-col items-center py-6 gap-6 relative">
        {/* 侧边栏背景渐变效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
        
        {/* Logo */}
        <motion.div 
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 relative z-10 shadow-lg shadow-primary/20"
          initial={{ scale: 0, rotate: -90 }} // 初始动画状态
          animate={{ scale: 1, rotate: 0 }} // 动画结束状态
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.5
          }}
          whileHover={{ scale: 1.05 }} // 鼠标悬停动画
        >
          <span className="text-background" style={{ fontWeight: 700, fontSize: '1.25rem' }}>M</span>
        </motion.div>

        {/* 导航项 */}
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
                    ? 'bg-primary/10 border border-primary shadow-lg shadow-primary/15' // 激活状态样式
                    : 'glass-hover hover:border-primary/50' // 普通状态样式
                }`}
                title={item.label} // 鼠标悬停提示
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }} // 交错动画
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

        {/* 语言切换按钮 */}
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
              key={language} // 动画key，确保语言切换时触发动画
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

        {/* 主题切换按钮 */}
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
              key={isDarkMode ? 'sun' : 'moon'} // 动画key，确保主题切换时触发动画
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </Button>
        </motion.div>

        {/* 登出按钮 */}
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

      {/* 主要内容区域 */}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}
