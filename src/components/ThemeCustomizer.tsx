// 导入React的核心库和钩子
import { useState, useEffect } from 'react';
// 导入framer-motion库，用于实现动画效果
import { motion, type Variants } from 'framer-motion';
// 从lucide-react库导入图标组件
import { Palette, Check } from 'lucide-react';
// 导入自定义的Button组件
import { Button } from './ui/button';
// 导入自定义的Label组件
import { Label } from './ui/label';
// 导入sonner库的toast函数，用于显示通知
import { toast } from 'sonner';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../i18n/LanguageContext';

// 定义主题对象的接口
interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
}

// 定义ThemeCustomizer组件的属性接口
interface ThemeCustomizerProps {
  currentTheme: Theme | null;
  onApplyTheme: (theme: Theme) => void;
}

// 获取预设主题列表的函数
const getPresetThemes = (language: 'zh' | 'en'): Theme[] => [
  // ... 此处省略了预设主题数据
];

// 主题定制器组件
export function ThemeCustomizer({ currentTheme, onApplyTheme }: ThemeCustomizerProps) {
  const { t, language } = useLanguage();
  const presetThemes = getPresetThemes(language);
  const [selectedTheme, setSelectedTheme] = useState('default');
  // 自定义颜色状态
  const [customPrimary, setCustomPrimary] = useState('#00F5FF');
  const [customSecondary, setCustomSecondary] = useState('#7F00FF');
  const [customBackground, setCustomBackground] = useState('#1A1A2E');

  // 副作用钩子：当外部传入的currentTheme变化时，更新内部状态
  useEffect(() => {
    if (currentTheme) {
      setSelectedTheme(currentTheme.id);
      if (currentTheme.id === 'custom') {
        setCustomPrimary(currentTheme.primary);
        setCustomSecondary(currentTheme.secondary);
        setCustomBackground(currentTheme.background);
      }
    }
  }, [currentTheme]);

  // 应用主题的函数
  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme.id);
    onApplyTheme(theme);
    toast.success(t.theme.themeApplied, {
      description: language === 'zh' ? `已切换到 ${theme.name}` : `Switched to ${theme.name}`,
    });
  };

  // 动画变体定义
  const containerVariants = { /* ... */ };
  const itemVariants: Variants = { /* ... */ };

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div /* ... */ >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.theme.title}</h1>
          <p className="text-muted-foreground mt-2">{language === 'zh' ? '选择预设主题或自定义配色方案' : 'Choose a preset theme or customize your color scheme'}</p>
        </motion.div>

        <div className="space-y-6">
          {/* 预设主题部分 */}
          <motion.div /* ... */ >
            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {t.theme.presetThemes}
            </h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {presetThemes.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => applyTheme(theme)}
                  // ... 其他样式和动画属性
                >
                  {/* ... 主题卡片内容 ... */}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* 自定义主题部分 */}
          <motion.div 
            className="glass rounded-[var(--radius-lg)] p-6 space-y-6"
            // ... 动画属性
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.theme.customTheme}</h3>
            </div>

            {/* 颜色选择器 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ... 主色、次色、背景色选择器 ... */}
            </div>

            {/* 实时预览 */}
            <div className="border-t border-border pt-6">
              {/* ... 预览UI ... */}
            </div>

            {/* 应用自定义主题按钮 */}
            <Button
              onClick={() => {
                const customTheme: Theme = {
                  id: 'custom',
                  name: language === 'zh' ? '自定义主题' : 'Custom Theme',
                  primary: customPrimary,
                  secondary: customSecondary,
                  background: customBackground,
                };
                applyTheme(customTheme);
              }}
              // ... 按钮样式
            >
              {t.theme.applyTheme}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
