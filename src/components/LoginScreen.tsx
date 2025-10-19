import { useState } from 'react';
import { motion } from 'motion/react';
import { Key, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLanguage } from '../i18n/LanguageContext';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { t, language, setLanguage } = useLanguage();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 验证 Token（示例：使用 'mofox-admin-token' 作为有效token）
    if (token === 'mofox-admin-token') {
      setIsLoggingIn(true);
      setTimeout(() => {
        onLogin();
      }, 800);
    } else {
      setError(t.login.invalidToken);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="h-screen w-screen aurora-bg flex items-center justify-center p-6 overflow-hidden relative">
      {/* Language Toggle - Top Right */}
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

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

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
        {/* Logo/Title */}
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
          {/* Token Input */}
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

          {/* Error Message */}
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

          {/* Login Button */}
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

        {/* Helper Text */}
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
