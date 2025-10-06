    import { useState, useEffect } from "react";
    import * as toml from 'toml';
    import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, AlertTriangle, Save } from "lucide-react";
import { toast } from "sonner";

interface BotConfigProps {
  tomlContent: string;
  onSave: (newTomlContent: string) => void;
  botTomlPath: string;
}

interface BotConfigState {
  platform: string;
  qq_account: string;
  nickname: string;
  alias_names: string[];
  command_prefixes: string[];
  allow_reply_self: boolean;
  max_context_size: number;
  thinking_timeout: number;
  express_mode: string;
  interruption_enabled: boolean;
  interruption_max_limit: number;
  interruption_probability_factor: number;
  dynamic_distribution_enabled: boolean;
  dynamic_distribution_base_interval: number;
  max_concurrent_distributions: number;
  host: string;
  port: number;
  eula_confirmed: boolean;
}

const defaultConfigState: BotConfigState = {
  platform: "qq",
  qq_account: "",
  nickname: "MoFox",
  alias_names: [],
  command_prefixes: ["/"],
  allow_reply_self: false,
  max_context_size: 10,
  thinking_timeout: 30,
  express_mode: "llm",
  interruption_enabled: true,
  interruption_max_limit: 3,
  interruption_probability_factor: 0.3,
  dynamic_distribution_enabled: true,
  dynamic_distribution_base_interval: 60,
  max_concurrent_distributions: 5,
  host: "0.0.0.0",
  port: 8080,
  eula_confirmed: false,
};

