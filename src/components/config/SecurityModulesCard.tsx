import { useState } from 'react';
import { Shield, Plus, X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useLanguage } from '../../i18n/LanguageContext';

export function SecurityModulesCard({ config, onChange }: { config: any, onChange: (config: any) => void }) {
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

  const [blacklistInput, setBlacklistInput] = useState('');

  const addToBlacklist = () => {
    const currentBlacklist = config.security?.blacklist || [];
    if (blacklistInput.trim() && !currentBlacklist.includes(blacklistInput.trim())) {
      handleUpdate('security.blacklist', [...currentBlacklist, blacklistInput.trim()]);
      setBlacklistInput('');
    }
  };

  const removeFromBlacklist = (item: string) => {
    const currentBlacklist = config.security?.blacklist || [];
    handleUpdate('security.blacklist', currentBlacklist.filter((b: string) => b !== item));
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
          <Switch
            checked={config.security?.anti_injection_enabled || false}
            onCheckedChange={(checked) => handleUpdate('security.anti_injection_enabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{t.config.security.enableRateLimit}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '限制用户请求频率' : 'Limit user request frequency'}
            </p>
          </div>
          <Switch
            checked={config.security?.enable_rate_limit || false}
            onCheckedChange={(checked) => handleUpdate('security.enable_rate_limit', checked)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.config.security.maxRequestsPerMin}</Label>
            <Input
              type="number"
              value={config.security?.max_requests_per_min || ''}
              onChange={(e) => handleUpdate('security.max_requests_per_min', parseInt(e.target.value) || 0)}
              placeholder="10"
              className="glass border-border focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === 'zh' ? '超限惩罚时间（分钟）' : 'Penalty Time (min)'}</Label>
            <Input
              type="number"
              value={config.security?.penalty_time_min || ''}
              onChange={(e) => handleUpdate('security.penalty_time_min', parseInt(e.target.value) || 0)}
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
          <Switch
            checked={config.security?.enable_content_filter || false}
            onCheckedChange={(checked) => handleUpdate('security.enable_content_filter', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
          <div className="space-y-1">
            <Label>{language === 'zh' ? '自动封禁' : 'Auto Ban'}</Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {language === 'zh' ? '自动封禁恶意用户' : 'Automatically ban malicious users'}
            </p>
          </div>
          <Switch
            checked={config.security?.auto_ban_enabled || false}
            onCheckedChange={(checked) => handleUpdate('security.auto_ban_enabled', checked)}
          />
        </div>

        {config.security?.auto_ban_enabled && (
          <div className="space-y-2">
            <Label>{language === 'zh' ? '封禁阈值（违规次数）' : 'Ban Threshold (Violations)'}</Label>
            <Input
              type="number"
              value={config.security?.ban_threshold_violations || ''}
              onChange={(e) => handleUpdate('security.ban_threshold_violations', parseInt(e.target.value) || 0)}
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
          <Switch
            checked={config.security?.enable_anti_spam || false}
            onCheckedChange={(checked) => handleUpdate('security.enable_anti_spam', checked)}
          />
        </div>

        <div className="space-y-3">
          <Label>{t.config.security.blacklist}</Label>
          <div className="flex flex-wrap gap-2 p-3 glass rounded-[var(--radius)] min-h-[60px]">
            {(config.security?.blacklist || []).map((item: string) => (
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
