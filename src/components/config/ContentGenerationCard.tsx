import { useState } from 'react';
import { Wand2, Image as ImageIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../i18n/LanguageContext';

export function ContentGenerationCard({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  const { t, language } = useLanguage();

  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config));
    let current = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {};
    }
    current[keys[keys.length - 1]] = value;
    onChange(newConfig);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Wand2 className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.content.title}</h3>
      </div>

      <div className="space-y-4">
        {/* Image Generation */}
        <div className="space-y-4 p-4 glass rounded-[var(--radius)]">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-secondary" />
              <Label>{t.config.content.imageGeneration}</Label>
            </div>
            <Switch
              checked={config.image_generation?.enabled || false}
              onCheckedChange={(checked) => handleUpdate('image_generation.enabled', checked)}
            />
          </div>

          {config.image_generation?.enabled && (
            <div className="space-y-4 pt-3 border-t border-border">
              <div className="space-y-2">
                <Label>{language === 'zh' ? '图片生成模型' : 'Image Model'}</Label>
                <Select
                  value={config.image_generation?.model || ''}
                  onValueChange={(value) => handleUpdate('image_generation.model', value)}
                >
                  <SelectTrigger className="glass border-border">
                    <SelectValue placeholder={language === 'zh' ? '选择模型' : 'Select model'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dalle3">DALL-E 3</SelectItem>
                    <SelectItem value="sd">Stable Diffusion</SelectItem>
                    <SelectItem value="midjourney">Midjourney</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.config.content.maxImagesPerDay}</Label>
                <Input
                  type="number"
                  value={config.image_generation?.max_images_per_day || ''}
                  onChange={(e) => handleUpdate('image_generation.max_images_per_day', parseInt(e.target.value) || 0)}
                  placeholder="10"
                  className="glass border-border focus:border-primary transition-all"
                />
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  {language === 'zh' ? '每个用户每天最多生成图片数' : 'Max images per user per day'}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{language === 'zh' ? '提示词优化' : 'Prompt Enhancement'}</Label>
                <Textarea
                  value={config.image_generation?.prompt_enhancement_prefix || ''}
                  onChange={(e) => handleUpdate('image_generation.prompt_enhancement_prefix', e.target.value)}
                  placeholder={language === 'zh' ? '在用户提示词前添加的前缀...' : 'Prefix to add before user prompt...'}
                  className="glass border-border focus:border-primary transition-all min-h-[80px] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Emoji & Stickers */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '偷取表情' : 'Steal Emoji'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '自动收集用户发送的表情包' : 'Auto collect user\'s emojis'}
            </p>
          </div>
          <Switch
            checked={config.expression?.steal_emoji || false}
            onCheckedChange={(checked) => handleUpdate('expression.steal_emoji', checked)}
          />
        </div>

        <div className="space-y-3 p-4 glass rounded-[var(--radius)]">
          <Label>{language === 'zh' ? '随机表情概率' : 'Random Emoji Chance'}</Label>
          <Slider
            value={[config.expression?.emoji_chance || 0]}
            onValueChange={(value) => handleUpdate('expression.emoji_chance', value[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            <span>{language === 'zh' ? '从不' : 'Never'}</span>
            <span>{config.expression?.emoji_chance || 0}%</span>
            <span>{language === 'zh' ? '总是' : 'Always'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.content.enableMemes}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '允许发送表情包' : 'Allow sending memes'}
            </p>
          </div>
          <Switch
            checked={config.expression?.enable_memes || false}
            onCheckedChange={(checked) => handleUpdate('expression.enable_memes', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.content.enableStickers}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '允许发送贴纸' : 'Allow sending stickers'}
            </p>
          </div>
          <Switch
            checked={config.expression?.enable_stickers || false}
            onCheckedChange={(checked) => handleUpdate('expression.enable_stickers', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.content.enableMarkdown}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '支持 Markdown 格式' : 'Support Markdown formatting'}
            </p>
          </div>
          <Switch
            checked={config.expression?.enable_markdown || false}
            onCheckedChange={(checked) => handleUpdate('expression.enable_markdown', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>{language === 'zh' ? '文本样式' : 'Text Style'}</Label>
          <Select
            value={config.expression?.text_style || ''}
            onValueChange={(value) => handleUpdate('expression.text_style', value)}
          >
            <SelectTrigger className="glass border-border">
              <SelectValue placeholder={language === 'zh' ? '选择样式' : 'Select style'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">{language === 'zh' ? '轻松随意' : 'Casual'}</SelectItem>
              <SelectItem value="formal">{language === 'zh' ? '正式严谨' : 'Formal'}</SelectItem>
              <SelectItem value="cute">{language === 'zh' ? '可爱卖萌' : 'Cute'}</SelectItem>
              <SelectItem value="cool">{language === 'zh' ? '冷酷高冷' : 'Cool'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
