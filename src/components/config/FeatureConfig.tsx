import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Heart,
  Brain,
  Wrench,
  BookOpen,
  Calendar,
  Smile
} from "lucide-react";
import { FeatureConfigType } from "./types";
import { defaultConfig } from "./defaults";

interface FeatureConfigProps {
  config: FeatureConfigType;
  updateConfig: (key: string, value: any) => void;
}

export function FeatureConfig({ config, updateConfig }: FeatureConfigProps) {
  const safeConfig = {
    ...defaultConfig.features,
    ...(config || {}),
    relationship: { ...defaultConfig.features.relationship, ...(config?.relationship || {}) },
    memory: { ...defaultConfig.features.memory, ...(config?.memory || {}) },
    tools: { ...defaultConfig.features.tools, ...(config?.tools || {}) },
    mood: { ...defaultConfig.features.mood, ...(config?.mood || {}) },
    knowledge: { ...defaultConfig.features.knowledge, ...(config?.knowledge || {}) },
    prompts: { ...defaultConfig.features.prompts, ...(config?.prompts || {}) },
  };

  const handleUpdate = (section: keyof FeatureConfigType, key: string, value: any) => {
    updateConfig(`${String(section)}.${key}`, value);
  };

  return (
    <div className="space-y-6">
      {/* 关系系统 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4" />
            关系系统
          </CardTitle>
          <CardDescription>配置用户关系分析和管理</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用关系系统</Label>
              <p className="text-sm text-muted-foreground">
                分析和跟踪与用户的关系状态
              </p>
            </div>
            <Switch
              checked={safeConfig.relationship.enable_relationship}
              onCheckedChange={(checked) => handleUpdate("relationship", "enable_relationship", checked)}
            />
          </div>

          {safeConfig.relationship.enable_relationship && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>关系频率</Label>
                  <span className="text-sm text-muted-foreground">
                    {safeConfig.relationship.relation_frequency}
                  </span>
                </div>
                <Slider
                  value={[safeConfig.relationship.relation_frequency]}
                  onValueChange={(value) => handleUpdate("relationship", "relation_frequency", value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>低频</span>
                  <span>中频</span>
                  <span>高频</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 记忆系统 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4" />
            记忆系统
          </CardTitle>
          <CardDescription>配置智能记忆构建和遗忘机制</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用记忆系统</Label>
              <p className="text-sm text-muted-foreground">
                自动构建和管理对话记忆
              </p>
            </div>
            <Switch
              checked={safeConfig.memory.enable_memory}
              onCheckedChange={(checked) => handleUpdate("memory", "enable_memory", checked)}
            />
          </div>

          {safeConfig.memory.enable_memory && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="memory-interval">记忆构建间隔 (秒)</Label>
                <Input
                  id="memory-interval"
                  type="number"
                  value={safeConfig.memory.memory_build_interval}
                  onChange={(e) => handleUpdate("memory", "memory_build_interval", parseInt(e.target.value) || 0)}
                  placeholder="3600"
                />
                <p className="text-sm text-muted-foreground">
                  多长时间进行一次记忆整理和构建
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-memory">最小记忆长度</Label>
                  <Input
                    id="min-memory"
                    type="number"
                    value={safeConfig.memory.min_memory_length}
                    onChange={(e) => handleUpdate("memory", "min_memory_length", parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-memory">最大记忆长度</Label>
                  <Input
                    id="max-memory"
                    type="number"
                    value={safeConfig.memory.max_memory_length}
                    onChange={(e) => handleUpdate("memory", "max_memory_length", parseInt(e.target.value) || 0)}
                    placeholder="500"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  智能遗忘机制
                </h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>启用智能遗忘</Label>
                    <p className="text-sm text-muted-foreground">
                      根据重要性自动遗忘旧记忆
                    </p>
                  </div>
                  <Switch
                    checked={safeConfig.memory.enable_memory_forgetting}
                    onCheckedChange={(checked) => handleUpdate("memory", "enable_memory_forgetting", checked)}
                  />
                </div>

                {safeConfig.memory.enable_memory_forgetting && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base-forgetting">基础遗忘天数</Label>
                      <Input
                        id="base-forgetting"
                        type="number"
                        value={safeConfig.memory.base_forgetting_days}
                        onChange={(e) => handleUpdate("memory", "base_forgetting_days", parseInt(e.target.value) || 0)}
                        placeholder="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="importance-bonus">重要记忆额外保留天数</Label>
                      <Input
                        id="importance-bonus"
                        type="number"
                        value={safeConfig.memory.critical_importance_bonus}
                        onChange={(e) => handleUpdate("memory", "critical_importance_bonus", parseInt(e.target.value) || 0)}
                        placeholder="7"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 工具系统 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            工具系统
          </CardTitle>
          <CardDescription>配置外部工具调用功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用工具调用</Label>
              <p className="text-sm text-muted-foreground">
                允许机器人调用外部工具和API
              </p>
            </div>
            <Switch
              checked={safeConfig.tools.enable_tool}
              onCheckedChange={(checked) => handleUpdate("tools", "enable_tool", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 情绪系统 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Smile className="h-4 w-4" />
            情绪系统
          </CardTitle>
          <CardDescription>配置情绪分析和心情管理</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用情绪系统</Label>
              <p className="text-sm text-muted-foreground">
                分析对话情绪并调整回复风格
              </p>
            </div>
            <Switch
              checked={safeConfig.mood.enable_mood}
              onCheckedChange={(checked) => handleUpdate("mood", "enable_mood", checked)}
            />
          </div>

          {safeConfig.mood.enable_mood && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>情绪更新阈值</Label>
                  <span className="text-sm text-muted-foreground">
                    {safeConfig.mood.mood_update_threshold}
                  </span>
                </div>
                <Slider
                  value={[safeConfig.mood.mood_update_threshold]}
                  onValueChange={(value) => handleUpdate("mood", "mood_update_threshold", value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>敏感</span>
                  <span>适中</span>
                  <span>稳定</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  较低的阈值会让情绪更容易受到影响
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* LPMM 知识库 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            LPMM 知识库
          </CardTitle>
          <CardDescription>配置知识检索和问答系统</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用知识库</Label>
              <p className="text-sm text-muted-foreground">
                使用知识库进行智能问答
              </p>
            </div>
            <Switch
              checked={safeConfig.knowledge.enable}
              onCheckedChange={(checked) => handleUpdate("knowledge", "enable", checked)}
            />
          </div>

          {safeConfig.knowledge.enable && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="synonym-search">同义词搜索数量</Label>
                  <Input
                    id="synonym-search"
                    type="number"
                    value={safeConfig.knowledge.rag_synonym_search_top_k}
                    onChange={(e) => handleUpdate("knowledge", "rag_synonym_search_top_k", parseInt(e.target.value) || 0)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relation-threshold">关系阈值</Label>
                  <Input
                    id="relation-threshold"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={safeConfig.knowledge.qa_relation_threshold}
                    onChange={(e) => handleUpdate("knowledge", "qa_relation_threshold", parseFloat(e.target.value) || 0)}
                    placeholder="0.8"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 自定义提示词 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">自定义提示词</CardTitle>
          <CardDescription>配置各种功能的提示词模板</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-prompt">图像描述提示词</Label>
            <Textarea
              id="image-prompt"
              value={safeConfig.prompts.image_prompt}
              onChange={(e) => handleUpdate("prompts", "image_prompt", e.target.value)}
              placeholder="请描述这张图片的内容..."
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              用于指导AI如何分析和描述图像内容
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}