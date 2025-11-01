// 导入React的核心库和钩子
import { useState, useEffect, useRef } from 'react';
// 导入framer-motion库，用于实现动画效果
import { motion, AnimatePresence } from 'framer-motion';
// 从lucide-react库导入图标组件
import { Terminal, Pause, Play, Trash2 } from 'lucide-react';
// 导入自定义的Button组件
import { Button } from './ui/button';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../i18n/LanguageContext';

// 定义日志级别的类型
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

// 定义日志条目的接口
interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

// 获取模拟日志数据的函数
const getMockLogs = (language: 'zh' | 'en'): LogEntry[] => language === 'zh' ? [
  { id: '1', timestamp: '14:23:15', level: 'INFO', message: '机器人服务已启动' },
  { id: '2', timestamp: '14:23:16', level: 'SUCCESS', message: '数据库连接成功' },
  { id: '3', timestamp: '14:23:18', level: 'SUCCESS', message: 'AI 模型初始化完成' },
] : [
  { id: '1', timestamp: '14:23:15', level: 'INFO', message: 'Bot service started' },
  { id: '2', timestamp: '14:23:16', level: 'SUCCESS', message: 'Database connected successfully' },
  { id: '4', timestamp: '14:23:18', level: 'SUCCESS', message: 'AI model initialized' },
];

// 日志查看器组件
export function LogViewer() {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<LogEntry[]>(() => getMockLogs(language));
  const [isPaused, setIsPaused] = useState(false); // 是否暂停日志滚动
  const logsEndRef = useRef<HTMLDivElement>(null); // 指向日志末尾的引用

  // 副作用钩子：模拟实时生成新日志
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
          level: ['INFO', 'WARN', 'ERROR', 'SUCCESS'][Math.floor(Math.random() * 4)] as LogLevel,
          message: language === 'zh' ? '处理新消息请求' : 'Processing new message request',
        };
        setLogs((prev) => [...prev, newLog]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, language]);

  // 副作用钩子：当日志更新时，自动滚动到底部
  useEffect(() => {
    if (!isPaused && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  // 根据日志级别返回对应的颜色类
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'WARN': return 'text-warning';
      case 'ERROR': return 'text-error';
      case 'SUCCESS': return 'text-success';
      default: return 'text-foreground';
    }
  };

  // 清空所有日志
  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="max-w-7xl w-full mx-auto flex flex-col h-full">
        {/* 页面标题 */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.logs.title}</h1>
          <p className="text-muted-foreground mt-2">{language === 'zh' ? '监控系统运行状态和事件' : 'Monitor system status and events'}</p>
        </motion.div>

        {/* 控制栏 */}
        <motion.div 
          className="glass-card p-4 mb-4 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {/* ... 控制栏UI ... */}
        </motion.div>

        {/* 日志容器 */}
        <motion.div 
          className="flex-1 glass-card p-6 overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex-1 overflow-auto font-mono space-y-1" style={{ fontSize: '0.875rem' }}>
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors group"
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
                  <span
                    className={`px-2 py-0.5 rounded border text-xs font-semibold ${getLevelColor(log.level)}`}
                  >
                    {log.level}
                  </span>
                  <span className={getLevelColor(log.level)}>{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={logsEndRef} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
