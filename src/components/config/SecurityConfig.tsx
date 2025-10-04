import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, Shield, Users, Ban } from "lucide-react";
import { SecurityConfigType } from "./types";
import { defaultConfig } from "./defaults";
import { useState } from "react";

interface SecurityConfigProps {
  config: SecurityConfigType;
  updateConfig: (key: keyof SecurityConfigType | `anti_injection.${keyof SecurityConfigType['anti_injection']}`, value: any) => void;
  sharedUserId: string;
  setSharedUserId: (id: string) => void;
}

export function SecurityConfig({ config, updateConfig, sharedUserId, setSharedUserId }: SecurityConfigProps) {
  const safeConfig = { ...defaultConfig.security, ...(config || {}) };
  safeConfig.anti_injection = { ...defaultConfig.security.anti_injection, ...(safeConfig.anti_injection || {}) };
  
  const [newWhitelistUser, setNewWhitelistUser] = useState("");

  const addWhitelistUser = () => {
    if (newWhitelistUser.trim() && !safeConfig.anti_injection.whitelist.includes(newWhitelistUser.trim())) {
      updateConfig("anti_injection.whitelist", [...safeConfig.anti_injection.whitelist, newWhitelistUser.trim()]);
      setNewWhitelistUser("");
    }
  };

  const removeWhitelistUser = (userId: string) => {
    updateConfig("anti_injection.whitelist", 
      safeConfig.anti_injection.whitelist.filter(u => u !== userId)
    );
  };

  return (
    <div className="space-y-6">

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
              <Label htmlFor="anti-injection-switch">启用反注入系统</Label>
              <p className="text-sm text-muted-foreground">
                检测和阻止恶意注入攻击
              </p>
            </div>
            <Switch
              id="anti-injection-switch"
              checked={safeConfig.anti_injection.enabled}
              onCheckedChange={(checked) => updateConfig("anti_injection.enabled", checked)}
            />
          </div>

          {safeConfig.anti_injection.enabled && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="process-mode">处理模式</Label>
                <Select
                  value={safeConfig.anti_injection.process_mode}
                  onValueChange={(value) => updateConfig("anti_injection.process_mode", value)}
                >
                  <SelectTrigger id="process-mode">
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
                  {safeConfig.anti_injection.whitelist.map((userId) => (
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
                    <Label htmlFor="auto-ban-switch">启用自动封禁</Label>
                    <p className="text-sm text-muted-foreground">
                      达到违规阈值时自动封禁用户
                    </p>
                  </div>
                  <Switch
                    id="auto-ban-switch"
                    checked={safeConfig.anti_injection.auto_ban_enabled}
                    onCheckedChange={(checked) => updateConfig("anti_injection.auto_ban_enabled", checked)}
                  />
                </div>

                {safeConfig.anti_injection.auto_ban_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="violation-threshold">违规次数阈值</Label>
                    <Input
                      id="violation-threshold"
                      type="number"
                      value={safeConfig.anti_injection.auto_ban_violation_threshold}
                      onChange={(e) => updateConfig("anti_injection.auto_ban_violation_threshold", parseInt(e.target.value) || 0)}
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