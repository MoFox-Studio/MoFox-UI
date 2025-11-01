// 导入React的核心库和钩子
import { useState, useEffect } from 'react';
// 从lucide-react库导入图标组件
import { Cpu, Plus, X } from 'lucide-react';
// 导入自定义的UI组件
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// 定义API提供商的接口
interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

// 定义模型的接口
interface Model {
  id: string;
  modelIdentifier: string;
  name: string;
  priceIn: number;
  priceOut: number;
  apiProvider: string;
}

// 获取任务名称列表的函数
const getTaskNames = (language: 'zh' | 'en') => [
  // ... 此处省略任务名称数据
];

// 模型配置卡片组件
export function ModelConfigCard({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  const { t, language } = useLanguage();
  const taskNames = getTaskNames(language);
  // 状态管理
  const [selectedType, setSelectedType] = useState<'provider' | 'model'>('provider');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [apiProviders, setApiProviders] = useState<ApiProvider[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [taskMapping, setTaskMapping] = useState<Record<string, string>>({});

  // 副作用钩子：当配置数据变化时，解析并设置本地状态
  useEffect(() => {
    if (config) {
      // ... 解析和设置 providers, models, taskMapping 的逻辑
    }
  }, [config, selectedProviderId, selectedModelId]);

  // 添加API提供商
  const addProvider = () => { /* ... */ };
  // 移除API提供商
  const removeProvider = (id: string) => { /* ... */ };
  // 更新API提供商
  const updateProvider = (id: string, field: keyof ApiProvider, value: string | number) => { /* ... */ };
  // 添加模型
  const addModel = () => { /* ... */ };
  // 移除模型
  const removeModel = (id: string) => { /* ... */ };
  // 更新模型
  const updateModel = (id: string, field: keyof Model, value: string | number) => { /* ... */ };

  const selectedProvider = apiProviders.find(p => p.id === selectedProviderId);
  const selectedModel = models.find(m => m.id === selectedModelId);

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <Cpu className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>模型配置</h3>
      </div>

      {/* 主从布局 */}
      <div className="grid grid-cols-3 gap-4 min-h-[400px]">
        {/* 左侧列表面板 */}
        <div className="col-span-1 space-y-4">
          {/* ... Provider和Model的列表和切换按钮 ... */}
        </div>

        {/* 右侧详情面板 */}
        <div className="col-span-2 glass rounded-[var(--radius)] p-4">
          {/* ... Provider和Model的详细配置表单 ... */}
        </div>
      </div>

      {/* 任务模型映射 */}
      <div className="border-t border-border pt-4 space-y-4">
        {/* ... 任务到模型的选择器列表 ... */}
      </div>
    </div>
  );
}
