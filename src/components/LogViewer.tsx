import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Search,
  Filter,
  Terminal,
  Circle
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  module: string;
  message: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-20 10:30:25",
    level: "INFO",
    module: "Bot",
    message: "MoFox Bot 启动完成，版本 v2.0.0"
  },
  {
    id: "2",
    timestamp: "2024-01-20 10:30:26",
    level: "INFO",
    module: "Database",
    message: "数据库连接已建立 (SQLite: ./data/mofox.db)"
  },
  {
    id: "3",
    timestamp: "2024-01-20 10:30:27",
    level: "INFO",
    module: "QQ",
    message: "QQ Bot 连接成功，账号: 123456789"
  },
  {
    id: "4",
    timestamp: "2024-01-20 10:31:15",
    level: "DEBUG",
    module: "Chat",
    message: "收到用户消息: [用户001] 你好"
  },
  {
    id: "5",
    timestamp: "2024-01-20 10:31:16",
    level: "DEBUG",
    module: "AI",
    message: "调用AI模型生成回复: gpt-4o-mini"
  },
  {
    id: "6",
    timestamp: "2024-01-20 10:31:18",
    level: "INFO",
    module: "Chat",
    message: "发送回复: 你好！我是MoFox，很高兴认识你~"
  },
  {
    id: "7",
    timestamp: "2024-01-20 10:32:05",
    level: "WARN",
    module: "Security",
    message: "检测到可疑注入尝试，已拦截"
  },
  {
    id: "8",
    timestamp: "2024-01-20 10:32:30",
    level: "ERROR",
    module: "Network",
    message: "API调用失败: 连接超时 (timeout: 30s)"
  }
];

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 模拟实时日志
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const modules = ["Bot", "Database", "QQ", "Chat", "AI", "Security", "Network", "Memory"];
      const levels: LogEntry["level"][] = ["DEBUG", "INFO", "WARN", "ERROR"];
      const messages = [
        "系统运行正常",
        "处理用户请求",
        "AI模型调用成功",
        "数据库操作完成",
        "消息发送成功",
        "内存使用率: 45%",
        "网络连接稳定",
        "配置已更新"
      ];

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }),
        level: levels[Math.floor(Math.random() * levels.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [...prev, newLog].slice(-100)); // 只保留最近100条
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // 自动滚动到底部
  useEffect(() => {
    if (isLive && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isLive]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === "" || 
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.module.toLowerCase().includes(filter.toLowerCase());
    
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    const matchesModule = moduleFilter === "ALL" || log.module === moduleFilter;
    
    return matchesFilter && matchesLevel && matchesModule;
  });

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "DEBUG": return "bg-gray-500";
      case "INFO": return "bg-blue-500";
      case "WARN": return "bg-yellow-500";
      case "ERROR": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getLevelBadgeVariant = (level: LogEntry["level"]) => {
    switch (level) {
      case "DEBUG": return "secondary" as const;
      case "INFO": return "default" as const;
      case "WARN": return "secondary" as const;
      case "ERROR": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logsText = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.level}] [${log.module}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mofox-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueModules = Array.from(new Set(logs.map(log => log.module)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h2>实时日志监控</h2>
          <div className="flex items-center gap-1">
            <Circle className={`h-2 w-2 ${isLive ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} fill="currentColor" />
            <span className="text-sm text-muted-foreground">
              {isLive ? '实时同步' : '已暂停'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLive ? '暂停' : '继续'}
          </Button>
          <Button variant="outline" size="sm" onClick={clearLogs}>
            <RotateCcw className="h-4 w-4 mr-2" />
            清空
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            过滤器
          </CardTitle>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索日志内容..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">所有级别</SelectItem>
                <SelectItem value="DEBUG">DEBUG</SelectItem>
                <SelectItem value="INFO">INFO</SelectItem>
                <SelectItem value="WARN">WARN</SelectItem>
                <SelectItem value="ERROR">ERROR</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">所有模块</SelectItem>
                {uniqueModules.map(module => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea 
            className="h-[600px] font-mono text-sm"
            ref={scrollRef}
          >
            <div className="p-4 space-y-1 bg-slate-950 text-green-400">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {logs.length === 0 ? '暂无日志' : '没有匹配的日志'}
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-3 hover:bg-slate-900/50 p-2 rounded border-l-2 border-transparent hover:border-green-500/30 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full mt-2 ${getLevelColor(log.level)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-400 text-xs font-mono">
                          {log.timestamp}
                        </span>
                        <Badge 
                          variant={getLevelBadgeVariant(log.level)}
                          className="text-xs px-2 py-0"
                        >
                          {log.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {log.module}
                        </Badge>
                      </div>
                      <div 
                        className="break-words"
                        style={{ 
                          color: log.color || '#4ade80' // 暂时保持绿色，未来可启用log.color
                        }}
                      >
                        {log.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}