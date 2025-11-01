// 导入React的核心库和钩子
import { useState } from 'react';
// 导入framer-motion库，用于实现动画效果
import { motion, AnimatePresence } from 'framer-motion';
// 从lucide-react库导入图标组件
import { Database, Folder } from 'lucide-react';
// 导入自定义的UI组件
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../../i18n/LanguageContext';

// 定义数据库类型
type DatabaseType = 'sqlite' | 'mysql';

// 数据库系统配置卡片组件
export function DatabaseSystemCard() {
  const { t } = useLanguage();
  // 状态管理
  const [databaseType, setDatabaseType] = useState<DatabaseType>('sqlite');
  const [sqlitePath, setSqlitePath] = useState('/data/mofox.db');
  const [mysqlAutocommit, setMysqlAutocommit] = useState(true);
  const [eulaConfirmed, setEulaConfirmed] = useState(false);

  return (
    <div className="glass-card p-6 space-y-6">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3">
        <Database className="w-5 h-5 text-primary" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.config.database.title}</h3>
      </div>

      {/* 数据库类型选择器 */}
      <div className="space-y-3">
        <Label>{t.config.database.type}</Label>
        <div className="glass rounded-[var(--radius)] p-1 flex gap-1 relative">
          <motion.div
            className="absolute inset-1 bg-primary rounded-[var(--radius-sm)]"
            initial={false}
            animate={{ x: databaseType === 'sqlite' ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: 'calc(50% - 2px)' }}
          />
          <button
            onClick={() => setDatabaseType('sqlite')}
            className={`flex-1 py-2 px-4 rounded-[var(--radius-sm)] transition-colors duration-300 relative z-10 ${
              databaseType === 'sqlite' ? 'text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontWeight: 600 }}
          >
            SQLite
          </button>
          <button
            onClick={() => setDatabaseType('mysql')}
            className={`flex-1 py-2 px-4 rounded-[var(--radius-sm)] transition-colors duration-300 relative z-10 ${
              databaseType === 'mysql' ? 'text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontWeight: 600 }}
          >
            MySQL
          </button>
        </div>
      </div>

      {/* SQLite 配置 */}
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

      {/* MySQL 配置 */}
      <AnimatePresence mode="wait">
        {databaseType === 'mysql' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* ... MySQL specific configuration fields ... */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 环境变量 */}
      <div className="border-t border-border pt-4 space-y-4">
        <h4 style={{ fontWeight: 600 }}>环境变量</h4>
        {/* ... Environment variable fields ... */}
      </div>
    </div>
  );
}
