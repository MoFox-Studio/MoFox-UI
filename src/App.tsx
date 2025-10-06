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

import { LoginPage } from "./components/LoginPage";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { isAuthenticated, user, isLoading, login, logout } = useAuth();
  const { isLoaded: themeLoaded } = useTheme();

  // 退出登录时重置activeSection
  const handleLogout = () => {
    setActiveSection("dashboard");
    logout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNavigateToLogs={() => setActiveSection("logs")} />;
      case "config":
        return <ConfigurationManager />;
      case "logs":
        return <LogViewer />;
      case "statistics":
        return <ChatStatistics />;
      case "profile":
        return user ? <UserProfile user={user} onBack={() => setActiveSection("dashboard")} /> : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">用户数据不可用</p>
            </div>
          </div>
        );

      case "theme":
        return <ThemeManager />;
      default:
        return <Dashboard onNavigateToLogs={() => setActiveSection("logs")} />;
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

  // 登录后显示主界面
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            user={user || undefined}
            onLogout={handleLogout}
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