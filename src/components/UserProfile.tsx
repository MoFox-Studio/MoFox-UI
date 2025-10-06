import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Bell,
  Globe,
  Palette,
  Save,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

interface UserProfileProps {
  user: {
    username: string;
    displayName: string;
    role: string;
  };
  onBack?: () => void;
}

interface ProfileSettings {
  displayName: string;
  email: string;
  phone: string;
  notifications: {
    email: boolean;
    browser: boolean;
    sound: boolean;
  };
  preferences: {
    language: string;
    theme: string;
    autoRefresh: boolean;
  };
}

export function UserProfile({ user, onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<ProfileSettings>({
    displayName: user.displayName,
    email: "admin@mofox.bot",
    phone: "+86 138****8888",
    notifications: {
      email: true,
      browser: true,
      sound: false
    },
    preferences: {
      language: "zh-CN",
      theme: "system",
      autoRefresh: true
    }
  });

  const handleSave = () => {
    // 模拟保存操作
    setTimeout(() => {
      setIsEditing(false);
      toast.success("个人资料已更新");
    }, 500);
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePreferenceChange = (key: keyof typeof settings.preferences, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "系统管理员";
      case "manager":
        return "管理员";
      default:
        return "用户";
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">个人资料</h1>
          <p className="text-muted-foreground">管理您的账户信息和偏好设置</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              保存更改
            </>
          ) : (
            <>
              <User className="h-4 w-4" />
              编辑资料
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本信息卡片 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像和基本信息 */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-2">
                <h3 className="font-semibold">{settings.displayName}</h3>
                <Badge className={getRoleBadgeColor(user.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {getRoleDisplayName(user.role)}
                </Badge>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>

            <Separator />

            {/* 账户统计 */}
            <div className="space-y-4">
              <h4 className="font-medium">账户统计</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold">127</div>
                  <div className="text-xs text-muted-foreground">登录次数</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">45</div>
                  <div className="text-xs text-muted-foreground">操作记录</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  加入时间: 2024年1月15日
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 详细设置 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 个人信息设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                个人信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">显示名称</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    disabled={!isEditing}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    value={user.username}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      disabled={!isEditing}
                      className="pl-10"
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={settings.phone}
                      disabled={!isEditing}
                      className="pl-10"
                      onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 通知设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">邮件通知</div>
                  <div className="text-sm text-muted-foreground">接收系统邮件通知</div>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">浏览器通知</div>
                  <div className="text-sm text-muted-foreground">接收浏览器推送通知</div>
                </div>
                <Switch
                  checked={settings.notifications.browser}
                  onCheckedChange={() => handleNotificationChange('browser')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">声音提示</div>
                  <div className="text-sm text-muted-foreground">开启通知声音提示</div>
                </div>
                <Switch
                  checked={settings.notifications.sound}
                  onCheckedChange={() => handleNotificationChange('sound')}
                />
              </div>
            </CardContent>
          </Card>

          {/* 偏好设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                偏好设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">语言设置</div>
                  <div className="text-sm text-muted-foreground">选择界面显示语言</div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">简体中文</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">自动刷新</div>
                  <div className="text-sm text-muted-foreground">自动刷新页面数据</div>
                </div>
                <Switch
                  checked={settings.preferences.autoRefresh}
                  onCheckedChange={(checked: boolean) => handlePreferenceChange('autoRefresh', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}