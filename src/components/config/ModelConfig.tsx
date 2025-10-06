import { useState, useEffect, ChangeEvent } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus } from "lucide-react";
import * as toml from 'toml';
import { ModelConfigType, ApiProvider, Model as ModelType, ModelTask } from './types';
import { Save, Trash2 } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ModelConfigProps {
  tomlContent: string;
  onSave: (newTomlContent: string) => void;
  modelTomlPath: string;
}

const defaultProvider: ApiProvider = { name: "", base_url: "", api_key: [], client_type: "openai", max_retry: 2, timeout: 30, retry_interval: 10, enable_content_obfuscation: false, obfuscation_intensity: 1 };
const defaultModel: ModelType = { model_identifier: "", name: "", api_provider: "", price_in: 0, price_out: 0, force_stream_mode: false, use_anti_truncation: false, extra_params: { enable_thinking: true } };

const TASK_NAMES = [
  "utils", "utils_small", "replyer", "planner", "emotion", "mood", "maizone",
  "vlm", "emoji_vlm", "utils_video", "voice", "tool_use", "schedule_generator",
  "anti_injection", "monthly_plan_generator", "relationship_tracker", "embedding",
  "lpmm_entity_extract", "lpmm_rdf_build", "lpmm_qa"
];

const TASK_DESCRIPTIONS: Record<string, string> = {
  utils: "在麦麦的一些组件中使用的模型，例如表情包模块，取名模块，关系模块，是麦麦必须的模型",
  utils_small: "在麦麦的一些组件中使用的小模型，消耗量较大，建议使用速度较快的小模型",
  replyer: "首要回复模型，还用于表达器和表达方式学习",
  planner: "决策：负责决定麦麦该做什么的模型",
  emotion: "负责麦麦的情绪变化",
  mood: "负责麦麦的心情变化",
  maizone: "maizone模型",
  vlm: "图像识别模型",
  emoji_vlm: "专用表情包识别模型",
  utils_video: "专用视频分析模型",
  voice: "语音识别模型",
  tool_use: "工具调用模型，需要使用支持工具调用的模型",
  schedule_generator: "日程表生成模型",
  anti_injection: "反注入检测专用模型",
  monthly_plan_generator: "月层计划生成模型",
  relationship_tracker: "用户关系追踪模型",
  embedding: "嵌入模型",
  lpmm_entity_extract: "LPMM知识库模型 - 实体提取模型",
  lpmm_rdf_build: "LPMM知识库模型 - RDF构建模型",
  lpmm_qa: "LPMM知识库模型 - 问答模型",
};

const TaskCard = ({ name, task, models, updateTask, openPopovers, setOpenPopovers }: { name: string, task: ModelTask, models: ModelType[], updateTask: Function, openPopovers: Record<string, boolean>, setOpenPopovers: Function }) => (
  <Card>
    <Accordion type="single" collapsible>
      <AccordionItem value={name}>
        <AccordionTrigger className="px-6">
          <div>
            <CardTitle className="text-base text-left">{name}</CardTitle>
            <CardDescription className="text-left font-normal mt-1">{TASK_DESCRIPTIONS[name] || "模型任务配置"}</CardDescription>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold">模型列表</Label>
              <Popover open={openPopovers[name]} onOpenChange={(isOpen: boolean) => setOpenPopovers((p: any) => ({ ...p, [name]: isOpen }))}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openPopovers[name]} className="w-full justify-between h-auto min-h-10">
                    <div className="flex flex-wrap gap-1">
                      {task.model_list.length > 0 ? task.model_list.map(modelName => <Badge key={modelName} variant="secondary">{modelName}</Badge>) : "选择模型..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="搜索模型..." />
                    <CommandList>
                      <CommandEmpty>未找到模型。</CommandEmpty>
                      <CommandGroup>
                        {models.map(model => (
                          <CommandItem key={model.name} value={model.name}
                            onSelect={() => {
                              const newList = task.model_list.includes(model.name)
                                ? task.model_list.filter(m => m !== model.name)
                                : [...task.model_list, model.name];
                              updateTask(name, 'model_list', newList);
                            }}>
                            <Check className={cn("mr-2 h-4 w-4", task.model_list.includes(model.name) ? "opacity-100" : "opacity-0")} />
                            {model.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {task.temperature !== undefined && <div className="space-y-2"><Label>温度</Label><Input type="number" step="0.1" value={task.temperature} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTask(name, 'temperature', parseFloat(e.target.value))} /></div>}
              {task.max_tokens !== undefined && <div className="space-y-2"><Label>Max Tokens</Label><Input type="number" value={task.max_tokens} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTask(name, 'max_tokens', parseInt(e.target.value))} /></div>}
              {task.concurrency_count !== undefined && <div className="space-y-2"><Label>并发数</Label><Input type="number" value={task.concurrency_count} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTask(name, 'concurrency_count', parseInt(e.target.value))} /></div>}
              {task.embedding_dimension !== undefined && <div className="space-y-2"><Label>嵌入维度</Label><Input type="number" value={task.embedding_dimension} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTask(name, 'embedding_dimension', parseInt(e.target.value))} /></div>}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
);


