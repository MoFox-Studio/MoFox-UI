import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, Shield, Users, Ban } from "lucide-react";

export function SecurityConfig() {
  const [config, setConfig] = useState({
    // 权限管理
    master_users: [
      ["qq", "123456"],
      ["telegram", "user789"]
    ],
    
    // 反注入与安全机制
    anti_injection: {
      enabled: true,
      process_mode: "strict",
      whitelist: ["admin123", "trusted_user"],
      auto_ban_enabled: true,
      auto_ban_violation_threshold: 3,
    }
  });

  const [newMasterPlatform, setNewMasterPlatform] = useState("qq");
  const [newMasterUser, setNewMasterUser] = useState("");
  const [newWhitelistUser, setNewWhitelistUser] = useState("");

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateAntiInjection = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      anti_injection: {
        ...prev.anti_injection,
        [key]: value
      }
    }));
  };

  const addMasterUser = () => {
    if (newMasterUser.trim()) {
      const newUser = [newMasterPlatform, newMasterUser.trim()];
      const exists = config.master_users.some(
        ([platform, user]) => platform === newMasterPlatform && user === newMasterUser.trim()
      );
      
      if (!exists) {
        updateConfig("master_users", [...config.master_users, newUser]);
        setNewMasterUser("");
      }
    }
  };

  const removeMasterUser = (platform: string, userId: string) => {
    updateConfig("master_users", 
      config.master_users.filter(([p, u]) => !(p === platform && u === userId))
    );
  };

  const addWhitelistUser = () => {
    if (newWhitelistUser.trim() && !config.anti_injection.whitelist.includes(newWhitelistUser.trim())) {
      updateAntiInjection("whitelist", [...config.anti_injection.whitelist, newWhitelistUser.trim()]);
      setNewWhitelistUser("");
    }
  };

  const removeWhitelistUser = (userId: string) => {
    updateAntiInjection("whitelist", 
      config.anti_injection.whitelist.filter(u => u !== userId)
    );
  };

  const platformColors = {
    qq: "bg-blue-500",
    telegram: "bg-sky-500",
    discord: "bg-indigo-500",
    wechat: "bg-green-500"
  };

  return (
    <div className="space-y-6">
      {/* 权限管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            权限管理
          </CardTitle>
          <CardDescription>配置管理员用户和访问权限</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Master 用户列表</Label>
            <div className="space-y-2">
              {config.master_users.map(([platform, userId], index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                  <div className={`h-2 w-2 rounded-full ${platformColors[platform as keyof typeof platformColors] || "bg-gray-500"}`} />
                  <Badge variant="outline" className="text-xs">
                    {platform.toUpperCase()}
                  </Badge>
                  <span className="flex-1 font-mono text-sm">{userId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeMasterUser(platform, userId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Select value={newMasterPlatform} onValueChange={setNewMasterPlatform}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qq">QQ</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                  <SelectItem value="wechat">微信</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={newMasterUser}
                onChange={(e) => setNewMasterUser(e.target.value)}
                placeholder="用户ID"
                onKeyPress={(e) => e.key === 'Enter' && addMasterUser()}
                className="flex-1"
              />
              <Button onClick={addMasterUser} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Master 用户拥有最高权限，可以执行所有管理命令
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 反注入与安全机制 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            反注入与安全机制
          </CardTitle>
          <CardDescription>配置安全防护和恶意行为检测</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用反注入系统</Label>
              <p className="text-sm text-muted-foreground">
                检测和阻止恶意注入攻击
              </p>
            </div>
            <Switch
              checked={config.anti_injection.enabled}
              onCheckedChange={(checked) => updateAntiInjection("enabled", checked)}
            />
          </div>

          {config.anti_injection.enabled && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="process-mode">处理模式</Label>
                <Select 
                  value={config.anti_injection.process_mode} 
                  onValueChange={(value) => updateAntiInjection("process_mode", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">严格模式</SelectItem>
                    <SelectItem value="lenient">宽松模式</SelectItem>
                    <SelectItem value="learning">学习模式</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  严格模式会立即阻止可疑请求，宽松模式会记录但允许通过，学习模式用于训练
                </p>
              </div>

              <div className="space-y-3">
                <Label>白名单用户</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.anti_injection.whitelist.map((userId) => (
                    <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                      {userId}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeWhitelistUser(userId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newWhitelistUser}
                    onChange={(e) => setNewWhitelistUser(e.target.value)}
                    placeholder="添加白名单用户ID"
                    onKeyPress={(e) => e.key === 'Enter' && addWhitelistUser()}
                  />
                  <Button onClick={addWhitelistUser} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  白名单用户的请求将跳过反注入检查
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  <Label className="text-base">自动封禁系统</Label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>启用自动封禁</Label>
                    <p className="text-sm text-muted-foreground">
                      达到违规阈值时自动封禁用户
                    </p>
                  </div>
                  <Switch
                    checked={config.anti_injection.auto_ban_enabled}
                    onCheckedChange={(checked) => updateAntiInjection("auto_ban_enabled", checked)}
                  />
                </div>

                {config.anti_injection.auto_ban_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="violation-threshold">违规次数阈值</Label>
                    <Input
                      id="violation-threshold"
                      type="number"
                      value={config.anti_injection.auto_ban_violation_threshold}
                      onChange={(e) => updateAntiInjection("auto_ban_violation_threshold", parseInt(e.target.value) || 0)}
                      placeholder="3"
                      className="w-32"
                    />
                    <p className="text-sm text-muted-foreground">
                      用户达到此违规次数后将被自动封禁
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 安全提示 */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="text-base text-yellow-800 dark:text-yellow-200">
            安全提醒
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
          <p>• 请定期检查和更新 Master 用户列表，移除不再需要的管理员权限</p>
          <p>• 建议启用反注入系统，并选择适合的处理模式</p>
          <p>• 白名单功能请谨慎使用，避免添加不可信的用户</p>
          <p>• 自动封禁系统可能会误判，请合理设置阈值并定期检查封禁记录</p>
        </CardContent>
      </Card>
    </div>
  );
}