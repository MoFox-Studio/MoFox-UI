import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useLanguage } from '../../i18n/LanguageContext';

export function AIPersonalityCard() {
  const { t, language } = useLanguage();
  const [useExpression, setUseExpression] = useState(true);
  const [learnExpression, setLearnExpression] = useState(false);
  const [learningStrength, setLearningStrength] = useState([50]);
  const [corePersonality, setCorePersonality] = useState('');
  const [secondaryPersonality, setSecondaryPersonality] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  useEffect(() => {
    fetch('/config/bot')
      .then(res => res.json())
      .then(data => {
        if (data.personality) {
          setCorePersonality(data.personality.personality_core || '');
          setSecondaryPersonality(data.personality.personality_side || '');
          setSystemPrompt(data.personality.reply_style || '');
        }
        if (data.expression && data.expression.rules && data.expression.rules.length > 0) {
          const globalRule = data.expression.rules.find((rule: any) => rule.chat_stream_id === "");
          if (globalRule) {
            setUseExpression(globalRule.use_expression);
            setLearnExpression(globalRule.learn_expression);
            setLearningStrength([globalRule.learning_strength * 100]);
          }
        }
      });
  }, []);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.personality.title}</h3>
      </div>

      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="w-full glass p-1">
          <TabsTrigger value="personality" className="flex-1">{language === 'zh' ? '人格设定' : 'Personality'}</TabsTrigger>
          <TabsTrigger value="expression" className="flex-1">{language === 'zh' ? '表达风格' : 'Expression'}</TabsTrigger>
        </TabsList>

        {/* Personality Tab */}
        <TabsContent value="personality" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>{language === 'zh' ? '核心人格' : 'Core Personality'}</Label>
            <Textarea
              value={corePersonality}
              onChange={(e) => setCorePersonality(e.target.value)}
              placeholder={language === 'zh' ? '描述机器人的核心性格特征...' : 'Describe the bot\'s core personality...'}
              className="glass border-border focus:border-primary transition-all min-h-[100px] resize-none"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '定义机器人的基本性格、态度和价值观' : 'Define the bot\'s basic character, attitudes, and values'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{language === 'zh' ? '辅助人格' : 'Secondary Personality'}</Label>
            <Textarea
              value={secondaryPersonality}
              onChange={(e) => setSecondaryPersonality(e.target.value)}
              placeholder={language === 'zh' ? '描述机器人的次要性格特征...' : 'Describe the bot\'s secondary traits...'}
              className="glass border-border focus:border-primary transition-all min-h-[100px] resize-none"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '补充的性格特征，在特定情况下展现' : 'Additional traits displayed in specific situations'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t.config.personality.systemPrompt}</Label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder={language === 'zh' ? '输入系统提示词...' : 'Enter system prompt...'}
              className="glass border-border focus:border-primary transition-all min-h-[100px] resize-none"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? 'AI 模型的系统级指令' : 'System-level instructions for AI model'}
            </p>
          </div>
        </TabsContent>

        {/* Expression Tab */}
        <TabsContent value="expression" className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
            <div className="space-y-1">
              <Label>{language === 'zh' ? '使用表达式库' : 'Use Expression Library'}</Label>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                {language === 'zh' ? '从预设的表达式中随机选择' : 'Randomly select from preset expressions'}
              </p>
            </div>
            <Switch checked={useExpression} onCheckedChange={setUseExpression} />
          </div>

          <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
            <div className="space-y-1">
              <Label>{language === 'zh' ? '学习用户表达' : 'Learn User Expressions'}</Label>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                {language === 'zh' ? '从对话中学习新的表达方式' : 'Learn new expressions from conversations'}
              </p>
            </div>
            <Switch checked={learnExpression} onCheckedChange={setLearnExpression} />
          </div>

          {learnExpression && (
            <div className="space-y-3 p-4 glass rounded-[var(--radius)]">
              <Label>{language === 'zh' ? '学习强度' : 'Learning Strength'}</Label>
              <Slider
                value={learningStrength}
                onValueChange={setLearningStrength}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                <span>{language === 'zh' ? '保守' : 'Conservative'}</span>
                <span>{learningStrength[0]}%</span>
                <span>{language === 'zh' ? '激进' : 'Aggressive'}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.config.personality.temperature}</Label>
              <Input
                type="number"
                placeholder="0.7"
                step="0.1"
                min="0"
                max="2"
                className="glass border-border focus:border-primary transition-all"
              />
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                {language === 'zh' ? '控制回复的随机性 (0-2)' : 'Control randomness (0-2)'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t.config.personality.maxTokens}</Label>
              <Input
                type="number"
                placeholder="2000"
                className="glass border-border focus:border-primary transition-all"
              />
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                {language === 'zh' ? '单次回复的最大长度' : 'Maximum response length'}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
