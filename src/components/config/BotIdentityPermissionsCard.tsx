import { useState } from 'react';
import { Bot, X, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../i18n/LanguageContext';

export function BotIdentityPermissionsCard({ config, onChange }: { config: any, onChange: (config: any) => void }) {
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

  const [aliasInput, setAliasInput] = useState('');
  const [prefixInput, setPrefixInput] = useState('');

  const addAlias = () => {
    const currentAliases = config.bot?.alias_names || [];
    if (aliasInput.trim() && !currentAliases.includes(aliasInput.trim())) {
      handleUpdate('bot.alias_names', [...currentAliases, aliasInput.trim()]);
      setAliasInput('');
    }
  };

  const removeAlias = (alias: string) => {
    const currentAliases = config.bot?.alias_names || [];
    handleUpdate('bot.alias_names', currentAliases.filter((a: string) => a !== alias));
  };

  const addPrefix = () => {
    const currentPrefixes = config.command?.command_prefixes || [];
    if (prefixInput.trim() && !currentPrefixes.includes(prefixInput.trim())) {
      handleUpdate('command.command_prefixes', [...currentPrefixes, prefixInput.trim()]);
      setPrefixInput('');
    }
  };

  const removePrefix = (prefix: string) => {
    const currentPrefixes = config.command?.command_prefixes || [];
    handleUpdate('command.command_prefixes', currentPrefixes.filter((p: string) => p !== prefix));
  };

  const addMasterUser = () => {
    const currentMasterUsers = config.permission?.master_users || [];
    handleUpdate('permission.master_users', [...currentMasterUsers, ['', '']]);
  };

  const removeMasterUser = (index: number) => {
    const currentMasterUsers = config.permission?.master_users || [];
    handleUpdate('permission.master_users', currentMasterUsers.filter((_: string[], i: number) => i !== index));
  };

  const updateMasterUser = (index: number, field: 0 | 1, value: string) => {
    const currentMasterUsers = config.permission?.master_users || [];
    const newMasterUsers = currentMasterUsers.map((user: string[], i: number) =>
      i === index ? (field === 0 ? [value, user[1]] : [user[0], value]) : user
    );
    handleUpdate('permission.master_users', newMasterUsers);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Bot className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.bot.title}</h3>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{language === 'zh' ? '平台' : 'Platform'}</Label>
          <Input
            value={config.bot?.platform || ''}
            onChange={(e) => handleUpdate('bot.platform', e.target.value)}
            placeholder="qq"
            className="glass border-border focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label>{language === 'zh' ? 'QQ 账号' : 'QQ Account'}</Label>
          <Input
            value={config.bot?.qq_account || ''}
            onChange={(e) => handleUpdate('bot.qq_account', e.target.value)}
            placeholder="2012345678"
            className="glass border-border focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label>{language === 'zh' ? '昵称' : 'Nickname'}</Label>
          <Input
            value={config.bot?.nickname || ''}
            onChange={(e) => handleUpdate('bot.nickname', e.target.value)}
            placeholder="MoFox"
            className="glass border-border focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Alias Names */}
      <div className="space-y-3">
        <Label>{language === 'zh' ? '别名列表' : 'Alias List'}</Label>
        <div className="flex flex-wrap gap-2 p-3 glass rounded-[var(--radius)] min-h-[60px]">
          {(config.bot?.alias_names || []).map((alias: string) => (
            <Badge
              key={alias}
              variant="secondary"
              className="glass-hover px-3 py-1 flex items-center gap-2"
            >
              {alias}
              <button
                onClick={() => removeAlias(alias)}
                className="hover:text-error transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={aliasInput}
            onChange={(e) => setAliasInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAlias()}
            placeholder={language === 'zh' ? '输入别名后按回车' : 'Enter alias and press Enter'}
            className="glass border-border focus:border-primary transition-all flex-1"
          />
          <Button
            onClick={addAlias}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            {language === 'zh' ? '添加' : 'Add'}
          </Button>
        </div>
      </div>

      {/* Command Prefixes */}
      <div className="space-y-3">
        <Label>{language === 'zh' ? '命令前缀' : 'Command Prefix'}</Label>
        <div className="flex flex-wrap gap-2 p-3 glass rounded-[var(--radius)] min-h-[60px]">
          {(config.command?.command_prefixes || []).map((prefix: string) => (
            <Badge
              key={prefix}
              variant="secondary"
              className="glass-hover px-3 py-1 flex items-center gap-2"
            >
              {prefix}
              <button
                onClick={() => removePrefix(prefix)}
                className="hover:text-error transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={prefixInput}
            onChange={(e) => setPrefixInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPrefix()}
            placeholder={language === 'zh' ? '输入前缀后按回车' : 'Enter prefix and press Enter'}
            className="glass border-border focus:border-primary transition-all flex-1"
          />
          <Button
            onClick={addPrefix}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            {language === 'zh' ? '添加' : 'Add'}
          </Button>
        </div>
      </div>

      {/* Master Users */}
      <div className="space-y-3">
        <Label>{language === 'zh' ? 'Master 用户列表' : 'Master User List'}</Label>
        <div className="space-y-2">
          {(config.permission?.master_users || []).map((user: string[], index: number) => (
            <div
              key={index}
              className="flex gap-2 items-center p-3 glass rounded-[var(--radius)]"
            >
              <Input
                value={user[0]}
                onChange={(e) => updateMasterUser(index, 0, e.target.value)}
                placeholder={language === 'zh' ? '平台 (如: qq)' : 'Platform (e.g., qq)'}
                className="glass border-border focus:border-primary transition-all flex-1"
              />
              <Input
                value={user[1]}
                onChange={(e) => updateMasterUser(index, 1, e.target.value)}
                placeholder={language === 'zh' ? '用户 ID' : 'User ID'}
                className="glass border-border focus:border-primary transition-all flex-1"
              />
              <button
                onClick={() => removeMasterUser(index)}
                className="p-2 hover:bg-error/20 rounded-lg transition-colors text-error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <Button
          onClick={addMasterUser}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'zh' ? '添加 Master 用户' : 'Add Master User'}
        </Button>
      </div>
    </div>
  );
}
