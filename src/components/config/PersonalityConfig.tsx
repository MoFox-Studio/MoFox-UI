import { useState, useEffect } from "react";
import * as toml from 'toml';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";

interface PersonalityConfigProps {
  tomlContent: string;
  onSave: (newTomlContent: string) => void;
  botTomlPath: string;
}

const initialPersonalityConfig = {
  personality_core: "",
  personality_side: "",
  identity: "",
  background_story: "",
  reply_style: "",
  safety_guidelines: [] as string[],
  use_expression: true,
  learn_expression: true,
  learning_strength: 1.0,
  emoji_chance: 0.6,
  max_reg_num: 10000,
  steal_emoji: true,
  emoji_selection_mode: "emotion",
};

export function PersonalityConfig({ tomlContent, onSave }: PersonalityConfigProps) {
  const [config, setConfig] = useState(initialPersonalityConfig);
  const [newGuideline, setNewGuideline] = useState("");

  useEffect(() => {
    if (tomlContent) {
      try {
        const parsedToml = toml.parse(tomlContent);
        const personality = parsedToml.personality || {};
        const emoji = parsedToml.emoji || {};
        
        setConfig({
          ...initialPersonalityConfig,
          ...personality,
          ...emoji,
          safety_guidelines: personality.safety_guidelines || [],
        });
      } catch (e: any) {
        console.error("KILO-CODE-DEBUG: Error parsing TOML in PersonalityConfig.tsx. Full error object:", e);
        const match = e.message.match(/at line (\d+) column (\d+)/);
        const description = match
          ? `语法错误: ${e.message.split(' at line')[0]} (行: ${match[1]}, 列: ${match[2]})`
          : `语法错误: ${e.message}`;
        toast.error("解析 PersonalityConfig 失败", { description, duration: 10000 });
      }
    }
  }, [tomlContent]);

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const addGuideline = () => {
    if (newGuideline.trim() && !config.safety_guidelines.includes(newGuideline.trim())) {
      updateConfig("safety_guidelines", [...config.safety_guidelines, newGuideline.trim()]);
      setNewGuideline("");
    }
  };

  const removeGuideline = (guideline: string) => {
    updateConfig("safety_guidelines", config.safety_guidelines.filter(g => g !== guideline));
  };

  const handleSave = () => {
    let updatedToml = tomlContent;

    const updateStringValue = (section: string, key: string, value: string) => {
        const isMultiLine = value.includes('\n');
        const formattedValue = isMultiLine
            ? `"""\n${value.replace(/"""/g, `\\"""`)}\n"""`
            : `"${value.replace(/"/g, '\\"')}"`;

        const singleLineRegex = new RegExp(`(\\[${section}\\](?:[^\\[]|\\[(?!\\[))*?${key}\\s*=\\s*)"(?:[^"\\\\]|\\\\.)*"`);
        const multiLineRegex = new RegExp(`(\\[${section}\\](?:[^\\[]|\\[(?!\\[))*?${key}\\s*=\\s*)"""(?:[^]*?)"""`);
        
        if (multiLineRegex.test(updatedToml)) {
             updatedToml = updatedToml.replace(multiLineRegex, `$1${formattedValue}`);
        } else if (singleLineRegex.test(updatedToml)) {
            updatedToml = updatedToml.replace(singleLineRegex, `$1${formattedValue}`);
        }
    };
    
    const updateNonStringValue = (section: string, key: string, value: any) => {
        const regex = new RegExp(`(\\[${section}\\](?:[^\\[]|\\[(?!\\[))*?${key}\\s*=\\s*)[^\\n#]*`);
        updatedToml = updatedToml.replace(regex, `$1${value}`);
    };
    
    const updateArrayValue = (section: string, key: string, value: string[]) => {
        const formattedValue = `[${value.map(v => `"${v.replace(/"/g, '\\"')}"`).join(", ")}]`;
        const regex = new RegExp(`(\\[${section}\\](?:[^\\[]|\\[(?!\\[))*?${key}\\s*=\\s*)\\[[\\s\\S]*?\\]`);
        
        if (regex.test(updatedToml)) {
            updatedToml = updatedToml.replace(regex, `$1${formattedValue}`);
        }
    };
    
    // Update personality section
    updateStringValue('personality', 'personality_core', config.personality_core);
    updateStringValue('personality', 'personality_side', config.personality_side);
    updateStringValue('personality', 'identity', config.identity);
    updateStringValue('personality', 'background_story', config.background_story);
    updateStringValue('personality', 'reply_style', config.reply_style);
    updateArrayValue('personality', 'safety_guidelines', config.safety_guidelines);
    
    // Update emoji section
    updateNonStringValue('emoji', 'emoji_chance', config.emoji_chance);
    updateNonStringValue('emoji', 'max_reg_num', config.max_reg_num);
    updateNonStringValue('emoji', 'steal_emoji', config.steal_emoji);
    updateStringValue('emoji', 'emoji_selection_mode', config.emoji_selection_mode);

    onSave(updatedToml);
  };

  return (
    <div className="space-y-6">
      {/* 人格设定 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">人格设定</CardTitle>
          <CardDescription>定义机器人的核心人格特征</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personality-core">核心特质</Label>
            <Input
              id="personality-core"
              value={config.personality_core}
              onChange={(e) => updateConfig("personality_core", e.target.value)}
              placeholder="例如：积极向上的女大学生"
            />
            <p className="text-sm text-muted-foreground">
              描述机器人的主要人格特征
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality-side">侧面特质</Label>
            <Input
              id="personality-side"
              value={config.personality_side}
              onChange={(e) => updateConfig("personality_side", e.target.value)}
              placeholder="例如：活泼、好奇、善良"
            />
            <p className="text-sm text-muted-foreground">
              补充描述人格的其他方面
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identity">身份描述</Label>
            <Textarea
              id="identity"
              value={config.identity}
              onChange={(e) => updateConfig("identity", e.target.value)}
              placeholder="描述年龄、性别、外貌、职业等身份信息"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="background-story">背景故事</Label>
            <Textarea
              id="background-story"
              value={config.background_story}
              onChange={(e) => updateConfig("background_story", e.target.value)}
              placeholder="描述机器人的背景故事和经历"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* 表达风格 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">表达风格</CardTitle>
          <CardDescription>配置机器人的交流方式和语言风格</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reply-style">回复风格</Label>
            <Input
              id="reply-style"
              value={config.reply_style}
              onChange={(e) => updateConfig("reply_style", e.target.value)}
              placeholder="例如：友好、自然、略带俏皮"
            />
            <p className="text-sm text-muted-foreground">
              定义机器人的语言表达特点
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* 安全与互动底线 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">安全与互动底线</CardTitle>
          <CardDescription>Bot在任何情况下都必须遵守的原则</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <Label htmlFor="new-guideline-input">安全守则</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {config.safety_guidelines.map((guideline) => (
                <Badge key={guideline} variant="secondary" className="flex items-center gap-1">
                  {guideline}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeGuideline(guideline)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="new-guideline-input"
                value={newGuideline}
                onChange={(e) => setNewGuideline(e.target.value)}
                placeholder="添加新守则"
                onKeyPress={(e) => e.key === 'Enter' && addGuideline()}
              />
              <Button onClick={addGuideline} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
        </CardContent>
      </Card>

      {/* 表达学习 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">全局表达学习规则</CardTitle>
          <CardDescription>配置默认的表达学习机制 (<code>chat_stream_id = ""</code>)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="use-expression">使用学到的表达</Label>
              <p className="text-sm text-muted-foreground">
                是否使用已学习的表达方式
              </p>
            </div>
            <Switch
              id="use-expression"
              checked={config.use_expression}
              onCheckedChange={(checked: boolean) => updateConfig("use_expression", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="learn-expression">学习新表达</Label>
              <p className="text-sm text-muted-foreground">
                是否从对话中学习新的表达方式
              </p>
            </div>
            <Switch
              id="learn-expression"
              checked={config.learn_expression}
              onCheckedChange={(checked: boolean) => updateConfig("learn_expression", checked)}
            />
          </div>

          {config.learn_expression && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>学习强度</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.learning_strength}
                  </span>
                </div>
                <Slider
                  value={[config.learning_strength]}
                  onValueChange={(value: number[]) => updateConfig("learning_strength", value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>保守</span>
                  <span>平衡</span>
                  <span>激进</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 表情包管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">表情包管理</CardTitle>
          <CardDescription>配置表情包使用和管理策略</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>表情包激活概率</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(config.emoji_chance * 100)}%
              </span>
            </div>
            <Slider
              value={[config.emoji_chance]}
              onValueChange={(value: number[]) => updateConfig("emoji_chance", value[0])}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>从不</span>
              <span>偶尔</span>
              <span>经常</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="max-reg-num">表情包最大注册数量</Label>
            <Input
              id="max-reg-num"
              type="number"
              value={config.max_reg_num}
              onChange={(e) => updateConfig("max_reg_num", parseInt(e.target.value) || 0)}
              placeholder="100"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="steal-emoji">偷取表情包</Label>
              <p className="text-sm text-muted-foreground">
                是否可以学习和使用用户发送的表情包
              </p>
            </div>
            <Switch
              id="steal-emoji"
              checked={config.steal_emoji}
              onCheckedChange={(checked: boolean) => updateConfig("steal_emoji", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emoji-selection-mode">表情选择模式</Label>
            <select
              id="emoji-selection-mode"
              value={config.emoji_selection_mode}
              onChange={(e) => updateConfig("emoji_selection_mode", e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="emotion">基于情绪</option>
              <option value="description">基于描述</option>
            </select>
            <p className="text-sm text-muted-foreground">
              选择表情包的匹配策略
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}