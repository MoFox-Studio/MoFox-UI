import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PersonalityConfigType } from "./types";
import { defaultConfig } from "./defaults";

interface PersonalityConfigProps {
  config: PersonalityConfigType;
  updateConfig: (key: keyof PersonalityConfigType, value: any) => void;
}

export function PersonalityConfig({ config, updateConfig }: PersonalityConfigProps) {
  const safeConfig = { ...defaultConfig.personality, ...(config || {}) };
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
              value={safeConfig.personality_core}
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
              value={safeConfig.personality_side}
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
              value={safeConfig.identity}
              onChange={(e) => updateConfig("identity", e.target.value)}
              placeholder="描述年龄、性别、外貌、职业等身份信息"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="background-story">背景故事</Label>
            <Textarea
              id="background-story"
              value={safeConfig.background_story}
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
              value={safeConfig.reply_style}
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
              value={safeConfig.chat_stream_id}
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
              checked={safeConfig.use_expression}
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
              checked={safeConfig.learn_expression}
              onCheckedChange={(checked) => updateConfig("learn_expression", checked)}
            />
          </div>

          {safeConfig.learn_expression && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>学习强度</Label>
                  <span className="text-sm text-muted-foreground">
                    {safeConfig.learning_strength}
                  </span>
                </div>
                <Slider
                  value={[safeConfig.learning_strength]}
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
                {Math.round(safeConfig.emoji_chance * 100)}%
              </span>
            </div>
            <Slider
              value={[safeConfig.emoji_chance]}
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
              value={safeConfig.max_reg_num}
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
              checked={safeConfig.steal_emoji}
              onCheckedChange={(checked) => updateConfig("steal_emoji", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emoji-selection-mode">表情选择模式</Label>
            <select
              id="emoji-selection-mode"
              value={safeConfig.emoji_selection_mode}
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