import { useState } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { AppSidebar } from "./components/AppSidebar";
import { ConfigurationManager } from "./components/ConfigurationManager";
import { LogViewer } from "./components/LogViewer";
import { ThemeManager } from "./components/ThemeManager";
import { Dashboard } from "./components/Dashboard";
import { ChatStatistics } from "./components/ChatStatistics";
import { UserProfile } from "./components/UserProfile";
import { UserManagement } from "./components/UserManagement";
import { LoginPage } from "./components/LoginPage";
import { FileSelector } from "./components/FileSelector";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { del } from 'idb-keyval';
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isAuthenticated, user, isLoading, login, logout } = useAuth();
  const { config: themeConfig, isLoaded: themeLoaded } = useTheme();
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);

  const handleSectionChange = (section: string) => {
    if (section !== activeSection) {
      if (themeConfig.effects.animations) {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveSection(section);
          setIsTransitioning(false);
        }, 150); // 延迟应与CSS过渡时间匹配
      } else {
        setActiveSection(section);
      }
    }
  };

  // 退出登录时重置activeSection
  const handleLogout = (showToast = true) => {
    handleSectionChange("dashboard");
    setDirectoryHandle(null);
    del('directoryHandle'); // Clear handle from IndexedDB
    if (showToast) {
      toast.info("已退出，请重新登录并选择目录。");
    }
    logout();
  };

  const handleFileSelect = (handle: FileSystemDirectoryHandle) => {
    setDirectoryHandle(handle);
    toast.success("已自动加载上次选择的目录", {
      description: handle.name,
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNavigateToLogs={() => handleSectionChange("logs")} />;
      case "config":
        return <ConfigurationManager directoryHandle={directoryHandle} onPermissionError={() => handleLogout(false)} />;
      case "logs":
        return <LogViewer />;
      case "statistics":
        return <ChatStatistics />;
      case "profile":
        return user ? <UserProfile user={user} onBack={() => handleSectionChange("dashboard")} /> : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">用户数据不可用</p>
            </div>
          </div>
        );
      case "users":
        return <UserManagement />;
      case "theme":
        return <ThemeManager />;
      default:
        return <Dashboard onNavigateToLogs={() => handleSectionChange("logs")} />;
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
      case "statistics":
        return "聊天统计";
      case "profile":
        return "个人资料";
      case "users":
        return "用户管理";
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
      case "statistics":
        return "聊天消息统计分析与用户活跃度排行";
      case "profile":
        return "管理您的账户信息和偏好设置";
      case "users":
        return "管理系统用户账户和权限分配";
      case "theme":
        return "界面主题配置与个性化设置";
      default:
        return "监控MoFox Bot的运行状态和关键指标";
    }
  };

  // 显示加载状态
  if (isLoading || !themeLoaded) {
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

  // 如果已登录但未选择目录，则显示文件选择器
  if (!directoryHandle) {
    return <FileSelector onFileSelect={handleFileSelect} onLogout={handleLogout} />;
  }

  // 登录后显示主界面
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            user={user || undefined}
            onLogout={handleLogout}
          />
          <main className={`flex-1 flex flex-col transition-all duration-300 ${isTransitioning ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
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
                </div>
              </div>
            </header>
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  );
}