import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

interface ThemeContextType {
    config: ThemeConfig;
    isLoaded: boolean;
    updateConfig: (newConfig: Partial<ThemeConfig>) => void;
    updateNestedConfig: <K extends keyof ThemeConfig>(
        section: K,
        updates: Partial<ThemeConfig[K]>
    ) => void;
    resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ThemeConfig>(defaultConfig);
    const [isLoaded, setIsLoaded] = useState(false);

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

    useEffect(() => {
        if (!isLoaded) return;

        const root = document.documentElement;
        
        if (config.mode === "dark") {
            root.classList.add("dark");
        } else if (config.mode === "light") {
            root.classList.remove("dark");
        } else {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            if (mediaQuery.matches) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }

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

        root.style.setProperty("--primary", config.customColors.primary);
        root.style.setProperty("--secondary", config.customColors.secondary);
        root.style.setProperty("--accent", config.customColors.accent);
        root.style.fontSize = `${config.accessibility.fontSize}px`;
        
        // Accessibility and Effects class toggling
        root.classList.toggle("reduced-motion", config.accessibility.reducedMotion || !config.effects.animations);
        root.classList.toggle("high-contrast", config.accessibility.highContrast);
        root.classList.toggle("no-shadows", !config.effects.shadows);
        root.classList.toggle("no-blur", !config.effects.blur);

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
        setConfig(prev => {
            const sectionState = prev[section];
            if (typeof sectionState === 'object' && sectionState !== null) {
                return {
                    ...prev,
                    [section]: {
                        ...sectionState,
                        ...updates
                    }
                };
            }
            return {
                ...prev,
                [section]: updates
            };
        });
    };

    const resetToDefault = () => {
        setConfig(defaultConfig);
    };

    const value = {
        config,
        isLoaded,
        updateConfig,
        updateNestedConfig,
        resetToDefault
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}