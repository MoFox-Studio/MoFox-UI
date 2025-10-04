import React from "react";
import { toast } from "sonner";
import { Settings, Terminal, Palette, Bot, LayoutDashboard, LogOut, User, Power } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user?: {
    username: string;
    displayName: string;
    role: string;
  };
  onLogout?: () => void;
}

const navigationItems = [
  {
    id: "dashboard",
    title: "控制台",
    icon: LayoutDashboard,
    description: "系统概览与监控"
  },
  {
    id: "config",
    title: "配置管理",
    icon: Settings,
    description: "机器人配置与设置"
  },
  {
    id: "logs",
    title: "日志同步",
    icon: Terminal,
    description: "实时日志监控"
  },
  {
    id: "theme",
    title: "主题设置",
    icon: Palette,
    description: "界面主题配置"
  },
  {
    id: "admin",
    title: "系统管理",
    icon: User,
    description: "系统管理与权限控制"
  }
];

export function AppSidebar({ activeSection, onSectionChange, user, onLogout }: AppSidebarProps) {
  const handleRestartWebUIClick = async () => {
    toast.info("正在重启 WebUI...");
    await window.electron.restartWebUI();
  };

  const handleRestartBotClick = async () => {
    toast.error("此功能在网页版中不可用。");
  };

  const showRestartToast = () => {
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
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-10 py-8">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="h-16 w-16 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-medium">MoFox Bot</h2>
            <p className="text-xs text-muted-foreground">v2.0.0</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>管理功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Separator className="my-5" />}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span>{item.title}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {item.description}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter className="border-t p-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user.displayName}</span>
                  <span className="text-xs text-muted-foreground">{user.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem onClick={showRestartToast}>
                <Power className="mr-2 h-4 w-4" />
                重启服务
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}