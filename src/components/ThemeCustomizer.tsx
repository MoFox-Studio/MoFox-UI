import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../i18n/LanguageContext';

interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
}

interface ThemeCustomizerProps {
  currentTheme: Theme | null;
  onApplyTheme: (theme: Theme) => void;
}

const getPresetThemes = (language: 'zh' | 'en'): Theme[] => [
  {
    id: 'default',
    name: language === 'zh' ? '默认主题' : 'Default',
    primary: '#00F5FF',
    secondary: '#7F00FF',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 25%, #1A1A2E 50%, #0F3460 75%, #1A1A2E 100%)',
  },
  {
    id: 'ocean',
    name: language === 'zh' ? '深海蓝' : 'Ocean Blue',
    primary: '#00D9FF',
    secondary: '#0066FF',
    background: 'linear-gradient(135deg, #0A1931 0%, #0F2557 50%, #0A1931 100%)',
  },
  {
    id: 'sunset',
    name: language === 'zh' ? '霞光紫' : 'Sunset Purple',
    primary: '#FF00FF',
    secondary: '#FF6B35',
    background: 'linear-gradient(135deg, #1A0E2E 0%, #2E1A47 50%, #1A0E2E 100%)',
  },
  {
    id: 'emerald',
    name: language === 'zh' ? '翡翠绿' : 'Emerald Green',
    primary: '#00FF88',
    secondary: '#00D9A3',
    background: 'linear-gradient(135deg, #0A2E1A 0%, #0F4C2E 50%, #0A2E1A 100%)',
  },
  {
    id: 'crimson',
    name: language === 'zh' ? '赤红' : 'Crimson',
    primary: '#FF3366',
    secondary: '#FF6B9D',
    background: 'linear-gradient(135deg, #2E0A1A 0%, #4C0F2E 50%, #2E0A1A 100%)',
  },
  {
    id: 'amber',
    name: language === 'zh' ? '琥珀金' : 'Amber Gold',
    primary: '#FFB800',
    secondary: '#FF8C00',
    background: 'linear-gradient(135deg, #2E1A0A 0%, #4C2E0F 50%, #2E1A0A 100%)',
  },
];

export function ThemeCustomizer({ currentTheme, onApplyTheme }: ThemeCustomizerProps) {
  const { t, language } = useLanguage();
  const presetThemes = getPresetThemes(language);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [customPrimary, setCustomPrimary] = useState('#00F5FF');
  const [customSecondary, setCustomSecondary] = useState('#7F00FF');
  const [customBackground, setCustomBackground] = useState('#1A1A2E');

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

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme.id);
    onApplyTheme(theme);
    toast.success(t.theme.themeApplied, {
      description: language === 'zh' ? `已切换到 ${theme.name}` : `Switched to ${theme.name}`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.theme.title}</h1>
          <p className="text-muted-foreground mt-2">{language === 'zh' ? '选择预设主题或自定义配色方案' : 'Choose a preset theme or customize your color scheme'}</p>
        </motion.div>

        {/* Preset Themes */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {t.theme.presetThemes}
            </h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {presetThemes.map((theme, index) => (
                <motion.button
                  variants={itemVariants}
                  key={theme.id}
                  onClick={() => applyTheme(theme)}
                  className={`glass rounded-[var(--radius-lg)] p-6 text-left transition-all duration-300 hover:scale-[1.02] relative ${
                    selectedTheme === theme.id ? 'border-primary' : 'glass-hover'
                  }`}
                >
                  {selectedTheme === theme.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-background" />
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 style={{ fontWeight: 600 }}>{theme.name}</h4>
                  </div>

                  {/* Color Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-border"
                        style={{ background: theme.primary }}
                      />
                      <span className="text-sm text-muted-foreground">{t.theme.primaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-border"
                        style={{ background: theme.secondary }}
                      />
                      <span className="text-sm text-muted-foreground">{t.theme.secondaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-border"
                        style={{ background: theme.background }}
                      />
                      <span className="text-sm text-muted-foreground">{t.theme.backgroundColor}</span>
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div
                    className="mt-4 p-4 rounded-lg border border-border"
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <div
                      className="text-sm mb-2"
                      style={{ color: theme.primary, fontWeight: 600 }}
                    >
                      {language === 'zh' ? '预览效果' : 'Preview'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'zh' ? '这是一段示例文本' : 'Sample text preview'}
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Custom Theme */}
          <motion.div 
            className="glass rounded-[var(--radius-lg)] p-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.theme.customTheme}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label>{t.theme.primaryColor}</Label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border glass"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">HEX</div>
                    <div style={{ fontWeight: 500 }}>{customPrimary}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>{t.theme.secondaryColor}</Label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border glass"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">HEX</div>
                    <div style={{ fontWeight: 500 }}>{customSecondary}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>{t.theme.backgroundColor}</Label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customBackground}
                    onChange={(e) => setCustomBackground(e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border glass"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">HEX</div>
                    <div style={{ fontWeight: 500 }}>{customBackground}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border-t border-border pt-6">
              <Label className="mb-4 block">{language === 'zh' ? '实时预览' : 'Live Preview'}</Label>
              <div className="glass rounded-[var(--radius-lg)] p-6 space-y-4">
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    borderColor: customPrimary,
                    background: `${customPrimary}20`,
                  }}
                >
                  <p style={{ color: customPrimary, fontWeight: 600 }}>{language === 'zh' ? '主色调示例' : 'Primary Color Sample'}</p>
                  <p className="text-sm text-muted-foreground mt-1">{language === 'zh' ? '这是使用主色调的文本' : 'Text using primary color'}</p>
                </div>

                <div
                  className="p-4 rounded-lg border"
                  style={{
                    borderColor: customSecondary,
                    background: `${customSecondary}20`,
                  }}
                >
                  <p style={{ color: customSecondary, fontWeight: 600 }}>{language === 'zh' ? '强调色示例' : 'Secondary Color Sample'}</p>
                  <p className="text-sm text-muted-foreground mt-1">{language === 'zh' ? '这是使用强调色的文本' : 'Text using secondary color'}</p>
                </div>
              </div>
            </div>

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
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background rounded-[var(--radius)] py-6 glow-primary"
              style={{ fontWeight: 600 }}
            >
              {t.theme.applyTheme}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
