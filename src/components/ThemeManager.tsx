import React, { Dispatch, SetStateAction, useState } from "react";
import { SketchPicker, ColorResult } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Palette, Sun, Moon, Monitor, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";

type ThemeMode = "light" | "dark" | "auto";
type CustomColors = {
  primary: string;
  secondary: string;
  accent: string;
};
type Effects = {
  animations: boolean;
  shadows: boolean;
  blur: boolean;
};
type Accessibility = {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
};

export interface ThemeConfig {
  mode: ThemeMode;
  preset: string;
  customColors: CustomColors;
  effects: Effects;
  accessibility: Accessibility;
}

export const DEFAULT_THEME_COLORS_LIGHT = {
  primary: "#030213",
  secondary: "#ececf0",
  accent: "#e9ebef",
};

export const DEFAULT_THEME_COLORS_DARK = {
  primary: "#E5E7EB",
  secondary: "#1F2937",
  accent: "#374151",
};

export const defaultConfig: ThemeConfig = {
  mode: "light",
  preset: "default",
  customColors: DEFAULT_THEME_COLORS_LIGHT,
  effects: {
    animations: true,
    shadows: true,
    blur: true
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 16
  }
};

const presetThemes = [
  {
    id: "default",
    name: "默认主题",
    description: "经典的蓝色配色方案",
    colors: DEFAULT_THEME_COLORS_LIGHT,
  },
  {
    id: "ocean",
    name: "海洋蓝",
    description: "深邃的海洋配色",
    colors: {
      primary: "#0066cc",
      secondary: "#e6f3ff",
      accent: "#b3daff"
    }
  },
  {
    id: "forest",
    name: "森林绿",
    description: "自然的绿色主题",
    colors: {
      primary: "#22c55e",
      secondary: "#f0fdf4",
      accent: "#bbf7d0"
    }
  },
  {
    id: "sunset",
    name: "夕阳橙",
    description: "温暖的橙色调",
    colors: {
      primary: "#f97316",
      secondary: "#fff7ed",
      accent: "#fed7aa"
    }
  },
  {
    id: "purple",
    name: "紫罗兰",
    description: "优雅的紫色系",
    colors: {
      primary: "#8b5cf6",
      secondary: "#faf5ff",
      accent: "#ddd6fe"
    }
  },
  {
    id: "rose",
    name: "玫瑰粉",
    description: "柔和的粉色主题",
    colors: {
      primary: "#f43f5e",
      secondary: "#fff1f2",
      accent: "#fecdd3"
    }
  }
];

interface ThemeManagerProps {
  config: ThemeConfig;
  setConfig: Dispatch<SetStateAction<ThemeConfig>>;
}

