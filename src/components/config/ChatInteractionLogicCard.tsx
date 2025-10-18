import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { useLanguage } from '../../i18n/LanguageContext';

export function ChatInteractionLogicCard() {
  const { t, language } = useLanguage();
  const [allowReplySelf, setAllowReplySelf] = useState(false);
  const [interruptionEnabled, setInterruptionEnabled] = useState(true);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.chat.title}</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.config.chat.replyDelay}</Label>
            <Input
              type="number"
              placeholder="1.5"
              step="0.1"
              className="glass border-border focus:border-primary transition-all"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '模拟打字延迟' : 'Simulated typing delay'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t.config.chat.contextWindow}</Label>
            <Input
              type="number"
              placeholder="10"
              className="glass border-border focus:border-primary transition-all"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '记忆最近N条消息' : 'Remember last N messages'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '允许回复自己' : 'Allow Self-Reply'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '机器人可以回复自己的消息' : 'Bot can reply to its own messages'}
            </p>
          </div>
          <Switch checked={allowReplySelf} onCheckedChange={setAllowReplySelf} />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.chat.enableMentions}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '仅回复@机器人的消息' : 'Only reply to @mentions'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '智能打断' : 'Smart Interruption'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '在生成回复时收到新消息时中断' : 'Interrupt when new message arrives'}
            </p>
          </div>
          <Switch checked={interruptionEnabled} onCheckedChange={setInterruptionEnabled} />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.chat.enableEmoji}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '在回复中添加表情' : 'Add emoji to replies'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.chat.enableVoice}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '支持语音消息回复' : 'Support voice message replies'}
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
}
