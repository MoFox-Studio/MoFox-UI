import { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { DatabaseConfigType } from "./types";
import { defaultConfig } from "./defaults";

interface DatabaseConfigProps {
  config: DatabaseConfigType;
  updateConfig: (key: keyof DatabaseConfigType, value: any) => void;
}

export function DatabaseConfig({ config, updateConfig }: DatabaseConfigProps) {
  const safeConfig = { ...defaultConfig.database, ...(config || {}) };

  useEffect(() => {
    if (safeConfig.database_type === "sqlite" && safeConfig.sqlite_path !== "./bot/data/MaiBot.db") {
      updateConfig("sqlite_path", "./bot/data/MaiBot.db");
    }
  }, [safeConfig.database_type, safeConfig.sqlite_path, updateConfig]);

  const displayPath = safeConfig.sqlite_path;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="database-type">数据库类型</Label>
          <Select value={safeConfig.database_type} onValueChange={(value) => updateConfig("database_type", value)}>
            <SelectTrigger id="database-type">
              <SelectValue placeholder="选择数据库类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqlite">SQLite</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {safeConfig.database_type === "sqlite" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SQLite 配置</CardTitle>
              <CardDescription>配置 SQLite 数据库文件路径</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sqlite-path">数据库文件路径</Label>
                <Input
                  id="sqlite-path"
                  value={displayPath}
                  readOnly
                  placeholder="./bot/data/MaiBot.db"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {safeConfig.database_type === "mysql" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">MySQL 配置</CardTitle>
              <CardDescription>配置 MySQL 数据库连接参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mysql-host">服务器地址</Label>
                  <Input
                    id="mysql-host"
                    value={safeConfig.mysql_host}
                    onChange={(e) => updateConfig("mysql_host", e.target.value)}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mysql-port">端口</Label>
                  <Input
                    id="mysql-port"
                    type="number"
                    value={safeConfig.mysql_port}
                    onChange={(e) => updateConfig("mysql_port", parseInt(e.target.value))}
                    placeholder="3306"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mysql-database">数据库名称</Label>
                <Input
                  id="mysql-database"
                  value={safeConfig.mysql_database}
                  onChange={(e) => updateConfig("mysql_database", e.target.value)}
                  placeholder="mofox_bot"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mysql-user">用户名</Label>
                  <Input
                    id="mysql-user"
                    value={safeConfig.mysql_user}
                    onChange={(e) => updateConfig("mysql_user", e.target.value)}
                    placeholder="root"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mysql-password">密码</Label>
                  <Input
                    id="mysql-password"
                    type="password"
                    value={safeConfig.mysql_password}
                    onChange={(e) => updateConfig("mysql_password", e.target.value)}
                    placeholder="请输入密码"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm">高级配置</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mysql-charset">字符集</Label>
                    <Select
                      value={safeConfig.mysql_charset}
                      onValueChange={(value) => updateConfig("mysql_charset", value)}
                    >
                      <SelectTrigger id="mysql-charset">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utf8mb4">utf8mb4</SelectItem>
                        <SelectItem value="utf8">utf8</SelectItem>
                        <SelectItem value="latin1">latin1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mysql-sql-mode">SQL 模式</Label>
                    <Input
                      id="mysql-sql-mode"
                      value={safeConfig.mysql_sql_mode}
                      onChange={(e) => updateConfig("mysql_sql_mode", e.target.value)}
                      placeholder="STRICT_TRANS_TABLES"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-commit-switch">自动提交事务</Label>
                    <p className="text-sm text-muted-foreground">
                      是否自动提交数据库事务
                    </p>
                  </div>
                  <Switch
                    id="auto-commit-switch"
                    checked={safeConfig.mysql_autocommit}
                    onCheckedChange={(checked) => updateConfig("mysql_autocommit", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">连接池配置</CardTitle>
            <CardDescription>配置数据库连接池参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pool-size">连接池大小</Label>
                <Input
                  id="pool-size"
                  type="number"
                  value={safeConfig.connection_pool_size}
                  onChange={(e) => updateConfig("connection_pool_size", parseInt(e.target.value))}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connection-timeout">连接超时时间 (秒)</Label>
                <Input
                  id="connection-timeout"
                  type="number"
                  value={safeConfig.connection_timeout}
                  onChange={(e) => updateConfig("connection_timeout", parseInt(e.target.value))}
                  placeholder="30"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}