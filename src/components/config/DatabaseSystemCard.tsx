import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Folder } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { useLanguage } from '../../i18n/LanguageContext';

type DatabaseType = 'sqlite' | 'mysql';

export function DatabaseSystemCard() {
  const { t } = useLanguage();
  const [databaseType, setDatabaseType] = useState<DatabaseType>('sqlite');
  const [sqlitePath, setSqlitePath] = useState('/data/mofox.db');
  const [mysqlAutocommit, setMysqlAutocommit] = useState(true);
  const [eulaConfirmed, setEulaConfirmed] = useState(false);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.database.title}</h3>
      </div>

      {/* Database Type Segmented Control */}
      <div className="space-y-3">
        <Label>{t.config.database.type}</Label>
        <div className="glass rounded-[var(--radius)] p-1 flex gap-1 relative">
          <motion.div
            className="absolute inset-1 bg-primary rounded-[var(--radius-sm)]"
            initial={false}
            animate={{
              x: databaseType === 'sqlite' ? 0 : '100%',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: 'calc(50% - 2px)' }}
          />
          <button
            onClick={() => setDatabaseType('sqlite')}
            className={`flex-1 py-2 px-4 rounded-[var(--radius-sm)] transition-all duration-300 relative z-10 ${
              databaseType === 'sqlite'
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontWeight: 600 }}
          >
            SQLite
          </button>
          <button
            onClick={() => setDatabaseType('mysql')}
            className={`flex-1 py-2 px-4 rounded-[var(--radius-sm)] transition-all duration-300 relative z-10 ${
              databaseType === 'mysql'
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontWeight: 600 }}
          >
            MySQL
          </button>
        </div>
      </div>

      {/* SQLite Configuration */}
      <AnimatePresence mode="wait">
        {databaseType === 'sqlite' && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
          <div className="space-y-2">
            <Label>{t.config.database.database} (SQLite)</Label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={sqlitePath}
                onChange={(e) => setSqlitePath(e.target.value)}
                className="glass border-border focus:border-primary transition-all pl-10"
                placeholder="/data/mofox.db"
              />
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* MySQL Configuration */}
      <AnimatePresence mode="wait">
        {databaseType === 'mysql' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
          {/* Basic Connection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.config.database.host}</Label>
              <Input
                placeholder="localhost"
                className="glass border-border focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.config.database.port}</Label>
              <Input
                type="number"
                placeholder="3306"
                className="glass border-border focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.config.database.database}</Label>
              <Input
                placeholder="mofox"
                className="glass border-border focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.config.database.username}</Label>
              <Input
                placeholder="root"
                className="glass border-border focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.config.database.password}</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="glass border-border focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label>Charset</Label>
              <Input
                placeholder="utf8mb4"
                className="glass border-border focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="border-t border-border pt-4 space-y-4">
            <h4 style={{ fontWeight: 600 }}>高级与连接池</h4>
            
            <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)]">
              <div className="space-y-1">
                <Label>自动提交</Label>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  启用自动提交事务
                </p>
              </div>
              <Switch checked={mysqlAutocommit} onCheckedChange={setMysqlAutocommit} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>SQL 模式</Label>
                <Input
                  placeholder="STRICT_TRANS_TABLES"
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label>连接池大小</Label>
                <Input
                  type="number"
                  placeholder="10"
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label>连接超时 (秒)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  className="glass border-border focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Environment Variables */}
      <div className="border-t border-border pt-4 space-y-4">
        <h4 style={{ fontWeight: 600 }}>环境变量</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>主机</Label>
            <Input
              placeholder="0.0.0.0"
              className="glass border-border focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label>端口</Label>
            <Input
              type="number"
              placeholder="8080"
              className="glass border-border focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 glass rounded-[var(--radius)]">
          <Checkbox
            id="eula"
            checked={eulaConfirmed}
            onCheckedChange={(checked) => setEulaConfirmed(checked as boolean)}
          />
          <div className="space-y-1">
            <Label htmlFor="eula" className="cursor-pointer">
              EULA 确认
            </Label>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              我已阅读并同意最终用户许可协议
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