export function ThemeManager({ config, setConfig }: ThemeManagerProps) {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const updateConfig = (key: keyof ThemeConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      if (key === 'mode' && newConfig.preset === 'default') {
        newConfig.customColors = value === 'dark'
          ? DEFAULT_THEME_COLORS_DARK
          : DEFAULT_THEME_COLORS_LIGHT;
      }
      return newConfig;
    });
  };

  const updateNestedConfig = (
    section: keyof ThemeConfig,
    key: string,
    value: boolean | string | number
  ) => {
    setConfig(prev => {
      const sectionData = prev[section] as Record<string, any>;
      const newConfig = {
        ...prev,
        [section]: {
          ...sectionData,
          [key]: value
        }
      };
      if (section === 'customColors') {
        newConfig.preset = 'custom';
      }
      return newConfig;
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = presetThemes.find(t => t.id === presetId);
    if (preset) {
      let newColors = preset.colors;
      if (preset.id === 'default' && config.mode === 'dark') {
        newColors = DEFAULT_THEME_COLORS_DARK;
      }
      setConfig(prev => ({
        ...prev,
        preset: presetId,
        customColors: newColors
      }));
      toast.success(`已应用 ${preset.name} 主题`);
    }
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
    toast.success("已重置为默认主题");
  };

  return (
    <div className="space-y-6">
      {/* 头部标题 */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-semibold">主题设置</h2>
            <p className="text-sm text-muted-foreground">
              自定义界面外观和配色方案
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          重置为默认
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 显示模式 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              显示模式
            </CardTitle>
            <CardDescription>选择亮色、暗色或跟随系统</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={config.mode === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig("mode", "light")}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Sun className="h-4 w-4" />
                <span className="text-xs">亮色</span>
              </Button>
              <Button
                variant={config.mode === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig("mode", "dark")}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Moon className="h-4 w-4" />
                <span className="text-xs">暗色</span>
              </Button>
              <Button
                variant={config.mode === "auto" ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig("mode", "auto")}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Monitor className="h-4 w-4" />
                <span className="text-xs">自动</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 视觉效果 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              视觉效果
            </CardTitle>
            <CardDescription>配置界面动画和效果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>动画效果</Label>
                <p className="text-sm text-muted-foreground">启用页面过渡动画</p>
              </div>
              <Switch
                checked={config.effects.animations}
                onCheckedChange={(checked: boolean) => updateNestedConfig("effects", "animations", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>阴影效果</Label>
                <p className="text-sm text-muted-foreground">显示卡片和按钮阴影</p>
              </div>
              <Switch
                checked={config.effects.shadows}
                onCheckedChange={(checked: boolean) => updateNestedConfig("effects", "shadows", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>模糊效果</Label>
                <p className="text-sm text-muted-foreground">启用毛玻璃效果</p>
              </div>
              <Switch
                checked={config.effects.blur}
                onCheckedChange={(checked: boolean) => updateNestedConfig("effects", "blur", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 预设主题 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">预设主题</CardTitle>
          <CardDescription>选择一个预设的配色方案</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetThemes.map((theme) => (
              <div
                key={theme.id}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                  config.preset === theme.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => applyPreset(theme.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm">{theme.name}</h4>
                  {config.preset === theme.id && (
                    <Badge variant="default" className="text-xs">当前</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {theme.description}
                </p>
                <div className="flex gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 自定义颜色 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">自定义颜色</CardTitle>
          <CardDescription>自定义主要配色方案</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorPickerInput
              label="主色调"
              color={config.customColors.primary}
              onChange={(color) => updateNestedConfig("customColors", "primary", color)}
              pickerId="primary"
              activePicker={activeColorPicker}
              setActivePicker={setActiveColorPicker}
            />
            <ColorPickerInput
              label="次要色调"
              color={config.customColors.secondary}
              onChange={(color) => updateNestedConfig("customColors", "secondary", color)}
              pickerId="secondary"
              activePicker={activeColorPicker}
              setActivePicker={setActiveColorPicker}
            />
            <ColorPickerInput
              label="强调色"
              color={config.customColors.accent}
              onChange={(color) => updateNestedConfig("customColors", "accent", color)}
              pickerId="accent"
              activePicker={activeColorPicker}
              setActivePicker={setActiveColorPicker}
            />
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label>颜色预览</Label>
                <p className="text-sm text-muted-foreground">实时预览当前配色效果</p>
              </div>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded-md border shadow-sm"
                  style={{ backgroundColor: config.customColors.primary }}
                  title="主色调"
                />
                <div 
                  className="w-8 h-8 rounded-md border shadow-sm"
                  style={{ backgroundColor: config.customColors.secondary }}
                  title="次要色调"
                />
                <div 
                  className="w-8 h-8 rounded-md border shadow-sm"
                  style={{ backgroundColor: config.customColors.accent }}
                  title="强调色"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 可访问性设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            可访问性
          </CardTitle>
          <CardDescription>优化视觉体验和易用性</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>高对比度</Label>
              <p className="text-sm text-muted-foreground">增强颜色对比度</p>
            </div>
            <Switch
              checked={config.accessibility.highContrast}
              onCheckedChange={(checked: boolean) => updateNestedConfig("accessibility", "highContrast", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>减少动画</Label>
              <p className="text-sm text-muted-foreground">减少或禁用动画效果</p>
            </div>
            <Switch
              checked={config.accessibility.reducedMotion}
              onCheckedChange={(checked: boolean) => updateNestedConfig("accessibility", "reducedMotion", checked)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>字体大小</Label>
              <span className="text-sm text-muted-foreground">
                {config.accessibility.fontSize}px
              </span>
            </div>
            <Slider
              value={[config.accessibility.fontSize]}
              onValueChange={(value: number[]) => updateNestedConfig("accessibility", "fontSize", value[0])}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>小</span>
              <span>中</span>
              <span>大</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ColorPickerInputProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  pickerId: string;
  activePicker: string | null;
  setActivePicker: (id: string | null) => void;
}

function ColorPickerInput({
  label,
  color,
  onChange,
  pickerId,
  activePicker,
  setActivePicker
}: ColorPickerInputProps) {
  const handleColorChange = (colorResult: ColorResult) => {
    onChange(colorResult.hex);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Popover open={activePicker === pickerId} onOpenChange={(isOpen) => setActivePicker(isOpen ? pickerId : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border border-input rounded-md cursor-pointer"
              style={{ backgroundColor: color }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <SketchPicker
              color={color}
              onChangeComplete={handleColorChange}
            />
          </PopoverContent>
        </Popover>
        <Input
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 font-mono"
        />
      </div>
    </div>
  );
}