export function BotConfig({ tomlContent, onSave, botTomlPath }: BotConfigProps) {
  const [config, setConfig] = useState<BotConfigState>(defaultConfigState);

  useEffect(() => {
    if (tomlContent) {
      try {
        const parsedToml = toml.parse(tomlContent);
        const botConfig = parsedToml.bot || {};
        const commandConfig = parsedToml.command || {};
        const chatConfig = parsedToml.chat || {};

        setConfig(prevConfig => ({
          ...prevConfig,
          ...botConfig,
          ...commandConfig,
          ...chatConfig,
        }));
      } catch (e: any) {
        console.error("KILO-CODE-DEBUG: Error parsing TOML in BotConfig.tsx. Full error object:", e);
        const match = e.message.match(/at line (\d+) column (\d+)/);
        const description = match
          ? `语法错误: ${e.message.split(' at line')[0]} (行: ${match[1]}, 列: ${match[2]})`
          : `语法错误: ${e.message}`;
        toast.error("解析 BotConfig 失败", { description, duration: 10000 });
      }
    }
  }, [tomlContent]);

  const [newAlias, setNewAlias] = useState("");
  const [newPrefix, setNewPrefix] = useState("");

  const handleSave = () => {
    let updatedToml = tomlContent;

    const updateValue = (section: string, key: string, value: any) => {
      const valueStr = typeof value === 'string' ? `"${value}"` : Array.isArray(value) ? `[${value.map(v => `"${v}"`).join(", ")}]` : value;
      const regex = new RegExp(`(\\[${section}\\][\\s\\S]*?${key}\\s*=\\s*)[^\\n]+`);
      if (regex.test(updatedToml)) {
        updatedToml = updatedToml.replace(regex, `$1${valueStr}`);
      }
    };
    
    // [bot]
    updateValue('bot', 'platform', config.platform);
    updateValue('bot', 'qq_account', config.qq_account);
    updateValue('bot', 'nickname', config.nickname);
    updateValue('bot', 'alias_names', config.alias_names);
    updateValue('bot', 'host', config.host);
    updateValue('bot', 'port', config.port);
    updateValue('bot', 'eula_confirmed', config.eula_confirmed);
    
    // [command]
    updateValue('command', 'command_prefixes', config.command_prefixes);

    // [chat]
    updateValue('chat', 'allow_reply_self', config.allow_reply_self);
    updateValue('chat', 'max_context_size', config.max_context_size);
    updateValue('chat', 'thinking_timeout', config.thinking_timeout);
    updateValue('chat', 'express_mode', config.express_mode);
    updateValue('chat', 'interruption_enabled', config.interruption_enabled);
    updateValue('chat', 'interruption_max_limit', config.interruption_max_limit);
    updateValue('chat', 'interruption_probability_factor', config.interruption_probability_factor);
    updateValue('chat', 'dynamic_distribution_enabled', config.dynamic_distribution_enabled);
    updateValue('chat', 'dynamic_distribution_base_interval', config.dynamic_distribution_base_interval);
    updateValue('chat', 'max_concurrent_distributions', config.max_concurrent_distributions);

    onSave(updatedToml);
    toast.success("Bot 配置已保存！");
  };

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addAlias = () => {
    if (newAlias.trim() && !config.alias_names.includes(newAlias.trim())) {
      updateConfig("alias_names", [...config.alias_names, newAlias.trim()]);
      setNewAlias("");
    }
  };

  const removeAlias = (alias: string) => {
    updateConfig("alias_names", config.alias_names.filter(a => a !== alias));
  };

  const addPrefix = () => {
    if (newPrefix.trim() && !config.command_prefixes.includes(newPrefix.trim())) {
      updateConfig("command_prefixes", [...config.command_prefixes, newPrefix.trim()]);
      setNewPrefix("");
    }
  };

  const removePrefix = (prefix: string) => {
    updateConfig("command_prefixes", config.command_prefixes.filter(p => p !== prefix));
  };

  return (
    <div className="space-y-6">
      {/* Bot 基础信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">基础信息</CardTitle>
          <CardDescription>配置机器人的基本身份信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">平台类型</Label>
              <Select value={config.platform} onValueChange={(value: string) => updateConfig("platform", value)}>
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
                value={config.qq_account}
                onChange={(e) => updateConfig("qq_account", e.target.value)}
                placeholder="请输入机器人账号"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">昵称</Label>
            <Input
              id="nickname"
              value={config.nickname}
              onChange={(e) => updateConfig("nickname", e.target.value)}
              placeholder="请输入机器人昵称"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="new-alias-input">别名列表</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {config.alias_names.map((alias) => (
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
                id="new-alias-input"
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

      {/* 命令配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">命令配置</CardTitle>
          <CardDescription>设置命令前缀和识别规则</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="new-prefix-input">命令前缀</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {config.command_prefixes.map((prefix) => (
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
                id="new-prefix-input"
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

      {/* 聊天设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">聊天设置</CardTitle>
          <CardDescription>配置聊天行为和响应参数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-reply-self">允许回复自己</Label>
              <p className="text-sm text-muted-foreground">
                机器人是否可以回复自己发送的消息
              </p>
            </div>
            <Switch
              id="allow-reply-self"
              checked={config.allow_reply_self}
              onCheckedChange={(checked: boolean) => updateConfig("allow_reply_self", checked)}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-context">最大上下文长度</Label>
              <Input
                id="max-context"
                type="number"
                value={config.max_context_size}
                onChange={(e) => updateConfig("max_context_size", parseInt(e.target.value) || 0)}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thinking-timeout">思考超时时间 (秒)</Label>
              <Input
                id="thinking-timeout"
                type="number"
                value={config.thinking_timeout}
                onChange={(e) => updateConfig("thinking_timeout", parseInt(e.target.value) || 0)}
                placeholder="30"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="express-mode">表达方式学习方法</Label>
            <Select value={config.express_mode} onValueChange={(value: string) => updateConfig("express_mode", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llm">
                  <div className="flex flex-col">
                    <span>LLM模式</span>
                    <span className="text-xs text-muted-foreground">使用语言模型进行表达学习</span>
                  </div>
                </SelectItem>
                <SelectItem value="train">
                  <div className="flex flex-col">
                    <span>训练模式</span>
                    <span className="text-xs text-muted-foreground">深度学习训练模式（需要高端硬件）</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {config.express_mode === "train" && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-800/30">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">硬件要求警告</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    训练模式最低需要 8x4090 GPU，推荐使用 2xH100 以获得最佳性能。
                    请确保您的硬件配置满足要求。
                  </p>
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              选择机器人学习表达方式的方法。LLM模式适合大多数用户，训练模式需要专业硬件支持。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 消息打断系统 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">消息打断系统</CardTitle>
          <CardDescription>配置消息打断机制</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-interruption">启用消息打断</Label>
              <p className="text-sm text-muted-foreground">
                允许新消息打断正在生成的回复
              </p>
            </div>
            <Switch
              id="enable-interruption"
              checked={config.interruption_enabled}
              onCheckedChange={(checked: boolean) => updateConfig("interruption_enabled", checked)}
            />
          </div>

          {config.interruption_enabled && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interruption-limit">最大打断次数</Label>
                  <Input
                    id="interruption-limit"
                    type="number"
                    value={config.interruption_max_limit}
                    onChange={(e) => updateConfig("interruption_max_limit", parseInt(e.target.value) || 0)}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interruption-factor">打断概率因子</Label>
                  <Input
                    id="interruption-factor"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={config.interruption_probability_factor}
                    onChange={(e) => updateConfig("interruption_probability_factor", parseFloat(e.target.value) || 0)}
                    placeholder="0.3"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 动态消息分发 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">动态消息分发</CardTitle>
          <CardDescription>配置消息分发和并发处理</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-dynamic-distribution">启用动态分发</Label>
              <p className="text-sm text-muted-foreground">
                启用智能消息分发机制
              </p>
            </div>
            <Switch
              id="enable-dynamic-distribution"
              checked={config.dynamic_distribution_enabled}
              onCheckedChange={(checked: boolean) => updateConfig("dynamic_distribution_enabled", checked)}
            />
          </div>

          {config.dynamic_distribution_enabled && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base-interval">基础分发间隔 (秒)</Label>
                  <Input
                    id="base-interval"
                    type="number"
                    value={config.dynamic_distribution_base_interval}
                    onChange={(e) => updateConfig("dynamic_distribution_base_interval", parseInt(e.target.value) || 0)}
                    placeholder="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-concurrent">最大并发处理数</Label>
                  <Input
                    id="max-concurrent"
                    type="number"
                    value={config.max_concurrent_distributions}
                    onChange={(e) => updateConfig("max_concurrent_distributions", parseInt(e.target.value) || 0)}
                    placeholder="5"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 环境配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">环境配置</CardTitle>
          <CardDescription>服务器运行环境设置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">主机地址</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => updateConfig("host", e.target.value)}
                placeholder="0.0.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">端口号</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(e) => updateConfig("port", parseInt(e.target.value) || 0)}
                placeholder="8080"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="eula-confirmed">确认用户协议</Label>
              <p className="text-sm text-muted-foreground">
                确认已阅读并同意用户使用协议
              </p>
            </div>
            <Switch
              id="eula-confirmed"
              checked={config.eula_confirmed}
              onCheckedChange={(checked: boolean) => updateConfig("eula_confirmed", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存 Bot 配置
        </Button>
      </div>
    </div>
  );
}