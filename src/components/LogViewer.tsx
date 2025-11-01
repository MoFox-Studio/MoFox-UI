import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Pause, Play, Trash2, WifiOff } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../i18n/LanguageContext';
import { useLogs, LogLevel } from '@/logs/LogContext';

export function LogViewer() {
  const { t, language } = useLanguage();
  const { logs, connectionStatus } = useLogs();
  const [isPaused, setIsPaused] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);


  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'WARN': return 'text-warning';
      case 'ERROR': return 'text-error';
      case 'SUCCESS': return 'text-success';
      case 'DEBUG': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getLevelBg = (level: LogLevel) => {
    switch (level) {
      case 'WARN': return 'bg-warning/20 border-warning/30';
      case 'ERROR': return 'bg-error/20 border-error/30';
      case 'SUCCESS': return 'bg-success/20 border-success/30';
      case 'DEBUG': return 'bg-gray-500/20 border-gray-500/30';
      default: return 'bg-primary/20 border-primary/30';
    }
  };

  const clearLogs = () => {
    // This functionality should be handled by the LogProvider if needed
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
          <p className="text-muted-foreground mt-2">{language === 'zh' ? '实时监控系统运行状态和事件' : 'Monitor system status and events in real-time'}</p>
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
               <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' && !isPaused ? 'bg-success animate-pulse' :
                connectionStatus === 'connected' && isPaused ? 'bg-warning' :
                'bg-error'
              }`} />
              <span className="text-sm" style={{ fontWeight: 500 }}>
                {connectionStatus === 'connected' ? (isPaused ? (language === 'zh' ? '已暂停' : 'Paused') : (language === 'zh' ? '实时' : 'Live')) :
                 connectionStatus === 'connecting' ? (language === 'zh' ? '连接中...' : 'Connecting...') :
                 (language === 'zh' ? '已断开' : 'Disconnected')}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {language === 'zh' ? `显示 ${logs.length} 条日志` : `Showing ${logs.length} logs`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPaused(!isPaused)}
              variant="ghost"
              size="sm"
              className="glass-hover"
              disabled={connectionStatus !== 'connected'}
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
                    className={`px-2 py-0.5 rounded border shrink-0 ${getLevelBg(log.level)} ${getLevelColor(log.level)}`}
                    style={{ fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    {log.level}
                  </span>
                  <span className={`whitespace-pre-wrap ${getLevelColor(log.level)}`}>{log.message}</span>
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
