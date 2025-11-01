// 导入React的核心库和钩子
import { Wifi } from 'lucide-react';
// 导入自定义的UI组件
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// Napcat适配器配置卡片组件
export function NapcatConfigCard({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  const { t } = useLanguage();

  // 更新配置的辅助函数
  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config)); // 深拷贝
    let current = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {};
    }
    current[keys[keys.length - 1]] = value;
    onChange(newConfig);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <Wifi className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Napcat Adapter</h3>
      </div>

      {/* 启用插件开关 */}
      <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
        <div className="space-y-1">
          <Label>启用插件</Label>
          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            是否启用 Napcat QQ 适配器
          </p>
        </div>
        <Switch 
          checked={config.plugin?.enabled || false} 
          onCheckedChange={(checked) => handleUpdate('plugin.enabled', checked)} 
        />
      </div>

      {/* 服务器连接配置 */}
      <div className="space-y-4">
        <h4 style={{ fontWeight: 600 }}>服务器连接</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* 连接模式 */}
          <div className="space-y-2">
            <Label>连接模式</Label>
            <Select
              value={config.napcat_server?.mode || 'reverse'}
              onValueChange={(value) => handleUpdate('napcat_server.mode', value)}
            >
              <SelectTrigger className="glass border-border focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reverse">反向 (reverse)</SelectItem>
                <SelectItem value="forward">正向 (forward)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* 主机 */}
          <div className="space-y-2">
            <Label>主机</Label>
            <Input
              value={config.napcat_server?.host || ''}
              onChange={(e) => handleUpdate('napcat_server.host', e.target.value)}
              className="glass border-border focus:border-primary transition-all"
            />
          </div>
          {/* 端口 */}
          <div className="space-y-2">
            <Label>端口</Label>
            <Input
              type="number"
              value={config.napcat_server?.port || ''}
              onChange={(e) => handleUpdate('napcat_server.port', parseInt(e.target.value) || 0)}
              className="glass border-border focus:border-primary transition-all"
            />
          </div>
          {/* Access Token */}
          <div className="space-y-2">
            <Label>Access Token</Label>
            <Input
              type="password"
              value={config.napcat_server?.access_token || ''}
              onChange={(e) => handleUpdate('napcat_server.access_token', e.target.value)}
              className="glass border-border focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}