import { useState, useEffect } from "react";

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

const defaultConfig: ThemeConfig = {
  mode: "light",
  preset: "default",
  customColors: {
    primary: "#030213",
    secondary: "#ececf0",
    accent: "#e9ebef"
  },
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

export function useTheme() {
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载主题配置
  useEffect(() => {
    const loadThemeConfig = () => {
      try {
        const savedConfig = localStorage.getItem("mofox_theme_config");
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig({ ...defaultConfig, ...parsedConfig });
        }
      } catch (error) {
        console.error("Failed to load theme config:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemeConfig();
  }, []);

  // 应用主题到页面
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    
    // 应用颜色模式
    if (config.mode === "dark") {
      root.classList.add("dark");
    } else if (config.mode === "light") {
      root.classList.remove("dark");
    } else {
      // auto mode - 跟随系统
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // 监听系统主题变化
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // 应用自定义颜色
    root.style.setProperty("--primary", config.customColors.primary);
    root.style.setProperty("--secondary", config.customColors.secondary);
    root.style.setProperty("--accent", config.customColors.accent);

    // 应用可访问性设置
    root.style.fontSize = `${config.accessibility.fontSize}px`;
    
    if (config.accessibility.reducedMotion) {
      root.style.setProperty("--animation-duration", "0s");
    } else {
      root.style.removeProperty("--animation-duration");
    }

    // 应用高对比度
    if (config.accessibility.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // 应用视觉效果
    if (!config.effects.animations) {
      root.style.setProperty("--animation-duration", "0s");
      root.style.setProperty("--transition-duration", "0s");
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
    }

    // 保存到localStorage
    try {
      localStorage.setItem("mofox_theme_config", JSON.stringify(config));
    } catch (error) {
      console.error("Failed to save theme config:", error);
    }
  }, [config, isLoaded]);

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateNestedConfig = <K extends keyof ThemeConfig>(
    section: K,
    updates: Partial<ThemeConfig[K]>
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
  };

  return {
    config,
    isLoaded,
    updateConfig,
    updateNestedConfig,
    resetToDefault
  };
}