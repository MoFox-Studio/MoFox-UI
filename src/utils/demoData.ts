// Demo 模式的模拟数据

export const demoConfig = {
  bot_name: "MoFox Demo",
  bot_qq: "1234567890",
  admin_qq: ["9876543210"],
  command_prefix: "/",
  log_level: "INFO",
  enable_group_chat: true,
  enable_private_chat: true,
  max_message_length: 1000,
  rate_limit: {
    enabled: true,
    max_requests: 10,
    time_window: 60
  }
};

export const demoLogs = [
  {
    timestamp: new Date().toISOString(),
    level: "INFO",
    message: "MoFox Bot started in DEMO mode",
    source: "system"
  },
  {
    timestamp: new Date(Date.now() - 60000).toISOString(),
    level: "INFO",
    message: "Configuration loaded successfully",
    source: "config"
  },
  {
    timestamp: new Date(Date.now() - 120000).toISOString(),
    level: "DEBUG",
    message: "Connecting to message service...",
    source: "network"
  },
  {
    timestamp: new Date(Date.now() - 180000).toISOString(),
    level: "INFO",
    message: "Message service connected",
    source: "network"
  },
  {
    timestamp: new Date(Date.now() - 240000).toISOString(),
    level: "WARNING",
    message: "Rate limit approaching threshold",
    source: "rate_limiter"
  }
];

export const demoStatus = {
  status: "running",
  uptime: 3600,
  message_count: 1234,
  error_count: 5,
  memory_usage: 256.5,
  cpu_usage: 12.3
};

export const demoMemories = [
  {
    id: "1",
    user_id: "user_001",
    content: "这是一条演示记忆内容",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    importance: 0.8
  },
  {
    id: "2",
    user_id: "user_002",
    content: "另一条演示记忆",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    importance: 0.6
  }
];

// 模拟 API 响应
export const mockApiResponse = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// 检查是否为 Demo 模式
export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

// 获取 API URL
export const getApiUrl = (): string => {
  if (isDemoMode()) {
    return '';
  }
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';
};
