// 导入React的核心库和钩子
import { useState, useEffect } from 'react';
// 导入用于动画效果的framer-motion库
import { motion } from 'framer-motion';
// 从lucide-react库导入保存图标
import { Save, FileJson, ArrowLeft } from 'lucide-react';
import Editor from '@monaco-editor/react';
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
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [activeConfigFile, setActiveConfigFile] = useState<'bot' | 'model' | 'napcat'>('bot');
  const [editorContent, setEditorContent] = useState('');

  // 状态：机器人配置
  const [botConfig, setBotConfig] = useState<any>(null);
  // 状态：模型配置
  const [modelConfig, setModelConfig] = useState<any>(null);
  // 状态：Napcat适配器配置
  const [napcatConfig, setNapcatConfig] = useState<any>(null);

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

  useEffect(() => {
    if (isEditorMode) {
      let contentToLoad = '';
      if (activeConfigFile === 'bot') {
        contentToLoad = JSON.stringify(botConfig, null, 2);
      } else if (activeConfigFile === 'model') {
        contentToLoad = JSON.stringify(modelConfig, null, 2);
      } else if (activeConfigFile === 'napcat') {
        contentToLoad = JSON.stringify(napcatConfig, null, 2);
      }
      setEditorContent(contentToLoad);
    }
  }, [isEditorMode, activeConfigFile, botConfig, modelConfig, napcatConfig]);


  // 更新机器人配置的状态
  const handleBotConfigChange = (newConfig: any) => setBotConfig(newConfig);
  // 更新模型配置的状态
  const handleModelConfigChange = (newConfig: any) => setModelConfig(newConfig);
  // 更新Napcat配置的状态
  const handleNapcatConfigChange = (newConfig: any) => setNapcatConfig(newConfig);

  const handleSaveFromEditor = async () => {
    setSaving(true);
    try {
      const newConfig = JSON.parse(editorContent);
      let endpoint = '';
      let configSetter: (config: any) => void;
      const configName = `${activeConfigFile}-config.json`;

      if (activeConfigFile === 'bot') {
        endpoint = '/config/bot';
        configSetter = setBotConfig;
      } else if (activeConfigFile === 'model') {
        endpoint = '/config/model';
        configSetter = setModelConfig;
      } else { // napcat
        endpoint = '/config/napcat';
        configSetter = setNapcatConfig;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      if (!res.ok) {
        throw new Error(`保存 ${configName} 失败: ${res.statusText}`);
      }

      configSetter(newConfig);
      toast.success(`${configName} 保存成功!`);

    } catch (error) {
      console.error("保存失败:", error);
      const errorMessage = error instanceof SyntaxError
        ? "JSON 格式无效。请检查您的配置。"
        : `保存更改失败。`;
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // 处理保存所有配置的函数
  const handleSaveAll = async () => {
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

  if (isEditorMode) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-8 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>编辑配置文件</h1>
              <p className="text-muted-foreground mt-2">直接修改JSON源文件</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditorMode(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回配置
            </Button>
          </div>
        </div>

        {/* Editor Section */}
        <div className="flex-grow min-h-0 px-8 pb-8">
          <div className="h-full w-full flex flex-col glass-card p-4" style={{ height: '75vh' }}>
            {/* Tabs */}
            <div className="flex-shrink-0 flex items-center gap-2 mb-4 p-1 glass rounded-[var(--radius)]">
              {(['bot', 'model', 'napcat'] as const).map(file => (
                <Button
                  key={file}
                  variant={activeConfigFile === file ? "default" : "ghost"}
                  onClick={() => setActiveConfigFile(file)}
                  className={`flex-1 transition-all duration-300 ${activeConfigFile === file ? 'text-background' : ''}`}
                  style={{ fontWeight: 600 }}
                >
                  {file}-config.json
                </Button>
              ))}
            </div>
            {/* Editor Wrapper */}
            <div className="flex-grow min-h-0 rounded-[var(--radius)] overflow-hidden relative">
              <Editor
                height="100%"
                language="json"
                value={editorContent}
                onChange={(value) => setEditorContent(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Floating Save Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleSaveFromEditor}
            disabled={saving}
            className="glass-button bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90 rounded-full px-8 py-6 transition-all duration-300 shadow-2xl shadow-primary/15"
            style={{ fontWeight: 600, color: 'var(--glass-button-text)' }}
          >
            {saving ? (
              <>
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
                保存当前文件
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 relative">
      <div className="max-w-7xl mx-auto pb-24">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.config.title}</h1>
                <p className="text-muted-foreground mt-2">{t.nav.config}</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditorMode(true)}>
              <FileJson className="w-4 h-4 mr-2" />
              编辑配置文件
            </Button>
          </div>
        </motion.div>

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
              {config && <Component config={config} onChange={onChange} />}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          onClick={handleSaveAll}
          disabled={saving}
          className="glass-button bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90 rounded-full px-8 py-6 transition-all duration-300 shadow-2xl shadow-primary/15"
          style={{ fontWeight: 600, color: 'var(--glass-button-text)' }}
        >
          {saving ? (
            <>
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
