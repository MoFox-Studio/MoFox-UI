import { useState } from 'react';
import { Heart, Brain } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { useLanguage } from '../../i18n/LanguageContext';

export function RelationshipMemoryCard() {
  const { t, language } = useLanguage();
  const [enableRelationship, setEnableRelationship] = useState(true);
  const [enableMemory, setEnableMemory] = useState(true);
  const [memoryStrength, setMemoryStrength] = useState([70]);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.memory.title}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.memory.enableMemory}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '记住用户的对话历史' : 'Remember user conversation history'}
            </p>
          </div>
          <Switch checked={enableMemory} onCheckedChange={setEnableMemory} />
        </div>

        {enableMemory && (
          <>
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

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.memory.relationshipTracking}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '追踪与用户的亲密度' : 'Track intimacy with users'}
            </p>
          </div>
          <Switch checked={enableRelationship} onCheckedChange={setEnableRelationship} />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1 flex items-center gap-2">
            <Brain className="w-4 h-4 text-secondary" />
            <Label>{t.config.memory.emotionalAnalysis}</Label>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.memory.topicTracking}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '记录用户感兴趣的话题' : 'Track topics users are interested in'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

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
