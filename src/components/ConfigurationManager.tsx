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

interface ConfigurationManagerProps {
  directoryHandle: FileSystemDirectoryHandle | null;
  onPermissionError: () => void;
}

export function ConfigurationManager({ directoryHandle, onPermissionError }: ConfigurationManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [botTomlContent, setBotTomlContent] = useState<string>("");
  const [modelTomlContent, setModelTomlContent] = useState<string>("");
  const [botTomlPath, setBotTomlPath] = useState<string>("");
  const [modelTomlPath, setModelTomlPath] = useState<string>("");
  const [botConfigFileHandle, setBotConfigFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [modelConfigFileHandle, setModelConfigFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [configDirHandle, setConfigDirHandle] = useState<FileSystemDirectoryHandle | null>(null);

  useEffect(() => {
    const findConfigDir = async (
      dirHandle: FileSystemDirectoryHandle,
      currentPath: string = ""
    ): Promise<{ dir: FileSystemDirectoryHandle; path: string } | null> => {
      try {
        // @ts-ignore
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file" && entry.name === "bot_config.toml") {
            return { dir: dirHandle, path: currentPath };
          }
          if (entry.kind === "directory") {
            if (["node_modules", ".git", "dist"].includes(entry.name)) {
              continue;
            }
            const newPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
            const result = await findConfigDir(entry, newPath);
            if (result) return result;
          }
        }
      } catch (error) {
        console.warn(`Could not scan directory "${currentPath || dirHandle.name}":`, error);
      }
      return null;
    };

    const loadConfigFiles = async () => {
      if (!directoryHandle) return;

      try {
        toast.info("正在搜索配置文件...");
        const result = await findConfigDir(directoryHandle);

        if (result) {
          setConfigDirHandle(result.dir);
          const botConfigPath = result.path ? `${result.path}/bot_config.toml` : "bot_config.toml";
          setBotTomlPath(`.../${botConfigPath}`);

          // Load bot_config.toml
          const botHandle = await result.dir.getFileHandle("bot_config.toml");
          setBotConfigFileHandle(botHandle);
          const botFile = await botHandle.getFile();
          const botContent = await botFile.text();
          setBotTomlContent(botContent);
          toast.success("成功加载 bot_config.toml");

          // Load model_config.toml
          try {
            const modelHandle = await result.dir.getFileHandle("model_config.toml");
            setModelConfigFileHandle(modelHandle);
            const modelFile = await modelHandle.getFile();
            setModelTomlContent(await modelFile.text());
            const modelConfigPath = botConfigPath.replace("bot_config.toml", "model_config.toml");
            setModelTomlPath(`.../${modelConfigPath}`);
            toast.success("成功加载 model_config.toml");
          } catch (e) {
            toast.warning("未找到 model_config.toml", {
              description: "模型配置将不可用。保存时会自动创建该文件。",
            });
            setModelTomlContent("");
            const modelConfigPath = botConfigPath.replace("bot_config.toml", "model_config.toml");
            setModelTomlPath(`未找到: ${modelConfigPath}`);
          }
        } else {
          toast.error("加载 bot_config.toml 失败", {
            description: "在所选目录及其子目录中未找到 'bot_config.toml' 文件。",
          });
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          console.error("Permission to read directory was not granted or has expired:", error);
          toast.error("文件夹读取权限已失效", { description: "将返回目录选择界面以重新授权。" });
          onPermissionError();
        } else {
          console.error("Critical error during config file load:", error);
          toast.error("加载配置文件时发生严重错误。");
        }
      }
    };

    loadConfigFiles();
  }, [directoryHandle, onPermissionError]);

  const handleSaveBotToml = async (newTomlContent: string) => {
    if (!botConfigFileHandle) {
      toast.error("无法保存 Bot 配置", { description: "文件句柄丢失。" });
      return;
    }
    setIsLoading(true);
    try {
      const writable = await botConfigFileHandle.createWritable();
      await writable.write(newTomlContent);
      await writable.close();
      setBotTomlContent(newTomlContent);
      toast.success("配置已成功保存至 bot_config.toml");
    } catch (error) {
      console.error("Failed to save bot_config.toml:", error);
      toast.error("保存 Bot 配置失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveModelToml = async (newTomlContent: string) => {
    let handle = modelConfigFileHandle;
    if (!handle && configDirHandle) {
      try {
        handle = await configDirHandle.getFileHandle("model_config.toml", { create: true });
        setModelConfigFileHandle(handle);
        toast.info("已创建新的 model_config.toml 文件。");
      } catch (error) {
        console.error("Failed to create model_config.toml:", error);
        toast.error("创建 model_config.toml 失败");
        return;
      }
    }
    
    if (!handle) {
      toast.error("无法保存模型配置", { description: "文件句柄丢失且无法创建文件。" });
      return;
    }
    
    setIsLoading(true);
    try {
      const writable = await handle.createWritable();
      await writable.write(newTomlContent);
      await writable.close();
      setModelTomlContent(newTomlContent);
      toast.success("配置已成功保存至 model_config.toml");
    } catch (error) {
      console.error("Failed to save model_config.toml:", error);
      toast.error("保存模型配置失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportConfig = () => {
    // 模拟导出配置
    const config = {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      // 这里会包含所有配置数据
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: "application/json" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mofox-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("配置已导出");
  };

  const handleImportConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string);
            // 这里会处理导入的配置
            toast.success("配置已导入成功");
          } catch (error) {
            toast.error("配置文件格式错误");
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
          {/* 导入/导出 JSON 功能保持不变 */}
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
                {botTomlPath ? `正在编辑: ${botTomlPath}` : "配置机器人使用的数据库连接参数"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {botTomlContent ? (
                <DatabaseConfig tomlContent={botTomlContent} onSave={handleSaveBotToml} />
              ) : (
                 <div className="text-center text-muted-foreground py-10">
                  <p>未加载配置文件。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot">
          <Card>
            <CardHeader>
              <CardTitle>Bot基础配置</CardTitle>
              <CardDescription>
                {botTomlPath ? `正在编辑: ${botTomlPath}` : "请先通过主页选择正确的机器人目录。"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {botTomlContent ? (
                <BotConfig
                  tomlContent={botTomlContent}
                  onSave={handleSaveBotToml}
                  botTomlPath={botTomlPath}
                />
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>未加载配置文件。</p>
                  <p>请确保已选择正确的 MoFox Bot 目录。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality">
          <Card>
            <CardHeader>
              <CardTitle>人格与表达设置</CardTitle>
              <CardDescription>
                {botTomlPath ? `正在编辑: ${botTomlPath}` : "配置机器人的人格特征和表达风格"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {botTomlContent ? (
                <PersonalityConfig
                  tomlContent={botTomlContent}
                  onSave={handleSaveBotToml}
                  botTomlPath={botTomlPath}
                />
              ) : (
                 <div className="text-center text-muted-foreground py-10">
                  <p>未加载配置文件。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全与权限配置</CardTitle>
              <CardDescription>
                {botTomlPath ? `正在编辑: ${botTomlPath}` : "设置权限管理和反注入安全机制"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {botTomlContent ? (
                <SecurityConfig tomlContent={botTomlContent} onSave={handleSaveBotToml} />
              ) : (
                 <div className="text-center text-muted-foreground py-10">
                  <p>未加载配置文件。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>模型配置</CardTitle>
              <CardDescription>
                 {modelTomlPath ? `正在编辑: ${modelTomlPath}` : "配置AI模型和API服务提供商"}
              </CardDescription>
            </CardHeader>
            <CardContent>
               {botTomlContent ? (
                <ModelConfig
                  tomlContent={modelTomlContent}
                  onSave={handleSaveModelToml}
                  modelTomlPath={modelTomlPath}
                />
              ) : (
                 <div className="text-center text-muted-foreground py-10">
                  <p>未加载配置文件。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>功能设置</CardTitle>
              <CardDescription>
                {botTomlPath ? `正在编辑: ${botTomlPath}` : "配置各种高级功能和系统参数"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {botTomlContent ? (
                <FeatureConfig tomlContent={botTomlContent} onSave={handleSaveBotToml} />
              ) : (
                 <div className="text-center text-muted-foreground py-10">
                  <p>未加载配置文件。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}