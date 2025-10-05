import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function DatabaseConfig() {
  const [databaseType, setDatabaseType] = useState("sqlite");
  const [config, setConfig] = useState({
    // SQLite 配置
    sqlite_path: "./data/mofox.db",
    
    // MySQL 配置
    mysql_host: "localhost",
    mysql_port: 3306,
    mysql_database: "mofox_bot",
    mysql_user: "root",
    mysql_password: "",
    mysql_charset: "utf8mb4",
    mysql_autocommit: true,
    mysql_sql_mode: "STRICT_TRANS_TABLES",
    
    // 连接池配置
    connection_pool_size: 10,
    connection_timeout: 30,
  });

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="database-type">数据库类型</Label>
          <Select value={databaseType} onValueChange={setDatabaseType}>
            <SelectTrigger>
              <SelectValue placeholder="选择数据库类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqlite">SQLite</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {databaseType === "sqlite" && (
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
                  value={config.sqlite_path}
                  onChange={(e) => updateConfig("sqlite_path", e.target.value)}
                  placeholder="./data/mofox.db"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {databaseType === "mysql" && (
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
                    value={config.mysql_host}
                    onChange={(e) => updateConfig("mysql_host", e.target.value)}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mysql-port">端口</Label>
                  <Input
                    id="mysql-port"
                    type="number"
                    value={config.mysql_port}
                    onChange={(e) => updateConfig("mysql_port", parseInt(e.target.value))}
                    placeholder="3306"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mysql-database">数据库名称</Label>
                <Input
                  id="mysql-database"
                  value={config.mysql_database}
                  onChange={(e) => updateConfig("mysql_database", e.target.value)}
                  placeholder="mofox_bot"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mysql-user">用户名</Label>
                  <Input
                    id="mysql-user"
                    value={config.mysql_user}
                    onChange={(e) => updateConfig("mysql_user", e.target.value)}
                    placeholder="root"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mysql-password">密码</Label>
                  <Input
                    id="mysql-password"
                    type="password"
                    value={config.mysql_password}
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
                      value={config.mysql_charset} 
                      onValueChange={(value) => updateConfig("mysql_charset", value)}
                    >
                      <SelectTrigger>
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
                      value={config.mysql_sql_mode}
                      onChange={(e) => updateConfig("mysql_sql_mode", e.target.value)}
                      placeholder="STRICT_TRANS_TABLES"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自动提交事务</Label>
                    <p className="text-sm text-muted-foreground">
                      是否自动提交数据库事务
                    </p>
                  </div>
                  <Switch
                    checked={config.mysql_autocommit}
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
                  value={config.connection_pool_size}
                  onChange={(e) => updateConfig("connection_pool_size", parseInt(e.target.value))}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connection-timeout">连接超时时间 (秒)</Label>
                <Input
                  id="connection-timeout"
                  type="number"
                  value={config.connection_timeout}
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