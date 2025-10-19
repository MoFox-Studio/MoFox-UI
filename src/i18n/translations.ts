export const translations = {
  zh: {
    // 通用
    common: {
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      loading: '加载中...',
      saving: '保存中...',
      success: '成功',
      error: '错误',
      warning: '警告',
    },
    
    // 登录页面
    login: {
      title: 'MoFox Bot',
      subtitle: '管理控制中心',
      token: '访问令牌',
      tokenPlaceholder: '请输入访问令牌 (Token)',
      loginButton: '登录',
      loggingIn: '登录中...',
      welcomeBack: '欢迎回来！',
      loginSuccess: '登录成功',
      invalidToken: '无效的访问令牌',
    },
    
    // 侧边栏导航
    nav: {
      dashboard: '仪表盘',
      config: '配置中心',
      logs: '日志查看器',
      theme: '主题定制器',
      logout: '登出',
    },
    
    // 仪表盘
    dashboard: {
      title: '仪表盘总览',
      systemStatus: '系统状态',
      online: '在线',
      offline: '离线',
      uptime: '运行时长',
      days: '天',
      hours: '小时',
      minutes: '分钟',
      cpuUsage: 'CPU使用率',
      memoryUsage: '内存使用',
      activeUsers: '活跃用户',
      users: '用户',
      todayMessages: '今日消息',
      messages: '条消息',
      quickActions: '快速操作',
      restartBot: '重启机器人',
      clearCache: '清空缓存',
      exportLogs: '导出日志',
      backupConfig: '备份配置',
      recentLogs: '最近日志',
      level: '级别',
      timestamp: '时间戳',
      message: '消息',
      viewAll: '查看全部',
      dailyQuote: '每日一言',
      refresh: '换一句',
    },
    
    // 配置中心
    config: {
      title: '配置中心',
      saveChanges: '保存更改',
      saveSuccess: '配置保存成功！',
      
      // 数据库系统
      database: {
        title: '数据库系统',
        type: '数据库类型',
        host: '数据库地址',
        port: '端口',
        username: '用户名',
        password: '密码',
        database: '数据库名',
        poolSize: '连接池大小',
      },
      
      // 机器人身份
      bot: {
        title: '机器人身份与权限',
        token: 'Bot Token',
        appId: '应用ID',
        appSecret: '应用密钥',
        permissions: '权限设置',
        adminOnly: '仅管理员可用',
        allowGroups: '允许群聊',
        allowPrivate: '允许私聊',
      },
      
      // AI人格
      personality: {
        title: 'AI人格设置',
        name: '机器人名称',
        personality: '人格描述',
        temperature: '创造性（Temperature）',
        maxTokens: '最大回复长度',
        systemPrompt: '系统提示词',
      },
      
      // 聊天交互
      chat: {
        title: '聊天交互逻辑',
        replyDelay: '回复延迟（秒）',
        contextWindow: '上下文窗口',
        enableMentions: '启用@提及',
        enableEmoji: '启用表情回应',
        enableVoice: '启用语音回复',
      },
      
      // 关系记忆
      memory: {
        title: '关系与记忆系统',
        enableMemory: '启用记忆系统',
        memoryDays: '记忆保留天数',
        relationshipTracking: '关系追踪',
        emotionalAnalysis: '情感分析',
        topicTracking: '话题追踪',
      },
      
      // 安全模块
      security: {
        title: '安全模块',
        enableRateLimit: '启用速率限制',
        maxRequestsPerMin: '每分钟最大请求数',
        enableContentFilter: '启用内容过滤',
        enableAntiSpam: '启用反垃圾',
        blacklist: '黑名单',
      },
      
      // 内容生成
      content: {
        title: '内容生成偏好',
        imageGeneration: '图片生成',
        maxImagesPerDay: '每日图片生成上限',
        enableMemes: '启用表情包',
        enableStickers: '启用贴纸',
        enableMarkdown: '启用Markdown',
      },
      
      // 模型配置
      model: {
        title: '模型配置',
        provider: '服务提供商',
        model: '模型名称',
        apiKey: 'API密钥',
        apiEndpoint: 'API端点',
        timeout: '超时时间（秒）',
      },
    },
    
    // 日志查看器
    logs: {
      title: '日志查看器',
      filter: '筛选级别',
      all: '全部',
      info: '信息',
      warning: '警告',
      error: '错误',
      search: '搜索日志...',
      clearLogs: '清空日志',
      exportLogs: '导出日志',
      refreshLogs: '刷新日志',
    },
    
    // 主题定制器
    theme: {
      title: '主题定制器',
      presetThemes: '预设主题',
      customTheme: '自定义主题',
      themeName: '主题名称',
      primaryColor: '主色调',
      secondaryColor: '强调色',
      backgroundColor: '背景色',
      applyTheme: '应用主题',
      themeApplied: '主题已应用！',
      
      // 预设主题名称
      presets: {
        cyberpunk: '赛博朋克',
        ocean: '深海蓝调',
        sunset: '晚霞渐变',
        forest: '森林绿意',
        aurora: '极光梦幻',
        neon: '霓虹电光',
      },
    },
  },
  
  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      saving: 'Saving...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
    },
    
    // Login Page
    login: {
      title: 'MoFox Bot',
      subtitle: 'Management Control Center',
      token: 'Access Token',
      tokenPlaceholder: 'Enter your access token',
      loginButton: 'Sign In',
      loggingIn: 'Signing in...',
      welcomeBack: 'Welcome back!',
      loginSuccess: 'Login successful',
      invalidToken: 'Invalid access token',
    },
    
    // Sidebar Navigation
    nav: {
      dashboard: 'Dashboard',
      config: 'Configuration',
      logs: 'Log Viewer',
      theme: 'Theme Customizer',
      logout: 'Logout',
    },
    
    // Dashboard
    dashboard: {
      title: 'Dashboard Overview',
      systemStatus: 'System Status',
      online: 'Online',
      offline: 'Offline',
      uptime: 'Uptime',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      cpuUsage: 'CPU Usage',
      memoryUsage: 'Memory Usage',
      activeUsers: 'Active Users',
      users: 'users',
      todayMessages: 'Today\'s Messages',
      messages: 'messages',
      quickActions: 'Quick Actions',
      restartBot: 'Restart Bot',
      clearCache: 'Clear Cache',
      exportLogs: 'Export Logs',
      backupConfig: 'Backup Config',
      recentLogs: 'Recent Logs',
      level: 'Level',
      timestamp: 'Timestamp',
      message: 'Message',
      viewAll: 'View All',
      dailyQuote: 'Daily Quote',
      refresh: 'Refresh',
    },
    
    // Configuration Center
    config: {
      title: 'Configuration Center',
      saveChanges: 'Save Changes',
      saveSuccess: 'Configuration saved successfully!',
      
      // Database System
      database: {
        title: 'Database System',
        type: 'Database Type',
        host: 'Host',
        port: 'Port',
        username: 'Username',
        password: 'Password',
        database: 'Database',
        poolSize: 'Pool Size',
      },
      
      // Bot Identity
      bot: {
        title: 'Bot Identity & Permissions',
        token: 'Bot Token',
        appId: 'Application ID',
        appSecret: 'Application Secret',
        permissions: 'Permissions',
        adminOnly: 'Admin Only',
        allowGroups: 'Allow Groups',
        allowPrivate: 'Allow Private',
      },
      
      // AI Personality
      personality: {
        title: 'AI Personality',
        name: 'Bot Name',
        personality: 'Personality',
        temperature: 'Temperature',
        maxTokens: 'Max Tokens',
        systemPrompt: 'System Prompt',
      },
      
      // Chat Interaction
      chat: {
        title: 'Chat Interaction Logic',
        replyDelay: 'Reply Delay (s)',
        contextWindow: 'Context Window',
        enableMentions: 'Enable Mentions',
        enableEmoji: 'Enable Emoji',
        enableVoice: 'Enable Voice',
      },
      
      // Relationship Memory
      memory: {
        title: 'Relationship & Memory System',
        enableMemory: 'Enable Memory',
        memoryDays: 'Memory Retention (days)',
        relationshipTracking: 'Relationship Tracking',
        emotionalAnalysis: 'Emotional Analysis',
        topicTracking: 'Topic Tracking',
      },
      
      // Security Module
      security: {
        title: 'Security Module',
        enableRateLimit: 'Enable Rate Limit',
        maxRequestsPerMin: 'Max Requests/Min',
        enableContentFilter: 'Enable Content Filter',
        enableAntiSpam: 'Enable Anti-Spam',
        blacklist: 'Blacklist',
      },
      
      // Content Generation
      content: {
        title: 'Content Generation',
        imageGeneration: 'Image Generation',
        maxImagesPerDay: 'Max Images/Day',
        enableMemes: 'Enable Memes',
        enableStickers: 'Enable Stickers',
        enableMarkdown: 'Enable Markdown',
      },
      
      // Model Configuration
      model: {
        title: 'Model Configuration',
        provider: 'Provider',
        model: 'Model Name',
        apiKey: 'API Key',
        apiEndpoint: 'API Endpoint',
        timeout: 'Timeout (s)',
      },
    },
    
    // Log Viewer
    logs: {
      title: 'Log Viewer',
      filter: 'Filter Level',
      all: 'All',
      info: 'Info',
      warning: 'Warning',
      error: 'Error',
      search: 'Search logs...',
      clearLogs: 'Clear Logs',
      exportLogs: 'Export Logs',
      refreshLogs: 'Refresh Logs',
    },
    
    // Theme Customizer
    theme: {
      title: 'Theme Customizer',
      presetThemes: 'Preset Themes',
      customTheme: 'Custom Theme',
      themeName: 'Theme Name',
      primaryColor: 'Primary Color',
      secondaryColor: 'Secondary Color',
      backgroundColor: 'Background Color',
      applyTheme: 'Apply Theme',
      themeApplied: 'Theme applied!',
      
      // Preset Theme Names
      presets: {
        cyberpunk: 'Cyberpunk',
        ocean: 'Ocean Blue',
        sunset: 'Sunset Gradient',
        forest: 'Forest Green',
        aurora: 'Aurora Dream',
        neon: 'Neon Glow',
      },
    },
  },
};

export type Language = 'zh' | 'en';
export type Translations = typeof translations.zh;
