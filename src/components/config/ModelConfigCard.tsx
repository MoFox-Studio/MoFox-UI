import { useState, useEffect } from 'react';
import { Cpu, Plus, X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { useLanguage } from '../../i18n/LanguageContext';

interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

interface Model {
  id: string;
  modelIdentifier: string;
  name: string;
  priceIn: number;
  priceOut: number;
  apiProvider: string;
}

const getTaskNames = (language: 'zh' | 'en') => language === 'zh' ? [
  { key: 'reply', label: '回复' },
  { key: 'decision', label: '决策' },
  { key: 'emotion', label: '情绪' },
  { key: 'mood', label: '心情' },
  { key: 'relation', label: '关系' },
  { key: 'tool', label: '工具' },
  { key: 'schedule', label: '日程' },
  { key: 'anti_injection', label: '反注入' },
  { key: 'month_plan', label: '月计划' },
  { key: 'memory', label: '记忆' },
  { key: 'embedding', label: '嵌入' },
  { key: 'image', label: '图像' },
  { key: 'emoji', label: '表情' },
  { key: 'video', label: '视频' },
  { key: 'voice', label: '语音' },
  { key: 'qa', label: '问答' },
  { key: 'entity', label: '实体' },
  { key: 'rdf', label: 'RDF' },
] : [
  { key: 'reply', label: 'Reply' },
  { key: 'decision', label: 'Decision' },
  { key: 'emotion', label: 'Emotion' },
  { key: 'mood', label: 'Mood' },
  { key: 'relation', label: 'Relation' },
  { key: 'tool', label: 'Tool' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'anti_injection', label: 'Anti-Injection' },
  { key: 'month_plan', label: 'Month Plan' },
  { key: 'memory', label: 'Memory' },
  { key: 'embedding', label: 'Embedding' },
  { key: 'image', label: 'Image' },
  { key: 'emoji', label: 'Emoji' },
  { key: 'video', label: 'Video' },
  { key: 'voice', label: 'Voice' },
  { key: 'qa', label: 'Q&A' },
  { key: 'entity', label: 'Entity' },
  { key: 'rdf', label: 'RDF' },
];

export function ModelConfigCard() {
  const { t, language } = useLanguage();
  const taskNames = getTaskNames(language);
  const [selectedType, setSelectedType] = useState<'provider' | 'model'>('provider');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const [apiProviders, setApiProviders] = useState<ApiProvider[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [taskMapping, setTaskMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/config/model')
      .then(res => res.json())
      .then(data => {
        const providers = data.api_providers.map((p: any, index: number) => ({
          id: index.toString(),
          name: p.name,
          baseUrl: p.base_url,
          apiKey: Array.isArray(p.api_key) ? p.api_key.join(', ') : p.api_key,
          timeout: p.timeout,
        }));
        setApiProviders(providers);
        if (providers.length > 0) {
          setSelectedProviderId(providers[0].id);
        }

        const loadedModels = data.models.map((m: any, index: number) => {
          const provider = providers.find((p: any) => p.name === m.api_provider);
          return {
            id: index.toString(),
            modelIdentifier: m.model_identifier,
            name: m.name,
            priceIn: m.price_in || 0,
            priceOut: m.price_out || 0,
            apiProvider: provider ? provider.id : '',
          };
        });
        setModels(loadedModels);
        if (loadedModels.length > 0) {
          setSelectedModelId(loadedModels[0].id);
        }

        const newTaskMapping: Record<string, string> = {};
        const keyMap: Record<string, string> = {
          replyer: 'reply',
          planner: 'decision',
          emotion: 'emotion',
          mood: 'mood',
          vlm: 'image',
          emoji_vlm: 'emoji',
          utils_video: 'video',
          voice: 'voice',
          tool_use: 'tool',
          schedule_generator: 'schedule',
          anti_injection: 'anti_injection',
          monthly_plan_generator: 'month_plan',
          relationship_tracker: 'relation',
          embedding: 'embedding',
          lpmm_entity_extract: 'entity',
          lpmm_rdf_build: 'rdf',
          lpmm_qa: 'qa',
        };

        for (const taskKey in data.model_task_config) {
          const taskConfig = data.model_task_config[taskKey];
          if (taskConfig.model_list && taskConfig.model_list.length > 0) {
            const modelName = taskConfig.model_list[0];
            const model = loadedModels.find((m: any) => m.name === modelName);
            if (model) {
              const mappedKey = keyMap[taskKey] || taskKey;
              newTaskMapping[mappedKey] = model.id;
            }
          }
        }
        setTaskMapping(newTaskMapping);
      });
  }, []);

  const addProvider = () => {
    const newProvider: ApiProvider = {
      id: Date.now().toString(),
      name: '新提供商',
      baseUrl: '',
      apiKey: '',
      timeout: 30,
    };
    setApiProviders([...apiProviders, newProvider]);
    setSelectedProviderId(newProvider.id);
  };

  const removeProvider = (id: string) => {
    setApiProviders(apiProviders.filter(p => p.id !== id));
    if (selectedProviderId === id) {
      setSelectedProviderId(apiProviders[0]?.id || null);
    }
  };

  const updateProvider = (id: string, field: keyof ApiProvider, value: string | number) => {
    setApiProviders(apiProviders.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addModel = () => {
    const newModel: Model = {
      id: Date.now().toString(),
      modelIdentifier: '',
      name: '新模型',
      priceIn: 0,
      priceOut: 0,
      apiProvider: apiProviders[0]?.id || '',
    };
    setModels([...models, newModel]);
    setSelectedModelId(newModel.id);
  };

  const removeModel = (id: string) => {
    setModels(models.filter(m => m.id !== id));
    if (selectedModelId === id) {
      setSelectedModelId(models[0]?.id || null);
    }
  };

  const updateModel = (id: string, field: keyof Model, value: string | number) => {
    setModels(models.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const selectedProvider = apiProviders.find(p => p.id === selectedProviderId);
  const selectedModel = models.find(m => m.id === selectedModelId);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Cpu className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>模型配置</h3>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-3 gap-4 min-h-[400px]">
        {/* Left Panel - Lists */}
        <div className="col-span-1 space-y-4">
          {/* Provider/Model Toggle */}
          <div className="glass rounded-[var(--radius)] p-1 flex gap-1">
            <button
              onClick={() => {
                setSelectedType('provider');
                setSelectedProviderId(apiProviders[0]?.id || null);
              }}
              className={`flex-1 py-2 px-3 rounded-[var(--radius-sm)] transition-all duration-300 text-sm ${
                selectedType === 'provider'
                  ? 'bg-primary text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ fontWeight: 600 }}
            >
              API 服务商
            </button>
            <button
              onClick={() => {
                setSelectedType('model');
                setSelectedModelId(models[0]?.id || null);
              }}
              className={`flex-1 py-2 px-3 rounded-[var(--radius-sm)] transition-all duration-300 text-sm ${
                selectedType === 'model'
                  ? 'bg-primary text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ fontWeight: 600 }}
            >
              模型
            </button>
          </div>

          {/* Provider List */}
          {selectedType === 'provider' && (
            <div className="space-y-2">
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-3">
                  {apiProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className={`flex items-center justify-between p-3 rounded-[var(--radius)] cursor-pointer transition-all ${
                        selectedProviderId === provider.id
                          ? 'glass border-primary'
                          : 'glass-hover'
                      }`}
                      onClick={() => setSelectedProviderId(provider.id)}
                    >
                      <span className="truncate" style={{ fontSize: '0.875rem' }}>
                        {provider.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProvider(provider.id);
                        }}
                        className="p-1 hover:bg-error/20 rounded transition-colors text-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button
                onClick={addProvider}
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加服务商
              </Button>
            </div>
          )}

          {/* Model List */}
          {selectedType === 'model' && (
            <div className="space-y-2">
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-3">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className={`flex items-center justify-between p-3 rounded-[var(--radius)] cursor-pointer transition-all ${
                        selectedModelId === model.id
                          ? 'glass border-primary'
                          : 'glass-hover'
                      }`}
                      onClick={() => setSelectedModelId(model.id)}
                    >
                      <span className="truncate" style={{ fontSize: '0.875rem' }}>
                        {model.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeModel(model.id);
                        }}
                        className="p-1 hover:bg-error/20 rounded transition-colors text-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button
                onClick={addModel}
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加模型
              </Button>
            </div>
          )}
        </div>

        {/* Right Panel - Details */}
        <div className="col-span-2 glass rounded-[var(--radius)] p-4">
          {selectedType === 'provider' && selectedProvider && (
            <div className="space-y-4">
              <h4 style={{ fontWeight: 600 }}>服务商配置</h4>
              
              <div className="space-y-2">
                <Label>名称</Label>
                <Input
                  value={selectedProvider.name}
                  onChange={(e) => updateProvider(selectedProvider.id, 'name', e.target.value)}
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label>Base URL</Label>
                <Input
                  value={selectedProvider.baseUrl}
                  onChange={(e) => updateProvider(selectedProvider.id, 'baseUrl', e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label>API 密钥</Label>
                <Input
                  type="password"
                  value={selectedProvider.apiKey}
                  onChange={(e) => updateProvider(selectedProvider.id, 'apiKey', e.target.value)}
                  placeholder="sk-..."
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label>超时时间 (秒)</Label>
                <Input
                  type="number"
                  value={selectedProvider.timeout}
                  onChange={(e) => updateProvider(selectedProvider.id, 'timeout', parseInt(e.target.value) || 0)}
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {selectedType === 'model' && selectedModel && (
            <div className="space-y-4">
              <h4 style={{ fontWeight: 600 }}>模型配置</h4>
              
              <div className="space-y-2">
                <Label>模型标识符</Label>
                <Input
                  value={selectedModel.modelIdentifier}
                  onChange={(e) => updateModel(selectedModel.id, 'modelIdentifier', e.target.value)}
                  placeholder="gpt-4-turbo"
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label>显示名称</Label>
                <Input
                  value={selectedModel.name}
                  onChange={(e) => updateModel(selectedModel.id, 'name', e.target.value)}
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>输入价格</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={selectedModel.priceIn}
                    onChange={(e) => updateModel(selectedModel.id, 'priceIn', parseFloat(e.target.value) || 0)}
                    className="glass border-border focus:border-primary transition-all"
                  />
                  <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>$/1K tokens</p>
                </div>
                <div className="space-y-2">
                  <Label>输出价格</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={selectedModel.priceOut}
                    onChange={(e) => updateModel(selectedModel.id, 'priceOut', parseFloat(e.target.value) || 0)}
                    className="glass border-border focus:border-primary transition-all"
                  />
                  <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>$/1K tokens</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>API 服务商</Label>
                <Select
                  value={selectedModel.apiProvider}
                  onValueChange={(value) => updateModel(selectedModel.id, 'apiProvider', value)}
                >
                  <SelectTrigger className="glass border-border focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {apiProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {!selectedProvider && selectedType === 'provider' && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>请选择或添加一个 API 服务商</p>
            </div>
          )}

          {!selectedModel && selectedType === 'model' && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>请选择或添加一个模型</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Model Mapping */}
      <div className="border-t border-border pt-4 space-y-4">
        <h4 style={{ fontWeight: 600 }}>任务模型映射</h4>
        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
          为每个任务类型指定使用的模型
        </p>

        <div className="grid grid-cols-2 gap-3">
          {taskNames.map((task) => (
            <div key={task.key} className="flex items-center gap-3 p-3 glass rounded-[var(--radius)]">
              <Label className="min-w-[80px]" style={{ fontSize: '0.875rem' }}>
                {task.label}
              </Label>
              <Select
                value={taskMapping[task.key] || ''}
                onValueChange={(value) => setTaskMapping({ ...taskMapping, [task.key]: value })}
              >
                <SelectTrigger className="glass border-border focus:border-primary flex-1">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
