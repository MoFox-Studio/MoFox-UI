// 导入React的核心库和钩子
import { useState } from 'react';
// 从lucide-react库导入图标组件
import { MessageCircle } from 'lucide-react';
// 导入自定义的UI组件
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// 聊天交互逻辑配置卡片组件
export function ChatInteractionLogicCard() {
  const { t, language } = useLanguage();
  // 状态管理
  const [allowReplySelf, setAllowReplySelf] = useState(false);
  const [interruptionEnabled, setInterruptionEnabled] = useState(true);

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.chat.title}</h3>
      </div>

      <div className="space-y-4">
        {/* 输入框组 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 回复延迟 */}
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

          {/* 上下文窗口 */}
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

        {/* 开关选项组 */}
        {/* 允许回复自己 */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '允许回复自己' : 'Allow Self-Reply'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '机器人可以回复自己的消息' : 'Bot can reply to its own messages'}
            </p>
          </div>
          <Switch checked={allowReplySelf} onCheckedChange={setAllowReplySelf} />
        </div>

        {/* 仅回复@ */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.chat.enableMentions}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '仅回复@机器人的消息' : 'Only reply to @mentions'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        {/* 智能打断 */}
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '智能打断' : 'Smart Interruption'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '在生成回复时收到新消息时中断' : 'Interrupt when new message arrives'}
            </p>
          </div>
          <Switch checked={interruptionEnabled} onCheckedChange={setInterruptionEnabled} />
        </div>
        
        {/* ... 其他开关选项 ... */}
      </div>
    </div>
  );
}
