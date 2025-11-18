import { useState } from 'react';
import { Shield, Plus, X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useLanguage } from '../../i18n/LanguageContext';

export function SecurityModulesCard() {
  const { t, language } = useLanguage();
  const [antiInjectionEnabled, setAntiInjectionEnabled] = useState(true);
  const [autoBanEnabled, setAutoBanEnabled] = useState(true);
  const [blacklist, setBlacklist] = useState<string[]>(['user_spam_001', 'bot_attacker_02']);
  const [blacklistInput, setBlacklistInput] = useState('');

  const addToBlacklist = () => {
    if (blacklistInput.trim() && !blacklist.includes(blacklistInput.trim())) {
      setBlacklist([...blacklist, blacklistInput.trim()]);
      setBlacklistInput('');
    }
  };

  const removeFromBlacklist = (item: string) => {
    setBlacklist(blacklist.filter(b => b !== item));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.security.title}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '防注入攻击' : 'Anti-Injection'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '防止 Prompt 注入和越狱' : 'Prevent prompt injection and jailbreak'}
            </p>
          </div>
          <Switch checked={antiInjectionEnabled} onCheckedChange={setAntiInjectionEnabled} />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.security.enableRateLimit}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '限制用户请求频率' : 'Limit user request frequency'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.config.security.maxRequestsPerMin}</Label>
            <Input
              type="number"
              placeholder="10"
              className="glass border-border focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === 'zh' ? '超限惩罚时间（分钟）' : 'Penalty Time (min)'}</Label>
            <Input
              type="number"
              placeholder="5"
              className="glass border-border focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.security.enableContentFilter}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '过滤敏感和不当内容' : 'Filter sensitive and inappropriate content'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '自动封禁' : 'Auto Ban'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '自动封禁恶意用户' : 'Automatically ban malicious users'}
            </p>
          </div>
          <Switch checked={autoBanEnabled} onCheckedChange={setAutoBanEnabled} />
        </div>

        {autoBanEnabled && (
          <div className="space-y-2">
            <Label>{language === 'zh' ? '封禁阈值（违规次数）' : 'Ban Threshold (Violations)'}</Label>
            <Input
              type="number"
              placeholder="3"
              className="glass border-border focus:border-primary transition-all"
            />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '达到此次数后自动封禁' : 'Auto ban after this many violations'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.security.enableAntiSpam}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '检测并阻止垃圾消息' : 'Detect and block spam messages'}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="space-y-3">
          <Label>{t.config.security.blacklist}</Label>
          <div className="flex flex-wrap gap-2 p-3 glass rounded-[var(--radius)] min-h-[60px]">
            {blacklist.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="glass-hover px-3 py-1 flex items-center gap-2 bg-error/20 border-error/30"
              >
                {item}
                <button
                  onClick={() => removeFromBlacklist(item)}
                  className="hover:text-error transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={blacklistInput}
              onChange={(e) => setBlacklistInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addToBlacklist()}
              placeholder={language === 'zh' ? '输入用户ID后按回车' : 'Enter user ID and press Enter'}
              className="glass border-border focus:border-primary transition-all flex-1"
            />
            <Button
              onClick={addToBlacklist}
              className="bg-error/20 hover:bg-error/30 text-error border border-error/50"
            >
              {language === 'zh' ? '添加' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
