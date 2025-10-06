import { useState } from "react";
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
import { toast } from "sonner@2.0.3";

export function ConfigurationManager() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      // 模拟保存配置到后端
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("配置已保存成功");
    } catch (error) {
      toast.error("保存配置失败");
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
              <DatabaseConfig />
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
              <BotConfig />
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
              <PersonalityConfig />
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
              <SecurityConfig />
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
              <ModelConfig />
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
              <FeatureConfig />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}