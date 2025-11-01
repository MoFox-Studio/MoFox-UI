import { useState } from 'react';
import { Wand2, Image as ImageIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../i18n/LanguageContext';

export function ContentGenerationCard() {
  const { t, language } = useLanguage();
  const [stealEmoji, setStealEmoji] = useState(true);
  const [emojiChance, setEmojiChance] = useState([30]);
  const [imageGenEnabled, setImageGenEnabled] = useState(false);

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
            <Switch checked={imageGenEnabled} onCheckedChange={setImageGenEnabled} />
          </div>

          {imageGenEnabled && (
            <div className="space-y-4 pt-3 border-t border-border">
              <div className="space-y-2">
                <Label>{language === 'zh' ? '图片生成模型' : 'Image Model'}</Label>
                <Select>
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
          <Switch checked={stealEmoji} onCheckedChange={setStealEmoji} />
        </div>

        <div className="space-y-3 p-4 glass rounded-[var(--radius)]">
          <Label>{language === 'zh' ? '随机表情概率' : 'Random Emoji Chance'}</Label>
          <Slider
            value={emojiChance}
            onValueChange={setEmojiChance}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            <span>{language === 'zh' ? '从不' : 'Never'}</span>
            <span>{emojiChance[0]}%</span>
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
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.content.enableStickers}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '允许发送贴纸' : 'Allow sending stickers'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.content.enableMarkdown}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '支持 Markdown 格式' : 'Support Markdown formatting'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="space-y-2">
          <Label>{language === 'zh' ? '文本样式' : 'Text Style'}</Label>
          <Select>
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
