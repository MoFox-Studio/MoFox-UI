import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, Brain, Server, Zap } from "lucide-react";

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

  const [taskConfig, setTaskConfig] = useState<Record<string, string>>({
    reply: "gpt-4o-mini",
    decision: "gpt-4o-mini",
    emotion: "claude-3-haiku",
    mood: "claude-3-haiku",
    relationship: "gpt-4o-mini",
    tool: "gpt-4o-mini",
    schedule: "gpt-4o-mini",
    anti_injection: "claude-3-haiku",
    monthly_plan: "gpt-4o-mini",
    memory: "gpt-4o-mini",
    embedding: "text-embedding-3-small",
    image: "gpt-4o-mini",
    expression: "gpt-4o-mini",
    video: "gpt-4o-mini",
    voice: "tts-1",
    qa: "gpt-4o-mini",
    entity: "gpt-4o-mini",
    rdf: "gpt-4o-mini"
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

  const updateTaskConfig = (task: string, modelId: string) => {
    setTaskConfig(prev => ({ ...prev, [task]: modelId }));
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
          <CardDescription>为不同任务分配合适的模型</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskTypes.map((task) => (
              <div key={task.key} className="space-y-2">
                <div>
                  <Label htmlFor={`task-${task.key}`}>{task.name}</Label>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
                <Select 
                  value={taskConfig[task.key] || ""} 
                  onValueChange={(value) => updateTaskConfig(task.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}