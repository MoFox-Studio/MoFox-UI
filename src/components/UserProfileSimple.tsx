import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, User } from "lucide-react";

interface UserProfileSimpleProps {
  user: {
    username: string;
    displayName: string;
    role: string;
  };
  onBack?: () => void;
}

export function UserProfileSimple({ user, onBack }: UserProfileSimpleProps) {
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
          <p className="text-muted-foreground">管理您的账户信息</p>
        </div>
      </div>

      {/* 简化的用户信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            用户信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">用户名</label>
            <p className="text-lg">{user.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium">显示名称</label>
            <p className="text-lg">{user.displayName}</p>
          </div>
          <div>
            <label className="text-sm font-medium">角色</label>
            <p className="text-lg">{user.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}