export function ModelConfig({ tomlContent, onSave, modelTomlPath }: ModelConfigProps) {
  const [config, setConfig] = useState<ModelConfigType>({ version: "1.3.6", providers: [], models: [], taskConfig: {} });
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (tomlContent) {
      try {
        const parsed = toml.parse(tomlContent);
        const taskConfig: Record<string, ModelTask> = {};
        
        const modelTaskConfigObject = parsed.model_task_config || {};

        TASK_NAMES.forEach(name => {
          if (modelTaskConfigObject[name]) {
            taskConfig[name] = modelTaskConfigObject[name];
          }
        });
        
        // Ensure all task names are present in the config for the UI
        TASK_NAMES.forEach(name => {
          if (!taskConfig[name]) {
             taskConfig[name] = { model_list: [] };
          }
        });

        setConfig({
          version: parsed.version || "1.3.6",
          providers: parsed.api_providers || [],
          models: parsed.models || [],
          taskConfig: taskConfig,
        });
      } catch (e) {
        console.error("Error parsing model config TOML:", e);
      }
    } else {
      const initialTaskConfig: Record<string, ModelTask> = {};
      TASK_NAMES.forEach(name => {
        initialTaskConfig[name] = { model_list: [] };
      });
      setConfig({ version: "1.pnpm run dev", providers: [], models: [], taskConfig: initialTaskConfig });
    }
  }, [tomlContent]);

  const handleSave = () => {
    let output = tomlContent;

    const updateSection = (sectionName: string, data: any) => {
        let sectionStr = `[${sectionName}]\n`;
        Object.entries(data).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (key === 'model_list' && Array.isArray(value)) {
                sectionStr += `model_list = [${value.map(m => `"${m}"`).join(", ")}]\n`;
            } else {
                sectionStr += `${key} = ${value}\n`;
            }
        });
        
        const regex = new RegExp(`\\[${sectionName.replace('.', '\\.')}\\][\\s\\S]*?(?=\\n\\[|$)`);
        if (regex.test(output)) {
            output = output.replace(regex, sectionStr);
        } else {
            output += `\n${sectionStr}`;
        }
    };

    Object.entries(config.taskConfig).forEach(([key, task]) => {
        // Only save if there's something to save
        if (task.model_list.length > 0 || task.temperature !== undefined || task.max_tokens !== undefined || task.concurrency_count !== undefined || task.embedding_dimension !== undefined) {
           updateSection(`model_task_config.${key}`, task);
        }
    });

    onSave(output);
  };

  const updateProvider = (index: number, field: keyof ApiProvider, value: any) => {
    const newProviders = [...config.providers];
    (newProviders[index] as any)[field] = value;
    setConfig(c => ({ ...c, providers: newProviders }));
  };
  
  const updateModel = (index: number, field: keyof ModelType, value: any) => {
    const newModels = [...config.models];
    (newModels[index] as any)[field] = value;
    setConfig(c => ({ ...c, models: newModels }));
  };

  const updateTask = (name: string, field: keyof ModelTask, value: any) => {
    setConfig(c => ({
      ...c,
      taskConfig: {
        ...c.taskConfig,
        [name]: {
          ...c.taskConfig[name],
          [field]: value
        }
      }
    }));
  };
  
  const addProvider = () => setConfig(c => ({ ...c, providers: [...c.providers, { ...defaultProvider }] }));
  const removeProvider = (index: number) => setConfig(c => ({ ...c, providers: c.providers.filter((_, i) => i !== index) }));
  
  const addModel = () => setConfig(c => ({ ...c, models: [...c.models, { ...defaultModel }] }));
  const removeModel = (index: number) => setConfig(c => ({ ...c, models: c.models.filter((_, i) => i !== index) }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{modelTomlPath}</p>
      
      {/* API Providers */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">API 服务提供商</CardTitle>
            <Button size="sm" onClick={addProvider}><Plus className="h-4 w-4 mr-2" />添加</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.providers.map((p, i) => (
            <div key={i} className="p-4 border rounded-md space-y-4 relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeProvider(i)}><Trash2 className="h-4 w-4" /></Button>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`provider-name-${i}`}>名称</Label>
                  <Input id={`provider-name-${i}`} placeholder="服务商名称 (例如, DeepSeek)" value={p.name} onChange={e => updateProvider(i, 'name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`provider-base-url-${i}`}>Base URL</Label>
                  <Input id={`provider-base-url-${i}`} placeholder="API Base URL (例如, https://api.deepseek.com/v1)" value={p.base_url} onChange={e => updateProvider(i, 'base_url', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`provider-api-key-${i}`}>API 密钥 (每行一个)</Label>
                <Textarea id={`provider-api-key-${i}`} placeholder="your-api-key-1&#10;your-api-key-2" value={Array.isArray(p.api_key) ? p.api_key.join('\n') : p.api_key} onChange={e => updateProvider(i, 'api_key', e.target.value.split('\n'))} />
              </div>
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`provider-client-type-${i}`}>客户端类型</Label>
                    <Select value={p.client_type} onValueChange={(v: string) => updateProvider(i, 'client_type', v)}>
                      <SelectTrigger><SelectValue placeholder="客户端类型" /></SelectTrigger>
                      <SelectContent><SelectItem value="openai">openai</SelectItem><SelectItem value="aiohttp_gemini">aiohttp_gemini</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`provider-max-retry-${i}`}>最大重试</Label>
                    <Input id={`provider-max-retry-${i}`} type="number" value={p.max_retry} onChange={(e: ChangeEvent<HTMLInputElement>) => updateProvider(i, 'max_retry', parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`provider-timeout-${i}`}>超时(秒)</Label>
                    <Input id={`provider-timeout-${i}`} type="number" value={p.timeout} onChange={(e: ChangeEvent<HTMLInputElement>) => updateProvider(i, 'timeout', parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`provider-retry-interval-${i}`}>重试间隔(秒)</Label>
                    <Input id={`provider-retry-interval-${i}`} type="number" value={p.retry_interval} onChange={(e: ChangeEvent<HTMLInputElement>) => updateProvider(i, 'retry_interval', parseInt(e.target.value))} />
                  </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                  <Switch id={`obfuscation-${i}`} checked={p.enable_content_obfuscation} onCheckedChange={(c: boolean) => updateProvider(i, 'enable_content_obfuscation', c)} />
                  <Label htmlFor={`obfuscation-${i}`} className="flex-grow">启用内容混淆</Label>
                  {p.enable_content_obfuscation && (
                    <>
                      <Slider value={[p.obfuscation_intensity || 1]} onValueChange={(v: number[]) => updateProvider(i, 'obfuscation_intensity', v[0])} min={1} max={3} step={1} className="w-32" />
                      <span className="text-sm w-8 text-center">{p.obfuscation_intensity}</span>
                    </>
                  )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Models */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">模型</CardTitle>
            <Button size="sm" onClick={addModel}><Plus className="h-4 w-4 mr-2" />添加</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.models.map((m, i) => (
            <div key={i} className="p-4 border rounded-md space-y-4 relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeModel(i)}><Trash2 className="h-4 w-4" /></Button>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor={`model-identifier-${i}`}>模型标识符</Label>
                  <Input id={`model-identifier-${i}`} placeholder="模型标识符 (例如, deepseek-chat)" value={m.model_identifier} onChange={e => updateModel(i, 'model_identifier', e.target.value)} />
                </div>
                <div className="space-y-2">
                   <Label htmlFor={`model-name-${i}`}>自定义模型名称</Label>
                  <Input id={`model-name-${i}`} placeholder="自定义模型名称 (例如, deepseek-v3)" value={m.name} onChange={e => updateModel(i, 'name', e.target.value)} />
                </div>
              </div>
              <Select value={m.api_provider} onValueChange={(v: string) => updateModel(i, 'api_provider', v)}>
                <SelectTrigger><SelectValue placeholder="选择 API 提供商" /></SelectTrigger>
                <SelectContent>{config.providers.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`model-price-in-${i}`}>输入价格 (元/M tokens)</Label>
                  <Input id={`model-price-in-${i}`} type="number" value={m.price_in} onChange={(e: ChangeEvent<HTMLInputElement>) => updateModel(i, 'price_in', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`model-price-out-${i}`}>输出价格 (元/M tokens)</Label>
                  <Input id={`model-price-out-${i}`} type="number" value={m.price_out} onChange={(e: ChangeEvent<HTMLInputElement>) => updateModel(i, 'price_out', parseFloat(e.target.value))} />
                </div>
              </div>
              <div className="flex items-center justify-around">
                <div className="flex items-center gap-2"><Switch id={`model-force-stream-${i}`} checked={m.force_stream_mode} onCheckedChange={(c: boolean) => updateModel(i, 'force_stream_mode', c)} /><Label htmlFor={`model-force-stream-${i}`}>强制流式</Label></div>
                <div className="flex items-center gap-2"><Switch id={`model-anti-truncation-${i}`} checked={m.use_anti_truncation} onCheckedChange={(c: boolean) => updateModel(i, 'use_anti_truncation', c)} /><Label htmlFor={`model-anti-truncation-${i}`}>反截断</Label></div>
                <div className="flex items-center gap-2"><Switch id={`model-enable-thinking-${i}`} checked={m.extra_params?.enable_thinking} onCheckedChange={(c: boolean) => setConfig(conf => { const newConf = {...conf}; newConf.models[i].extra_params = {...newConf.models[i].extra_params, enable_thinking: c }; return newConf;})} /><Label htmlFor={`model-enable-thinking-${i}`}>启用思考</Label></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Task Config */}
      <Card>
        <CardHeader>
            <CardTitle className="text-base">模型任务配置</CardTitle>
            <CardDescription>为不同任务（如回复、决策、视觉识别等）分配和配置特定的模型。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {TASK_NAMES.map(name => (
             config.taskConfig[name] && <TaskCard key={name} name={name} task={config.taskConfig[name]} models={config.models} updateTask={updateTask} openPopovers={openPopovers} setOpenPopovers={setOpenPopovers} />
           ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />保存模型配置</Button>
      </div>
    </div>
  );
}