import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { DatabaseConfig } from "./config/DatabaseConfig";
import { BotConfig } from "./config/BotConfig";
import { PersonalityConfig } from "./config/PersonalityConfig";
import { SecurityConfig } from "./config/SecurityConfig";
import { ModelConfig } from "./config/ModelConfig";
import { FeatureConfig } from "./config/FeatureConfig";
import { Button } from "./ui/button";
import { Save, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { FullConfig } from "./config/types";
import { defaultConfig } from "./config/defaults";
import { parse as parseToml, stringify } from '@ltd/j-toml';

interface ConfigurationManagerProps {
  directoryHandle: FileSystemDirectoryHandle | null;
  sharedUserId: string;
  setSharedUserId: (id: string) => void;
  masterUsers: [string, string][];
  setMasterUsers: React.Dispatch<React.SetStateAction<[string, string][]>>;
  configPath: string;
  fetchConfig: () => void;
}

export function ConfigurationManager({
  directoryHandle,
  sharedUserId,
  setSharedUserId,
  masterUsers,
  setMasterUsers,
  configPath,
  fetchConfig,
}: ConfigurationManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<FullConfig>(defaultConfig);

  useEffect(() => {
    const loadConfig = async () => {
      if (directoryHandle) {
        try {
          const botDir = await directoryHandle.getDirectoryHandle('Bot');
          const configDir = await botDir.getDirectoryHandle('config');
          const configFileHandle = await configDir.getFileHandle('bot_config.toml');
          const file = await configFileHandle.getFile();
          const text = await file.text();
          const parsedConfig = parseToml(text, { joiner: '\n' } as any);
          setConfig(parsedConfig as unknown as FullConfig);
          toast.success("配置文件已加载");
        } catch (error) {
          toast.error("加载配置文件失败", { description: String(error) });
        }
      }
    };
    loadConfig();
  }, [directoryHandle, masterUsers]);

  const updateConfig = (section: keyof FullConfig, key: string, value: any) => {
    setConfig(prev => {
        const newConfig = { ...prev };
        const keys = key.split('.');
        
        let currentLevel = newConfig[section] as any;
        for (let i = 0; i < keys.length - 1; i++) {
            if (currentLevel[keys[i]] === undefined) {
                currentLevel[keys[i]] = {};
            }
            currentLevel = currentLevel[keys[i]];
        }
        currentLevel[keys[keys.length - 1]] = value;

        if (section === 'security' && key === 'master_users') {
            setMasterUsers(value);
        }

        return newConfig;
    });
};

  const handleSaveConfig = async () => {
    if (directoryHandle) {
      setIsLoading(true);
      try {
        const botDir = await directoryHandle.getDirectoryHandle('Bot', { create: true });
        const configDir = await botDir.getDirectoryHandle('config', { create: true });
        const configFileHandle = await configDir.getFileHandle('bot_config.toml', { create: true });
        const writable = await configFileHandle.createWritable();
        await writable.write(stringify(config as any, {
          newline: '\n',
          indent: 2,
        }));
        await writable.close();
        toast.success("配置已直接保存到本地文件！");
      } catch (error) {
        console.error(error);
        toast.error("直接保存文件失败", { description: String(error) });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning("请先选择一个目录才能保存文件。");
      handleExportConfig();
    }
  };

  const handleExportConfig = () => {
    try {
      const tomlString = stringify(config as any);
      const blob = new Blob([tomlString], { type: "application/toml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bot_config.toml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("配置已导出！");
    } catch (error) {
      toast.error("导出失败", { description: String(error) });
    }
  };

  const handleImportConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".toml";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const tomlString = event.target?.result as string;
            const parsedConfig = parseToml(tomlString, { joiner: '\n' } as any);
            setConfig(parsedConfig as unknown as FullConfig);
            toast.success("配置已成功导入！");
          } catch (error) {
            toast.error("导入失败", { description: "文件格式错误或内容损坏。" });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>配置管理</h2>
          <p className="text-muted-foreground">
            管理MoFox Bot的各项配置参数
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportConfig}>
            <Upload className="h-4 w-4 mr-2" />
            导入配置
          </Button>
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            导出配置
          </Button>
          <Button onClick={handleSaveConfig} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "保存中..." : "保存配置"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="database">数据库</TabsTrigger>
          <TabsTrigger value="bot">Bot配置</TabsTrigger>
          <TabsTrigger value="personality">人格设置</TabsTrigger>
          <TabsTrigger value="security">安全机制</TabsTrigger>
          <TabsTrigger value="models">模型配置</TabsTrigger>
          <TabsTrigger value="features">功能设置</TabsTrigger>
        </TabsList>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>数据库配置</CardTitle>
              <CardDescription>
                配置机器人使用的数据库连接参数
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseConfig config={config.database} updateConfig={(key, value) => updateConfig('database', key, value)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot">
          <Card>
            <CardHeader>
              <CardTitle>Bot基础配置</CardTitle>
              <CardDescription>
                设置机器人的基本信息和行为参数
              </CardDescription>
            </CardHeader>
            <CardContent>
               <BotConfig config={config.bot} updateConfig={(key, value) => updateConfig('bot', key, value)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality">
          <Card>
            <CardHeader>
              <CardTitle>人格与表达设置</CardTitle>
              <CardDescription>
                配置机器人的人格特征和表达风格
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalityConfig config={config.personality} updateConfig={(key, value) => updateConfig('personality', key, value)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全与权限配置</CardTitle>
              <CardDescription>
                设置权限管理和反注入安全机制
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityConfig config={config.security} updateConfig={(key, value) => updateConfig('security', key, value)} sharedUserId={sharedUserId} setSharedUserId={setSharedUserId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>模型配置</CardTitle>
              <CardDescription>
                配置AI模型和API服务提供商
              </CardDescription>
            </CardHeader>
            <CardContent>
               <ModelConfig config={config.model} updateConfig={(key, value) => updateConfig('model', key, value)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>功能设置</CardTitle>
              <CardDescription>
                配置各种高级功能和系统参数
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureConfig config={config.features} updateConfig={(key, value) => updateConfig('features', key, value)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}