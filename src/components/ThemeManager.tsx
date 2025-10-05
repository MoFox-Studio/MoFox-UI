import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Palette, Sun, Moon, Monitor, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ThemeConfig {
  mode: "light" | "dark" | "auto";
  preset: string;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    animations: boolean;
    shadows: boolean;
    blur: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: number;
  };
}

const presetThemes = [
  {
    id: "default",
    name: "默认主题",
    description: "经典的蓝色配色方案",
    colors: {
      primary: "#030213",
      secondary: "#ececf0",
      accent: "#e9ebef"
    }
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

export function ThemeManager() {
  const { config, updateConfig, updateNestedConfig, resetToDefault } = useTheme();

  const handleUpdateConfig = (key: keyof typeof config, value: any) => {
    updateConfig({ [key]: value });
  };

  const handleUpdateNestedConfig = (section: keyof typeof config, key: string, value: any) => {
    updateNestedConfig(section, { [key]: value });
  };

  const applyPreset = (presetId: string) => {
    const preset = presetThemes.find(t => t.id === presetId);
    if (preset) {
      updateConfig({
        preset: presetId,
        customColors: preset.colors
      });
      toast.success(`已应用 ${preset.name} 主题`);
    }
  };

  const handleReset = () => {
    resetToDefault();
    toast.success("已重置为默认主题");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <div>
            <h2>主题设置</h2>
            <p className="text-muted-foreground">
              自定义界面外观和配色方案
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleReset}>
          重置为默认
        </Button>
      </div>

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
                onClick={() => handleUpdateConfig("mode", "light")}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Sun className="h-4 w-4" />
                <span className="text-xs">亮色</span>
              </Button>
              <Button
                variant={config.mode === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => handleUpdateConfig("mode", "dark")}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Moon className="h-4 w-4" />
                <span className="text-xs">暗色</span>
              </Button>
              <Button
                variant={config.mode === "auto" ? "default" : "outline"}
                size="sm"
                onClick={() => handleUpdateConfig("mode", "auto")}
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
                onCheckedChange={(checked) => handleUpdateNestedConfig("effects", "animations", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>阴影效果</Label>
                <p className="text-sm text-muted-foreground">显示卡片和按钮阴影</p>
              </div>
              <Switch
                checked={config.effects.shadows}
                onCheckedChange={(checked) => handleUpdateNestedConfig("effects", "shadows", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>模糊效果</Label>
                <p className="text-sm text-muted-foreground">启用毛玻璃效果</p>
              </div>
              <Switch
                checked={config.effects.blur}
                onCheckedChange={(checked) => handleUpdateNestedConfig("effects", "blur", checked)}
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
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  config.preset === theme.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
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
            <div className="space-y-2">
              <Label htmlFor="primary-color">主色调</Label>
              <div className="flex items-center gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={config.customColors.primary}
                  onChange={(e) => handleUpdateNestedConfig("customColors", "primary", e.target.value)}
                  className="w-12 h-10 border border-input rounded-md cursor-pointer"
                />
                <Input
                  value={config.customColors.primary}
                  onChange={(e) => handleUpdateNestedConfig("customColors", "primary", e.target.value)}
                  placeholder="#030213"
                  className="flex-1 font-mono"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">次要色调</Label>
              <div className="flex items-center gap-2">
                <input
                  id="secondary-color"
                  type="color"
                  value={config.customColors.secondary}
                  onChange={(e) => handleUpdateNestedConfig("customColors", "secondary", e.target.value)}
                  className="w-12 h-10 border border-input rounded-md cursor-pointer"
                />
                <Input
                  value={config.customColors.secondary}
                  onChange={(e) => handleUpdateNestedConfig("customColors", "secondary", e.target.value)}
                  placeholder="#ececf0"
                  className="flex-1 font-mono"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accent-color">强调色</Label>
              <div className="flex items-center gap-2">
                <input
                  id="accent-color"
                  type="color"
                  value={config.customColors.accent}
                  onChange={(e) => handleUpdateNestedConfig("customColors", "accent", e.target.value)}
                  className="w-12 h-10 border border-input rounded-md cursor-pointer"
                />
                <Input
                  value={config.customColors.accent}
                  onChange={(e) => handleUpdateNestedConfig("customColors", "accent", e.target.value)}
                  placeholder="#e9ebef"
                  className="flex-1 font-mono"
                />
              </div>
            </div>
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
              onCheckedChange={(checked) => handleUpdateNestedConfig("accessibility", "highContrast", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>减少动画</Label>
              <p className="text-sm text-muted-foreground">减少或禁用动画效果</p>
            </div>
            <Switch
              checked={config.accessibility.reducedMotion}
              onCheckedChange={(checked) => handleUpdateNestedConfig("accessibility", "reducedMotion", checked)}
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
              onValueChange={(value) => handleUpdateNestedConfig("accessibility", "fontSize", value[0])}
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