// 导入React的核心库和钩子
import { useState, useEffect } from 'react';
// 从lucide-react库导入图标组件
import { Bot, X, Plus } from 'lucide-react';
// 导入自定义的UI组件
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// 定义Master用户的接口
interface MasterUser {
  id: string;
  platform: string;
  userId: string;
}

// 机器人身份与权限配置卡片组件
export function BotIdentityPermissionsCard() {
  const { t, language } = useLanguage();
  // 状态管理
  const [platform, setPlatform] = useState('');
  const [qqAccount, setQqAccount] = useState('');
  const [nickname, setNickname] = useState('');
  const [aliases, setAliases] = useState<string[]>([]);
  const [commandPrefixes, setCommandPrefixes] = useState<string[]>([]);
  const [masterUsers, setMasterUsers] = useState<MasterUser[]>([]);
  
  // 输入框临时状态
  const [aliasInput, setAliasInput] = useState('');
  const [prefixInput, setPrefixInput] = useState('');

  // 副作用钩子：从后端获取初始配置
  useEffect(() => {
    fetch('/config/bot')
      .then(res => res.json())
      .then(data => {
        setPlatform(data.bot.platform);
        setQqAccount(data.bot.qq_account);
        setNickname(data.bot.nickname);
        setAliases(data.bot.alias_names);
        setCommandPrefixes(data.command.command_prefixes);
        setMasterUsers(data.permission.master_users.map((user: string[], index: number) => ({
          id: index.toString(),
          platform: user[0],
          userId: user[1],
        })));
      });
  }, []);

  // 添加别名
  const addAlias = () => {
    if (aliasInput.trim() && !aliases.includes(aliasInput.trim())) {
      setAliases([...aliases, aliasInput.trim()]);
      setAliasInput('');
    }
  };

  // 移除别名
  const removeAlias = (alias: string) => {
    setAliases(aliases.filter(a => a !== alias));
  };

  // 添加命令前缀
  const addPrefix = () => {
    if (prefixInput.trim() && !commandPrefixes.includes(prefixInput.trim())) {
      setCommandPrefixes([...commandPrefixes, prefixInput.trim()]);
      setPrefixInput('');
    }
  };

  // 移除命令前缀
  const removePrefix = (prefix: string) => {
    setCommandPrefixes(commandPrefixes.filter(p => p !== prefix));
  };

  // 添加Master用户
  const addMasterUser = () => {
    setMasterUsers([
      ...masterUsers,
      { id: Date.now().toString(), platform: '', userId: '' }
    ]);
  };

  // 移除Master用户
  const removeMasterUser = (id: string) => {
    setMasterUsers(masterUsers.filter(u => u.id !== id));
  };

  // 更新Master用户信息
  const updateMasterUser = (id: string, field: 'platform' | 'userId', value: string) => {
    setMasterUsers(masterUsers.map(u => 
      u.id === id ? { ...u, [field]: value } : u
    ));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <Bot className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.bot.title}</h3>
      </div>

      {/* 基础信息表单 */}
      {/* ... */}

      {/* 别名列表管理 */}
      {/* ... */}

      {/* 命令前缀管理 */}
      {/* ... */}

      {/* Master用户管理 */}
      {/* ... */}
    </div>
  );
}
