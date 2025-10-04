import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, X } from "lucide-react";
import { BotConfigType } from "./types";
import { defaultConfig } from "./defaults";

interface BotConfigProps {
  config: BotConfigType;
  updateConfig: (key: keyof BotConfigType, value: any) => void;
}

export const BotConfig = ({ config, updateConfig }: BotConfigProps) => {
  const safeConfig = { ...defaultConfig.bot, ...(config || {}) };
  safeConfig.alias_names = safeConfig.alias_names || [];
  safeConfig.command_prefixes = safeConfig.command_prefixes || [];

  const [newAlias, setNewAlias] = useState("");
  const [newPrefix, setNewPrefix] = useState("");

  const handleValueChange = <K extends keyof BotConfigType>(key: K, value: BotConfigType[K]) => {
    updateConfig(key, value);
  };

  const handleNumberChange = (key: 'qq_account' | 'max_context_size' | 'thinking_timeout', value: string) => {
    const sanitizedValue = key === 'qq_account' ? value.replace(/\D/g, '') : value;
    let numValue = parseInt(sanitizedValue, 10);
    if (isNaN(numValue)) {
      numValue = 0;
    }

    if (key === "max_context_size") {
      if (numValue > 36) {
        toast.warning("该数据请勿过大");
      }
      if (numValue > 256) {
        numValue = 256;
      }
    }

    if (key === "thinking_timeout") {
      if (numValue > 180) {
        toast.warning("该数据请勿过久");
      }
    }
    
    updateConfig(key, numValue);
  };

  const addAlias = () => {
    if (newAlias.trim() && !safeConfig.alias_names.includes(newAlias.trim())) {
      const newAliasList = [...safeConfig.alias_names, newAlias.trim()];
      handleValueChange("alias_names", newAliasList);
      setNewAlias("");
    }
  };

  const removeAlias = (alias: string) => {
    const newAliasList = safeConfig.alias_names.filter((a: string) => a !== alias);
    handleValueChange("alias_names", newAliasList);
  };

  const addPrefix = () => {
    if (newPrefix.trim() && !safeConfig.command_prefixes.includes(newPrefix.trim())) {
      const newPrefixList = [...safeConfig.command_prefixes, newPrefix.trim()];
      handleValueChange("command_prefixes", newPrefixList);
      setNewPrefix("");
    }
  };

  const removePrefix = (prefix: string) => {
    const newPrefixList = safeConfig.command_prefixes.filter((p: string) => p !== prefix);
    handleValueChange("command_prefixes", newPrefixList);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">基础信息</CardTitle>
          <CardDescription>配置机器人的基本身份信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">平台类型</Label>
              <Select value={safeConfig.platform} onValueChange={(value) => handleValueChange("platform", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qq">QQ</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                  <SelectItem value="wechat">微信</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qq-account">账号</Label>
              <Input
                id="qq-account"
                value={String(safeConfig.qq_account)}
                onChange={(e) => handleNumberChange("qq_account", e.target.value)}
                placeholder="请输入机器人账号"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">昵称</Label>
            <Input
              id="nickname"
              value={safeConfig.nickname}
              onChange={(e) => handleValueChange("nickname", e.target.value)}
              placeholder="请输入机器人昵称"
            />
          </div>

          <div className="space-y-3">
            <Label>别名列表</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {safeConfig.alias_names.map((alias: string) => (
                <Badge key={alias} variant="secondary" className="flex items-center gap-1">
                  {alias}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeAlias(alias)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                placeholder="添加新别名"
                onKeyPress={(e) => e.key === 'Enter' && addAlias()}
              />
              <Button onClick={addAlias} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">命令配置</CardTitle>
          <CardDescription>设置命令前缀和识别规则</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>命令前缀</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {safeConfig.command_prefixes.map((prefix: string) => (
                <Badge key={prefix} variant="outline" className="flex items-center gap-1">
                  {prefix}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removePrefix(prefix)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                placeholder="添加新前缀"
                onKeyPress={(e) => e.key === 'Enter' && addPrefix()}
                className="max-w-32"
              />
              <Button onClick={addPrefix} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">聊天设置</CardTitle>
          <CardDescription>配置聊天行为和响应参数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>允许回复自己</Label>
              <p className="text-sm text-muted-foreground">
                机器人是否可以回复自己发送的消息
              </p>
            </div>
            <Switch
              checked={safeConfig.allow_reply_self}
              onCheckedChange={(checked) => handleValueChange("allow_reply_self", checked)}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-context">最大上下文长度</Label>
              <Input
                id="max-context"
                type="number"
                value={String(safeConfig.max_context_size)}
                onChange={(e) => handleNumberChange("max_context_size", e.target.value)}
                placeholder="10"
                max="256"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thinking-timeout">思考超时时间 (秒)</Label>
              <Input
                id="thinking-timeout"
                type="number"
                value={String(safeConfig.thinking_timeout)}
                onChange={(e) => handleNumberChange("thinking_timeout", e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};