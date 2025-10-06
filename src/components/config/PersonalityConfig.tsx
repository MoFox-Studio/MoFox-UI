import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function PersonalityConfig() {
  const [config, setConfig] = useState({
    // 人格配置
    personality_core: "积极向上的女大学生",
    personality_side: "活泼、好奇、善良",
    identity: "20岁的计算机专业女大学生，身高165cm，喜欢编程和游戏",
    background_story: "是一个热爱技术的大学生，平时喜欢研究新技术，也喜欢和朋友们一起玩游戏。性格开朗活泼，总是充满好奇心。",
    
    // 表达风格
    reply_style: "友好、自然、略带俏皮",
    
    // 表达学习规则
    chat_stream_id: "default_stream",
    use_expression: true,
    learn_expression: true,
    learning_strength: 0.7,
    
    // 表情包管理
    emoji_chance: 0.3,
    max_reg_num: 100,
    steal_emoji: false,
    emoji_selection_mode: "emotion",
  });

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
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

      {/* 表达学习 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">表达学习</CardTitle>
          <CardDescription>配置机器人的表达学习机制</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chat-stream-id">聊天流 ID</Label>
            <Input
              id="chat-stream-id"
              value={config.chat_stream_id}
              onChange={(e) => updateConfig("chat_stream_id", e.target.value)}
              placeholder="default_stream"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>使用学到的表达</Label>
              <p className="text-sm text-muted-foreground">
                是否使用已学习的表达方式
              </p>
            </div>
            <Switch
              checked={config.use_expression}
              onCheckedChange={(checked) => updateConfig("use_expression", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>学习新表达</Label>
              <p className="text-sm text-muted-foreground">
                是否从对话中学习新的表达方式
              </p>
            </div>
            <Switch
              checked={config.learn_expression}
              onCheckedChange={(checked) => updateConfig("learn_expression", checked)}
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
                  onValueChange={(value) => updateConfig("learning_strength", value[0])}
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
              onValueChange={(value) => updateConfig("emoji_chance", value[0])}
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
              <Label>偷取表情包</Label>
              <p className="text-sm text-muted-foreground">
                是否可以学习和使用用户发送的表情包
              </p>
            </div>
            <Switch
              checked={config.steal_emoji}
              onCheckedChange={(checked) => updateConfig("steal_emoji", checked)}
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
              <option value="random">随机选择</option>
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