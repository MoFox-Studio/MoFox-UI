// 导入React的核心库和钩子
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义日志级别的类型
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG';

// 定义日志条目的接口
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

// 定义连接状态的类型
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// 定义日志上下文的类型
interface LogContextType {
  logs: LogEntry[];
  connectionStatus: ConnectionStatus;
}

// 创建日志上下文
const LogContext = createContext<LogContextType | undefined>(undefined);

// 日志提供者组件
export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // 副作用钩子：建立WebSocket连接并处理消息
  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8001/ws/logs');

    ws.onopen = () => {
      console.log("全局WebSocket连接已打开");
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const rawMessage = event.data;
        let logData;
        try {
            logData = JSON.parse(rawMessage);
        } catch (e) {
            const parts = rawMessage.split('|').map((p: string) => p.trim());
            if (parts.length >= 4) {
                 logData = {
                    timestamp: parts[0],
                    level: parts[1],
                    message: parts.slice(2).join(' | '),
                };
            } else {
                 logData = { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: rawMessage };
            }
        }
        
        const newLog: LogEntry = {
          id: Date.now().toString() + Math.random(),
          timestamp: logData.timestamp || new Date().toLocaleTimeString(),
          level: (logData.level?.toUpperCase() as LogLevel) || 'INFO',
          message: logData.message || '无效的日志格式',
        };

        setLogs((prev) => [...prev.slice(-500), newLog]); // 保持一个较长的历史记录
      } catch (error) {
        console.error("处理全局日志消息时出错:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("全局WebSocket错误:", error);
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      console.log("全局WebSocket连接已关闭");
      setConnectionStatus('disconnected');
    };

    // 组件卸载时关闭连接
    return () => {
      ws.close();
    };
  }, []); // 空依赖数组确保只在挂载时运行一次

  const value = { logs, connectionStatus };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
}

// 自定义钩子，方便在任何组件中使用日志上下文
export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs必须在LogProvider内部使用');
  }
  return context;
}