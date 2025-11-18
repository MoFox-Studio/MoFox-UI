// 导入React的核心库和钩子
import { useState } from 'react';
// 从lucide-react库导入图标组件
import { Brain } from 'lucide-react';
// 导入自定义的UI组件
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// AI人格配置卡片组件
export function AIPersonalityCard({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  const { t, language } = useLanguage();

  // 更新配置的辅助函数
  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config)); // 深拷贝配置对象
    let current = newConfig;
    // 遍历路径，创建不存在的对象
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {};
    }
    current[keys[keys.length - 1]] = value;
    onChange(newConfig); // 调用父组件的回调函数更新状态
  };

  // 找到全局表达规则
  const globalExpressionRule = config.expression?.rules.find((r: any) => r.chat_stream_id === "");

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <Brain className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.personality.title}</h3>
      </div>

      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="w-full glass p-1">
          <TabsTrigger value="personality" className="flex-1">{language === 'zh' ? '人格设定' : 'Personality'}</TabsTrigger>
          <TabsTrigger value="expression" className="flex-1">{language === 'zh' ? '表达风格' : 'Expression'}</TabsTrigger>
        </TabsList>

        {/* 人格设定标签页 */}
        <TabsContent value="personality" className="space-y-4 mt-4">
          {/* 核心人格 */}
          <div className="space-y-2">
            <Label>{t.config.personality.core}</Label>
            <Textarea
              value={config.personality?.personality_core || ''}
              onChange={(e) => handleUpdate('personality.personality_core', e.target.value)}
              placeholder={t.config.personality.corePlaceholder}
              className="glass border-border focus:border-primary transition-all min-h-[100px] resize-none"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {t.config.personality.coreDescription}
            </p>
          </div>

          {/* 辅助人格 */}
          <div className="space-y-2">
            <Label>{t.config.personality.secondary}</Label>
            <Textarea
              value={config.personality?.personality_side || ''}
              onChange={(e) => handleUpdate('personality.personality_side', e.target.value)}
              placeholder={t.config.personality.secondaryPlaceholder}
              className="glass border-border focus:border-primary transition-all min-h-[100px] resize-none"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {t.config.personality.secondaryDescription}
            </p>
          </div>

          {/* 系统提示词 */}
          <div className="space-y-2">
            <Label>{t.config.personality.systemPrompt}</Label>
            <Textarea
              value={config.personality?.reply_style || ''}
              onChange={(e) => handleUpdate('personality.reply_style', e.target.value)}
              placeholder={t.config.personality.systemPromptPlaceholder}
              className="glass border-border focus:border-primary transition-all min-h-[100px] resize-none"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {t.config.personality.systemPromptDescription}
            </p>
          </div>
        </TabsContent>

        {/* 表达风格标签页 */}
        <TabsContent value="expression" className="space-y-4 mt-4">
          {/* ... 此处省略表达风格相关UI ... */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
