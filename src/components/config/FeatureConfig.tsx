import { useState, useEffect } from "react";
import * as toml from 'toml';
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
import { Button } from "../ui/button";
import { toast } from "sonner";

interface FeatureConfigProps {
  tomlContent: string;
  onSave: (newTomlContent: string) => void;
}

const initialFeatureConfig = {
  relationship: { enable_relationship: true, relation_frequency: 1 },
  memory: {
    enable_memory: true,
    memory_build_interval: 600,
    min_memory_length: 10,
    max_memory_length: 500,
    enable_memory_forgetting: true,
    base_forgetting_days: 30.0,
    critical_importance_bonus: 45.0
  },
  tool: { enable_tool: true },
  mood: { enable_mood: true, mood_update_threshold: 1 },
  lpmm_knowledge: { enable: true, rag_synonym_search_top_k: 10, qa_relation_threshold: 0.5 },
  custom_prompt: { image_prompt: "" }
};


export function FeatureConfig({ tomlContent, onSave }: FeatureConfigProps) {
  const [config, setConfig] = useState(initialFeatureConfig);

   useEffect(() => {
    if (tomlContent) {
      try {
       const parsed = toml.parse(tomlContent);
       setConfig({
         relationship: { ...initialFeatureConfig.relationship, ...parsed.relationship },
         memory: { ...initialFeatureConfig.memory, ...parsed.memory },
         tool: { ...initialFeatureConfig.tool, ...parsed.tool },
         mood: { ...initialFeatureConfig.mood, ...parsed.mood },
         lpmm_knowledge: { ...initialFeatureConfig.lpmm_knowledge, ...parsed.lpmm_knowledge },
         custom_prompt: { ...initialFeatureConfig.custom_prompt, ...parsed.custom_prompt },
       });
     } catch (e: any) {
        console.error("KILO-CODE-DEBUG: Error parsing TOML in FeatureConfig.tsx. Full error object:", e);
        const match = e.message.match(/at line (\d+) column (\d+)/);
        const description = match
          ? `语法错误: ${e.message.split(' at line')[0]} (行: ${match[1]}, 列: ${match[2]})`
          : `语法错误: ${e.message}`;
        toast.error("解析 FeatureConfig 失败", { description, duration: 10000 });
      }
    }
  }, [tomlContent]);

  const updateConfig = (section: keyof typeof config, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    let updatedToml = tomlContent;
    
    const updateValue = (section: string, key: string, value: any) => {
      const valueStr = typeof value === 'string' ? `"""${value.replace(/"""/g, `\\"""`)}"""` : value;
      const regex = new RegExp(`(\\[${section}\\][\\s\\S]*?${key}\\s*=\\s*)[^\\n#]*`);
       if (regex.test(updatedToml)) {
        updatedToml = updatedToml.replace(regex, `$1${valueStr}`);
      }
    };

    // Save all values
    Object.keys(config).forEach(section => {
        const sectionKey = section as keyof typeof config;
        Object.keys(config[sectionKey]).forEach(key => {
            const value = config[sectionKey][key as keyof typeof config[typeof sectionKey]];
            updateValue(sectionKey, key, value);
        });
    });

    onSave(updatedToml);
    toast.success("功能配置已保存！");
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
              <Label htmlFor="enable-relationship">启用关系系统</Label>
              <p className="text-sm text-muted-foreground">
                分析和跟踪与用户的关系状态
              </p>
            </div>
            <Switch
              id="enable-relationship"
              checked={config.relationship.enable_relationship}
              onCheckedChange={(checked: boolean) => updateConfig("relationship", "enable_relationship", checked)}
            />
          </div>

          {config.relationship.enable_relationship && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="relation-frequency-slider">关系频率</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.relationship.relation_frequency}
                  </span>
                </div>
                <Slider
                  id="relation-frequency-slider"
                  aria-label="关系频率"
                  value={[config.relationship.relation_frequency]}
                  onValueChange={(value: number[]) => updateConfig("relationship", "relation_frequency", value[0])}
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
              <Label htmlFor="enable-memory">启用记忆系统</Label>
              <p className="text-sm text-muted-foreground">
                自动构建和管理对话记忆
              </p>
            </div>
            <Switch
              id="enable-memory"
              checked={config.memory.enable_memory}
              onCheckedChange={(checked: boolean) => updateConfig("memory", "enable_memory", checked)}
            />
          </div>

          {config.memory.enable_memory && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="memory-interval">记忆构建间隔 (秒)</Label>
                <Input
                  id="memory-interval"
                  type="number"
                  value={config.memory.memory_build_interval}
                  onChange={(e) => updateConfig("memory", "memory_build_interval", parseInt(e.target.value) || 0)}
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
                    value={config.memory.min_memory_length}
                    onChange={(e) => updateConfig("memory", "min_memory_length", parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-memory">最大记忆长度</Label>
                  <Input
                    id="max-memory"
                    type="number"
                    value={config.memory.max_memory_length}
                    onChange={(e) => updateConfig("memory", "max_memory_length", parseInt(e.target.value) || 0)}
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
                    <Label htmlFor="enable-memory-forgetting">启用智能遗忘</Label>
                    <p className="text-sm text-muted-foreground">
                      根据重要性自动遗忘旧记忆
                    </p>
                  </div>
                  <Switch
                    id="enable-memory-forgetting"
                    checked={config.memory.enable_memory_forgetting}
                    onCheckedChange={(checked: boolean) => updateConfig("memory", "enable_memory_forgetting", checked)}
                  />
                </div>

                {config.memory.enable_memory_forgetting && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base-forgetting">基础遗忘天数</Label>
                      <Input
                        id="base-forgetting"
                        type="number"
                        value={config.memory.base_forgetting_days}
                        onChange={(e) => updateConfig("memory", "base_forgetting_days", parseInt(e.target.value) || 0)}
                        placeholder="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="importance-bonus">重要记忆额外保留天数</Label>
                      <Input
                        id="importance-bonus"
                        type="number"
                        value={config.memory.critical_importance_bonus}
                        onChange={(e) => updateConfig("memory", "critical_importance_bonus", parseInt(e.target.value) || 0)}
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
              <Label htmlFor="enable-tool">启用工具调用</Label>
              <p className="text-sm text-muted-foreground">
                允许机器人调用外部工具和API
              </p>
            </div>
            <Switch
              id="enable-tool"
              checked={config.tool.enable_tool}
              onCheckedChange={(checked: boolean) => updateConfig("tool", "enable_tool", checked)}
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
              <Label htmlFor="enable-mood">启用情绪系统</Label>
              <p className="text-sm text-muted-foreground">
                分析对话情绪并调整回复风格
              </p>
            </div>
            <Switch
              id="enable-mood"
              checked={config.mood.enable_mood}
              onCheckedChange={(checked: boolean) => updateConfig("mood", "enable_mood", checked)}
            />
          </div>

          {config.mood.enable_mood && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mood-update-threshold-slider">情绪更新阈值</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.mood.mood_update_threshold}
                  </span>
                </div>
                <Slider
                  id="mood-update-threshold-slider"
                  aria-label="情绪更新阈值"
                  value={[config.mood.mood_update_threshold]}
                  onValueChange={(value: number[]) => updateConfig("mood", "mood_update_threshold", value[0])}
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
              <Label htmlFor="enable-lpmm-knowledge">启用知识库</Label>
              <p className="text-sm text-muted-foreground">
                使用知识库进行智能问答
              </p>
            </div>
            <Switch
              id="enable-lpmm-knowledge"
              checked={config.lpmm_knowledge.enable}
              onCheckedChange={(checked: boolean) => updateConfig("lpmm_knowledge", "enable", checked)}
            />
          </div>

          {config.lpmm_knowledge.enable && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="synonym-search">同义词搜索数量</Label>
                  <Input
                    id="synonym-search"
                    type="number"
                    value={config.lpmm_knowledge.rag_synonym_search_top_k}
                    onChange={(e) => updateConfig("lpmm_knowledge", "rag_synonym_search_top_k", parseInt(e.target.value) || 0)}
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
                    value={config.lpmm_knowledge.qa_relation_threshold}
                    onChange={(e) => updateConfig("lpmm_knowledge", "qa_relation_threshold", parseFloat(e.target.value) || 0)}
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
              value={config.custom_prompt.image_prompt}
              onChange={(e) => updateConfig("custom_prompt", "image_prompt", e.target.value)}
              placeholder="请描述这张图片的内容..."
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              用于指导AI如何分析和描述图像内容
            </p>
          </div>
        </CardContent>
      </Card>
       <div className="flex justify-end">
        <Button onClick={handleSave}>保存功能配置</Button>
      </div>
    </div>
  );
}