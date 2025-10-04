import { useState, useEffect, useRef } from "react";
import { PowerPredictionChart } from "./PowerPredictionChart"; // 导入新组件
import { Bot, Power } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  Activity,
  Users,
  MessageCircle,
  Brain,
  Server,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  module: string;
  message: string;
}

interface DashboardProps {
  directoryName?: string | null;
  onNavigateToLogs: () => void;
}

export function Dashboard({ directoryName, onNavigateToLogs }: DashboardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 89,
    messagesHandled: 15683,
    aiRequests: 8942,
    systemUptime: "15天 6小时 42分钟",
    memoryUsage: 45,
    cpuUsage: 32,
    diskUsage: 28
  });

  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "14:30:25",
      level: "INFO",
      module: "Chat",
      message: "发送回复成功: 用户询问天气信息"
    },
    {
      id: "2",
      timestamp: "14:29:18",
      level: "DEBUG",
      module: "AI",
      message: "调用GPT-4o-mini模型，耗时1.2s"
    },
    {
      id: "3",
      timestamp: "14:28:45",
      level: "INFO",
      module: "Memory",
      message: "更新用户关系状态"
    },
    {
      id: "4",
      timestamp: "14:27:32",
      level: "WARN",
      module: "Security",
      message: "检测到可疑请求，已拦截"
    },
    {
      id: "5",
      timestamp: "14:26:15",
      level: "INFO",
      module: "Database",
      message: "数据库备份完成"
    }
  ]);

  const [botUptime, setBotUptime] = useState("未知");

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        messagesHandled: prev.messagesHandled + Math.floor(Math.random() * 3),
        aiRequests: prev.aiRequests + Math.floor(Math.random() * 2),
        activeUsers: 85 + Math.floor(Math.random() * 10),
        memoryUsage: 40 + Math.floor(Math.random() * 20),
        cpuUsage: 25 + Math.floor(Math.random() * 20)
      }));

      // 添加新的日志条目
      const modules = ["Chat", "AI", "Memory", "Security", "Database"];
      const levels: LogEntry["level"][] = ["DEBUG", "INFO", "WARN"];
      const messages = [
        "处理用户消息",
        "AI模型调用完成",
        "数据库查询成功",
        "内存清理完成",
        "系统运行正常"
      ];

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
        level: levels[Math.floor(Math.random() * levels.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setRecentLogs(prev => [newLog, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (directoryName) {
      setBotUptime("正在加载..."); // Placeholder, will be improved later
    } else {
      setBotUptime("未选择目录");
    }
  }, [directoryName]);

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "DEBUG": return "text-gray-500";
      case "INFO": return "text-blue-500";
      case "WARN": return "text-yellow-500";
      case "ERROR": return "text-red-500";
      default: return "text-gray-500";
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

  const handleRestartWebUIClick = async () => {
    toast.info("正在重新加载页面...");
    window.location.reload();
  };

  const handleRestartBotClick = async () => {
    toast.error("此功能在网页版中不可用。");
  };

  // 快速操作处理函数
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "restart":
        toast.info(
          <>
            重启 <strong className="italic">WebUI</strong> 服务
          </>,
          {
            description: "点击按钮以重启 WebUI 界面。",
            action: (
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleRestartWebUIClick}
              >
                <Power className="h-4 w-4 mr-1" /> 重启
              </Button>
            ),
          }
        );
        toast.info(
          <>
            重启 <strong className="italic">MoFox-bot</strong> 服务
          </>,
          {
            description: "点击按钮以重启机器人核心服务。",
            action: (
              <Button
                size="sm"
                className="bg-sky-500 hover:bg-sky-600 text-white"
                onClick={handleRestartBotClick}
              >
                <Bot className="h-4 w-4 mr-1" /> 重启
              </Button>
            ),
          }
        );
        break;
      case "performance":
        chartRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "users":
        toast.info("用户管理功能", {
          description: "此功能正在开发中，敬请期待"
        });
        break;
      case "check":
        toast.promise(
          new Promise(resolve => setTimeout(resolve, 2000)),
          {
            loading: "正在执行系统检查...",
            success: "系统检查完成，一切正常！",
            error: "系统检查失败"
          }
        );
        break;
      default:
        toast.info("功能开发中", {
          description: "该功能正在开发中，敬请期待"
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">控制台概览</h2>
          <p className="text-muted-foreground">
            监控MoFox Bot的运行状态和关键指标
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">系统运行正常</span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info("用户统计详情", { description: "查看详细的用户数据分析" })}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info("在线用户详情", { description: "查看当前在线用户列表" })}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">在线用户</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              实时在线用户数量
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info("消息统计详情", { description: "查看消息处理的详细统计" })}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">消息处理</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.messagesHandled.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> 较上周
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info("AI调用统计", { description: "查看AI模型调用的详细统计" })}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">AI调用</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.aiRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              今日AI模型调用次数
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 系统状态和日志 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 系统状态 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              系统状态
            </CardTitle>
            <CardDescription>服务器资源使用情况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>内存使用率</span>
                <span>{stats.memoryUsage}%</span>
              </div>
              <Progress
                value={stats.memoryUsage}
                className="h-2 cursor-pointer"
                onClick={() => toast.info("内存详情", { description: `当前内存使用率: ${stats.memoryUsage}%` })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>CPU使用率</span>
                <span>{stats.cpuUsage}%</span>
              </div>
              <Progress
                value={stats.cpuUsage}
                className="h-2 cursor-pointer"
                onClick={() => toast.info("CPU详情", { description: `当前CPU使用率: ${stats.cpuUsage}%` })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>磁盘使用率</span>
                <span>{stats.diskUsage}%</span>
              </div>
              <Progress
                value={stats.diskUsage}
                className="h-2 cursor-pointer"
                onClick={() => toast.info("磁盘详情", { description: `当前磁盘使用率: ${stats.diskUsage}%` })}
              />
            </div>

            <div className="pt-2 border-t">
              <div
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => toast.info("系统运行时间", {
                  description: `系统已持续运行 ${stats.systemUptime}，运行状态良好`
                })}
              >
                <Clock className="h-4 w-4" />
                <span>系统运行: {stats.systemUptime}</span>
              </div>
              <div
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => toast.info("Bot运行时间", {
                  description: `Bot脚本运行时间: ${botUptime}`
                })}
              >
                <Brain className="h-4 w-4" />
                <span>Bot运行: {botUptime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 实时日志预览 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  实时日志
                </CardTitle>
                <CardDescription>最近的系统活动</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNavigateToLogs}
                className="flex items-center gap-1"
              >
                查看全部
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-3 text-sm p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => toast.info("日志详情", { 
                      description: `${log.timestamp} [${log.level}] ${log.module}: ${log.message}` 
                    })}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant={getLevelBadgeVariant(log.level)}
                          className="text-xs px-1.5 py-0"
                        >
                          {log.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {log.module}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {log.timestamp}
                      </span>
                    </div>
                    <div className="text-sm text-foreground truncate max-w-xs">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用管理功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2 hover:bg-green-50 hover:border-green-200"
              onClick={() => handleQuickAction("restart")}
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">重启服务</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200"
              onClick={() => handleQuickAction("performance")}
            >
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-sm">性能分析</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-200"
              onClick={() => handleQuickAction("users")}
            >
              <Users className="h-5 w-5 text-purple-500" />
              <span className="text-sm">用户管理</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2 hover:bg-yellow-50 hover:border-yellow-200"
              onClick={() => handleQuickAction("check")}
            >
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">系统检查</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 功耗预测图表 */}
      <div ref={chartRef}>
        <PowerPredictionChart />
      </div>
    </div>
  );
}