import { useState } from 'react';
import { Bot, X, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../i18n/LanguageContext';

interface MasterUser {
  id: string;
  platform: string;
  userId: string;
}

export function BotIdentityPermissionsCard() {
  const { t, language } = useLanguage();
  const [aliases, setAliases] = useState<string[]>(['小狐', 'MoFox']);
  const [commandPrefixes, setCommandPrefixes] = useState<string[]>(['/', '!', '.']);
  const [masterUsers, setMasterUsers] = useState<MasterUser[]>([
    { id: '1', platform: 'qq', userId: '123456789' },
  ]);
  
  const [aliasInput, setAliasInput] = useState('');
  const [prefixInput, setPrefixInput] = useState('');

  const addAlias = () => {
    if (aliasInput.trim() && !aliases.includes(aliasInput.trim())) {
      setAliases([...aliases, aliasInput.trim()]);
      setAliasInput('');
    }
  };

  const removeAlias = (alias: string) => {
    setAliases(aliases.filter(a => a !== alias));
  };

  const addPrefix = () => {
    if (prefixInput.trim() && !commandPrefixes.includes(prefixInput.trim())) {
      setCommandPrefixes([...commandPrefixes, prefixInput.trim()]);
      setPrefixInput('');
    }
  };

  const removePrefix = (prefix: string) => {
    setCommandPrefixes(commandPrefixes.filter(p => p !== prefix));
  };

  const addMasterUser = () => {
    setMasterUsers([
      ...masterUsers,
      { id: Date.now().toString(), platform: '', userId: '' }
    ]);
  };

  const removeMasterUser = (id: string) => {
    setMasterUsers(masterUsers.filter(u => u.id !== id));
  };

  const updateMasterUser = (id: string, field: 'platform' | 'userId', value: string) => {
    setMasterUsers(masterUsers.map(u => 
      u.id === id ? { ...u, [field]: value } : u
    ));
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
            placeholder="qq"
            className="glass border-border focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label>{language === 'zh' ? 'QQ 账号' : 'QQ Account'}</Label>
          <Input
            placeholder="2012345678"
            className="glass border-border focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label>{language === 'zh' ? '昵称' : 'Nickname'}</Label>
          <Input
            placeholder="MoFox"
            className="glass border-border focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Alias Names */}
      <div className="space-y-3">
        <Label>{language === 'zh' ? '别名列表' : 'Alias List'}</Label>
        <div className="flex flex-wrap gap-2 p-3 glass rounded-[var(--radius)] min-h-[60px]">
          {aliases.map((alias) => (
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
          {commandPrefixes.map((prefix) => (
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
          {masterUsers.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center p-3 glass rounded-[var(--radius)]"
            >
              <Input
                value={user.platform}
                onChange={(e) => updateMasterUser(user.id, 'platform', e.target.value)}
                placeholder={language === 'zh' ? '平台 (如: qq)' : 'Platform (e.g., qq)'}
                className="glass border-border focus:border-primary transition-all flex-1"
              />
              <Input
                value={user.userId}
                onChange={(e) => updateMasterUser(user.id, 'userId', e.target.value)}
                placeholder={language === 'zh' ? '用户 ID' : 'User ID'}
                className="glass border-border focus:border-primary transition-all flex-1"
              />
              <button
                onClick={() => removeMasterUser(user.id)}
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
