// 导入React的核心库和钩子
import { useState, useEffect } from 'react';
// 导入用于动画效果的framer-motion库
import { motion } from 'framer-motion';
// 从lucide-react库导入保存图标
import { Save } from 'lucide-react';
// 导入自定义的Button组件
import { Button } from './ui/button';
// 导入sonner库的toast函数，用于显示通知
import { toast } from 'sonner';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../i18n/LanguageContext';
// 导入各个配置卡片组件
import { DatabaseSystemCard } from './config/DatabaseSystemCard';
import { BotIdentityPermissionsCard } from './config/BotIdentityPermissionsCard';
import { AIPersonalityCard } from './config/AIPersonalityCard';
import { ChatInteractionLogicCard } from './config/ChatInteractionLogicCard';
import { RelationshipMemoryCard } from './config/RelationshipMemoryCard';
import { SecurityModulesCard } from './config/SecurityModulesCard';
import { ContentGenerationCard } from './config/ContentGenerationCard';
import { ModelConfigCard } from './config/ModelConfigCard';
import { NapcatConfigCard } from './config/NapcatConfigCard';

// 配置中心主组件
export function ConfigCenter() {
  // 使用语言上下文获取翻译函数
  const { t } = useLanguage();
  // 状态：是否正在保存配置
  const [saving, setSaving] = useState(false);
  // 状态：机器人配置
  const [botConfig, setBotConfig] = useState(null);
  // 状态：模型配置
  const [modelConfig, setModelConfig] = useState(null);
  // 状态：Napcat适配器配置
  const [napcatConfig, setNapcatConfig] = useState(null);

  // 副作用钩子：在组件挂载时从后端获取初始配置
  useEffect(() => {
    Promise.all([
      fetch('/config/bot').then(res => res.json()),
      fetch('/config/model').then(res => res.json()),
      fetch('/config/napcat').then(res => res.json()),
    ]).then(([botData, modelData, napcatData]) => {
      setBotConfig(botData);
      setModelConfig(modelData);
      setNapcatConfig(napcatData);
    }).catch(error => {
      console.error("获取初始配置失败:", error);
      toast.error("从服务器加载配置失败。");
    });
  }, []);

  // 更新机器人配置的状态
  const handleBotConfigChange = (newConfig: any) => setBotConfig(newConfig);
  // 更新模型配置的状态
  const handleModelConfigChange = (newConfig: any) => setModelConfig(newConfig);
  // 更新Napcat配置的状态
  const handleNapcatConfigChange = (newConfig: any) => setNapcatConfig(newConfig);

  // 处理保存所有配置的函数
  const handleSave = async () => {
    setSaving(true);
    try {
      const results = await Promise.all([
        // 保存机器人配置
        fetch('/config/bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(botConfig),
        }),
        // 保存模型配置
        fetch('/config/model', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modelConfig),
        }),
        // 保存Napcat配置
        fetch('/config/napcat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(napcatConfig),
        }),
      ]);

      // 检查所有请求是否成功
      for (const res of results) {
        if (!res.ok) {
          throw new Error(`保存配置文件失败: ${res.statusText}`);
        }
      }

      toast.success(t.config.saveSuccess, {
        description: t.config.saveSuccess,
      });
    } catch (error) {
      console.error("保存失败:", error);
      toast.error("保存更改失败。");
    } finally {
      setSaving(false);
    }
  };

  // 定义配置卡片的数组，方便统一渲染
  const configCards = [
    { Component: DatabaseSystemCard, key: 'database', config: botConfig, onChange: handleBotConfigChange },
    { Component: BotIdentityPermissionsCard, key: 'identity', config: botConfig, onChange: handleBotConfigChange },
    { Component: AIPersonalityCard, key: 'personality', config: botConfig, onChange: handleBotConfigChange },
    { Component: ChatInteractionLogicCard, key: 'chat', config: botConfig, onChange: handleBotConfigChange },
    { Component: RelationshipMemoryCard, key: 'memory', config: botConfig, onChange: handleBotConfigChange },
    { Component: SecurityModulesCard, key: 'security', config: botConfig, onChange: handleBotConfigChange },
    { Component: ContentGenerationCard, key: 'content', config: botConfig, onChange: handleBotConfigChange },
    { Component: ModelConfigCard, key: 'model', config: modelConfig, onChange: handleModelConfigChange },
    { Component: NapcatConfigCard, key: 'napcat', config: napcatConfig, onChange: handleNapcatConfigChange },
  ];

  // 如果配置仍在加载中，显示加载提示
  if (!botConfig || !modelConfig || !napcatConfig) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>正在加载配置...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-8 relative">
      <div className="max-w-7xl mx-auto pb-24">
        {/* 页面标题 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.config.title}</h1>
          <p className="text-muted-foreground mt-2">{t.nav.config}</p>
        </motion.div>

        {/* 配置卡片列表 */}
        <div className="space-y-6">
          {configCards.map(({ Component, key, config, onChange }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {/* 仅在配置加载后渲染组件 */}
              {config && <Component config={config} onChange={onChange} />}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 浮动保存按钮 */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          onClick={handleSave}
          disabled={saving}
          className="glass-button bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90 rounded-full px-8 py-6 transition-all duration-300 shadow-2xl shadow-primary/15"
          style={{ fontWeight: 600, color: 'var(--glass-button-text)' }}
        >
          {saving ? (
            <>
              {/* 保存中的加载动画 */}
              <motion.div 
                className="w-5 h-5 border-2 border-background border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {t.common.saving}
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {t.config.saveChanges}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
