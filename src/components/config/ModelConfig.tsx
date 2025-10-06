import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, Brain, Server, Zap, ArrowUp, ArrowDown } from "lucide-react";
import { Switch } from "../ui/switch";

interface ApiProvider {
  name: string;
  base_url: string;
  api_key: string;
  timeout: number;
}

interface Model {
  model_identifier: string;
  name: string;
  api_provider: string;
  price_in: number;
  price_out: number;
}

interface TaskModel {
  model_identifier: string;
  priority: number;
  enabled: boolean;
}

const taskTypes = [
  { key: "reply", name: "回复", description: "生成聊天回复" },
  { key: "decision", name: "决策", description: "做出行为决策" },
  { key: "emotion", name: "情绪", description: "分析情绪状态" },
  { key: "mood", name: "心情", description: "判断心情变化" },
  { key: "relationship", name: "关系", description: "分析用户关系" },
  { key: "tool", name: "工具", description: "工具调用决策" },
  { key: "schedule", name: "日程", description: "日程管理" },
  { key: "anti_injection", name: "反注入", description: "安全检测" },
  { key: "monthly_plan", name: "月计划", description: "制定月度计划" },
  { key: "memory", name: "记忆", description: "记忆处理" },
  { key: "embedding", name: "嵌入", description: "文本向量化" },
  { key: "image", name: "图像", description: "图像理解" },
  { key: "expression", name: "表情", description: "表情生成" },
  { key: "video", name: "视频", description: "视频处理" },
  { key: "voice", name: "语音", description: "语音合成" },
  { key: "qa", name: "问答", description: "知识问答" },
  { key: "entity", name: "实体", description: "实体识别" },
  { key: "rdf", name: "RDF", description: "知识图谱" },
];

