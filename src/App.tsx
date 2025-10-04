import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parse as parseToml } from '@ltd/j-toml';
import { SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { AppSidebar } from "./components/AppSidebar";
import { ConfigurationManager } from "./components/ConfigurationManager";
import { LogViewer } from "./components/LogViewer";
import { ThemeManager, defaultConfig, ThemeConfig, DEFAULT_THEME_COLORS_LIGHT, DEFAULT_THEME_COLORS_DARK } from "./components/ThemeManager";
import { Dashboard } from "./components/Dashboard";
import { LoginPage } from "./components/LoginPage";
import { FileSelector } from "./components/FileSelector";
import SystemManagement from "./components/SystemManagement";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";
import { toast } from "sonner";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [isPathValidated, setIsPathValidated] = useState(true); // Always true for web
  const [sharedUserId, setSharedUserId] = useState('');
  const { isAuthenticated, user, isLoading, login, logout } = useAuth();
  const [platform, setPlatform] = useState('qq');
  const [masterUsers, setMasterUsers] = useState<[string, string][]>([]);
  const [configPath, setConfigPath] = useState('');
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    try {
      const savedConfig = localStorage.getItem("themeConfig");
      return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
    } catch (error) {
      return defaultConfig;
    }
  });

  const fetchConfig = useCallback(async () => {
    if (directoryHandle) {
      try {
        const botDir = await directoryHandle.getDirectoryHandle('Bot');
        const configDir = await botDir.getDirectoryHandle('config');
        const configFileHandle = await configDir.getFileHandle('bot_config.toml');
        const file = await configFileHandle.getFile();
        const content = await file.text();
        const parsed = parseToml(content, { joiner: '\n' } as any);
        if (parsed.security && (parsed.security as any).master_users) {
            setMasterUsers((parsed.security as any).master_users);
        } else {
            setMasterUsers([]);
        }
        setConfigPath(configFileHandle.name);
        toast.success("配置文件加载成功");
      } catch (error) {
        toast.error("加载配置文件失败", { description: String(error) });
        setMasterUsers([]);
      }
    } else {
      setConfigPath('未选择机器人目录');
      setMasterUsers([]);
    }
  }, [directoryHandle]);

  useEffect(() => {
    const root = document.documentElement;
    if (themeConfig.mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("themeConfig", JSON.stringify(themeConfig));

    root.style.setProperty("--primary", themeConfig.customColors.primary);
    root.style.setProperty("--secondary", themeConfig.customColors.secondary);
    root.style.setProperty("--accent", themeConfig.customColors.accent);
    root.style.fontSize = `${themeConfig.accessibility.fontSize}px`;
    // ... apply other styles if needed
    fetchConfig();
  }, [themeConfig, fetchConfig]);

  const toggleTheme = () => {
    setThemeConfig(prev => {
      const newMode = prev.mode === 'dark' ? 'light' : 'dark';
      let newColors = prev.customColors;
      if (prev.preset === 'default') {
        newColors = newMode === 'dark' ? DEFAULT_THEME_COLORS_DARK : DEFAULT_THEME_COLORS_LIGHT;
      }
      return { ...prev, mode: newMode, customColors: newColors };
    });
  };

  const handleAddUser = () => {
    if (sharedUserId) {
      const newMasterUsers = [...masterUsers, [platform, sharedUserId] as [string, string]];
      setMasterUsers(newMasterUsers);
      setSharedUserId('');
    }
  };

  const handleRemoveUser = (index: number) => {
    const newUsers = [...masterUsers];
    newUsers.splice(index, 1);
    setMasterUsers(newUsers);
  };

  const handleSave = async () => {
    toast.info("请使用配置管理中的“保存配置”按钮进行保存。");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard directoryName={directoryHandle?.name} onNavigateToLogs={() => setActiveSection("logs")} />;
      case "config":
        return <ConfigurationManager
                  directoryHandle={directoryHandle}
                  sharedUserId={sharedUserId}
                  setSharedUserId={setSharedUserId}
                  masterUsers={masterUsers}
                  setMasterUsers={setMasterUsers}
                  configPath={configPath}
                  fetchConfig={fetchConfig}
                />;
      case "logs":
        return <LogViewer />;
      case "theme":
        return <ThemeManager config={themeConfig} setConfig={setThemeConfig} />;
      case "admin":
        return <SystemManagement
                  sharedUserId={sharedUserId}
                  setSharedUserId={setSharedUserId}
                  onLogout={() => {
                    logout();
                    setDirectoryHandle(null);
                  }}
                  platform={platform}
                  setPlatform={setPlatform}
                  masterUsers={masterUsers}
                  configPath={configPath}
                  handleAddUser={handleAddUser}
                  handleRemoveUser={handleRemoveUser}
                  handleSave={handleSave}
                />;
      case "default":
        return <Dashboard directoryName={directoryHandle?.name} onNavigateToLogs={() => setActiveSection("logs")} />;
    }
  };

  const getPageTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "控制台概览";
      case "config":
        return "配置管理";
      case "logs":
        return "日志同步";
      case "theme":
        return "主题设置";
      default:
        return "控制台概览";
    }
  };

  const getPageDescription = () => {
    switch (activeSection) {
      case "dashboard":
        return "监控MoFox Bot的运行状态和关键指标";
      case "config":
        return "智能机器人配置与设置";
      case "logs":
        return "实时日志监控与管理";
      case "theme":
        return "界面主题配置与个性化设置";
      default:
        return "监控MoFox Bot的运行状态和关键指标";
    }
  };

  // 显示加载状态
  if (isLoading || !isPathValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 bg-primary rounded-lg animate-pulse mx-auto"></div>
          <p className="text-muted-foreground">正在加载...</p>
        </div>
      </div>
    );
  }

  // 如果未登录，显示登录页面
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // 如果已登录但未选择文件，显示文件选择界面
  const handleFileSelected = async (handle: FileSystemDirectoryHandle) => {
    try {
      // 验证目录结构：尝试访问必需的配置文件
      const botDir = await handle.getDirectoryHandle('Bot');
      const configDir = await botDir.getDirectoryHandle('config');
      await configDir.getFileHandle('bot_config.toml');

      // 如果以上代码没有抛出错误，说明结构正确
      setDirectoryHandle(handle);
      toast.success("目录验证成功", { description: `已选择: ${handle.name}` });

    } catch (error) {
      // 如果访问失败，说明用户选错了目录
      console.error("目录验证失败:", error);
      toast.error("目录结构不正确", {
        description: "未在所选目录中找到 'Bot/config/bot_config.toml'。请确保您选择的是 MoFox Bot 的主目录（而不是Bot或config子目录）。",
      });
      // 不要设置目录句柄，让用户留在选择界面
    }
  };

  const handleLogout = () => {
    logout();
    setDirectoryHandle(null);
  };
  
  if (!directoryHandle) {
    return <FileSelector onFileSelect={handleFileSelected} onLogout={handleLogout} />;
  }

  // 登录后显示主界面
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            user={user || undefined}
            onLogout={() => {
              logout();
              setDirectoryHandle(null);
            }}
          />
          <main className="flex-1 flex flex-col">
            <header className="border-b bg-card px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-1">{getPageTitle()}</h1>
                  <p className="text-muted-foreground text-sm">
                    {getPageDescription()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">在线</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    欢迎, {user?.displayName}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-primary hover:text-primary/90"
                  >
                    {themeConfig.mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.location.reload()}
                    className="text-primary hover:text-primary/90"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </header>
            <div className="flex-1 p-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  );
}