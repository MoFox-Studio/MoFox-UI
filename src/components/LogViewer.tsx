import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Pause, Play, Trash2, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../i18n/LanguageContext';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

const getMockLogs = (language: 'zh' | 'en'): LogEntry[] => language === 'zh' ? [
  { id: '1', timestamp: '14:23:15', level: 'INFO', message: '机器人服务已启动' },
  { id: '2', timestamp: '14:23:16', level: 'SUCCESS', message: '数据库连接成功' },
  { id: '3', timestamp: '14:23:17', level: 'INFO', message: '加载配置文件: config.json' },
  { id: '4', timestamp: '14:23:18', level: 'SUCCESS', message: 'AI 模型初始化完成' },
  { id: '5', timestamp: '14:23:20', level: 'INFO', message: '开始监听消息...' },
  { id: '6', timestamp: '14:24:15', level: 'INFO', message: '收到新消息: 用户 user123' },
  { id: '7', timestamp: '14:24:16', level: 'SUCCESS', message: '消息处理完成' },
  { id: '8', timestamp: '14:25:30', level: 'WARN', message: 'API 请求延迟较高: 1.2s' },
  { id: '9', timestamp: '14:26:45', level: 'INFO', message: '执行定时任务: 清理缓存' },
  { id: '10', timestamp: '14:27:10', level: 'ERROR', message: '表情包加载失败: network_error.jpg' },
] : [
  { id: '1', timestamp: '14:23:15', level: 'INFO', message: 'Bot service started' },
  { id: '2', timestamp: '14:23:16', level: 'SUCCESS', message: 'Database connected successfully' },
  { id: '3', timestamp: '14:23:17', level: 'INFO', message: 'Loading config file: config.json' },
  { id: '4', timestamp: '14:23:18', level: 'SUCCESS', message: 'AI model initialized' },
  { id: '5', timestamp: '14:23:20', level: 'INFO', message: 'Listening for messages...' },
  { id: '6', timestamp: '14:24:15', level: 'INFO', message: 'New message received: user user123' },
  { id: '7', timestamp: '14:24:16', level: 'SUCCESS', message: 'Message processed' },
  { id: '8', timestamp: '14:25:30', level: 'WARN', message: 'High API latency: 1.2s' },
  { id: '9', timestamp: '14:26:45', level: 'INFO', message: 'Running scheduled task: clear cache' },
  { id: '10', timestamp: '14:27:10', level: 'ERROR', message: 'Failed to load meme: network_error.jpg' },
];

export function LogViewer() {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<LogEntry[]>(() => getMockLogs(language));
  const [isPaused, setIsPaused] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
          level: ['INFO', 'WARN', 'ERROR', 'SUCCESS'][Math.floor(Math.random() * 4)] as LogLevel,
          message: language === 'zh' ? [
            '处理新消息请求',
            'API 调用完成',
            '缓存更新成功',
            '执行定时任务',
            '用户互动记录已保存',
            '系统健康检查通过',
          ][Math.floor(Math.random() * 6)] : [
            'Processing new message request',
            'API call completed',
            'Cache updated successfully',
            'Running scheduled task',
            'User interaction saved',
            'System health check passed',
          ][Math.floor(Math.random() * 6)],
        };
        setLogs((prev) => [...prev, newLog]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  useEffect(() => {
    if (isLive && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLive]);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'INFO':
        return 'text-foreground';
      case 'WARN':
        return 'text-warning';
      case 'ERROR':
        return 'text-error';
      case 'SUCCESS':
        return 'text-success';
      default:
        return 'text-foreground';
    }
  };

  const getLevelBg = (level: LogLevel) => {
    switch (level) {
      case 'INFO':
        return 'bg-primary/20 border-primary/30';
      case 'WARN':
        return 'bg-warning/20 border-warning/30';
      case 'ERROR':
        return 'bg-error/20 border-error/30';
      case 'SUCCESS':
        return 'bg-success/20 border-success/30';
      default:
        return 'bg-primary/20 border-primary/30';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="max-w-7xl w-full mx-auto flex flex-col h-full">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.logs.title}</h1>
          <p className="text-muted-foreground mt-2">{language === 'zh' ? '监控系统运行状态和事件' : 'Monitor system status and events'}</p>
        </motion.div>

        {/* Control Bar */}
        <motion.div 
          className="glass-card p-4 mb-4 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-warning' : 'bg-success'}`} />
              <span className="text-sm" style={{ fontWeight: 500 }}>
                {isPaused ? (language === 'zh' ? '已暂停' : 'Paused') : (language === 'zh' ? '实时' : 'Live')}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {language === 'zh' ? `共 ${logs.length} 条日志` : `${logs.length} logs`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPaused(!isPaused)}
              variant="ghost"
              size="sm"
              className="glass-hover"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {language === 'zh' ? '继续' : 'Resume'}
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  {language === 'zh' ? '暂停' : 'Pause'}
                </>
              )}
            </Button>
            <Button
              onClick={clearLogs}
              variant="ghost"
              size="sm"
              className="glass-hover hover:text-error"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t.logs.clearLogs}
            </Button>
          </div>
        </motion.div>

        {/* Logs Container */}
        <motion.div 
          className="flex-1 glass-card p-6 overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex-1 overflow-auto font-mono space-y-1" style={{ fontSize: '0.875rem' }}>
            <AnimatePresence initial={false}>
              {logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
                  <span
                    className={`px-2 py-0.5 rounded border shrink-0 ${getLevelBg(log.level)} ${getLevelColor(log.level)}`}
                    style={{ fontSize: '0.75rem', fontWeight: 600 }}
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
