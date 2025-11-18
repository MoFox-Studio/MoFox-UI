// 导入React的核心库和钩子
import { useState } from 'react';
// 导入framer-motion库，用于实现动画效果
import { motion } from 'framer-motion';
// 从lucide-react库导入图标组件
import { Key, Languages } from 'lucide-react';
// 导入自定义的Button组件
import { Button } from './ui/button';
// 导入自定义的Input组件
import { Input } from './ui/input';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../i18n/LanguageContext';

// 定义LoginScreen组件的属性接口
interface LoginScreenProps {
  onLogin: () => void; // 登录成功时的回调函数
}

// 登录界面组件
export function LoginScreen({ onLogin }: LoginScreenProps) {
  // 使用语言上下文
  const { t, language, setLanguage } = useLanguage();
  // 状态：访问令牌
  const [token, setToken] = useState(() => {
    // 启动时尝试从localStorage读取token，实现记忆登录
    if (typeof window !== 'undefined') {
      return localStorage.getItem('webui_token') || '';
    }
    return '';
  });
  // 状态：错误信息
  const [error, setError] = useState('');
  // 状态：当前聚焦的输入框
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  // 状态：是否正在登录
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 处理登录表单提交
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 验证Token（示例：使用 'mofox-admin-token' 或 'lycoris' 作为有效token）
    const processedToken = token.trim().toLowerCase();
    if (processedToken === 'mofox-admin-token' || processedToken === 'lycoris') {
      setIsLoggingIn(true);
      // 保存token到localStorage，实现记忆登录
      if (typeof window !== 'undefined') {
        localStorage.setItem('webui_token', token);
      }
      // 模拟网络延迟
      setTimeout(() => {
        onLogin();
      }, 800);
    } else {
      setError(t.login.invalidToken);
      // 3秒后清除错误信息
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="h-screen w-screen aurora-bg flex items-center justify-center p-6 overflow-hidden relative">
      {/* 语言切换按钮 - 右上角 */}
      <motion.div
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          variant="ghost"
          size="sm"
          className="glass-hover gap-2"
        >
          <Languages className="w-4 h-4" />
          <span>{language === 'zh' ? 'EN' : '中'}</span>
        </Button>
      </motion.div>

      {/* 装饰性的背景辉光效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* ... 此处省略背景动画的JSX ... */}
      </div>

      {/* 登录表单容器 */}
      <motion.div 
        className="glass w-full max-w-md p-8 relative z-10 overflow-hidden" 
        style={{ borderRadius: '80px' }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* 标题 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent" style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            {t.login.title}
          </h1>
          <p className="text-muted-foreground opacity-80" style={{ fontSize: '0.875rem', fontWeight: 300, letterSpacing: '0.05em' }}>
            {t.login.subtitle}
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Token 输入框 */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className={`glass flex items-center gap-3 p-4 transition-all duration-500 ${
              focusedInput === 'token' ? 'border-primary glow-primary' : ''
            }`} style={{ borderRadius: '20px' }}>
              <Key className="w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder={t.login.tokenPlaceholder}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onFocus={() => setFocusedInput('token')}
                onBlur={() => setFocusedInput(null)}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto placeholder:text-muted-foreground/50"
              />
            </div>
          </motion.div>

          {/* 错误信息显示 */}
          {error && (
            <motion.div 
              className="text-error text-center" 
              style={{ fontSize: '0.875rem' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* 登录按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full glass-button bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90 py-6 transition-all duration-300 relative overflow-hidden group"
              style={{ fontWeight: 600, borderRadius: '20px', backgroundSize: '200% 100%', color: 'var(--glass-button-text)' }}
            >
              <span className="relative z-10">
                {isLoggingIn ? t.login.loggingIn : t.login.loginButton}
              </span>
            </Button>
          </motion.div>
        </form>

        {/* 提示信息 */}
        <motion.p 
          className="text-center mt-6 text-muted-foreground" 
          style={{ fontSize: '0.75rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {language === 'zh' ? '提示: 使用 mofox-admin-token 登录' : 'Hint: Use mofox-admin-token to login'}
        </motion.p>
      </motion.div>
    </div>
  );
}