export function ModelConfig() {
  const [providers, setProviders] = useState<ApiProvider[]>([
    {
      name: "OpenAI",
      base_url: "https://api.openai.com/v1",
      api_key: "sk-xxxxxxxxxxxxxxxx",
      timeout: 30
    },
    {
      name: "Claude",
      base_url: "https://api.anthropic.com",
      api_key: "sk-ant-xxxxxxxxxxxxxxxx",
      timeout: 30
    }
  ]);

  const [models, setModels] = useState<Model[]>([
    {
      model_identifier: "gpt-4o-mini",
      name: "GPT-4o Mini",
      api_provider: "OpenAI",
      price_in: 0.15,
      price_out: 0.6
    },
    {
      model_identifier: "claude-3-haiku",
      name: "Claude 3 Haiku",
      api_provider: "Claude",
      price_in: 0.25,
      price_out: 1.25
    }
  ]);

  const [taskConfig, setTaskConfig] = useState<Record<string, TaskModel[]>>({
    reply: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true },
      { model_identifier: "claude-3-haiku", priority: 2, enabled: true }
    ],
    decision: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    emotion: [
      { model_identifier: "claude-3-haiku", priority: 1, enabled: true },
      { model_identifier: "gpt-4o-mini", priority: 2, enabled: true }
    ],
    mood: [
      { model_identifier: "claude-3-haiku", priority: 1, enabled: true }
    ],
    relationship: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    tool: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    schedule: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    anti_injection: [
      { model_identifier: "claude-3-haiku", priority: 1, enabled: true }
    ],
    monthly_plan: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    memory: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    embedding: [
      { model_identifier: "text-embedding-3-small", priority: 1, enabled: true }
    ],
    image: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    expression: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    video: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    voice: [
      { model_identifier: "tts-1", priority: 1, enabled: true }
    ],
    qa: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    entity: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ],
    rdf: [
      { model_identifier: "gpt-4o-mini", priority: 1, enabled: true }
    ]
  });

  const [newProvider, setNewProvider] = useState<ApiProvider>({
    name: "",
    base_url: "",
    api_key: "",
    timeout: 30
  });

  const [newModel, setNewModel] = useState<Model>({
    model_identifier: "",
    name: "",
    api_provider: "",
    price_in: 0,
    price_out: 0
  });

  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);

  const addProvider = () => {
    if (newProvider.name && newProvider.base_url && newProvider.api_key) {
      setProviders([...providers, { ...newProvider }]);
      setNewProvider({ name: "", base_url: "", api_key: "", timeout: 30 });
      setShowAddProvider(false);
    }
  };

  const removeProvider = (name: string) => {
    setProviders(providers.filter(p => p.name !== name));
    // 也要移除使用此提供商的模型
    setModels(models.filter(m => m.api_provider !== name));
  };

  const addModel = () => {
    if (newModel.model_identifier && newModel.name && newModel.api_provider) {
      setModels([...models, { ...newModel }]);
      setNewModel({ model_identifier: "", name: "", api_provider: "", price_in: 0, price_out: 0 });
      setShowAddModel(false);
    }
  };

  const removeModel = (identifier: string) => {
    setModels(models.filter(m => m.model_identifier !== identifier));
  };

  const addModelToTask = (taskKey: string, modelId: string) => {
    const existingModels = taskConfig[taskKey] || [];
    const maxPriority = Math.max(...existingModels.map(m => m.priority), 0);
    const newModel: TaskModel = {
      model_identifier: modelId,
      priority: maxPriority + 1,
      enabled: true
    };
    
    setTaskConfig(prev => ({
      ...prev,
      [taskKey]: [...existingModels, newModel]
    }));
  };

  const removeModelFromTask = (taskKey: string, modelId: string) => {
    setTaskConfig(prev => ({
      ...prev,
      [taskKey]: prev[taskKey]?.filter(m => m.model_identifier !== modelId) || []
    }));
  };

  const updateTaskModel = (taskKey: string, modelId: string, updates: Partial<TaskModel>) => {
    setTaskConfig(prev => ({
      ...prev,
      [taskKey]: prev[taskKey]?.map(m => 
        m.model_identifier === modelId ? { ...m, ...updates } : m
      ) || []
    }));
  };

  const moveModelPriority = (taskKey: string, modelId: string, direction: 'up' | 'down') => {
    const models = taskConfig[taskKey] || [];
    const currentIndex = models.findIndex(m => m.model_identifier === modelId);
    if (currentIndex === -1) return;

    const newModels = [...models];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (swapIndex >= 0 && swapIndex < newModels.length) {
      // 交换优先级
      const temp = newModels[currentIndex].priority;
      newModels[currentIndex].priority = newModels[swapIndex].priority;
      newModels[swapIndex].priority = temp;
      
      // 重新排序
      newModels.sort((a, b) => a.priority - b.priority);
      
      setTaskConfig(prev => ({
        ...prev,
        [taskKey]: newModels
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* API 服务提供商 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4" />
            API 服务提供商
          </CardTitle>
          <CardDescription>配置 AI 模型的 API 服务商</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {providers.map((provider) => (
              <div key={provider.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{provider.name}</Badge>
                    <Badge variant="secondary" className="text-xs">
                      超时: {provider.timeout}s
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeProvider(provider.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Base URL:</span>
                    <p className="font-mono break-all">{provider.base_url}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">API Key:</span>
                    <p className="font-mono">••••••••••••{provider.api_key.slice(-6)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAddProvider ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>提供商名称</Label>
                    <Input
                      value={newProvider.name}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="例如: OpenAI"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>超时时间 (秒)</Label>
                    <Input
                      type="number"
                      value={newProvider.timeout}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, timeout: parseInt(e.target.value) || 30 }))}
                      placeholder="30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Base URL</Label>
                  <Input
                    value={newProvider.base_url}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, base_url: e.target.value }))}
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={newProvider.api_key}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, api_key: e.target.value }))}
                    placeholder="sk-xxxxxxxxxxxxxxxx"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addProvider}>添加</Button>
                  <Button variant="outline" onClick={() => setShowAddProvider(false)}>取消</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setShowAddProvider(true)}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加新的服务提供商
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 模型配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4" />
            模型配置
          </CardTitle>
          <CardDescription>配置可用的 AI 模型</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {models.map((model) => (
              <div key={model.model_identifier} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm">{model.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {model.api_provider}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeModel(model.model_identifier)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">标识符:</span>
                    <p className="font-mono">{model.model_identifier}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">输入价格:</span>
                    <p>${model.price_in}/1k tokens</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">输出价格:</span>
                    <p>${model.price_out}/1k tokens</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAddModel ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>模型标识符</Label>
                    <Input
                      value={newModel.model_identifier}
                      onChange={(e) => setNewModel(prev => ({ ...prev, model_identifier: e.target.value }))}
                      placeholder="gpt-4o-mini"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>模型名称</Label>
                    <Input
                      value={newModel.name}
                      onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="GPT-4o Mini"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>API 提供商</Label>
                  <Select 
                    value={newModel.api_provider} 
                    onValueChange={(value) => setNewModel(prev => ({ ...prev, api_provider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择提供商" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.name} value={provider.name}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>输入价格 ($/1k tokens)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={newModel.price_in}
                      onChange={(e) => setNewModel(prev => ({ ...prev, price_in: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>输出价格 ($/1k tokens)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={newModel.price_out}
                      onChange={(e) => setNewModel(prev => ({ ...prev, price_out: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.6"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addModel}>添加</Button>
                  <Button variant="outline" onClick={() => setShowAddModel(false)}>取消</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setShowAddModel(true)}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加新模型
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 任务模型配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            任务模型配置
          </CardTitle>
          <CardDescription>为不同任务配置多个模型，支持优先级和故障转移</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {taskTypes.map((task) => {
            const taskModels = taskConfig[task.key] || [];
            return (
              <Card key={task.key} className="border-l-4 border-l-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">{task.name}</CardTitle>
                      <CardDescription className="text-xs">{task.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {taskModels.filter(m => m.enabled).length} 个模型
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 已配置的模型 */}
                  {taskModels.length > 0 && (
                    <div className="space-y-3">
                      {taskModels
                        .sort((a, b) => a.priority - b.priority)
                        .map((taskModel, index) => {
                          const model = models.find(m => m.model_identifier === taskModel.model_identifier);
                          if (!model) return null;
                          
                          return (
                            <div key={taskModel.model_identifier} className="p-3 border rounded-lg bg-muted/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    优先级 {taskModel.priority}
                                  </Badge>
                                  <span className="text-sm">{model.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {model.api_provider}
                                  </Badge>
                                  <Switch
                                    checked={taskModel.enabled}
                                    onCheckedChange={(checked) => 
                                      updateTaskModel(task.key, taskModel.model_identifier, { enabled: checked })
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() => moveModelPriority(task.key, taskModel.model_identifier, 'up')}
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={index === taskModels.length - 1}
                                    onClick={() => moveModelPriority(task.key, taskModel.model_identifier, 'down')}
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => removeModelFromTask(task.key, taskModel.model_identifier)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                  
                  {/* 添加新模型 */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">添加模型到此任务</Label>
                    <Select 
                      value="" 
                      onValueChange={(value) => {
                        if (value && !taskModels.find(m => m.model_identifier === value)) {
                          addModelToTask(task.key, value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-dashed">
                        <SelectValue placeholder="选择要添加的模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {models
                          .filter(model => !taskModels.find(tm => tm.model_identifier === model.model_identifier))
                          .map(model => (
                            <SelectItem key={model.model_identifier} value={model.model_identifier}>
                              <div className="flex items-center gap-2">
                                <span>{model.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {model.api_provider}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 任务统计信息 */}
                  {taskModels.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="block">启用模型</span>
                          <span className="text-foreground">{taskModels.filter(m => m.enabled).length}</span>
                        </div>
                        <div>
                          <span className="block">备用模型</span>
                          <span className="text-foreground">{Math.max(0, taskModels.filter(m => m.enabled).length - 1)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}