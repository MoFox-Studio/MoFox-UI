import { isDemoMode, mockApiResponse, demoConfig, demoLogs, demoStatus, demoMemories } from './demoData';

// API 基础 URL
const getBaseUrl = () => {
  if (isDemoMode()) return '';
  return import.meta.env.VITE_API_URL || '';
};

// 通用 fetch 包装器
export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  if (isDemoMode()) {
    return handleDemoRequest<T>(endpoint, options);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Demo 模式请求处理
const handleDemoRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  console.log(`[DEMO] API call: ${endpoint}`, options);

  // 根据不同的 endpoint 返回不同的模拟数据
  if (endpoint.includes('/config')) {
    if (options?.method === 'POST' || options?.method === 'PUT') {
      // 保存配置
      return mockApiResponse({ success: true, message: 'Configuration saved (demo)' } as T);
    }
    // 获取配置
    return mockApiResponse(demoConfig as T);
  }

  if (endpoint.includes('/logs')) {
    return mockApiResponse(demoLogs as T);
  }

  if (endpoint.includes('/status')) {
    return mockApiResponse(demoStatus as T);
  }

  if (endpoint.includes('/memory')) {
    if (options?.method === 'POST') {
      // 添加记忆
      return mockApiResponse({ success: true, message: 'Memory added (demo)' } as T);
    }
    if (options?.method === 'DELETE') {
      // 删除记忆
      return mockApiResponse({ success: true, message: 'Memory deleted (demo)' } as T);
    }
    // 获取记忆列表
    return mockApiResponse(demoMemories as T);
  }

  if (endpoint.includes('/check-ports')) {
    return mockApiResponse([
      { port: 31415, status: 'available' },
      { port: 35023, status: 'available' }
    ] as T);
  }

  // 默认返回成功响应
  return mockApiResponse({ success: true, message: 'Demo response' } as T);
};

// 配置相关 API
export const configApi = {
  get: () => apiFetch('/config'),
  update: (config: any) => apiFetch('/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  })
};

// 日志相关 API
export const logsApi = {
  get: () => apiFetch('/api/logs'),
  clear: () => apiFetch('/api/logs/clear', { method: 'POST' })
};

// 状态相关 API
export const statusApi = {
  get: () => apiFetch('/api/status')
};

// 记忆相关 API
export const memoryApi = {
  list: () => apiFetch('/api/memory'),
  add: (memory: any) => apiFetch('/api/memory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memory)
  }),
  delete: (id: string) => apiFetch(`/api/memory/${id}`, { method: 'DELETE' })
};
