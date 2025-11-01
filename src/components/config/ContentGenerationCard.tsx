// 导入React的核心库和钩子
import { useState } from 'react';
// 从lucide-react库导入图标组件
import { Wand2, Image as ImageIcon } from 'lucide-react';
// 导入自定义的UI组件
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// 内容生成配置卡片组件
export function ContentGenerationCard() {
  const { t, language } = useLanguage();
  // 状态管理
  const [stealEmoji, setStealEmoji] = useState(true);
  const [emojiChance, setEmojiChance] = useState([30]);
  const [imageGenEnabled, setImageGenEnabled] = useState(false);

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <Wand2 className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.content.title}</h3>
      </div>

      <div className="space-y-4">
        {/* 图片生成部分 */}
        <div className="space-y-4 p-4 glass rounded-[var(--radius)]">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-secondary" />
              <Label>{t.config.content.imageGeneration}</Label>
            </div>
            <Switch checked={imageGenEnabled} onCheckedChange={setImageGenEnabled} />
          </div>

          {/* 如果启用图片生成，显示更多选项 */}
          {imageGenEnabled && (
            <div className="space-y-4 pt-3 border-t border-border">
              {/* ... 图片生成相关配置 ... */}
            </div>
          )}
        </div>

        {/* 表情与贴纸部分 */}
        {/* ... */}
        
      </div>
    </div>
  );
}
