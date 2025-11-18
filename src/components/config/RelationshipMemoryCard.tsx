// 导入React的核心库和钩子
import { useState } from 'react';
// 从lucide-react库导入图标组件
import { Heart, Brain } from 'lucide-react';
// 导入自定义的UI组件
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// 关系与记忆系统配置卡片组件
export function RelationshipMemoryCard() {
  const { t, language } = useLanguage();
  // 状态管理
  const [enableRelationship, setEnableRelationship] = useState(true);
  const [enableMemory, setEnableMemory] = useState(true);
  const [memoryStrength, setMemoryStrength] = useState([70]);

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <Heart className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.memory.title}</h3>
      </div>

      <div className="space-y-4">
        {/* 启用记忆系统 */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.memory.enableMemory}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '记住用户的对话历史' : 'Remember user conversation history'}
            </p>
          </div>
          <Switch checked={enableMemory} onCheckedChange={setEnableMemory} />
        </div>

        {/* 仅在启用记忆系统时显示 */}
        {enableMemory && (
          <>
            {/* 记忆保留天数 */}
            <div className="space-y-2">
              <Label>{t.config.memory.memoryDays}</Label>
              <Input
                type="number"
                placeholder="30"
                className="glass border-border focus:border-primary transition-all"
              />
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                {language === 'zh' ? '超过此时间的记忆将被清理' : 'Memories older than this will be cleared'}
              </p>
            </div>

            {/* 记忆强度 */}
            <div className="space-y-3 p-4 glass rounded-[var(--radius)]">
              <Label>{language === 'zh' ? '记忆强度' : 'Memory Strength'}</Label>
              <Slider
                value={memoryStrength}
                onValueChange={setMemoryStrength}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                <span>{language === 'zh' ? '遗忘快' : 'Forget Fast'}</span>
                <span>{memoryStrength[0]}%</span>
                <span>{language === 'zh' ? '记忆深' : 'Remember Well'}</span>
              </div>
            </div>
          </>
        )}

        {/* 关系追踪 */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.memory.relationshipTracking}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '追踪与用户的亲密度' : 'Track intimacy with users'}
            </p>
          </div>
          <Switch checked={enableRelationship} onCheckedChange={setEnableRelationship} />
        </div>

        {/* 情感分析 */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1 flex items-center gap-2">
            <Brain className="w-4 h-4 text-secondary" />
            <Label>{t.config.memory.emotionalAnalysis}</Label>
          </div>
          <Switch defaultChecked />
        </div>

        {/* 话题追踪 */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.memory.topicTracking}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '记录用户感兴趣的话题' : 'Track topics users are interested in'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        {/* 记忆向量维度 */}
        <div className="space-y-2">
          <Label>{language === 'zh' ? '记忆向量维度' : 'Memory Vector Dimension'}</Label>
          <Input
            type="number"
            placeholder="1536"
            className="glass border-border focus:border-primary transition-all"
          />
          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            {language === 'zh' ? '用于语义检索的向量维度' : 'Vector dimension for semantic search'}
          </p>
        </div>
      </div>
    </div>
  );
}
